from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.app.core.database import get_db
from backend.app.models.models import Alert
from backend.app.schemas.schemas import AlertOut

router = APIRouter(prefix="/alerts", tags=["Emergency Weather Alerts"])

@router.get("", response_model=List[AlertOut])
def get_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).order_by(desc(Alert.created_at)).all()

@router.get("/active", response_model=List[AlertOut])
def get_active_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).filter(Alert.is_active == True).order_by(desc(Alert.created_at)).all()
