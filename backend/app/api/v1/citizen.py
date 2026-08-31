import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.app.core.database import get_db
from backend.app.models.models import WeatherReport, EventCluster
from backend.app.schemas.schemas import CitizenReportCreate, WeatherReportOut
from backend.app.api.websocket import ws_manager
from processing.pipeline import pipeline

router = APIRouter(prefix="/citizen", tags=["Citizen Reporting Portal"])

@router.post("/submit", response_model=WeatherReportOut)
async def submit_citizen_report(
    payload: CitizenReportCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    ticket_id = f"VR-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}"
    
    raw_data = {
        "source_id": ticket_id,
        "source_type": "citizen_report",
        "source_name": "VARSHANET Citizen Portal",
        "author": payload.author_contact or "verified_citizen",
        "text": payload.description,
        "event_type": payload.event_type,
        "city": payload.city,
        "state": payload.state,
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "media_urls": payload.media_urls,
        "hashtags": ["#IMD", "#CitizenWeather"]
    }
    
    existing_reports = [
        {"id": r.id, "text": r.text, "latitude": r.latitude, "longitude": r.longitude, "event_type": r.event_type, "duplicate_group_id": r.duplicate_group_id}
        for r in db.query(WeatherReport).order_by(desc(WeatherReport.timestamp)).limit(50).all()
    ]
    existing_clusters = [
        {"id": c.id, "event_type": c.event_type, "latitude": c.latitude, "longitude": c.longitude, "status": c.status, "total_reports": c.total_reports}
        for c in db.query(EventCluster).filter(EventCluster.status.in_(["ACTIVE", "VERIFIED"])).all()
    ]
    
    processed = pipeline.process_raw_report(
        raw_data=raw_data,
        existing_reports=existing_reports,
        existing_clusters=existing_clusters
    )
    
    cluster_id = processed["event_cluster_id"]
    if processed.get("_is_new_cluster"):
        c_data = processed["_cluster_data"]
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
            citizen_reports_count=1,
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
            existing_cl.citizen_reports_count += 1
            existing_cl.last_reported_at = datetime.now()
            
    report_dict = {k: v for k, v in processed.items() if not k.startswith("_")}
    new_report = WeatherReport(**report_dict)
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    background_tasks.add_task(ws_manager.broadcast, {
        "type": "NEW_CITIZEN_REPORT",
        "ticket_id": ticket_id,
        "city": new_report.city,
        "state": new_report.state,
        "event_type": new_report.event_type,
        "credibility": new_report.credibility_score
    })
    
    return new_report

@router.get("/track/{ticket_id}", response_model=WeatherReportOut)
def track_report_status(ticket_id: str, db: Session = Depends(get_db)):
    report = db.query(WeatherReport).filter(WeatherReport.source_id == ticket_id).first()
    if not report:
        raise HTTPException(status_code=404, detail=f"No submission found for tracking code {ticket_id}")
    return report