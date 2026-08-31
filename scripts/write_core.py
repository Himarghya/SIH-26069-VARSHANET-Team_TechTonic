import os
import json

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Written: {path}")

# ==========================================
# 1. BACKEND CORE CONFIG
# ==========================================
write_file("backend/app/core/config.py", '''
import os
from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "VARSHANET - National Weather Big Data Analytics & Citizen Intelligence Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "varshanet-super-secret-national-weather-security-key-2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Database (SQLite with spatial emulation fallback or PostgreSQL/PostGIS)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./varshanet.db")
    
    # Redis
    REDIS_URL: Optional[str] = os.getenv("REDIS_URL", None)
    
    # Kafka
    KAFKA_BOOTSTRAP_SERVERS: str = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    KAFKA_ENABLED: bool = os.getenv("KAFKA_ENABLED", "false").lower() == "true"
    
    # Storage
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", "./data/media")
    RAW_DATA_DIR: str = os.getenv("RAW_DATA_DIR", "./data/raw")
    PARQUET_DIR: str = os.getenv("PARQUET_DIR", "./data/processed/parquet")
    
    # External APIs (Configurable via .env)
    WEATHER_API_KEY: Optional[str] = os.getenv("WEATHER_API_KEY", "")
    NEWS_API_KEY: Optional[str] = os.getenv("NEWS_API_KEY", "")
    MAP_API_KEY: Optional[str] = os.getenv("MAP_API_KEY", "")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", "")
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"

settings = Settings()
''')

# ==========================================
# 2. BACKEND DATABASE & BASE
# ==========================================
write_file("backend/app/core/database.py", '''
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.app.core.config import settings

connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
''')

# ==========================================
# 3. SECURITY & AUTH
# ==========================================
write_file("backend/app/core/security.py", '''
import hashlib
import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from backend.app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def hash_password(password: str) -> str:
    # Use sha256 with salt for guaranteed local cross-platform compatibility
    salt = "varshanet_salt_2026"
    return hashlib.sha256(f"{salt}_{password}".encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(subject: str | Any, role: str = "citizen", expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "sub": str(subject),
        "role": role,
        "exp": expire,
        "iat": datetime.now(timezone.utc)
    }
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None

def get_current_user(token: Optional[str] = Depends(oauth2_scheme)):
    if not token:
        # Default to anonymous citizen for seamless public access
        return {"id": "anon", "username": "citizen_user", "role": "citizen"}
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"id": payload.get("sub"), "username": payload.get("sub"), "role": payload.get("role", "citizen")}

def require_role(allowed_roles: list[str]):
    def role_checker(user: dict = Depends(get_current_user)):
        if user.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required role in: {allowed_roles}"
            )
        return user
    return role_checker
''')

print("Core modules written successfully!")
