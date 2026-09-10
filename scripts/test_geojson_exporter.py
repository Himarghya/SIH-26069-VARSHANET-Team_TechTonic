#!/usr/bin/env python3
"""
scripts/test_geojson_exporter.py

Unit test for RFC 7946 GeoJSON Tactical Disaster Layer Exporter.
"""
import sys
from pathlib import Path

_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_ROOT))

from processing.geolocation.geojson_exporter import geojson_exporter

def test_geojson_export():
    res = geojson_exporter.export_all_layers()
    assert res["type"] == "FeatureCollection"
    assert "features" in res
    assert len(res["features"]) >= 30

    layer_types = set(f["properties"]["layer"] for f in res["features"])
    assert "imd_dwr_radar" in layer_types
    assert "ndrf_battalion" in layer_types
    assert "cwc_flood_corridor" in layer_types

    print("[PASS] GeoJSON Exporter Unit Test Passed (Features count: %d)" % len(res["features"]))

if __name__ == "__main__":
    test_geojson_export()
