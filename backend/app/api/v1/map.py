from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import WeatherReport, EventCluster

router = APIRouter(prefix="/map", tags=["Geospatial Intelligence"])

@router.get("/events")
def get_map_events(
    db: Session = Depends(get_db),
    event_type: Optional[str] = None,
    state: Optional[str] = None
):
    query = db.query(EventCluster).filter(EventCluster.status.in_(["ACTIVE", "VERIFIED", "UNDER_REVIEW"]))
    if event_type and event_type != "All":
        query = query.filter(EventCluster.event_type == event_type)
    if state and state != "All":
        query = query.filter(EventCluster.state == state)
        
    clusters = query.all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "event_type": c.event_type,
            "city": c.city,
            "state": c.state,
            "latitude": c.latitude,
            "longitude": c.longitude,
            "severity": c.severity,
            "total_reports": c.total_reports,
            "citizen_reports_count": c.citizen_reports_count,
            "weather_api_confirmed": c.weather_api_confirmed,
            "credibility": c.overall_credibility,
            "confidence": c.confidence_score,
            "status": c.status
        }
        for c in clusters
    ]

@router.get("/heatmap")
def get_heatmap_points(db: Session = Depends(get_db)):
    reports = db.query(WeatherReport.latitude, WeatherReport.longitude, WeatherReport.credibility_score).all()
    return [
        {"lat": r.latitude, "lon": r.longitude, "intensity": round(r.credibility_score / 100.0, 2)}
        for r in reports
    ]

@router.get("/export-geojson")
def export_tactical_layers_geojson(
    layer: Optional[str] = "all",
    db: Session = Depends(get_db)
):
    """
    Exports national disaster layers into RFC 7946 GeoJSON FeatureCollection
    for QGIS, ArcGIS, and Google Earth integration.
    """
    from processing.geolocation.geojson_exporter import geojson_exporter
    clusters = db.query(EventCluster).all()
    reports = db.query(WeatherReport).filter(WeatherReport.verification_status == "VERIFIED").limit(300).all()
    return geojson_exporter.export_all_layers(
        event_clusters=clusters,
        verified_reports=reports,
        layer_filter=layer or "all"
    )

