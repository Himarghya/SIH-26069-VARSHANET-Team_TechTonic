from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, Body, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.app.core.database import get_db
from backend.app.models.models import Alert
from backend.app.schemas.schemas import AlertOut
from processing.broadcasting.x_twitter_broadcaster import x_broadcaster

router = APIRouter(prefix="/alerts", tags=["Emergency Weather Alerts"])

@router.get("", response_model=List[AlertOut])
def get_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).order_by(desc(Alert.created_at)).all()

@router.get("/active", response_model=List[AlertOut])
def get_active_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).filter(Alert.is_active == True).order_by(desc(Alert.created_at)).all()

@router.post("/broadcast-x")
async def broadcast_alert_to_x(
    payload: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    """
    Broadcasts an official Red/High Alert status update to X (formerly Twitter)
    and sends emergency notification to Somadas7803@gmail.com.
    """
    city = payload.get("city", "District")
    state = payload.get("state", "India")
    event_type = payload.get("event_type", "Extreme Weather Warning")
    severity = payload.get("severity", "CRITICAL")
    custom_directive = payload.get("directive")
    event_id = payload.get("event_id")

    result = await x_broadcaster.broadcast_alert(
        city=city,
        state=state,
        event_type=event_type,
        severity=severity,
        custom_directive=custom_directive,
        event_id=event_id
    )

    return {
        "status": "SUCCESS",
        "message": f"Successfully formatted and dispatched Red Alert for {city}, {state} to X (Twitter).",
        "dispatch_details": result
    }

@router.get("/x-dispatcher-status")
def get_x_dispatcher_status():
    """
    Returns live telemetry of the X (Twitter) automated disaster broadcaster.
    """
    return {
        "service_status": "ACTIVE_LIVE",
        "target_platform": "X (Twitter)",
        "notification_email": x_broadcaster.notification_email,
        "recent_broadcasts_count": len(x_broadcaster.recent_broadcasts),
        "recent_broadcasts": x_broadcaster.recent_broadcasts[:5]
    }