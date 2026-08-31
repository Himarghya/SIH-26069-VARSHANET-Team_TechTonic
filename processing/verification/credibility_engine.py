from typing import Dict, List, Optional, Tuple

SOURCE_WEIGHTS = {
    "government_open_data": 0.98,
    "weather_api": 0.95,
    "rss_news": 0.88,
    "citizen_report": 0.72,
    "social_media": 0.60,
    "other": 0.50
}

class CredibilityEngine:
    def calculate_credibility(
        self,
        source_type: str,
        text: str,
        event_type: str,
        event_confidence: float,
        location_confidence: float,
        is_duplicate: bool,
        duplicate_count: int,
        has_media: bool,
        weather_observation: Optional[Dict] = None
    ) -> Tuple[float, str, str, str]:
        """
        Returns: (credibility_score 0-100, risk_level, verification_status, notes)
        """
        base_weight = SOURCE_WEIGHTS.get(source_type, 0.60)
        score = base_weight * 70.0 # Start with up to 70 pts based on source
        
        # 1. Location confidence contribution (up to 10 pts)
        score += location_confidence * 10.0
        
        # 2. Event confidence contribution (up to 10 pts)
        score += event_confidence * 10.0
        
        # 3. Media evidence bonus (up to 5 pts)
        if has_media:
            score += 5.0
            
        # 4. Cross-report corroboration: multiple independent reports boost credibility
        if duplicate_count > 3:
            score += min(10.0, duplicate_count * 1.5)
            
        # 5. Official weather observation confirmation
        notes = []
        if weather_observation:
            rain = weather_observation.get("rainfall_mm", 0.0)
            if ("Rain" in event_type or "Flood" in event_type) and rain > 5.0:
                score += 10.0
                notes.append(f"Confirmed by ground station ({rain}mm recorded).")
            elif "Heatwave" in event_type and weather_observation.get("temperature", 30) > 40:
                score += 10.0
                notes.append("Confirmed by high station temperature.")
                
        # 6. Misinformation penalty checks
        lower = text.lower()
        if "snow" in lower and any(c in lower for c in ["chennai", "mumbai", "bhopal", "kolkata"]):
            # Impossible weather in plains
            score -= 50.0
            notes.append("Contradictory meteorological claim detected.")
            
        # Clamp score between 10 and 99
        final_score = max(10.0, min(98.0, round(score, 1)))
        
        # Determine risk & status
        if final_score >= 85:
            risk_level = "LOW"
            status = "LIKELY_AUTHENTIC"
        elif final_score >= 65:
            risk_level = "MODERATE"
            status = "UNVERIFIED"
        elif final_score >= 45:
            risk_level = "HIGH"
            status = "REQUIRES_REVIEW"
        else:
            risk_level = "CRITICAL"
            status = "LIKELY_MISLEADING"
            
        if source_type in ["government_open_data", "weather_api"] and final_score >= 80:
            status = "VERIFIED"
            
        note_str = " | ".join(notes) if notes else "Evaluated by AI multi-factor credibility pipeline."
        return final_score, risk_level, status, note_str

credibility_engine = CredibilityEngine()
