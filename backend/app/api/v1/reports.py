from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks, Body
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.app.core.database import get_db
from backend.app.models.models import WeatherReport, EventCluster, Alert
from backend.app.schemas.schemas import WeatherReportOut, NormalizedReportIn
from backend.app.api.websocket import ws_manager
from processing.pipeline import pipeline
from processing.geolocation.indian_geo_resolver import geo_resolver

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

@router.post("/admin-publish", response_model=WeatherReportOut)
async def admin_publish_verified_report(
    payload: Dict[str, Any] = Body(...),
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db)
):
    """
    Official Admin Instant Verified Incident Posting:
    - Pre-verified by default (100% verified, 99.8% credibility)
    - Automatically resolves geographic coordinates & places on national map
    - Immediately creates/updates EventCluster & Alert without requiring verification
    """
    event_type = payload.get("event_type", "Urban Flooding")
    description = payload.get("description") or payload.get("text", "")
    city = payload.get("city", "Bhopal")
    state = payload.get("state", "Madhya Pradesh")
    severity = payload.get("severity", "HIGH").upper()
    media_urls = payload.get("media_urls", [])
    author = payload.get("author") or "National Disaster Management Lead"
    manual_lat = payload.get("latitude")
    manual_lon = payload.get("longitude")

    # Geolocation resolution
    resolved_geo = geo_resolver.resolve(
        eff_text=description,
        lat=manual_lat,
        lon=manual_lon,
        city=city,
        state=state
    )

    now_utc = datetime.now(timezone.utc)
    
    # Check if an active cluster already exists within ~35km
    existing_cluster = db.query(EventCluster).filter(
        EventCluster.state == resolved_geo["state"],
        EventCluster.event_type == event_type,
        EventCluster.status.in_(["ACTIVE", "VERIFIED"])
    ).first()

    if existing_cluster:
        target_cluster_id = existing_cluster.id
        existing_cluster.total_reports += 1
        existing_cluster.last_reported_at = now_utc
        existing_cluster.severity = severity
        existing_cluster.status = "VERIFIED"
        existing_cluster.overall_credibility = 99.8
    else:
        target_cluster_id = f"EVT-ADM-{now_utc.strftime('%Y%m%d%H%M%S')}"
        title = payload.get("title") or f"{event_type} in {resolved_geo['city']}, {resolved_geo['state']}"
        new_cl = EventCluster(
            id=target_cluster_id,
            title=title,
            event_type=event_type,
            city=resolved_geo["city"],
            district=resolved_geo["district"],
            state=resolved_geo["state"],
            latitude=resolved_geo["latitude"],
            longitude=resolved_geo["longitude"],
            status="VERIFIED",
            severity=severity,
            total_reports=1,
            independent_sources_count=1,
            citizen_reports_count=0,
            weather_api_confirmed=True,
            confidence_score=0.99,
            overall_credibility=99.8,
            started_at=now_utc,
            last_reported_at=now_utc,
            summary=description
        )
        db.add(new_cl)

    # Create Pre-Verified Weather Report
    report_id = str(uuid.uuid4())
    new_report = WeatherReport(
        id=report_id,
        source_id=f"ADM-{now_utc.strftime('%Y%m%d%H%M%S')}",
        source_type="official_admin",
        source_name="National Operations Admin Center",
        author=author,
        text=description,
        original_language="en",
        normalized_text=description,
        event_type=event_type,
        event_confidence=1.0,
        latitude=resolved_geo["latitude"],
        longitude=resolved_geo["longitude"],
        city=resolved_geo["city"],
        district=resolved_geo["district"],
        state=resolved_geo["state"],
        location_confidence=1.0,
        timestamp=now_utc,
        ingestion_timestamp=now_utc,
        credibility_score=99.8,
        risk_level=severity,
        verification_status="VERIFIED",
        verification_notes="Officially published and pre-verified by National Operations Command Admin.",
        event_cluster_id=target_cluster_id,
        media_urls=media_urls,
        hashtags=["#IMDVerified", "#OfficialAdvisory", f"#{resolved_geo['city']}Weather"],
        image_analysis_results={
            "is_fake": False,
            "visual_authenticity_score": 99.0,
            "verdict": "OFFICIALLY_VERIFIED_ADMIN_GROUND_PROOF"
        } if media_urls else {}
    )
    db.add(new_report)

    # Issue Critical Alert if severity is HIGH or CRITICAL
    if severity in ["HIGH", "CRITICAL"]:
        alert_code = f"ALT-ADM-{now_utc.strftime('%Y%m%d%H%M%S')}"
        new_alert = Alert(
            id=str(uuid.uuid4()),
            alert_code=alert_code,
            title=f"OFFICIAL {severity} ALERT: {event_type} - {resolved_geo['city']}",
            message=description,
            severity=severity,
            event_type=event_type,
            city=resolved_geo["city"],
            state=resolved_geo["state"],
            latitude=resolved_geo["latitude"],
            longitude=resolved_geo["longitude"],
            reports_count=1,
            is_active=True,
            created_at=now_utc
        )
        db.add(new_alert)

    db.commit()
    db.refresh(new_report)

    # Broadcast to WebSocket
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
    if background_tasks:
        background_tasks.add_task(ws_manager.broadcast, ws_msg)

    return new_report

@router.post("", response_model=WeatherReportOut)
async def submit_and_process_report(
    payload: NormalizedReportIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    existing_reports = [
        {"id": r.id, "text": r.text, "latitude": r.latitude, "longitude": r.longitude, "event_type": r.event_type, "duplicate_group_id": r.duplicate_group_id}
        for r in db.query(WeatherReport).order_by(desc(WeatherReport.timestamp)).limit(50).all()
    ]
    existing_clusters = [
        {"id": c.id, "event_type": c.event_type, "latitude": c.latitude, "longitude": c.longitude, "status": c.status, "total_reports": c.total_reports}
        for c in db.query(EventCluster).filter(EventCluster.status.in_(["ACTIVE", "VERIFIED"])).all()
    ]
    
    processed = pipeline.process_raw_report(
        raw_data=payload.model_dump(),
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
            
    report_dict = {k: v for k, v in processed.items() if not k.startswith("_")}
    new_report = WeatherReport(**report_dict)
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
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