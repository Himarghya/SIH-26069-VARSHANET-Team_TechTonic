from datetime import datetime, timezone
from typing import Dict, Any, List

class InsatSatelliteEngine:
    """
    Simulates and processes Indian Geostationary Meteorological Satellite (INSAT-3D / INSAT-3DR) data.
    Computes Cloud Top Temperature (CTT in °C), Thermal Infrared (TIR-1/TIR-2 bands),
    and Deep Convective Cloud (DCC) index for synoptic overviews.
    """
    def get_satellite_frame(self) -> Dict[str, Any]:
        sectors = [
            {"sector": "Central India (MP/Maharashtra)", "ctt_celsius": -68.5, "tir_kelvin": 204.6, "cloud_type": "Cumulonimbus / Deep Convective", "hazard_flag": "HIGH_PRECIP_PROBABILITY"},
            {"sector": "Northern Himalayas (Uttarakhand/HP)", "ctt_celsius": -74.2, "tir_kelvin": 198.9, "cloud_type": "Severe Orographic Convection", "hazard_flag": "CLOUDBURST_POTENTIAL"},
            {"sector": "Northeast (Assam/Brahmaputra)", "ctt_celsius": -62.0, "tir_kelvin": 211.1, "cloud_type": "Monsoon Trough Mesoscale Convective System", "hazard_flag": "FLOOD_RISK"},
            {"sector": "Western Coast (Mumbai/Konkan)", "ctt_celsius": -58.4, "tir_kelvin": 214.7, "cloud_type": "Offshore Trough Squall Line", "hazard_flag": "MODERATE_SQUALL"},
            {"sector": "Southern Peninsula (Tamil Nadu/Kerala)", "ctt_celsius": -32.1, "tir_kelvin": 241.0, "cloud_type": "Stratiform Cirrus", "hazard_flag": "NORMAL"}
        ]

        return {
            "satellite_id": "INSAT-3D / INSAT-3DR Geostationary Met-Sat",
            "sub_satellite_point": "74°E Longitude (Indian Subcontinent)",
            "imager_bands": ["VIS (0.55-0.75 μm)", "SWIR (1.55-1.70 μm)", "TIR-1 (10.3-11.3 μm)", "TIR-2 (11.5-12.5 μm)", "WV (6.5-7.1 μm)"],
            "resolution_km": 1.0,
            "scan_timestamp": datetime.now(timezone.utc).isoformat(),
            "cloud_motion_vectors": "Active Westerly / South-Westerly Monsoon Influx",
            "monitored_sectors": sectors
        }

insat_engine = InsatSatelliteEngine()