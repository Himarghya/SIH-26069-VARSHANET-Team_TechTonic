#!/usr/bin/env python3
"""
scripts/test_cap_serializer.py

Unit test for OASIS CAP 1.2 XML Serializer and Validator.
"""
import sys
from pathlib import Path

_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_ROOT))

from processing.broadcasting.cap_serializer import cap_serializer

def test_cap_serializer():
    xml_str = cap_serializer.generate_cap_xml(
        event_type="CLOUDBURST",
        city="Shimla",
        state="Himachal Pradesh",
        severity="CRITICAL",
        latitude=31.1048,
        longitude=77.1734,
        radius_km=20.0
    )
    assert "xmlns=\"urn:oasis:names:tc:emergency:cap:1.2\"" in xml_str
    assert "en-IN" in xml_str
    assert "hi-IN" in xml_str
    assert "Shimla" in xml_str

    val = cap_serializer.validate_cap_xml(xml_str)
    assert val["is_valid"] is True
    assert val["info_blocks_count"] == 2
    assert "en-IN" in val["languages_included"]
    assert "hi-IN" in val["languages_included"]

    print("[PASS] OASIS CAP 1.2 XML Serializer & Validator Test Passed!")

if __name__ == "__main__":
    test_cap_serializer()
