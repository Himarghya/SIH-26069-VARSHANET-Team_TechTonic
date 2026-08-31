from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.app.core.database import get_db
from backend.app.models.models import EventCluster
from backend.app.schemas.schemas import EventClusterOut

router = APIRouter(prefix="/events", tags=["Weather Events & Clusters"])

@router.get("", response_model=List[EventClusterOut])
def get_events(
    db: Session = Depends(get_db),
    status: Optional[str] = None,
    event_type: Optional[str] = None,
    state: Optional[str] = None
):
    query = db.query(EventCluster)
    if status and status != "All":
        query = query.filter(EventCluster.status == status)
    if event_type and event_type != "All":
        query = query.filter(EventCluster.event_type == event_type)
    if state and state != "All":
        query = query.filter(EventCluster.state == state)
    return query.order_by(desc(EventCluster.last_reported_at)).all()

@router.get("/active", response_model=List[EventClusterOut])
def get_active_events(db: Session = Depends(get_db)):
    return db.query(EventCluster).filter(EventCluster.status.in_(["ACTIVE", "VERIFIED"])).order_by(desc(EventCluster.total_reports)).all()

@router.get("/{event_id}", response_model=EventClusterOut)
def get_event_by_id(event_id: str, db: Session = Depends(get_db)):
    event = db.query(EventCluster).filter(EventCluster.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event cluster not found")
    return event
