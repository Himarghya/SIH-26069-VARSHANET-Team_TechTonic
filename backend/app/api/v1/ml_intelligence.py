from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Body, Depends, Query
from processing.ml.multimodal_verification import multimodal_verifier
from processing.ml.severity_forecaster import severity_forecaster
from processing.ml.anomaly_detector import anomaly_detector
from processing.ml.hdbscan_clusterer import hdbscan_clusterer
from processing.ml.vision_forensics import vision_forensics_engine
from processing.ml.explainable_vayuscore import explainable_vayuscore_engine
from processing.ml.active_learning import active_learning_service
from processing.ml.source_reliability import dynamic_source_engine

router = APIRouter(prefix="/ml", tags=["VARSHANET 2.0 ML Intelligence Layer"])

# 1. Multimodal Incident Verification API
@router.post("/multimodal-verify")
def verify_multimodal_incident(payload: Dict[str, Any] = Body(...)):
    text = payload.get("text", "Water has crossed the road near Andheri station")
    city = payload.get("city", "Mumbai")
    state = payload.get("state", "Maharashtra")
    media_urls = payload.get("media_urls", [])
    rainfall_mmh = float(payload.get("rainfall_mmh", 48.5))
    radar_dbz = float(payload.get("radar_dbz", 43.0))
    elevation_m = float(payload.get("elevation_m", 12.0))
    co_located_reports = int(payload.get("co_located_reports", 9))
    
    return multimodal_verifier.verify_incident(
        text=text,
        city=city,
        state=state,
        media_urls=media_urls,
        rainfall_mmh=rainfall_mmh,
        radar_dbz=radar_dbz,
        elevation_m=elevation_m,
        co_located_reports=co_located_reports
    )

# 2. Spatio-Temporal Severity Forecaster (1h-3h lookahead)
@router.post("/severity-forecast")
def forecast_incident_severity(payload: Dict[str, Any] = Body(...)):
    cluster_id = payload.get("cluster_id", "INC-07")
    event_type = payload.get("event_type", "Urban Flooding")
    current_severity = payload.get("current_severity", "MODERATE")
    rainfall_rate_mmh = float(payload.get("rainfall_rate_mmh", 38.0))
    rainfall_acc_24h = float(payload.get("rainfall_acc_24h", 142.0))
    radar_dbz = float(payload.get("radar_dbz", 44.5))
    river_level_trend = payload.get("river_level_trend", "RISING")
    report_velocity = float(payload.get("report_velocity_per_min", 4.2))
    elevation_m = float(payload.get("elevation_m", 11.0))
    drainage_susceptibility = float(payload.get("drainage_susceptibility", 0.85))
    social_burst = float(payload.get("social_media_burst_ratio", 3.2))

    return severity_forecaster.predict_escalation(
        cluster_id=cluster_id,
        event_type=event_type,
        current_severity=current_severity,
        rainfall_rate_mmh=rainfall_rate_mmh,
        rainfall_acc_24h=rainfall_acc_24h,
        radar_dbz=radar_dbz,
        river_level_trend=river_level_trend,
        report_velocity_per_min=report_velocity,
        elevation_m=elevation_m,
        drainage_susceptibility=drainage_susceptibility,
        social_media_burst_ratio=social_burst
    )

# 3. Unsupervised Anomaly Detection API
@router.post("/anomaly-detect")
def detect_disaster_anomaly(payload: Dict[str, Any] = Body(...)):
    city = payload.get("city", "Bhopal")
    zone = payload.get("zone", "Zone 4 - Kolar Dam Corridor")
    normal_rate = float(payload.get("normal_hourly_rate", 3.5))
    current_10m = int(payload.get("current_10m_reports", 142))
    rainfall_zscore = float(payload.get("rainfall_dev_zscore", 3.8))
    water_level_rise = float(payload.get("water_level_rise_rate_cm_hr", 48.0))
    social_spike = float(payload.get("social_burst_spike", 5.4))

    return anomaly_detector.evaluate_spatiotemporal_burst(
        city=city,
        zone=zone,
        normal_hourly_rate=normal_rate,
        current_10m_reports=current_10m,
        rainfall_dev_zscore=rainfall_zscore,
        water_level_rise_rate_cm_hr=water_level_rise,
        social_burst_spike=social_spike
    )

# 4. Semantic HDBSCAN Incident Clustering API
@router.get("/hdbscan-clusters")
def get_hdbscan_clusters():
    return hdbscan_clusterer.cluster_sample_reports()

# 5. CLIP Vision Forensics & Recycled Image Detection API
@router.post("/image-forensics")
def inspect_image_forensics(payload: Dict[str, Any] = Body(...)):
    image_url = payload.get("image_url", "https://images.unsplash.com/photo-1547683905-f686c993aae5")
    city = payload.get("city", "Mumbai")
    event_type = payload.get("event_type", "Urban Flooding")
    timestamp = payload.get("timestamp", "2026-09-03 15:30:00")

    return vision_forensics_engine.evaluate_image_forensics(
        image_url=image_url,
        city=city,
        event_type=event_type,
        claimed_timestamp_utc=timestamp
    )

# 6. Explainable ML VayuScore SHAP Waterfall API
@router.post("/vayuscore-shap")
def explain_vayuscore_shap(payload: Dict[str, Any] = Body(...)):
    report_text = payload.get("report_text", "Water has crossed the road near Andheri station")
    independent_reports = int(payload.get("independent_reports_count", 4))
    rainfall_rate = float(payload.get("rainfall_correlation_rate", 48.0))
    image_auth = float(payload.get("image_authenticity_score", 92.0))
    source_reliability = float(payload.get("source_reliability_score", 94.0))
    geo_km = float(payload.get("geographic_consistency_km", 0.4))
    temporal_min = int(payload.get("temporal_window_minutes", 18))

    return explainable_vayuscore_engine.calculate_shap_attributions(
        report_text=report_text,
        independent_reports_count=independent_reports,
        rainfall_correlation_rate=rainfall_rate,
        image_authenticity_score=image_auth,
        source_reliability_score=source_reliability,
        geographic_consistency_km=geo_km,
        temporal_window_minutes=temporal_min
    )

# 7. Active Learning Feedback & Retraining Telemetry API
@router.get("/active-learning")
def get_active_learning_telemetry():
    return active_learning_service.get_telemetry()

@router.post("/active-learning/feedback")
def submit_human_feedback(payload: Dict[str, Any] = Body(...)):
    report_id = payload.get("report_id", "rep_default")
    human_label = payload.get("human_label", "VERIFIED_TRUE")
    ai_conf = float(payload.get("initial_confidence", 62.5))
    notes = payload.get("reviewer_notes", "Verified by District Magistrate")

    return active_learning_service.record_human_decision(
        report_id=report_id,
        human_label=human_label,
        original_ai_confidence=ai_conf,
        reviewer_notes=notes
    )

# 8. Dynamic Source Reliability API
@router.get("/dynamic-sources")
def get_dynamic_sources():
    return dynamic_source_engine.get_all_dynamic_sources()