import asyncio
import sys, os
sys.path.insert(0, os.path.abspath("."))

from datetime import datetime, timezone
from backend.app.core.database import SessionLocal, engine, Base
from backend.app.models.models import WeatherReport, EventCluster
from ingestion.connectors.news_api_connector import news_connector
from processing.pipeline import pipeline

async def ingest_live_news():
    print("=" * 60)
    print("VARSHANET: Ingesting REAL LIVE Indian Weather News into Database...")
    print("=" * 60)
    
    db = SessionLocal()
    articles = await news_connector.fetch_live_news_rss()
    
    if not articles:
        print("No articles fetched or network unavailable.")
        db.close()
        return

    print(f"Fetched {len(articles)} live articles from real Indian media outlets.")
    
    ingested_count = 0
    for art in articles:
        # Check if already exists by text match
        if db.query(WeatherReport).filter(WeatherReport.text == art["text"]).first():
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
            raw_data=art,
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
                weather_api_confirmed=False,
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
        rep = WeatherReport(**report_dict)
        db.add(rep)
        ingested_count += 1
        print(f"[LIVE INGESTED] {rep.source_name} | {rep.city}, {rep.state} | {rep.event_type} | AI Score: {rep.credibility_score}%")

    db.commit()
    db.close()
    print("=" * 60)
    print(f"Successfully processed & ingested {ingested_count} real-time news reports into VARSHANET database!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(ingest_live_news())