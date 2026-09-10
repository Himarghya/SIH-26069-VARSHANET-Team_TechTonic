#!/usr/bin/env python3
"""
scripts/test_extreme_advisories.py

Unit test for Extreme Weather Advisory Engine & Predictive ML Indices.
"""
import sys
from pathlib import Path

_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_ROOT))

from processing.meteorology.extreme_advisory_engine import extreme_advisory_engine

def test_cloudburst_advisory():
    res = extreme_advisory_engine.generate_cloudburst_advisory(
        city="Chamoli",
        state="Uttarakhand",
        radar_dbz=58.0,
        cloud_top_temp_c=-74.0,
        rainfall_rate_mmh=85.0,
        is_himalayan=True
    )
    assert res["hazard_type"] == "CLOUDBURST_FLASH_FLOOD"
    assert res["cpi_score"] >= 80.0
    assert len(res["administrative_directives"]) >= 3
    assert "Chamoli" in res["public_bulletin"]["en"]
    assert "Chamoli" in res["public_bulletin"]["hi"] or "चमोली" in res["public_bulletin"]["hi"]
    print("[PASS] Cloudburst Advisory Test Passed! CPI:", res["cpi_score"])

def test_heatwave_advisory():
    res = extreme_advisory_engine.generate_heatwave_advisory(
        city="Nagpur",
        state="Maharashtra",
        temp_c=46.2,
        humidity_pct=42.0
    )
    assert res["hazard_type"] == "SEVERE_HEATWAVE_LOO"
    assert res["heat_index_c"] > 45.0
    assert len(res["administrative_directives"]) >= 2
    print("[PASS] Heatwave Advisory Test Passed! HI:", res["heat_index_c"])

if __name__ == "__main__":
    test_cloudburst_advisory()
    test_heatwave_advisory()
