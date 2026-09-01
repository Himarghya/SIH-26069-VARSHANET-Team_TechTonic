import math
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

IMD_DWR_STATIONS = [
    {"code": "DWR-DEL", "name": "Delhi Palam DWR", "latitude": 28.5847, "longitude": 77.0984, "state": "Delhi NCR", "range_km": 250, "freq_ghz": 5.6},
    {"code": "DWR-BPL", "name": "Bhopal Bairagarh DWR", "latitude": 23.2875, "longitude": 77.3374, "state": "Madhya Pradesh", "range_km": 250, "freq_ghz": 2.8},
    {"code": "DWR-MUM", "name": "Mumbai Colaba DWR", "latitude": 18.9067, "longitude": 72.8147, "state": "Maharashtra", "range_km": 250, "freq_ghz": 2.8},
    {"code": "DWR-KOL", "name": "Kolkata Alipore DWR", "latitude": 22.5333, "longitude": 88.3333, "state": "West Bengal", "range_km": 250, "freq_ghz": 2.8},
    {"code": "DWR-CHN", "name": "Chennai Port DWR", "latitude": 13.0827, "longitude": 80.2707, "state": "Tamil Nadu", "range_km": 250, "freq_ghz": 2.8},
    {"code": "DWR-PAT", "name": "Patna Airport DWR", "latitude": 25.5913, "longitude": 85.0880, "state": "Bihar", "range_km": 250, "freq_ghz": 5.6},
    {"code": "DWR-MHB", "name": "Mohanbari Dibrugarh DWR", "latitude": 27.4833, "longitude": 94.9167, "state": "Assam", "range_km": 250, "freq_ghz": 5.6},
    {"code": "DWR-SRN", "name": "Srinagar DWR", "latitude": 34.0837, "longitude": 74.7973, "state": "Jammu & Kashmir", "range_km": 250, "freq_ghz": 5.6},
    {"code": "DWR-JPR", "name": "Jaipur Sanganer DWR", "latitude": 26.8242, "longitude": 75.8010, "state": "Rajasthan", "range_km": 250, "freq_ghz": 5.6},
    {"code": "DWR-HYD", "name": "Hyderabad Begumpet DWR", "latitude": 17.4531, "longitude": 78.4677, "state": "Telangana", "range_km": 250, "freq_ghz": 2.8}
]

class DopplerWeatherRadarEngine:
    """
    Simulates & processes India Meteorological Department (IMD) Doppler Weather Radar (DWR) data.
    Computes Radar Reflectivity Factor (Z in dBZ) and precipitation rate (R in mm/hr) using
    the Marshall-Palmer and Convective Z-R relationships:
    Z = 200 * R^1.6 (Stratiform) | Z = 300 * R^1.4 (Convective/Cloudburst)
    """

    @staticmethod
    def dbz_to_rainfall_rate(dbz: float, convective: bool = False) -> float:
        if dbz <= 10.0:
            return 0.0
        z_linear = 10.0 ** (dbz / 10.0)
        if convective:
            # Z = 300 * R^1.4  -->  R = (Z / 300)^(1 / 1.4)
            r = (z_linear / 300.0) ** (1.0 / 1.4)
        else:
            # Z = 200 * R^1.6  -->  R = (Z / 200)^(1 / 1.6)
            r = (z_linear / 200.0) ** (1.0 / 1.6)
        return round(r, 1)

    @staticmethod
    def classify_hydrometeor(dbz: float) -> Dict[str, Any]:
        if dbz >= 55.0:
            return {"category": "CLOUDBURST_HAIL_CORE", "color": "#7e22ce", "label": "Cloudburst / Extreme Hail Core", "hazard": "CRITICAL"}
        elif dbz >= 45.0:
            return {"category": "TORRENTIAL_DOWNPOUR", "color": "#e11d48", "label": "Torrential Convective Rainfall", "hazard": "HIGH"}
        elif dbz >= 35.0:
            return {"category": "MODERATE_HEAVY_RAIN", "color": "#ea580c", "label": "Moderate to Heavy Rain", "hazard": "MODERATE"}
        elif dbz >= 20.0:
            return {"category": "LIGHT_RAIN", "color": "#0284c7", "label": "Light Stratiform Rain", "hazard": "LOW"}
        else:
            return {"category": "CLEAR_DRIZZLE", "color": "#059669", "label": "No Significant Echo", "hazard": "NONE"}

    def get_national_radar_grid(self, active_event_coords: Optional[List[Dict[str, float]]] = None) -> Dict[str, Any]:
        """
        Generates simulated polar/cartesian radar sweep grids across all Indian DWR nodes.
        """
        radar_nodes = []
        active_coords = active_event_coords or []

        for station in IMD_DWR_STATIONS:
            # Calculate distance to nearest active weather incident
            min_dist = 9999.0
            for pt in active_coords:
                d = math.sqrt((station["latitude"] - pt.get("latitude", 0))**2 + (station["longitude"] - pt.get("longitude", 0))**2) * 111.0
                if d < min_dist:
                    min_dist = d

            # If weather incident is within radar range (250km), synthesize intense convective echoes
            if min_dist <= 80.0:
                peak_dbz = round(min(62.0, 48.0 + (80.0 - min_dist) * 0.18), 1)
            elif min_dist <= 200.0:
                peak_dbz = round(32.0 + (200.0 - min_dist) * 0.08, 1)
            else:
                peak_dbz = round(15.0 + (hash(station["code"]) % 12), 1)

            rain_rate = self.dbz_to_rainfall_rate(peak_dbz, convective=(peak_dbz >= 45.0))
            hydro = self.classify_hydrometeor(peak_dbz)

            radar_nodes.append({
                "station_code": station["code"],
                "station_name": station["name"],
                "latitude": station["latitude"],
                "longitude": station["longitude"],
                "state": station["state"],
                "range_km": station["range_km"],
                "peak_reflectivity_dbz": peak_dbz,
                "estimated_rain_rate_mmh": rain_rate,
                "hydrometeor_classification": hydro,
                "sweep_elevation_deg": 0.5,
                "last_scan_utc": datetime.now(timezone.utc).isoformat()
            })

        return {
            "network_status": "OPERATIONAL",
            "total_dwr_stations": len(radar_nodes),
            "wavelength_band": "S/C Band Active Telemetry",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "stations": radar_nodes
        }

dwr_engine = DopplerWeatherRadarEngine()