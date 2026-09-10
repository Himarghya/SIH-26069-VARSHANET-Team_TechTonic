"""
geojson_exporter.py

Exports national disaster layers and meteorological infrastructure into standard
RFC 7946 GeoJSON FeatureCollections for interoperability with QGIS, ArcGIS,
and Google Earth.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

from processing.meteorology.radar_dwr_engine import IMD_DWR_STATIONS, DopplerWeatherRadarEngine

NDRF_BATTALIONS_DATA = [
    {"id": "ndrf_01", "name": "1st Bn NDRF (Guwahati)", "lat": 26.1158, "lon": 91.7086, "state": "Assam", "teams": 18, "boats": 42, "divers": 36, "commander": "Commandant R. K. Sharma", "readiness": "RED ALERT (ACTIVE)"},
    {"id": "ndrf_02", "name": "2nd Bn NDRF (Kolkata)", "lat": 22.9868, "lon": 88.4616, "state": "West Bengal", "teams": 16, "boats": 36, "divers": 30, "commander": "Commandant A. K. Biswas", "readiness": "STANDBY"},
    {"id": "ndrf_03", "name": "3rd Bn NDRF (Mundali/Cuttack)", "lat": 20.4625, "lon": 85.8830, "state": "Odisha", "teams": 18, "boats": 40, "divers": 32, "commander": "Commandant D. K. Jena", "readiness": "CYCLONE QRT ACTIVE"},
    {"id": "ndrf_04", "name": "4th Bn NDRF (Arakkonam)", "lat": 13.0784, "lon": 79.6687, "state": "Tamil Nadu", "teams": 16, "boats": 38, "divers": 30, "commander": "Commandant M. V. Nair", "readiness": "STANDBY (QRT 15m)"},
    {"id": "ndrf_05", "name": "5th Bn NDRF (Pune)", "lat": 18.7516, "lon": 73.6842, "state": "Maharashtra", "teams": 20, "boats": 50, "divers": 45, "commander": "Commandant S. B. Patil", "readiness": "DEPLOYED (MUMBAI/KONKAN)"},
    {"id": "ndrf_06", "name": "6th Bn NDRF (Vadodara)", "lat": 22.3072, "lon": 73.1812, "state": "Gujarat", "teams": 14, "boats": 32, "divers": 24, "commander": "Commandant N. K. Joshi", "readiness": "STANDBY"},
    {"id": "ndrf_07", "name": "7th Bn NDRF (Bhatinda)", "lat": 30.2110, "lon": 74.9455, "state": "Punjab", "teams": 15, "boats": 30, "divers": 22, "commander": "Commandant G. S. Sandhu", "readiness": "MONITORING"},
    {"id": "ndrf_08", "name": "8th Bn NDRF (Ghaziabad)", "lat": 28.6692, "lon": 77.4538, "state": "Uttar Pradesh / NCR", "teams": 22, "boats": 48, "divers": 40, "commander": "Commandant P. K. Srivastava", "readiness": "HIGH ALERT (YAMUNA FLOODS)"},
    {"id": "ndrf_09", "name": "9th Bn NDRF (Patna)", "lat": 25.5941, "lon": 85.1376, "state": "Bihar", "teams": 18, "boats": 44, "divers": 35, "commander": "Commandant A. K. Rai", "readiness": "STANDBY (KOSI BASIN)"},
    {"id": "ndrf_10", "name": "10th Bn NDRF (Vijayawada)", "lat": 16.5062, "lon": 80.6480, "state": "Andhra Pradesh", "teams": 16, "boats": 34, "divers": 26, "commander": "Commandant K. R. Rao", "readiness": "STANDBY"},
    {"id": "ndrf_11", "name": "11th Bn NDRF (Varanasi)", "lat": 25.3176, "lon": 82.9739, "state": "Uttar Pradesh", "teams": 16, "boats": 36, "divers": 28, "commander": "Commandant V. P. Singh", "readiness": "MONITORING (GANGA BASIN)"},
    {"id": "ndrf_12", "name": "12th Bn NDRF (Itanagar)", "lat": 27.0844, "lon": 93.6053, "state": "Arunachal Pradesh", "teams": 14, "boats": 28, "divers": 20, "commander": "Commandant T. Norbu", "readiness": "LANDSLIDE QRT"},
    {"id": "ndrf_13", "name": "13th Bn NDRF (Ludhiana)", "lat": 30.9010, "lon": 75.8573, "state": "Punjab", "teams": 14, "boats": 26, "divers": 18, "commander": "Commandant R. S. Bajwa", "readiness": "STANDBY"},
    {"id": "ndrf_14", "name": "14th Bn NDRF (Jasur/Kangra)", "lat": 32.1833, "lon": 75.8333, "state": "Himachal Pradesh", "teams": 15, "boats": 22, "divers": 18, "commander": "Commandant H. C. Sharma", "readiness": "FLASH FLOOD QRT"},
    {"id": "ndrf_15", "name": "15th Bn NDRF (Srinagar)", "lat": 34.0837, "lon": 74.7973, "state": "Jammu & Kashmir", "teams": 16, "boats": 30, "divers": 25, "commander": "Commandant M. A. Lone", "readiness": "HIGH ALERT"},
    {"id": "ndrf_16", "name": "16th Bn NDRF (Bhopal)", "lat": 23.2599, "lon": 77.4126, "state": "Madhya Pradesh", "teams": 15, "boats": 32, "divers": 24, "commander": "Commandant S. K. Verma", "readiness": "CENTRAL RESERVE"}
]

CWC_RIVER_CORRIDORS = [
    {
        "name": "Brahmaputra Flood Basin (Guwahati to Dhubri)",
        "danger_level": "+1.85m Above Warning Level",
        "discharge": "112,000 Cusecs",
        "severity": "CRITICAL",
        "coords": [[91.7362, 26.1445], [91.5000, 26.1800], [90.8000, 26.1000], [89.9800, 26.0200]]
    },
    {
        "name": "Yamuna Floodplain Corridor (Delhi Wazirabad to Okhla)",
        "danger_level": "+0.92m Above Warning Level",
        "discharge": "45,000 Cusecs (Hathnikund Released)",
        "severity": "HIGH",
        "coords": [[77.2300, 28.7100], [77.2400, 28.6600], [77.2500, 28.6100], [77.3000, 28.5300]]
    },
    {
        "name": "Mithi River Basin & Hindmata Channel (Mumbai)",
        "danger_level": "High Tide Storm Surge (4.2m)",
        "discharge": "Peak Inundation 3.5 ft Depth",
        "severity": "CRITICAL",
        "coords": [[72.8777, 19.0760], [72.8500, 19.0400], [72.8400, 19.0100], [72.8300, 18.9800]]
    },
    {
        "name": "Ganga Flood Basin (Varanasi to Patna)",
        "danger_level": "Approaching Warning Level (70.2m)",
        "discharge": "88,000 Cusecs",
        "severity": "MODERATE",
        "coords": [[82.9739, 25.3176], [83.5000, 25.4000], [84.3000, 25.5000], [85.1376, 25.5941]]
    }
]

class NationalGeoJsonExporter:
    """
    Generates standard RFC 7946 GeoJSON FeatureCollections for GIS software.
    """
    def export_all_layers(
        self,
        event_clusters: Optional[List[Any]] = None,
        verified_reports: Optional[List[Any]] = None,
        layer_filter: str = "all"
    ) -> Dict[str, Any]:
        features = []
        now_iso = datetime.now(timezone.utc).isoformat()

        # 1. IMD Doppler Weather Radars
        if layer_filter in ["all", "radars"]:
            for r in IMD_DWR_STATIONS:
                features.append({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [r["longitude"], r["latitude"]]
                    },
                    "properties": {
                        "layer": "imd_dwr_radar",
                        "code": r["code"],
                        "name": r["name"],
                        "state": r["state"],
                        "range_km": r["range_km"],
                        "frequency_ghz": r["freq_ghz"],
                        "status": "OPERATIONAL",
                        "agency": "India Meteorological Department (MoES)"
                    }
                })

        # 2. NDRF Battalions
        if layer_filter in ["all", "ndrf"]:
            for b in NDRF_BATTALIONS_DATA:
                features.append({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [b["lon"], b["lat"]]
                    },
                    "properties": {
                        "layer": "ndrf_battalion",
                        "battalion_id": b["id"],
                        "name": b["name"],
                        "state": b["state"],
                        "teams": b["teams"],
                        "rescue_boats": b["boats"],
                        "deep_divers": b["divers"],
                        "commander": b["commander"],
                        "readiness": b["readiness"],
                        "agency": "National Disaster Response Force (MHA)"
                    }
                })

        # 3. CWC River Flood Corridors
        if layer_filter in ["all", "cwc"]:
            for c in CWC_RIVER_CORRIDORS:
                features.append({
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": c["coords"]
                    },
                    "properties": {
                        "layer": "cwc_flood_corridor",
                        "name": c["name"],
                        "danger_level": c["danger_level"],
                        "discharge": c["discharge"],
                        "severity": c["severity"],
                        "agency": "Central Water Commission (Jal Shakti)"
                    }
                })

        # 4. Active Spatiotemporal Incident Clusters
        if layer_filter in ["all", "clusters"] and event_clusters:
            for cluster in event_clusters:
                lat = getattr(cluster, "latitude", None)
                lon = getattr(cluster, "longitude", None)
                if lat is not None and lon is not None:
                    features.append({
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [float(lon), float(lat)]
                        },
                        "properties": {
                            "layer": "incident_cluster",
                            "cluster_id": getattr(cluster, "id", "INC-00"),
                            "title": getattr(cluster, "title", "Disaster Event"),
                            "event_type": getattr(cluster, "event_type", "FLOOD"),
                            "city": getattr(cluster, "city", "India"),
                            "state": getattr(cluster, "state", "India"),
                            "severity": getattr(cluster, "severity", "HIGH"),
                            "vayuscore": getattr(cluster, "overall_credibility", 85.0),
                            "total_reports": getattr(cluster, "total_reports", 1),
                            "status": getattr(cluster, "status", "ACTIVE")
                        }
                    })

        # 5. Verified Ground Truth Reports
        if layer_filter in ["all", "reports"] and verified_reports:
            for rep in verified_reports:
                lat = getattr(rep, "latitude", None)
                lon = getattr(rep, "longitude", None)
                if lat is not None and lon is not None:
                    features.append({
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [float(lon), float(lat)]
                        },
                        "properties": {
                            "layer": "verified_ground_report",
                            "report_id": getattr(rep, "id", ""),
                            "event_type": getattr(rep, "event_type", ""),
                            "city": getattr(rep, "city", ""),
                            "state": getattr(rep, "state", ""),
                            "text": getattr(rep, "text", "")[:120],
                            "credibility_score": getattr(rep, "credibility_score", 90.0),
                            "author": getattr(rep, "author", "Citizen"),
                            "verification_status": getattr(rep, "verification_status", "VERIFIED")
                        }
                    })

        return {
            "type": "FeatureCollection",
            "metadata": {
                "generated_by": "VARSHANET 2.0 National Disaster Intelligence Grid",
                "generated_at_utc": now_iso,
                "layer_filter": layer_filter,
                "total_features": len(features),
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
                    }
                }
            },
            "features": features
        }

geojson_exporter = NationalGeoJsonExporter()
