"""
extreme_advisory_engine.py

Translates real-time Doppler Radar reflectivity, INSAT-3DR thermal satellite CTT,
and Extreme ML Predictor CPI/WBGT indices into structured, actionable emergency
advisories and administrative directives for DMs, SDMAs, and NDRF commanders.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
import math

from processing.meteorology.extreme_weather_ml import extreme_ml_predictor

class ExtremeWeatherAdvisoryEngine:
    """
    Generates actionable emergency response advisories for Cloudburst,
    Severe Heatwaves, Cyclone Storm Surges, and Flash Floods.
    """

    def generate_cloudburst_advisory(
        self,
        city: str,
        state: str,
        radar_dbz: float = 56.5,
        cloud_top_temp_c: float = -72.0,
        rainfall_rate_mmh: float = 75.0,
        is_himalayan: bool = True
    ) -> Dict[str, Any]:
        cpi_result = extreme_ml_predictor.compute_cloudburst_prediction_index(
            radar_dbz=radar_dbz,
            cloud_top_temp_c=cloud_top_temp_c,
            rainfall_rate_mmh=rainfall_rate_mmh,
            is_himalayan_orography=is_himalayan
        )

        cpi_score = cpi_result["cloudburst_prediction_index"]
        alert_level = cpi_result["alert_level"]
        lead_time = cpi_result["estimated_lead_time_minutes"]

        if cpi_score >= 75.0:
            status = "CRITICAL_ACTION_REQUIRED"
            color = "rose"
            priority = "P0 - IMMEDIATE EVACUATION"
            directives = [
                f"Trigger OASIS CAP 1.2 emergency cell sirens across {city} within 5 minutes.",
                f"Requisition nearest NDRF battalion with deep diver teams and inflatable motor boats.",
                "Evacuate all settlements within 300m of mountain stream channels and nullahs.",
                "Close low-lying river bridges, culverts, and underpass bypass routes immediately.",
                "Establish temporary emergency relief camps on high ground with dry rations and power backup."
            ]
            public_notice_en = f"EMERGENCY WARNING: Imminent cloudburst risk detected in {city} (CPI {cpi_score}/100). Move to high ground immediately. Avoid traveling near hill streams."
            public_notice_hi = f"आपातकालीन चेतावनी: {city} में भीषण बादल फटने की संभावना (CPI {cpi_score}/100)। तुरंत ऊंचाई वाले सुरक्षित स्थानों पर जाएं और बरसाती नालों से दूर रहें।"
        elif cpi_score >= 50.0:
            status = "WARNING_STANDBY"
            color = "amber"
            priority = "P1 - HIGH READINESS"
            directives = [
                f"Issue localized yellow/orange alert bulletin for {city} district disaster control room.",
                "Pre-position State Disaster Response Force (SDRF) teams at vulnerable choke points.",
                "Verify backup communication channels (satellite phones & VHF radio networks)."
            ]
            public_notice_en = f"HEAVY RAIN ALERT: Severe convective storm developing over {city}. Stay indoors and monitor weather updates."
            public_notice_hi = f"भारी बारिश का अलर्ट: {city} में तीव्र गरज-चमक और भारी बारिश का अंदेशा। सुरक्षित पक्के मकानों में रहें।"
        else:
            status = "ROUTINE_MONITORING"
            color = "emerald"
            priority = "P3 - ADVISORY"
            directives = ["Standard meteorological radar monitoring active."]
            public_notice_en = f"Weather update: Normal synoptic conditions in {city}."
            public_notice_hi = f"मौसम सामान्य: {city} में स्थिति नियंत्रण में है।"

        return {
            "hazard_type": "CLOUDBURST_FLASH_FLOOD",
            "city": city,
            "state": state,
            "cpi_score": cpi_score,
            "alert_level": alert_level,
            "estimated_lead_time_min": lead_time,
            "operational_status": status,
            "priority_code": priority,
            "badge_color": color,
            "administrative_directives": directives,
            "public_bulletin": {
                "en": public_notice_en,
                "hi": public_notice_hi
            },
            "sensor_telemetry": {
                "radar_reflectivity_dbz": radar_dbz,
                "cloud_top_temperature_c": cloud_top_temp_c,
                "rainfall_rate_mmh": rainfall_rate_mmh,
                "himalayan_terrain": is_himalayan
            },
            "timestamp_utc": datetime.now(timezone.utc).isoformat()
        }

    def generate_heatwave_advisory(
        self,
        city: str,
        state: str,
        temp_c: float = 44.5,
        humidity_pct: float = 48.0,
        wind_speed_kmh: float = 22.0
    ) -> Dict[str, Any]:
        wbgt_res = extreme_ml_predictor.compute_heatwave_wbgt_index(
            temperature_c=temp_c,
            humidity_pct=humidity_pct,
            wind_speed_kmh=wind_speed_kmh
        )

        heat_index = wbgt_res["heat_index_c"]
        severity = wbgt_res["severity_classification"]

        if temp_c >= 44.0 or heat_index >= 50.0:
            directives = [
                f"Declare mandatory work stoppage between 11:30 AM and 4:00 PM in {city}.",
                "Deploy municipal water tankers and public hydration kiosks at transit hubs.",
                "Ensure emergency cooling wards in all district hospitals with IV fluids and ice packs."
            ]
            bulletin_en = f"SEVERE HEATWAVE RED ALERT: Extreme heat index ({heat_index}°C) in {city}. Avoid direct sunlight."
            bulletin_hi = f"भीषण लू रेड अलर्ट: {city} में अत्यधिक तापमान और हीट इंडेक्स ({heat_index}°C)। दोपहर में धूप में न निकलें।"
            color = "rose"
        else:
            directives = ["Standard summer advisory: Maintain hydration and avoid direct sun during peak noon."]
            bulletin_en = f"Heat advisory: Moderate thermal stress in {city}."
            bulletin_hi = f"गर्मी की सलाह: {city} में पर्याप्त पानी पिएं।"
            color = "amber"

        return {
            "hazard_type": "SEVERE_HEATWAVE_LOO",
            "city": city,
            "state": state,
            "ambient_temp_c": temp_c,
            "heat_index_c": heat_index,
            "wet_bulb_temp_c": wbgt_res["wet_bulb_temperature_c"],
            "severity_classification": severity,
            "badge_color": color,
            "administrative_directives": directives,
            "public_bulletin": {
                "en": bulletin_en,
                "hi": bulletin_hi
            },
            "timestamp_utc": datetime.now(timezone.utc).isoformat()
        }

extreme_advisory_engine = ExtremeWeatherAdvisoryEngine()
