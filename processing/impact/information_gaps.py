import uuid
from typing import List, Dict, Any

class InformationGapEngine:
    """
    Identifies what the intelligence grid does NOT know and generates actionable
    Citizen Verification Requests to resolve operational uncertainty.
    """
    def identify_gaps(
        self,
        city: str,
        state: str,
        lat: float,
        lon: float,
        event_type: str,
        citizen_reports_count: int,
        weather_api_confirmed: bool,
        roads_at_risk_count: int
    ) -> Tuple_List:
        gaps = []
        verification_requests = []

        # Gap 1: Road & Underpass Traffic Passability
        if roads_at_risk_count > 0:
            gap_id = f"gap_{uuid.uuid4().hex[:8]}"
            gaps.append({
                "id": gap_id,
                "missing_information": f"Real-time passability of key arterial underpasses in {city}",
                "affected_decision": "Traffic police diversion routing and emergency vehicle dispatch",
                "severity": "HIGH",
                "recommended_action": "Request nearby citizens to submit visual photo confirmation of road water levels."
            })
            verification_requests.append({
                "id": f"vrq_{uuid.uuid4().hex[:8]}",
                "information_gap_id": gap_id,
                "title": f"Verify Road Passability near {city}",
                "prompt": f"Can citizens near {city} central corridor verify if main underpass is waterlogged or passable for 4-wheelers?",
                "target_area": f"{city} Central Corridor",
                "latitude": lat + 0.01,
                "longitude": lon + 0.01,
                "radius_km": 4.0,
                "status": "ACTIVE",
                "responses_count": 0
            })

        # Gap 2: Ground Radar Confirmation if only citizen reports exist
        if not weather_api_confirmed and citizen_reports_count > 0:
            gap_id = f"gap_{uuid.uuid4().hex[:8]}"
            gaps.append({
                "id": gap_id,
                "missing_information": f"Automated Synoptic AWS sensor reading in {city} perimeter",
                "affected_decision": "Official meteorological red alert escalation",
                "severity": "MEDIUM",
                "recommended_action": "Cross-reference IMD Doppler Radar reflectivity or request rain gauge readings."
            })

        return gaps, verification_requests

Tuple_List = tuple[List[Dict[str, Any]], List[Dict[str, Any]]]
information_gap_engine = InformationGapEngine()