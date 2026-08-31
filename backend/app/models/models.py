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
    impact_assessments = relationship("ImpactAssessment", back_populates="cluster")
    nowcasts = relationship("NowcastPrediction", back_populates="cluster")
    recommendations = relationship("ResponseRecommendation", back_populates="cluster")
    information_gaps = relationship("InformationGap", back_populates="cluster")
    verification_requests = relationship("VerificationRequest", back_populates="cluster")
    prediction_evaluations = relationship("PredictionEvaluation", back_populates="cluster")

class InfrastructureAsset(Base):
    __tablename__ = "infrastructure_assets"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(128), nullable=False, index=True)
    type = Column(String(64), nullable=False, index=True) # HOSPITAL, SCHOOL, RAILWAY_STATION, AIRPORT, BRIDGE, HIGHWAY, EMERGENCY_SHELTER, GOVT_BUILDING
    city = Column(String(128), index=True, nullable=True)
    district = Column(String(128), index=True, nullable=False)
    state = Column(String(128), index=True, nullable=False)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    vulnerability_score = Column(Float, default=0.5) # 0 to 1.0
    operational_status = Column(String(32), default="OPERATIONAL") # OPERATIONAL, AT_RISK, INUNDATED, EVACUATED
    capacity = Column(Integer, default=500)
    contact_phone = Column(String(32), nullable=True)

class ImpactAssessment(Base):
    __tablename__ = "impact_assessments"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    event_cluster_id = Column(String(64), ForeignKey("event_clusters.id"), nullable=False, index=True)
    
    # Three Core Scores
    evidence_confidence = Column(Float, default=85.0) # 0 to 100
    impact_risk = Column(Float, default=70.0) # 0 to 100
    response_priority = Column(String(16), default="P2") # P1 (Critical), P2 (High), P3 (Moderate), P4 (Monitor)
    
    # Population Exposure
    total_population_exposed = Column(Integer, default=0)
    vulnerable_population_exposed = Column(Integer, default=0)
    urban_population = Column(Integer, default=0)
    rural_population = Column(Integer, default=0)
    population_density_per_sqkm = Column(Float, default=0.0)
    
    # Infrastructure & Escalation
    infrastructure_risk_score = Column(Float, default=65.0)
    hospitals_at_risk_count = Column(Integer, default=0)
    schools_at_risk_count = Column(Integer, default=0)
    bridges_roads_at_risk_count = Column(Integer, default=0)
    escalation_probability = Column(Float, default=0.45) # 0.0 to 1.0
    accessibility_risk = Column(String(32), default="MODERATE") # LOW, MODERATE, HIGH, SEVERED
    
    explainability_factors = Column(JSON, default=list) # List of "Why?" evidence statements
    assessed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    cluster = relationship("EventCluster", back_populates="impact_assessments")

class NowcastPrediction(Base):
    __tablename__ = "nowcast_predictions"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    event_cluster_id = Column(String(64), ForeignKey("event_clusters.id"), nullable=False, index=True)
    forecast_offset_minutes = Column(Integer, nullable=False) # 0 (current), 30, 60, 120, 180
    predicted_risk_score = Column(Float, nullable=False) # 0 to 100
    predicted_rainfall_mm = Column(Float, default=0.0)
    predicted_severity = Column(String(32), default="MODERATE")
    confidence = Column(Float, default=0.85)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    cluster = relationship("EventCluster", back_populates="nowcasts")

class ResponseRecommendation(Base):
    __tablename__ = "response_recommendations"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    event_cluster_id = Column(String(64), ForeignKey("event_clusters.id"), nullable=False, index=True)
    priority = Column(Integer, default=1) # 1 (Highest) to 4 (Lowest)
    priority_label = Column(String(16), default="P1") # P1, P2, P3, P4
    action = Column(String(256), nullable=False)
    reason = Column(Text, nullable=False)
    supporting_evidence = Column(JSON, default=list)
    confidence = Column(Float, default=0.9)
    affected_area = Column(String(128), nullable=True)
    status = Column(String(32), default="PENDING") # PENDING, ACKNOWLEDGED, DISPATCHED, RESOLVED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    cluster = relationship("EventCluster", back_populates="recommendations")

class InformationGap(Base):
    __tablename__ = "information_gaps"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    event_cluster_id = Column(String(64), ForeignKey("event_clusters.id"), nullable=False, index=True)
    missing_information = Column(String(256), nullable=False)
    affected_decision = Column(String(256), nullable=False)
    severity = Column(String(32), default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL
    recommended_action = Column(Text, nullable=False)
    is_resolved = Column(Boolean, default=False, index=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    cluster = relationship("EventCluster", back_populates="information_gaps")

class VerificationRequest(Base):
    __tablename__ = "verification_requests"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    information_gap_id = Column(String(64), nullable=True)
    event_cluster_id = Column(String(64), ForeignKey("event_clusters.id"), nullable=False, index=True)
    title = Column(String(256), nullable=False)
    prompt = Column(Text, nullable=False) # e.g. "Can someone near MP Nagar Zone-2 confirm if Link Road is passable?"
    target_area = Column(String(128), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    radius_km = Column(Float, default=5.0)
    status = Column(String(32), default="ACTIVE", index=True) # ACTIVE, FULFILLED, EXPIRED
    responses_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    cluster = relationship("EventCluster", back_populates="verification_requests")

class PredictionEvaluation(Base):
    __tablename__ = "prediction_evaluations"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    event_cluster_id = Column(String(64), ForeignKey("event_clusters.id"), nullable=False, index=True)
    predicted_population_exposure = Column(Integer, nullable=False)
    actual_population_exposure = Column(Integer, nullable=False)
    predicted_risk_score = Column(Float, nullable=False)
    actual_impact_outcome = Column(String(64), nullable=False)
    prediction_error_pct = Column(Float, nullable=False)
    model_version = Column(String(32), default="VARSHANET-Impact-v2.0")
    evaluated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    cluster = relationship("EventCluster", back_populates="prediction_evaluations")

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