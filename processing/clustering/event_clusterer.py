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

    def judge_ai_severity(self, event_type: str, text: str = "", credibility: float = 80.0, report_count: int = 1) -> str:
        """
        AI Dynamic Severity Engine:
        Evaluates physical hazard thresholds, linguistic severity cues, and corroboration volume
        to objectively classify into CRITICAL, HIGH, MODERATE, or LOW.
        """
        lower_text = (text or "").lower()
        
        # 1. Extreme catastrophic triggers
        catastrophic_keywords = ["cloudburst", "flash flood", "dam overflow", "submerged", "evacuate", "deaths", "casualties", "breach", "collapsed"]
        if any(w in lower_text for w in catastrophic_keywords) or event_type in ["Cloudburst", "Flash Flood", "Cyclone", "Landslide"]:
            if report_count >= 2 or credibility >= 75:
                return "CRITICAL"
            return "HIGH"

        # 2. High severity triggers
        high_keywords = ["heavy rainfall", "waterlogging", "inundation", "heatwave 45", "red alert", "orange alert", "hailstorm", "squall", "strong winds"]
        if any(w in lower_text for w in high_keywords) or event_type in ["Heavy Rainfall", "Urban Flooding", "Heatwave", "Thunderstorm"]:
            if report_count >= 4 and credibility >= 70:
                return "HIGH"
            return "MODERATE"

        # 3. Moderate triggers
        moderate_keywords = ["rain", "drizzle", "shower", "cloudy", "fog", "thunder", "wind"]
        if any(w in lower_text for w in moderate_keywords) or event_type in ["Rainfall", "Dense Fog", "Dust Storm"]:
            return "MODERATE"

        # 4. Routine / Minor
        return "LOW"

    def find_or_create_cluster(
        self,
        event_type: str,
        city: str,
        state: str,
        lat: float,
        lon: float,
        source_type: str,
        credibility: float,
        existing_clusters: List[Dict],
        text: str = ""
    ) -> Tuple[str, bool, Dict]:
        for cl in existing_clusters:
            if cl.get("status") in ["ACTIVE", "VERIFIED", "UNDER_REVIEW"]:
                dist = self.calculate_distance_km(lat, lon, cl["latitude"], cl["longitude"])
                if dist <= 35.0:
                    if cl["event_type"] == event_type or ("Rain" in cl["event_type"] and "Rain" in event_type):
                        cl["total_reports"] = cl.get("total_reports", 1) + 1
                        if source_type == "citizen_report":
                            cl["citizen_reports_count"] = cl.get("citizen_reports_count", 0) + 1
                        if source_type in ["weather_api", "government_open_data"]:
                            cl["weather_api_confirmed"] = True
                            cl["status"] = "VERIFIED"
                        
                        # Dynamically re-evaluate severity with AI as reports accumulate
                        cl["severity"] = self.judge_ai_severity(
                            event_type=cl["event_type"],
                            text=text,
                            credibility=cl.get("overall_credibility", credibility),
                            report_count=cl["total_reports"]
                        )
                        cl["last_reported_at"] = datetime.now(timezone.utc)
                        return cl["id"], False, cl
                        
        today_str = datetime.now(timezone.utc).strftime("%Y%m%d")
        unique_suffix = uuid.uuid4().hex[:4].upper()
        new_cluster_id = f"EVT-{today_str}-{unique_suffix}"
        
        # AI judges initial severity
        severity = self.judge_ai_severity(
            event_type=event_type,
            text=text,
            credibility=credibility,
            report_count=1
        )
            
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