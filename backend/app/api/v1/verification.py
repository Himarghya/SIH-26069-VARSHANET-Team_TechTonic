from typing import List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.app.core.database import get_db
from backend.app.models.models import WeatherReport, VerificationAction
from backend.app.schemas.schemas import WeatherReportOut, VerificationRequest
from backend.app.api.websocket import ws_manager

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
        report.credibility_score = max(report.credibility_score, 92.0)
    elif action_type == "REGECT":
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
        "credibility_score": report.credibility_score
    })
    
    return report
