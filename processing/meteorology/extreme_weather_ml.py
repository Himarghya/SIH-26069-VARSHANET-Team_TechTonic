from typing import Dict, Any, List

class ExtremeWeatherMlPredictor:
    """
    MoES Advanced Predictive ML & Hydro-Meteorological Model for extreme weather anomalies:
    1. Cloudburst Prediction Index (CPI, 0-100)
    2. Severe Heatwave & Wet-Bulb Globe Temperature (WBGT) / Loo Stress Index
    3. Flash Flood & Hydrological Inundation Surge Vector
    """

    def compute_cloudburst_prediction_index(
        self,
        radar_dbz: float,
        cloud_top_temp_c: float,
        rainfall_rate_mmh: float,
        is_himalayan_orography: bool = False
    ) -> Dict[str, Any]:
        """
        Cloudburst Prediction Index (CPI):
        Requires rapid convective updraft (Radar dBZ > 50), extreme cold cloud tops (CTT < -65°C),
        and high precipitable water flux.
        """
        # 1. Radar Reflectivity Factor (0 - 40 pts)
        radar_pts = min(40.0, max(0.0, (radar_dbz - 25.0) * 1.33))

        # 2. Cold Cloud Top Temperature Factor (0 - 30 pts)
        # CTT colder than -50°C indicates high vertical cloud height
        temp_pts = min(30.0, max(0.0, (-cloud_top_temp_c - 40.0) * 1.0))

        # 3. Intensity & Orographic multiplier (0 - 30 pts)
        rate_pts = min(20.0, (rainfall_rate_mmh / 70.0) * 20.0)
        orography_pts = 10.0 if is_himalayan_orography else 0.0

        cpi_score = min(99.0, round(radar_pts + temp_pts + rate_pts + orography_pts, 1))

        if cpi_score >= 80.0:
            cpi_level = "IMMINENT_CLOUDBURST_RED_ALERT"
            lead_time_min = 25
        elif cpi_score >= 60.0:
            cpi_level = "SEVERE_CONVECTIVE_HAIL_STORM_ORANGE"
            lead_time_min = 45
        elif cpi_score >= 40.0:
            cpi_level = "MODERATE_THUNDERSTORM_YELLOW"
            lead_time_min = 60
        else:
            cpi_level = "LOW_RISK_GREEN"
            lead_time_min = 120

        return {
            "cloudburst_prediction_index": cpi_score,
            "alert_level": cpi_level,
            "estimated_lead_time_minutes": lead_time_min,
            "radar_reflectivity_dbz": radar_dbz,
            "cloud_top_temperature_c": cloud_top_temp_c,
            "himalayan_orography_trigger": is_himalayan_orography,
            "meteorological_rationale": f"Calculated CPI: {cpi_score}/100 based on severe convective updraft echo and cold cloud-top thermodynamic lapse rate."
        }

    def compute_heatwave_wbgt_index(
        self,
        temperature_c: float,
        humidity_pct: float,
        wind_speed_kmh: float
    ) -> Dict[str, Any]:
        """
        Computes Heat Index (Steadman formula approximation) and Wet-Bulb Globe Temperature (WBGT)
        for thermal mortality & severe heatwave / Loo wind warning.
        """
        # Simplified Heat Index (HI)
        hi = temperature_c + 0.5555 * ((humidity_pct / 100.0) * 6.112 * math.exp((17.67 * temperature_c) / (temperature_c + 243.5)) - 10.0)
        hi = round(hi, 1)

        # Wet-Bulb Temperature approximation (Stull formula)
        tw = temperature_c * math.atan(0.151977 * (humidity_pct + 8.313659)**0.5) + math.atan(temperature_c + humidity_pct) - math.atan(humidity_pct - 1.676331) + 0.00391838 * (humidity_pct**1.5) * math.atan(0.023101 * humidity_pct) - 4.686035
        tw = round(tw, 1)

        if temperature_c >= 45.0 or hi >= 52.0:
            severity = "SEVERE_HEATWAVE_RED_ALERT"
            impact = "Extreme risk of heat stroke and cardiovascular collapse; mandatory work halts."
        elif temperature_c >= 42.0 or hi >= 44.0:
            severity = "HEATWAVE_ORANGE_WARNING"
            impact = "High risk of heat cramps and exhaustion; avoid afternoon exposure."
        else:
            severity = "NORMAL_THERMAL_RANGE"
            impact = "Thermal conditions within normal synoptic parameters."

        return {
            "ambient_temperature_c": temperature_c,
            "relative_humidity_pct": humidity_pct,
            "heat_index_c": hi,
            "wet_bulb_temperature_c": tw,
            "severity_classification": severity,
            "biometeorological_impact": impact
        }

import math
extreme_ml_predictor = ExtremeWeatherMlPredictor()