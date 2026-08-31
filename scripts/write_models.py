import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Written: {path}")

# ==========================================
# MODELS
# ==========================================
write_file("backend/app/models/models.py", '''
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    username = Column(String(64), unique=True, index=True, nullable=False)
    email = Column(String(128), unique=True, index=True, nullable=False)
    hashed_password = Column(String(256), nullable=False)
    full_name = Column(String(128), nullable=True)
    role = Column(String(32), default="citizen", index=True) # admin, analyst, citizen
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class WeatherReport(Base):
    __tablename__ = "weather_reports"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    source_id = Column(String(128), index=True, nullable=True)
    source_type = Column(String(64), index=True, nullable=False) # social_media, weather_api, citizen_report, rss_news, government_open_data
    source_name = Column(String(128), nullable=True)
    author = Column(String(128), nullable=True)
    text = Column(Text, nullable=False)
    original_language = Column(String(16), default="en")
    normalized_text = Column(Text, nullable=True)
    
    # Event classification
    event_type = Column(String(64), index=True, nullable=False)
    event_confidence = Column(Float, default=0.5)
    raw_classification_details = Column(JSON, default=dict)
    
    # Geolocation
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    city = Column(String(128), index=True, nullable=True)
    district = Column(String(128), index=True, nullable=True)
    state = Column(String(128), index=True, nullable=False)
    location_confidence = Column(Float, default=0.8)
    
    # Timestamps
    timestamp = Column(DateTime, index=True, default=lambda: datetime.now(timezone.utc))
    ingestion_timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # AI Credibility & Verification
    credibility_score = Column(Float, default=70.0) # 0 to 100
    risk_level = Column(String(32), default="LOW") # LOW, MODERATE, HIGH, CRITICAL
    verification_status = Column(String(64), index=True, default="UNVERIFIED") # UNVERIFIED, LIKELY_AUTHENTIC, LIKELY_MISLEADING, REQUIRES_REVIEW, VERIFIED, REJECTED
    verification_notes = Column(Text, nullable=True)
    
    # Deduplication & Clustering
    duplicate_group_id = Column(String(64), nullable=True, index=True)
    is_duplicate = Column(Boolean, default=False)
    duplicate_count = Column(Integer, default=0)
    
    event_cluster_id = Column(String(64), ForeignKey("event_clusters.id"), nullable=True, index=True)
    
    # Payload, Media & Vision
    media_urls = Column(JSON, default=list)
    hashtags = Column(JSON, default=list)
    image_analysis_results = Column(JSON, default=dict)
    raw_payload = Column(JSON, default=dict)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    cluster = relationship("EventCluster", back_populates="reports")
    verification_actions = relationship("VerificationAction", back_populates="report")

class EventCluster(Base):
    __tablename__ = "event_clusters"
    
    id = Column(String(64), primary_key=True) # e.g. EVT-20260831-001
    title = Column(String(256), nullable=False)
    event_type = Column(String(64), index=True, nullable=False)
    city = Column(String(128), index=True, nullable=True)
    district = Column(String(128), nullable=True)
    state = Column(String(128), index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    status = Column(String(64), default="ACTIVE", index=True) # ACTIVE, VERIFIED, RESOLVED, UNDER_REVIEW
    severity = Column(String(32), default="MODERATE", index=True) # LOW, MODERATE, HIGH, CRITICAL
    
    total_reports = Column(Integer, default=1)
    independent_sources_count = Column(Integer, default=1)
    citizen_reports_count = Column(Integer, default=0)
    weather_api_confirmed = Column(Boolean, default=False)
    
    confidence_score = Column(Float, default=0.85)
    overall_credibility = Column(Float, default=80.0)
    
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_reported_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    summary = Column(Text, nullable=True)
    
    reports = relationship("WeatherReport", back_populates="cluster")

class WeatherObservation(Base):
    __tablename__ = "weather_observations"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    station_name = Column(String(128), nullable=True)
    city = Column(String(128), index=True, nullable=False)
    state = Column(String(128), index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    rainfall_mm = Column(Float, default=0.0)
    wind_speed_kmh = Column(Float, default=0.0)
    condition = Column(String(128), nullable=True)
    recorded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    alert_code = Column(String(64), unique=True, index=True)
    title = Column(String(256), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(32), index=True, default="HIGH") # INFO, LOW, MODERATE, HIGH, CRITICAL
    event_type = Column(String(64), index=True, nullable=False)
    city = Column(String(128), index=True, nullable=True)
    state = Column(String(128), index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    reports_count = Column(Integer, default=1)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class VerificationAction(Base):
    __tablename__ = "verification_actions"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    report_id = Column(String(64), ForeignKey("weather_reports.id"), nullable=False, index=True)
    action = Column(String(64), nullable=False) # VERIFIED, REJECTED, MARK_DUPLICATE, FLAG_MISINFORMATION, REQUEST_REVIEW
    admin_username = Column(String(64), nullable=False)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    report = relationship("WeatherReport", back_populates="verification_actions")

class SourceConfig(Base):
    __tablename__ = "source_configs"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(128), unique=True, nullable=False)
    source_type = Column(String(64), nullable=False)
    endpoint_url = Column(String(256), nullable=True)
    status = Column(String(32), default="ACTIVE") # ACTIVE, DEGRADED, OFFLINE, DISABLED
    ingestion_rate_per_min = Column(Integer, default=60)
    credibility_weight = Column(Float, default=1.0)
    last_ingested_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), nullable=True)
    action = Column(String(64), nullable=False)
    target_type = Column(String(64), nullable=False)
    target_id = Column(String(64), nullable=True)
    details = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
''')

# ==========================================
# SCHEMAS
# ==========================================
write_file("backend/app/schemas/schemas.py", '''
from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, Field

# User & Auth
class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    role: str = "citizen"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class LoginRequest(BaseModel):
    username: str
    password: str

# Citizen Report Submission
class CitizenReportCreate(BaseModel):
    event_type: str = Field(..., example="Heavy Rainfall")
    description: str = Field(..., example="Heavy waterlogging and flooding on MG Road near Bhopal Junction")
    city: Optional[str] = Field(None, example="Bhopal")
    state: Optional[str] = Field(None, example="Madhya Pradesh")
    latitude: Optional[float] = Field(None, example=23.2599)
    longitude: Optional[float] = Field(None, example=77.4126)
    media_urls: Optional[List[str]] = Field(default_factory=list)
    author_contact: Optional[str] = Field(None, example="citizen@varshanet.in")

# Raw Ingestion Schema
class NormalizedReportIn(BaseModel):
    source_id: Optional[str] = None
    source_type: str = "citizen_report" # social_media, weather_api, citizen_report, rss_news, government_open_data
    source_name: Optional[str] = "Citizen Portal"
    author: Optional[str] = "anonymous"
    text: str
    timestamp: Optional[datetime] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    media_urls: Optional[List[str]] = Field(default_factory=list)
    hashtags: Optional[List[str]] = Field(default_factory=list)
    raw_payload: Optional[Dict[str, Any]] = Field(default_factory=dict)

# Weather Report Response
class WeatherReportOut(BaseModel):
    id: str
    source_id: Optional[str]
    source_type: str
    source_name: Optional[str]
    author: Optional[str]
    text: str
    original_language: Optional[str]
    normalized_text: Optional[str]
    event_type: str
    event_confidence: float
    raw_classification_details: Optional[Dict[str, Any]] = None
    latitude: float
    longitude: float
    city: Optional[str]
    district: Optional[str]
    state: str
    location_confidence: float
    timestamp: datetime
    ingestion_timestamp: datetime
    credibility_score: float
    risk_level: str
    verification_status: str
    verification_notes: Optional[str]
    duplicate_group_id: Optional[str]
    is_duplicate: bool
    duplicate_count: int
    event_cluster_id: Optional[str]
    media_urls: List[str]
    hashtags: List[str]
    image_analysis_results: Optional[Dict[str, Any]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Event Cluster
class EventClusterOut(BaseModel):
    id: str
    title: str
    event_type: str
    city: Optional[str]
    district: Optional[str]
    state: str
    latitude: float
    longitude: float
    status: str
    severity: str
    total_reports: int
    independent_sources_count: int
    citizen_reports_count: int
    weather_api_confirmed: bool
    confidence_score: float
    overall_credibility: float
    started_at: datetime
    last_reported_at: datetime
    summary: Optional[str]
    
    class Config:
        from_attributes = True

# Verification Action
class VerificationRequest(BaseModel):
    action: str = Field(..., example="VERIFIED") # VERIFIED, REJECTED, MARK_DUPLICATE, FLAG_MISINFORMATION, REQUEST_REVIEW
    reason: Optional[str] = Field(None, example="Cross-verified with IMD radar bulletin and ground citizen reports")

# Alert Schema
class AlertOut(BaseModel):
    id: str
    alert_code: str
    title: str
    message: str
    severity: str
    event_type: str
    city: Optional[str]
    state: str
    latitude: float
    longitude: float
    reports_count: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Overview Analytics
class AnalyticsOverview(BaseModel):
    total_reports: int
    active_events: int
    verified_events: int
    reports_today: int
    critical_alerts: int
    states_affected: int
    avg_credibility: float
    source_distribution: Dict[str, int]
    event_distribution: Dict[str, int]
    verification_distribution: Dict[str, int]
    state_activity: Dict[str, int]

# System Health
class SystemHealthOut(BaseModel):
    status: str
    database: str
    redis: str
    kafka: str
    ai_workers: str
    ingestion_rate_per_min: int
    processing_latency_ms: float
    active_connections: int
''')

print("Models & Schemas written successfully!")
