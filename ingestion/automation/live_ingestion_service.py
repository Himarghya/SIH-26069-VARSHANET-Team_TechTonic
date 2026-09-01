import asyncio
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.core.database import SessionLocal
from backend.app.core.config import settings
from backend.app.models.models import WeatherReport, EventCluster
from backend.app.api.websocket import ws_manager
from ingestion.connectors.news_api_connector import news_connector
from ingestion.connectors.weather_api_connector import weather_connector
from processing.pipeline import pipeline
from processing.geolocation.indian_geo_resolver import PROMINENT_CITY_COORDS, CITY_TO_STATE_MAP

class LiveIngestionService:
    def __init__(self):
        self.is_running = False
        self._task: asyncio.Task = None
        self.interval_seconds = settings.AUTO_SYNC_INTERVAL_SECONDS # 5 minutes (300s) default
        self.last_sync_time: datetime = None
        self.total_auto_ingested = 0
        self.last_sync_count = 0

    def start(self):
        if self.is_running:
            return
        self.is_running = True
        self._task = asyncio.create_task(self._background_loop())
        print(f"[VARSHANET AUTOMATION] Multi-Channel Live Ingestion Service STARTED ({self.interval_seconds}s / 5-min auto-cycle).")

    def stop(self):
        self.is_running = False
        if self._task:
            self._task.cancel()
            self._task = None
        print("[VARSHANET AUTOMATION] Live Ingestion Service STOPPED.")

    def get_status(self) -> Dict[str, Any]:
        return {
            "is_running": self.is_running,
            "interval_seconds": self.interval_seconds,
            "last_sync_time": self.last_sync_time.isoformat() if self.last_sync_time else None,
            "total_auto_ingested": self.total_auto_ingested,
            "last_sync_count": self.last_sync_count
        }

    async def _background_loop(self):
        await asyncio.sleep(4)
        while self.is_running:
            try:
                count = await self.sync_live_data()
                print(f"[5-MIN AUTO-SYNC] Ingested {count} new live events across channels at {datetime.now().strftime('%H:%M:%S')}")
            except Exception as e:
                print(f"[5-MIN AUTO-SYNC ERROR] Background sync error: {e}")
            await asyncio.sleep(self.interval_seconds)

    async def sync_live_data(self) -> int:
        db = SessionLocal()
        new_items_ingested = 0
        try:
            # 1. Fetch live multi-channel breaking news (Google News, TOI, NDTV, India Today, Down To Earth, NewsAPI)
            news_items = await news_connector.fetch_all_channels()

            # 2. Fetch live synoptic AWS stations for 11 key Indian cities
            weather_items = []
            selected_cities = ["bhopal", "mumbai", "delhi", "guwahati", "dehradun", "chennai", "bengaluru", "jaipur", "bhubaneswar", "kolkata", "patna"]
            for city_key in selected_cities:
                coords = PROMINENT_CITY_COORDS.get(city_key)
                if coords:
                    state_name = CITY_TO_STATE_MAP.get(city_key, "India")
                    w_item = await weather_connector.fetch_live_weather(coords[0], coords[1], city_key.title(), state_name)
                    if w_item:
                        weather_items.append(w_item)

            all_incoming = news_items + weather_items

            for raw in all_incoming:
                # Text deduplication against DB
                existing_rep = db.query(WeatherReport).filter(WeatherReport.text == raw["text"]).first()
                if existing_rep:
                    continue

                existing_reports = [
                    {"id": r.id, "text": r.text, "latitude": r.latitude, "longitude": r.longitude, "event_type": r.event_type, "duplicate_group_id": r.duplicate_group_id}
                    for r in db.query(WeatherReport).order_by(WeatherReport.timestamp.desc()).limit(50).all()
                ]
                existing_clusters = [
                    {"id": c.id, "event_type": c.event_type, "latitude": c.latitude, "longitude": c.longitude, "status": c.status, "total_reports": c.total_reports}
                    for c in db.query(EventCluster).filter(EventCluster.status.in_(["ACTIVE", "VERIFIED"])).all()
                ]

                enriched = pipeline.process_raw_report(
                    raw_data=raw,
                    existing_reports=existing_reports,
                    existing_clusters=existing_clusters
                )

                cluster_id = enriched["event_cluster_id"]
                if enriched.get("_is_new_cluster"):
                    c_data = enriched["_cluster_data"]
                    new_cl = EventCluster(
                        id=c_data["id"],
                        title=c_data["title"],
                        event_type=c_data["event_type"],
                        city=c_data["city"],
                        district=c_data["district"],
                        state=c_data["state"],
                        latitude=c_data["latitude"],
                        longitude=c_data["longitude"],
                        status=c_data["status"],
                        severity=c_data["severity"],
                        total_reports=c_data["total_reports"],
                        independent_sources_count=c_data["independent_sources_count"],
                        citizen_reports_count=0,
                        weather_api_confirmed=raw["source_type"] == "weather_api",
                        confidence_score=c_data["confidence_score"],
                        overall_credibility=c_data["overall_credibility"],
                        summary=c_data["summary"]
                    )
                    db.add(new_cl)
                else:
                    existing_cl = db.query(EventCluster).filter(EventCluster.id == cluster_id).first()
                    if existing_cl:
                        existing_cl.total_reports += 1
                        existing_cl.last_reported_at = datetime.now(timezone.utc)

                report_dict = {k: v for k, v in enriched.items() if not k.startswith("_")}
                new_rep = WeatherReport(**report_dict)
                db.add(new_rep)
                new_items_ingested += 1

                # Broadcast live event to WebSocket clients
                await ws_manager.broadcast({
                    "type": "NEW_WEATHER_REPORT",
                    "id": new_rep.id,
                    "city": new_rep.city,
                    "state": new_rep.state,
                    "event_type": new_rep.event_type,
                    "source_name": new_rep.source_name,
                    "credibility": new_rep.credibility_score
                })

            if new_items_ingested > 0:
                db.commit()
                self.total_auto_ingested += new_items_ingested

            self.last_sync_time = datetime.now(timezone.utc)
            self.last_sync_count = new_items_ingested

        except Exception as err:
            db.rollback()
            print(f"[AUTOMATION ERROR] Sync failed: {err}")
        finally:
            db.close()

        return new_items_ingested

live_ingestion_service = LiveIngestionService()