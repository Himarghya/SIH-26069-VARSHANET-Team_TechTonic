import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Written: {path}")

# ==========================================
# AUTH ROUTER
# ==========================================
write_file("backend/app/api/v1/auth.py", '''
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.security import hash_password, verify_password, create_access_token, get_current_user
from backend.app.models.models import User
from backend.app.schemas.schemas import UserCreate, UserResponse, TokenResponse, LoginRequest

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter((User.username == payload.username) | (User.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    new_user = User(
        username=payload.username,
        email=payload.email,
        full_name=payload.full_name,
        role=payload.role,
        hashed_password=hash_password(payload.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        # Default mock admin/analyst credentials for hackathon demo
        if payload.username == "admin" and payload.password == "admin123":
            mock_user = User(id="admin_1", username="admin", email="admin@varshanet.gov.in", full_name="National Operations Lead", role="admin")
            token = create_access_token(subject="admin", role="admin")
            return {"access_token": token, "token_type": "bearer", "user": mock_user}
        elif payload.username == "analyst" and payload.password == "analyst123":
            mock_user = User(id="analyst_1", username="analyst", email="analyst@varshanet.gov.in", full_name="Senior Meteorologist", role="analyst")
            token = create_access_token(subject="analyst", role="analyst")
            return {"access_token": token, "token_type": "bearer", "user": mock_user}
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    token = create_access_token(subject=user.username, role=user.role)
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == current_user["username"]).first()
    if not user:
        return User(
            id=current_user.get("id", "user_1"),
            username=current_user.get("username", "citizen_user"),
            email=f"{current_user.get('username', 'citizen')}@varshanet.in",
            full_name=current_user.get("username", "Citizen").title(),
            role=current_user.get("role", "citizen"),
            is_active=True
        )
    return user
''')

# ==========================================
# REPORTS ROUTER
# ==========================================
write_file("backend/app/api/v1/reports.py", '''
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
''')

# ==========================================
# EVENTS & CLUSTERS ROUTER
# ==========================================
write_file("backend/app/api/v1/events.py", '''
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
''')

print("Auth, Reports and Events routers written!")
