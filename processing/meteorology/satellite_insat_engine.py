import random
from datetime import datetime, timezone
from typing import Dict, Any, List

class InsatSatelliteEngine:
    def get_satellite_frame(self) -> Dict[str, Any]:
        base_sectors = [
            {"sector": "Central India (MP/Maharashtra)", "base_ctt": -68.5, "cloud_type": "Cumulonimbus / Deep Convective", "hazard_flag": "HIGH_PRECIP_PROBABILITY"},
            {"sector": "Northern Himalayas (Uttarakhand/HP)", "base_ctt": -74.2, "cloud_type": "Severe Orographic Convection", "hazard_flag": "CLOUDBURST_POTENTIAL"},
            {"sector": "Northeast (Assam/Brahmaputra)", "base_ctt": -62.0, "cloud_type": "Monsoon Trough Mesoscale Convective System", "hazard_flag": "FLOOD_RISK"},
            {"sector": "Western Coast (Mumbai/Konkan)", "base_ctt": -58.4, "cloud_type": "Offshore Trough Squall Line", "hazard_flag": "MODERATE_SQUALL"},
            {"sector": "Southern Peninsula (Tamil Nadu/Kerala)", "base_ctt": -32.1, "cloud_type": "Stratiform Cirrus", "hazard_flag": "NORMAL"}
        ]

        sectors = []
        for s in base_sectors:
            ctt_noise = round(random.uniform(-0.8, 0.8), 1)
            ctt = round(s["base_ctt"] + ctt_noise, 1)
            tir = round(273.15 + ctt, 1)
            sectors.append({
                "sector": s["sector"],
                "ctt_celsius": ctt,
                "tir_kelvin": tir,
                "cloud_type": s["cloud_type"],
                "hazard_flag": s["hazard_flag"]
            })

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