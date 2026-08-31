import math
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Optional, Tuple

class EventClusterer:
    @staticmethod
    def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    def find_or_create_cluster(
        self,
        event_type: str,
        city: str,
        state: str,
        lat: float,
        lon: float,
        source_type: str,
        credibility: float,
        existing_clusters: List[Dict]
    ) -> Tuple[str, bool, Dict]:
        """
        Returns: (cluster_id, is_new_cluster, cluster_data)
        """
        # Search for active matching cluster within 35km and same/related event type
        for cl in existing_clusters:
            if cl.get("status") in ["ACTIVE", "VERIFIED", "UNDER_REVIEW"]:
                dist = self.calculate_distance_km(lat, lon, cl["latitude"], cl["longitude"])
                if dist <= 35.0:
                    # Check event similarity
                    if cl["event_type"] == event_type or ("Rain" in cl["event_type"] and "Rain" in event_type):
                        cl["total_reports"] = cl.get("total_reports", 1) + 1
                        if source_type == "citizen_report":
                            cl["citizen_reports_count"] = cl.get("citizen_reports_count", 0) + 1
                        if source_type in ["weather_api", "government_open_data"]:
                            cl["weather_api_confirmed"] = True
                            cl["status"] = "VERIFIED"
                        cl["last_reported_at"] = datetime.now(timezone.utc)
                        return cl["id"], False, cl
                        
        # Generate unique cluster ID
        today_str = datetime.now(timezone.utc).strftime("%Y%m%d")
        unique_suffix = uuid.uuid4().hex[:4].upper()
        new_cluster_id = f"EVT-{today_str}-{unique_suffix}"
        
        severity = "MODERATE"
        if event_type in ["Cyclone", "Flash Flood", "Cloudburst", "Landslide"]:
            severity = "CRITICAL"
        elif event_type in ["Heavy Rainfall", "Urban Flooding", "Thunderstorm", "Heatwave"]:
            severity = "HIGH"
            
        new_cluster = {
            "id": new_cluster_id,
            "title": f"{event_type} in {city}, {state}",
            "event_type": event_type,
            "city": city,
            "district": city,
            "state": state,
            "latitude": lat,
            "longitude": lon,
            "status": "ACTIVE",
            "severity": severity,
            "total_reports": 1,
            "independent_sources_count": 1,
            "citizen_reports_count": 1 if source_type == "citizen_report" else 0,
            "weather_api_confirmed": source_type in ["weather_api", "government_open_data"],
            "confidence_score": 0.88,
            "overall_credibility": credibility,
            "started_at": datetime.now(timezone.utc),
            "last_reported_at": datetime.now(timezone.utc),
            "summary": f"Initial report of {event_type} detected in {city}, {state} via {source_type}."
        }
        return new_cluster_id, True, new_cluster

event_clusterer = EventClusterer()