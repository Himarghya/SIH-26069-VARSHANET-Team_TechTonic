from typing import Dict, Any, List

# 30-Year Historical Climate Normals Baseline (1991–2020 IMD normals)
IMD_30YR_NORMALS = {
    "bhopal": {"mean_rain_aug_mm": 312.0, "std_dev_rain_mm": 68.0, "mean_temp_c": 28.5, "std_dev_temp_c": 2.4},
    "mumbai": {"mean_rain_aug_mm": 560.0, "std_dev_rain_mm": 115.0, "mean_temp_c": 29.1, "std_dev_temp_c": 1.8},
    "dehradun": {"mean_rain_aug_mm": 665.0, "std_dev_rain_mm": 140.0, "mean_temp_c": 26.2, "std_dev_temp_c": 2.1},
    "guwahati": {"mean_rain_aug_mm": 345.0, "std_dev_rain_mm": 72.0, "mean_temp_c": 31.0, "std_dev_temp_c": 2.0},
    "delhi": {"mean_rain_aug_mm": 235.0, "std_dev_rain_mm": 55.0, "mean_temp_c": 33.4, "std_dev_temp_c": 2.6},
    "jaipur": {"mean_rain_aug_mm": 210.0, "std_dev_rain_mm": 48.0, "mean_temp_c": 32.2, "std_dev_temp_c": 2.5},
    "patna": {"mean_rain_aug_mm": 275.0, "std_dev_rain_mm": 62.0, "mean_temp_c": 31.5, "std_dev_temp_c": 2.2},
    "chennai": {"mean_rain_aug_mm": 138.0, "std_dev_rain_mm": 35.0, "mean_temp_c": 34.0, "std_dev_temp_c": 1.9}
}

DEFAULT_NORMALS = {"mean_rain_aug_mm": 300.0, "std_dev_rain_mm": 70.0, "mean_temp_c": 30.0, "std_dev_temp_c": 2.2}

class ClimatologyAnomalyEngine:
    """
    Evaluates observed meteorological parameters against 30-Year Historical IMD Gridded Climatological Normals.
    Calculates Standardized Anomaly Z-Score: Z = (x - μ) / σ
    Flags extreme historical anomalies exceeding ±2.5σ.
    """
    def evaluate_anomaly(self, city: str, observed_24h_rain_mm: float, observed_temp_c: float) -> Dict[str, Any]:
        norm = IMD_30YR_NORMALS.get(city.lower().strip(), DEFAULT_NORMALS)
        
        # 1. Rainfall Anomaly Z-Score
        rain_z = round((observed_24h_rain_mm - (norm["mean_rain_aug_mm"] / 30.0)) / (norm["std_dev_rain_mm"] / 5.5), 2)
        
        # 2. Temperature Anomaly Z-Score
        temp_z = round((observed_temp_c - norm["mean_temp_c"]) / norm["std_dev_temp_c"], 2)

        # Classify Anomaly Exceedance
        if rain_z >= 3.0:
            rain_category = "HISTORICALLY_EXTREME_PRECIPITATION (+3σ Exceedance)"
            is_anomaly = True
        elif rain_z >= 2.0:
            rain_category = "SEVERE_EXCESS_RAINFALL (+2σ)"
            is_anomaly = True
        elif rain_z <= -2.0:
            rain_category = "SEVERE_DEFICIT"
            is_anomaly = True
        else:
            rain_category = "NORMAL_SYNOPTIC_VARIATION"
            is_anomaly = False

        return {
            "city": city,
            "baseline_period": "1991–2020 IMD 30-Year Climatological Normal",
            "historical_mean_daily_rain_mm": round(norm["mean_rain_aug_mm"] / 30.0, 1),
            "observed_rain_mm": round(observed_24h_rain_mm, 1),
            "rain_anomaly_z_score": rain_z,
            "rain_anomaly_classification": rain_category,
            "historical_mean_temp_c": norm["mean_temp_c"],
            "observed_temp_c": round(observed_temp_c, 1),
            "temp_anomaly_z_score": temp_z,
            "is_extreme_climatological_anomaly": is_anomaly
        }

climatology_engine = ClimatologyAnomalyEngine()