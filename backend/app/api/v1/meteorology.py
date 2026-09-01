from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import EventCluster
from processing.meteorology.radar_dwr_engine import dwr_engine
from processing.meteorology.satellite_insat_engine import insat_engine
from processing.meteorology.climatology_anomaly_engine import climatology_engine
from processing.meteorology.extreme_weather_ml import extreme_ml_predictor
from processing.streaming.stream_processor import stream_telemetry

router = APIRouter(prefix="/meteorology", tags=["MoES Meteorological & Radar Big Data Grid"])

@router.get("/dwr-radar")
def get_dwr_radar_grid(db: Session = Depends(get_db)):
    clusters = db.query(EventCluster).all()
    coords = [{"latitude": c.latitude, "longitude": c.longitude} for c in clusters]
    return dwr_engine.get_national_radar_grid(active_event_coords=coords)

@router.get("/insat-satellite")
def get_insat_satellite_telemetry():
    return insat_engine.get_satellite_frame()

@router.get("/climatology-anomaly")
def get_climatological_anomalies(city: str = "Bhopal", rain_24h_mm: float = 85.0, temp_c: float = 31.0):
    return climatology_engine.evaluate_anomaly(city=city, observed_24h_rain_mm=rain_24h_mm, observed_temp_c=temp_c)

@router.get("/extreme-ml")
def get_extreme_weather_predictions(
    radar_dbz: float = 56.5,
    cloud_top_temp_c: float = -71.2,
    rainfall_rate_mmh: float = 68.0,
    temp_c: float = 43.5,
    humidity_pct: float = 62.0
):
    cpi = extreme_ml_predictor.compute_cloudburst_prediction_index(
        radar_dbz=radar_dbz,
        cloud_top_temp_c=cloud_top_temp_c,
        rainfall_rate_mmh=rainfall_rate_mmh,
        is_himalayan_orography=False
    )
    wbgt = extreme_ml_predictor.compute_heatwave_wbgt_index(
        temperature_c=temp_c,
        humidity_pct=humidity_pct,
        wind_speed_kmh=18.0
    )
    return {
        "cloudburst_prediction": cpi,
        "heatwave_wbgt_prediction": wbgt
    }

@router.get("/stream-telemetry")
def get_streaming_telemetry():
    return stream_telemetry.get_stream_metrics()