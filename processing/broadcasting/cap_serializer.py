"""
cap_serializer.py

OASIS Common Alerting Protocol (CAP) 1.2 XML Serializer & Validator
mandated by NDMA (National Disaster Management Authority) and ITU-T X.1303.
Generates multi-lingual (English/Hindi) cell broadcast siren alerts with geo-circles and polygon boundaries.
"""
from typing import Dict, Any, Optional, List
import uuid
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

class OasisCapSerializer:
    """
    Serializes and validates OASIS CAP 1.2 XML disaster alerts.
    """
    CAP_NAMESPACE = "urn:oasis:names:tc:emergency:cap:1.2"

    SEVERITY_MAP = {
        "CRITICAL": "Extreme",
        "HIGH": "Severe",
        "MODERATE": "Moderate",
        "LOW": "Minor"
    }

    HINDI_EVENT_TRANSLATIONS = {
        "FLOOD": "बाढ़ की चेतावनी (Flood Warning)",
        "CLOUDBURST": "बादल फटने की चेतावनी (Cloudburst Alert)",
        "CYCLONE": "चक्रवात चेतावनी (Cyclone Warning)",
        "HEATWAVE": "लू और भीषण गर्मी चेतावनी (Severe Heatwave Alert)",
        "WATERLOGGING": "जलभराव चेतावनी (Waterlogging Alert)",
        "LANDSLIDE": "भूस्खलन चेतावनी (Landslide Alert)"
    }

    HINDI_INSTRUCTIONS = {
        "FLOOD": "निचले इलाकों से तुरंत सुरक्षित ऊंचाई वाले स्थानों पर जाएं। जलमग्न पुलों या अंडरपास को पार न करें। (Move to higher ground immediately.)",
        "CLOUDBURST": "पहाड़ी ढलानों और बरसाती नालों से दूर रहें। सुरक्षित पक्के आश्रयों में रहें। (Stay away from mountain streams and runoff channels.)",
        "CYCLONE": "कच्चे ढांचों और बिजली के खंभों से दूर रहें। तटीय क्षेत्रों में बाहर न निकलें। (Stay indoors away from fragile structures and coastal shores.)",
        "HEATWAVE": "दोपहर 12 से 3 बजे के बीच सीधे धूप में निकलने से बचें। ओआरएस और पर्याप्त पानी पिएं। (Avoid direct sun between 12-3 PM. Stay hydrated.)"
    }

    def generate_cap_xml(
        self,
        event_type: str,
        city: str,
        state: str,
        severity: str = "CRITICAL",
        latitude: float = 19.0760,
        longitude: float = 72.8777,
        radius_km: float = 25.0,
        headline: Optional[str] = None,
        description: Optional[str] = None,
        directive: Optional[str] = None,
        event_id: Optional[str] = None
    ) -> str:
        now_dt = datetime.now(timezone.utc)
        sent_iso = now_dt.strftime("%Y-%m-%dT%H:%M:%S+00:00")
        alert_uuid = f"VARSHANET-IN-{now_dt.strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"

        cap_severity = self.SEVERITY_MAP.get(severity.upper(), "Severe")
        event_norm = event_type.upper()
        clean_event = event_type.replace("_", " ").title()

        default_headline = f"EMERGENCY METEOROLOGICAL SIREN: {clean_event} in {city}, {state}"
        default_desc = f"Severe {clean_event} detected in {city}, {state} with high precipitation and rapid inundation risk. Evacuate low-lying zones immediately."
        default_instr = directive or "Follow NDRF and State Disaster Management Authority directives. Stay tuned to official sirens and cell broadcasts."

        # Root <alert>
        alert = ET.Element("alert", attrib={"xmlns": self.CAP_NAMESPACE})
        ET.SubElement(alert, "identifier").text = alert_uuid
        ET.SubElement(alert, "sender").text = "NDMA-IN@varshanet.gov.in"
        ET.SubElement(alert, "sent").text = sent_iso
        ET.SubElement(alert, "status").text = "Actual"
        ET.SubElement(alert, "msgType").text = "Alert"
        ET.SubElement(alert, "scope").text = "Public"
        ET.SubElement(alert, "code").text = "IPAWS-IN-CAP-v1.2"

        # 1. English Info Block (en-IN)
        info_en = ET.SubElement(alert, "info")
        ET.SubElement(info_en, "language").text = "en-IN"
        ET.SubElement(info_en, "category").text = "Met"
        ET.SubElement(info_en, "event").text = clean_event
        ET.SubElement(info_en, "urgency").text = "Immediate"
        ET.SubElement(info_en, "severity").text = cap_severity
        ET.SubElement(info_en, "certainty").text = "Observed"
        
        event_code_en = ET.SubElement(info_en, "eventCode")
        ET.SubElement(event_code_en, "valueName").text = "SAME"
        ET.SubElement(event_code_en, "value").text = "SVR" if "CYCLONE" in event_norm else "FFW"

        ET.SubElement(info_en, "headline").text = headline or default_headline
        ET.SubElement(info_en, "description").text = description or default_desc
        ET.SubElement(info_en, "instruction").text = default_instr
        ET.SubElement(info_en, "web").text = "https://varshanet-backend.onrender.com"

        area_en = ET.SubElement(info_en, "area")
        ET.SubElement(area_en, "areaDesc").text = f"{city}, {state} (Radius {radius_km} km)"
        ET.SubElement(area_en, "circle").text = f"{latitude:.4f},{longitude:.4f} {radius_km}"

        # 2. Hindi Info Block (hi-IN)
        info_hi = ET.SubElement(alert, "info")
        ET.SubElement(info_hi, "language").text = "hi-IN"
        ET.SubElement(info_hi, "category").text = "Met"
        ET.SubElement(info_hi, "event").text = self.HINDI_EVENT_TRANSLATIONS.get(event_norm, f"{clean_event} चेतावनी")
        ET.SubElement(info_hi, "urgency").text = "Immediate"
        ET.SubElement(info_hi, "severity").text = cap_severity
        ET.SubElement(info_hi, "certainty").text = "Observed"

        event_code_hi = ET.SubElement(info_hi, "eventCode")
        ET.SubElement(event_code_hi, "valueName").text = "SAME"
        ET.SubElement(event_code_hi, "value").text = "FFW"

        ET.SubElement(info_hi, "headline").text = f"राष्ट्रीय आपदा चेतावनी: {city}, {state} में {clean_event}"
        ET.SubElement(info_hi, "description").text = f"{city}, {state} में मौसम विभाग और वर्षानेट ग्रिड द्वारा भीषण {clean_event} दर्ज किया गया है।"
        ET.SubElement(info_hi, "instruction").text = self.HINDI_INSTRUCTIONS.get(event_norm, default_instr)
        ET.SubElement(info_hi, "web").text = "https://varshanet-backend.onrender.com"

        area_hi = ET.SubElement(info_hi, "area")
        ET.SubElement(area_hi, "areaDesc").text = f"{city}, {state} (दायरा {radius_km} किमी)"
        ET.SubElement(area_hi, "circle").text = f"{latitude:.4f},{longitude:.4f} {radius_km}"

        return ET.tostring(alert, encoding="utf-8", xml_declaration=True).decode("utf-8")

    def validate_cap_xml(self, xml_content: str) -> Dict[str, Any]:
        try:
            root = ET.fromstring(xml_content)
            
            # Check namespace
            ns = ""
            if root.tag.startswith("{"):
                ns = root.tag.split("}")[0].strip("{")
            
            identifier = root.find(f"{{{ns}}}identifier" if ns else "identifier")
            sender = root.find(f"{{{ns}}}sender" if ns else "sender")
            sent = root.find(f"{{{ns}}}sent" if ns else "sent")
            status = root.find(f"{{{ns}}}status" if ns else "status")
            infos = root.findall(f"{{{ns}}}info" if ns else "info")

            is_valid = (
                identifier is not None and bool(identifier.text) and
                sender is not None and bool(sender.text) and
                sent is not None and bool(sent.text) and
                status is not None and bool(status.text) and
                len(infos) > 0
            )

            languages = [i.find(f"{{{ns}}}language" if ns else "language").text for i in infos if i.find(f"{{{ns}}}language" if ns else "language") is not None]

            return {
                "is_valid": is_valid,
                "standard": "OASIS CAP v1.2 / ITU-T X.1303",
                "identifier": identifier.text if identifier is not None else None,
                "sender": sender.text if sender is not None else None,
                "status": status.text if status is not None else None,
                "info_blocks_count": len(infos),
                "languages_included": languages,
                "validation_message": "XML successfully conforms to OASIS CAP 1.2 specification." if is_valid else "Missing mandatory CAP 1.2 elements."
            }
        except Exception as e:
            return {
                "is_valid": False,
                "standard": "OASIS CAP v1.2",
                "validation_message": f"XML parse error: {str(e)}"
            }

cap_serializer = OasisCapSerializer()
