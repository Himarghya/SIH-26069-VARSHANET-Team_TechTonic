from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, timezone
from backend.app.core.database import get_db
from backend.app.models.models import WeatherReport, EventCluster, Alert
from backend.app.schemas.schemas import AnalyticsOverview
from processing.pipeline import pipeline
from processing.verification.gemini_analyzer import gemini_analyzer

router = APIRouter(prefix="/analytics", tags=["Analytics and Intelligence"])

@router.get("/overview", response_model=AnalyticsOverview)
def get_analytics_overview(db: Session = Depends(get_db)):
    total_reports = db.query(WeatherReport).count()
    active_events = db.query(EventCluster).filter(EventCluster.status.in_(["ACTIVE", "VERIFIED"])).count()
    verified_events = db.query(EventCluster).filter(EventCluster.status == "VERIFIED").count()
    
    today_cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
    reports_today = db.query(WeatherReport).filter(WeatherReport.timestamp >= today_cutoff).count()
    critical_alerts = db.query(Alert).filter(Alert.severity.in_(["CRITICAL", "HIGH"]), Alert.is_active == True).count()
    
    states_count = db.query(func.count(func.distinct(WeatherReport.state))).scalar() or 0
    avg_cred = db.query(func.avg(WeatherReport.credibility_score)).scalar() or 75.0
    
    sources_raw = db.query(WeatherReport.source_type, func.count(WeatherReport.id)).group_by(WeatherReport.source_type).all()
    source_dist = {s: count for s, count in sources_raw}
    
    events_raw = db.query(WeatherReport.event_type, func.count(WeatherReport.id)).group_by(WeatherReport.event_type).order_by(func.count(WeatherReport.id).desc()).limit(8).all()
    event_dist = {e: count for e, count in events_raw}
    
    v_raw = db.query(WeatherReport.verification_status, func.count(WeatherReport.id)).group_by(WeatherReport.verification_status).all()
    v_dist = {v: count for v, count in v_raw}
    
    state_raw = db.query(WeatherReport.state, func.count(WeatherReport.id)).group_by(WeatherReport.state).order_by(func.count(WeatherReport.id).desc()).limit(10).all()
    state_dist = {st: count for st, count in state_raw}
    
    return {
        "total_reports": total_reports,
        "active_events": active_events,
        "verified_events": verified_events,
        "reports_today": reports_today,
        "critical_alerts": critical_alerts,
        "states_affected": states_count,
        "avg_credibility": round(float(avg_cred), 1),
        "source_distribution": source_dist,
        "event_distribution": event_dist,
        "verification_distribution": v_dist,
        "state_activity": state_dist
    }

@router.get("/timeline")
def get_timeline_data(db: Session = Depends(get_db)):
    reports = db.query(WeatherReport).order_by(WeatherReport.timestamp.asc()).all()
    buckets = {}
    for r in reports:
        hour_key = r.timestamp.strftime("%H:00")
        buckets[hour_key] = buckets.get(hour_key, 0) + 1
    res_list = [{"time": k, "reports": v} for k, v in buckets.items()]
    return res_list[-24:]

@router.post("/test-ai")
async def test_ai_pipeline(
    payload: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    """
    Live AI Demonstration Lab Endpoint:
    Accepts arbitrary text and returns the full live breakdown:
    - Step 1: Text & Language Cleaner
    - Step 2: PostGIS Geo Resolver
    - Step 3: Local Hybrid ML + NLP Classifier
    - Step 4: Live Google Gemini API LLM Analysis
    - Step 5: Multi-Factor Credibility Scoring
    """
    text = payload.get("text", "")
    city = payload.get("city")
    state = payload.get("state")
    
    # 1. Pipeline execution
    raw_data = {
        "source_id": "lab_demo",
        "source_type": payload.get("source_type", "citizen_report"),
        "text": text,
        "city": city,
        "state": state
    }
    
    enriched = pipeline.process_raw_report(raw_data=raw_data)
    
    # 2. Live Google Gemini LLM API Call
    gemini_res = await gemini_analyzer.analyze_weather_report(
        text=text,
        city=enriched["city"],
        state=enriched["state"]
    )
    
    return {
        "input_text": text,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "nlp_stage": {
            "cleaned_text": enriched["normalized_text"],
            "detected_language": enriched["original_language"],
            "hashtags": enriched["hashtags"]
        },
        "geospatial_stage": {
            "resolved_city": enriched["city"],
            "resolved_state": enriched["state"],
            "latitude": enriched["latitude"],
            "longitude": enriched["longitude"],
            "location_confidence": enriched["location_confidence"]
        },
        "local_ml_stage": {
            "event_type": enriched["event_type"],
            "ml_confidence_score": enriched["event_confidence"],
            "classification_details": enriched["raw_classification_details"]
        },
        "gemini_llm_stage": gemini_res or {
            "gemini_active": False,
            "notice": "Gemini API key active. Response generated via local ML failover."
        },
        "credibility_stage": {
            "final_score": enriched["credibility_score"],
            "risk_level": enriched["risk_level"],
            "verification_status": enriched["verification_status"],
            "assessment_notes": enriched["verification_notes"]
        },
        "cluster_stage": {
            "cluster_id": enriched["event_cluster_id"]
        }
    }