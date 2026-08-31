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
    source_type: str = "citizen_report"
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

# Infrastructure Asset
class InfrastructureAssetOut(BaseModel):
    id: str
    name: str
    type: str
    city: Optional[str]
    district: str
    state: str
    latitude: float
    longitude: float
    vulnerability_score: float
    operational_status: str
    capacity: int
    contact_phone: Optional[str] = None

    class Config:
        from_attributes = True

# Nowcast Prediction
class NowcastPredictionOut(BaseModel):
    id: str
    event_cluster_id: str
    forecast_offset_minutes: int
    predicted_risk_score: float
    predicted_rainfall_mm: float
    predicted_severity: str
    confidence: float

    class Config:
        from_attributes = True

# Response Recommendation
class ResponseRecommendationOut(BaseModel):
    id: str
    event_cluster_id: str
    priority: int
    priority_label: str
    action: str
    reason: str
    supporting_evidence: List[str]
    confidence: float
    affected_area: Optional[str]
    status: str

    class Config:
        from_attributes = True

# Information Gap
class InformationGapOut(BaseModel):
    id: str
    event_cluster_id: str
    missing_information: str
    affected_decision: str
    severity: str
    recommended_action: str
    is_resolved: bool
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Verification Request (Citizen Crowd Sourcing)
class VerificationRequestCreate(BaseModel):
    information_gap_id: Optional[str] = None
    event_cluster_id: str
    title: str
    prompt: str
    target_area: str
    latitude: float
    longitude: float
    radius_km: Optional[float] = 5.0

class VerificationRequestOut(BaseModel):
    id: str
    information_gap_id: Optional[str]
    event_cluster_id: str
    title: str
    prompt: str
    target_area: str
    latitude: float
    longitude: float
    radius_km: float
    status: str
    responses_count: int
    created_at: datetime

    class Config:
        from_attributes = True

# Impact Assessment Master
class ImpactAssessmentOut(BaseModel):
    id: str
    event_cluster_id: str
    evidence_confidence: float
    impact_risk: float
    response_priority: str
    total_population_exposed: int
    vulnerable_population_exposed: int
    urban_population: int
    rural_population: int
    population_density_per_sqkm: float
    infrastructure_risk_score: float
    hospitals_at_risk_count: int
    schools_at_risk_count: int
    bridges_roads_at_risk_count: int
    escalation_probability: float
    accessibility_risk: str
    explainability_factors: List[str]
    assessed_at: datetime

    class Config:
        from_attributes = True

# Incident Outcome Evaluation
class PredictionEvaluationOut(BaseModel):
    id: str
    event_cluster_id: str
    predicted_population_exposure: int
    actual_population_exposure: int
    predicted_risk_score: float
    actual_impact_outcome: str
    prediction_error_pct: float
    model_version: str
    evaluated_at: datetime

    class Config:
        from_attributes = True

# Verification Action (Admin moderation)
class VerificationActionRequest(BaseModel):
    action: str = Field(..., example="VERIFIED")
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
    active_connections: int# Verification Action alias for backward compatibility
VerificationRequest = VerificationActionRequest
