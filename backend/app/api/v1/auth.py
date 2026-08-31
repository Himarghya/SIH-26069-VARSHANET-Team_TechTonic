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
