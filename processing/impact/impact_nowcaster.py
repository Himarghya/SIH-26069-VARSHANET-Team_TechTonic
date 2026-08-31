from typing import List, Dict, Any

class ImpactNowcaster:
    """
    Lightweight, transparent, explainable 3-hour trajectory nowcast model
    predicting impact evolution across 0m (current), 30m, 60m, 120m, and 180m (3h).
    """
    def generate_nowcast_trajectory(
        self,
        current_risk: float,
        rainfall_trend: str, # INCREASING, STABLE, DECREASING
        event_severity: str,
        escalation_probability: float
    ) -> List[Dict[str, Any]]:
        # Trend multiplier
        trend_mult = {"INCREASING": 1.15, "STABLE": 1.02, "DECREASING": 0.85}.get(rainfall_trend, 1.05)
        
        trajectory = []
        # Timesteps in minutes
        timesteps = [
            {"offset": 0, "label": "Current", "factor": 1.0},
            {"offset": 30, "label": "+30 Min", "factor": 1.0 + (0.12 * trend_mult * escalation_probability)},
            {"offset": 60, "label": "+60 Min", "factor": 1.0 + (0.24 * trend_mult * escalation_probability)},
            {"offset": 120, "label": "+2 Hours", "factor": 1.0 + (0.35 * trend_mult * escalation_probability)},
            {"offset": 180, "label": "+3 Hours", "factor": 1.0 + (0.42 * trend_mult * escalation_probability) if rainfall_trend != "DECREASING" else 0.75}
        ]

        for step in timesteps:
            pred_risk = min(99.0, max(10.0, round(current_risk * step["factor"], 1)))
            
            sev = "LOW"
            if pred_risk >= 80.0:
                sev = "CRITICAL"
            elif pred_risk >= 65.0:
                sev = "HIGH"
            elif pred_risk >= 45.0:
                sev = "MODERATE"
                
            trajectory.append({
                "forecast_offset_minutes": step["offset"],
                "time_label": step["label"],
                "predicted_risk_score": pred_risk,
                "predicted_rainfall_mm": round(pred_risk * 1.2, 1),
                "predicted_severity": sev,
                "confidence": round(max(0.65, 0.95 - (step["offset"] / 360.0)), 2)
            })

        return trajectory

impact_nowcaster = ImpactNowcaster()