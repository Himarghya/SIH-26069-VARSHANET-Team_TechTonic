from typing import List, Dict, Any
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import SourceConfig
from ingestion.automation.live_ingestion_service import live_ingestion_service

router = APIRouter(prefix="/sources", tags=["Data Sources & Automation Management"])

@router.get("")
def get_sources(db: Session = Depends(get_db)):
    sources = db.query(SourceConfig).all()
    if not sources:
        return [
            {"id": "src_1", "name": "Google News India & IMD RSS Bulletin", "source_type": "rss_news", "status": "ACTIVE", "ingestion_rate_per_min": 60, "credibility_weight": 0.95},
            {"id": "src_2", "name": "Open-Meteo Meteorological AWS API", "source_type": "weather_api", "status": "ACTIVE", "ingestion_rate_per_min": 120, "credibility_weight": 0.95},
            {"id": "src_3", "name": "VARSHANET Citizen Intelligence Network", "source_type": "citizen_report", "status": "ACTIVE", "ingestion_rate_per_min": 45, "credibility_weight": 0.75},
            {"id": "src_4", "name": "Public Weather Social Stream (#IMD, #Rainfall)", "source_type": "social_media", "status": "ACTIVE", "ingestion_rate_per_min": 180, "credibility_weight": 0.65},
            {"id": "src_5", "name": "PIB & State Disaster Management Authority", "source_type": "government_open_data", "status": "ACTIVE", "ingestion_rate_per_min": 30, "credibility_weight": 0.98}
        ]
    return sources

@router.get("/automation-status")
def get_automation_status():
    """
    Returns real-time health telemetry of the automated live ingestion engine.
    """
    return live_ingestion_service.get_status()

@router.post("/sync-live")
async def trigger_live_sync():
    """
    Triggers an immediate live sync from Indian news outlets and meteorological AWS stations.
    """
    count = await live_ingestion_service.sync_live_data()
    return {
        "status": "SUCCESS",
        "message": f"Successfully pulled and processed {count} live Indian weather and news observations.",
        "new_reports_count": count,
        "telemetry": live_ingestion_service.get_status()
    }

@router.post("/toggle-automation")
def toggle_automation():
    """
    Toggles the automatic periodic background stream ingestion worker.
    """
    if live_ingestion_service.is_running:
        live_ingestion_service.stop()
        state = "STOPPED"
    else:
        live_ingestion_service.start()
        state = "RUNNING"
    return {"status": "SUCCESS", "automation_state": state}