import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.app.core.database import get_db
from backend.app.models.models import WeatherReport, EventCluster, VerificationAction
from backend.app.schemas.schemas import WeatherReportOut, VerificationRequest
from backend.app.api.websocket import ws_manager
from processing.nlp.hashtag_categorizer import hashtag_categorizer

router = APIRouter(prefix="/verification", tags=["Verification Queue"])

@router.get("/pending", response_model=List[WeatherReportOut])
def get_pending_verification(db: Session = Depends(get_db)):
    return db.query(WeatherReport).filter(
        WeatherReport.verification_status.in_(["REQUIRES_REVIEW", "UNVERIFIED", "LIKELY_MISLEADING"])
    ).order_by(desc(WeatherReport.timestamp)).limit(50).all()

@router.post("/{report_id}/action", response_model=WeatherReportOut)
async def perform_verification_action(
    report_id: str,
    payload: VerificationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    report = db.query(WeatherReport).filter(WeatherReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    action_type = payload.action.upper()
    if action_type == "VERIFY":
        report.verification_status = "VERIFIED"
        report.credibility_score = max(report.credibility_score, 95.0)

        # 1. AI Categorization of Verified Report:
        # Categorizes report under #Monsoon2026, #MumbaiRains, #DelhiWeather, #Cloudburst, #FloodAlert, #HeatwaveWarning, #CycloneAlert, or #IMD
        report.hashtags = hashtag_categorizer.categorize(
            text=report.text,
            event_type=report.event_type,
            city=report.city or "",
            state=report.state or "",
            source_name=report.source_name or "Citizen Intelligence",
            source_type=report.source_type or "citizen_report",
            raw_payload=report.raw_payload or {}
        )

        # 2. Automatically Link/Update EventCluster so it shows as VERIFIED on the map
        if report.event_cluster_id:
            cluster = db.query(EventCluster).filter(EventCluster.id == report.event_cluster_id).first()
            if cluster:
                cluster.status = "VERIFIED"
                cluster.overall_credibility = max(cluster.overall_credibility, 95.0)
                cluster.confidence_score = max(cluster.confidence_score, 92.0)
                cluster.citizen_reports_count = (cluster.citizen_reports_count or 0) + 1
        else:
            # Create a verified cluster for this report so it renders as a live cluster on the map
            cluster_id = f"cl_verified_{uuid.uuid4().hex[:8]}"
            new_cl = EventCluster(
                id=cluster_id,
                title=f"Verified {report.event_type} in {report.city or report.state}",
                event_type=report.event_type,
                city=report.city or "Unknown",
                district=report.district or "",
                state=report.state or "India",
                latitude=report.latitude,
                longitude=report.longitude,
                status="VERIFIED",
                severity=report.risk_level or "HIGH",
                total_reports=1,
                independent_sources_count=1,
                citizen_reports_count=1,
                weather_api_confirmed=False,
                confidence_score=95.0,
                overall_credibility=95.0,
                summary=f"Admin-verified {report.event_type} incident reported near {report.city}, {report.state}."
            )
            db.add(new_cl)
            report.event_cluster_id = cluster_id

    elif action_type == "REGECT" or action_type == "REJECT":
        report.verification_status = "REJECTED"
        report.credibility_score = min(report.credibility_score, 20.0)
    elif action_type == "FLAG_MISINFORMATION":
        report.verification_status = "LIKELY_MISLEADING"
        report.risk_level = "CRITICAL"
        report.credibility_score = 15.0
    elif action_type == "MARK_DUPLICATE":
        report.is_duplicate = True
        report.verification_status = "DUPLICATE"
    elif action_type == "REQUEST_REVIEW":
        report.verification_status = "REQUIRES_REVIEW"
        
    report.verification_notes = payload.reason or f"Action {action_type} executed by National Weather Lead"
    
    action_log = VerificationAction(
        report_id=report.id,
        action=action_type,
        admin_username="admin_lead",
        reason=payload.reason
    )
    db.add(action_log)
    db.commit()
    db.refresh(report)
    
    background_tasks.add_task(ws_manager.broadcast, {
        "type": "VERIFICATION_UPDATED",
        "report_id": report.id,
        "verification_status": report.verification_status,
        "credibility_score": report.credibility_score,
        "hashtags": report.hashtags,
        "event_cluster_id": report.event_cluster_id,
        "city": report.city,
        "state": report.state,
        "event_type": report.event_type
    })
    
    return report
