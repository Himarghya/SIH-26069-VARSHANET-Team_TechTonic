from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.app.core.database import get_db
from backend.app.models.models import WeatherReport, EventCluster, Alert
from backend.app.schemas.schemas import WeatherReportOut, NormalizedReportIn
from backend.app.api.websocket import ws_manager
from processing.pipeline import pipeline

router = APIRouter(prefix="/reports", tags=["Weather Reports"])

@router.get("", response_model=List[WeatherReportOut])
def get_reports(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    event_type: Optional[str] = None,
    state: Optional[str] = None,
    city: Optional[str] = None,
    verification_status: Optional[str] = None,
    source_type: Optional[str] = None,
    min_credibility: Optional[float] = None
):
    query = db.query(WeatherReport)
    
    if date_from:
        query = query.filter(WeatherReport.timestamp >= date_from)
    if date_to:
        query = query.filter(WeatherReport.timestamp <= date_to)
    if event_type and event_type != "All":
        query = query.filter(WeatherReport.event_type == event_type)
    if state and state != "All":
        query = query.filter(WeatherReport.state == state)
    if city and city != "All":
        query = query.filter(WeatherReport.city == city)
    if verification_status and verification_status != "All":
        query = query.filter(WeatherReport.verification_status == verification_status)
    if source_type and source_type != "All":
        query = query.filter(WeatherReport.source_type == source_type)
    if min_credibility is not None:
        query = query.filter(WeatherReport.credibility_score >= min_credibility)
        
    return query.order_by(desc(WeatherReport.timestamp)).offset(skip).limit(limit).all()

@router.get("/{report_id}", response_model=WeatherReportOut)
def get_report_by_id(report_id: str, db: Session = Depends(get_db)):
    report = db.query(WeatherReport).filter(WeatherReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.post("", response_model=WeatherReportOut)
async def submit_and_process_report(
    payload: NormalizedReportIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Fetch recent reports & clusters for context
    existing_reports = [
        {"id": r.id, "text": r.text, "latitude": r.latitude, "longitude": r.longitude, "event_type": r.event_type, "duplicate_group_id": r.duplicate_group_id}
        for r in db.query(WeatherReport).order_by(desc(WeatherReport.timestamp)).limit(50).all()
    ]
    existing_clusters = [
        {"id": c.id, "event_type": c.event_type, "latitude": c.latitude, "longitude": c.longitude, "status": c.status, "total_reports": c.total_reports}
        for c in db.query(EventCluster).filter(EventCluster.status.in_(["ACTIVE", "VERIFIED"])).all()
    ]
    
    # Process through full AI pipeline
    processed = pipeline.process_raw_report(
        raw_data=payload.model_dump(),
        existing_reports=existing_reports,
        existing_clusters=existing_clusters
    )
    
    # Handle cluster updates or creation
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
            citizen_reports_count=c_data["citizen_reports_count"],
            weather_api_confirmed=c_data["weather_api_confirmed"],
            confidence_score=c_data["confidence_score"],
            overall_credibility=c_data["overall_credibility"],
            summary=c_data["summary"]
        )
        db.add(new_cl)
    else:
        existing_cl = db.query(EventCluster).filter(EventCluster.id == cluster_id).first()
        if existing_cl:
            existing_cl.total_reports += 1
            if processed["source_type"] == "citizen_report":
                existing_cl.citizen_reports_count += 1
            existing_cl.last_reported_at = datetime.now()
            
    # Clean temporary internal flags before creating report
    report_dict = {k: v for k, v in processed.items() if not k.startswith("_")}
    new_report = WeatherReport(**report_dict)
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    # Broadcast to WebSocket subscribers for zero-latency dashboard refresh
    ws_msg = {
        "type": "NEW_WEATHER_REPORT",
        "report": {
            "id": new_report.id,
            "event_type": new_report.event_type,
            "city": new_report.city,
            "state": new_report.state,
            "latitude": new_report.latitude,
            "longitude": new_report.longitude,
            "credibility_score": new_report.credibility_score,
            "verification_status": new_report.verification_status,
            "timestamp": new_report.timestamp.isoformat()
        }
    }
    background_tasks.add_task(ws_manager.broadcast, ws_msg)
    
    return new_report
