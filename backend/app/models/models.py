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

class InfrastructureAsset(Base):
    __tablename__ = "infrastructure_assets"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(128), nullable=False)
    type = Column(String(64), nullable=False, index=True)
    city = Column(String(128), nullable=False, index=True)
    district = Column(String(128), nullable=True)
    state = Column(String(128), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_m = Column(Float, default=0.0)
    vulnerability_score = Column(Float, default=0.5)
    capacity = Column(Integer, default=1000)
    details = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class PredictionEvaluation(Base):
    __tablename__ = "prediction_evaluations"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    event_cluster_id = Column(String(64), nullable=True, index=True)
    predicted_population_exposure = Column(Integer, default=0)
    actual_population_exposure = Column(Integer, default=0)
    predicted_risk_score = Column(Float, default=0.0)
    actual_impact_outcome = Column(Text, nullable=True)
    prediction_error_pct = Column(Float, default=0.0)
    model_version = Column(String(64), default="VARSHANET-Impact-v2.0")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ImpactAssessment(Base):
    __tablename__ = "impact_assessments"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    event_cluster_id = Column(String(64), nullable=True, index=True)
    risk_score = Column(Float, default=0.0)
    population_exposed = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class NowcastPrediction(Base):
    __tablename__ = "nowcast_predictions"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    event_cluster_id = Column(String(64), nullable=True, index=True)
    lead_time_minutes = Column(Integer, default=30)
    predicted_severity = Column(String(32), default="MODERATE")
    confidence = Column(Float, default=0.85)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ResponseRecommendation(Base):
    __tablename__ = "response_recommendations"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    event_cluster_id = Column(String(64), nullable=True, index=True)
    priority = Column(String(16), default="P2")
    action = Column(Text, nullable=False)
    status = Column(String(32), default="PENDING")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class InformationGap(Base):
    __tablename__ = "information_gaps"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    event_cluster_id = Column(String(64), nullable=True, index=True)
    missing_information = Column(Text, nullable=False)
    severity = Column(String(32), default="HIGH")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class VerificationRequest(Base):
    __tablename__ = "verification_requests"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    information_gap_id = Column(String(64), nullable=True, index=True)
    event_cluster_id = Column(String(64), nullable=True, index=True)
    title = Column(String(256), nullable=False)
    prompt = Column(Text, nullable=False)
    target_area = Column(String(128), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    radius_km = Column(Float, default=5.0)
    status = Column(String(32), default="ACTIVE")
    responses_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

