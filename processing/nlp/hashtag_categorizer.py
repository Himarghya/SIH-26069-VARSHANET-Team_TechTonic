import re
from typing import List, Optional, Dict, Any

TARGET_HASHTAGS = [
    "#IMD",
    "#Monsoon2026",
    "#MumbaiRains",
    "#DelhiWeather",
    "#Cloudburst",
    "#FloodAlert",
    "#HeatwaveWarning",
    "#CycloneAlert"
]

def compile_pattern(terms: List[str]) -> re.Pattern:
    # Use word boundary for all terms to avoid partial word matching (e.g. 'loo' in 'flooding')
    escaped = [rf"\b{re.escape(t)}\b" for t in terms]
    return re.compile("|".join(escaped), re.IGNORECASE)

class HashtagCategorizer:
    """
    Automated AI/NLP weather hashtag categorizer for VARSHANET.
    Accurately categorizes all incoming API feeds (news, AWS synoptic stations, citizen reports)
    into the designated AI trending categories:
    - #Monsoon2026
    - #MumbaiRains
    - #DelhiWeather
    - #Cloudburst
    - #FloodAlert
    - #HeatwaveWarning
    - #CycloneAlert
    Fallback: If a report does not match any of the above specific categories, it falls on #IMD.
    """

    def __init__(self):
        self.mumbai_regex = compile_pattern([
            "mumbai", "bombay", "santacruz", "colaba", "dadar", "kurla", "andheri",
            "borivali", "bandra", "powai", "thane", "kalyan", "chembur", "navi mumbai",
            "mumbai rains", "mumbai rain", "bmc", "suburban trains", "western railway"
        ])
        
        self.delhi_regex = compile_pattern([
            "delhi", "new delhi", "ncr", "safdarjung", "palam", "lodhi road",
            "noida", "gurgaon", "gurugram", "ghaziabad", "faridabad", "delhi weather",
            "delhi rains", "delhi rain", "yamuna", "delhi aqi", "delhi fog"
        ])

        self.monsoon_regex = compile_pattern([
            "monsoon", "southwest monsoon", "northeast monsoon", "monsoon2026", "monsoon 2026",
            "monsoon surge", "monsoon trough", "monsoon showers", "seasonal rain",
            "seasonal rains", "monsoon onset", "monsoon withdrawal", "active monsoon"
        ])

        self.cloudburst_regex = compile_pattern([
            "cloudburst", "cloud burst", "badal fata", "extreme localized downpour",
            "mountain deluge", "flash downpour", "torrential cloudburst"
        ])

        self.flood_regex = compile_pattern([
            "flood", "floods", "flooding", "flash flood", "flash floods", "waterlogging",
            "waterlogged", "water logging", "submerged", "inundated", "inundation",
            "river overflow", "dam overflow", "dam discharge", "nallah overflow",
            "drain overflow", "underpass flooded", "roads flooded", "relief camp",
            "water accumulation", "deluge", "baadh", "jalbharao"
        ])

        self.heatwave_regex = compile_pattern([
            "heatwave", "heat wave", "loo", "scorching heat", "extreme heat",
            "high temperature", "sunstroke", "heat alert", "severe heat", "tapman"
        ])

        self.cyclone_regex = compile_pattern([
            "cyclone", "cyclonic storm", "super cyclone", "deep depression", "depression",
            "landfall", "eye of cyclone", "storm surge", "gale", "chakravat", "cyclonic"
        ])

        self.imd_regex = compile_pattern([
            "imd", "india meteorological department", "mausam bhavan", "met department",
            "weather bureau", "synoptic", "aws"
        ])

    def categorize(
        self,
        text: str = "",
        event_type: str = "",
        city: str = "",
        state: str = "",
        source_name: str = "",
        source_type: str = "",
        raw_payload: Optional[Dict[str, Any]] = None
    ) -> List[str]:
        text_lower = (text or "").lower()
        event_lower = (event_type or "").lower()
        city_lower = (city or "").lower()
        state_lower = (state or "").lower()
        source_lower = (source_name or "").lower()
        source_type_lower = (source_type or "").lower()
        raw_payload = raw_payload or {}

        matched: List[str] = []

        temp = raw_payload.get("temperature_2m", 0.0) if isinstance(raw_payload, dict) else 0.0
        rain = raw_payload.get("rain", 0.0) if isinstance(raw_payload, dict) else 0.0

        # Combined string for contextual analysis
        full_context = f"{text_lower} {city_lower} {state_lower} {event_lower}"

        # 1. #MumbaiRains
        is_mumbai_loc = any(m in city_lower for m in ["mumbai", "thane", "navi mumbai"])
        is_mumbai_text = bool(self.mumbai_regex.search(text_lower))
        is_rain_event = any(r in event_lower for r in ["rain", "flood", "cloudburst", "waterlog"]) or \
                        any(r in text_lower for r in ["rain", "barish", "shower", "downpour", "waterlog", "flood", "monsoon"]) or \
                        rain > 0.1
        if (is_mumbai_loc or is_mumbai_text) and (is_rain_event or is_mumbai_text):
            matched.append("#MumbaiRains")

        # 2. #DelhiWeather
        is_delhi_loc = any(d in city_lower for d in ["delhi", "new delhi", "noida", "gurgaon", "gurugram", "ghaziabad", "faridabad"]) or "delhi" in state_lower
        is_delhi_text = bool(self.delhi_regex.search(text_lower))
        if is_delhi_loc or is_delhi_text:
            matched.append("#DelhiWeather")

        # 3. #Cloudburst
        is_cloudburst = "cloudburst" in event_lower or bool(self.cloudburst_regex.search(text_lower))
        if is_cloudburst:
            matched.append("#Cloudburst")

        # 4. #FloodAlert
        is_flood = any(fl in event_lower for fl in ["flood", "urban flooding", "flash flood"]) or \
                   bool(self.flood_regex.search(text_lower))
        if is_flood:
            matched.append("#FloodAlert")

        # 5. #HeatwaveWarning
        is_heatwave = "heatwave" in event_lower or \
                      bool(self.heatwave_regex.search(text_lower)) or \
                      (temp >= 40.0)
        if is_heatwave:
            matched.append("#HeatwaveWarning")

        # 6. #CycloneAlert
        is_cyclone = "cyclone" in event_lower or bool(self.cyclone_regex.search(text_lower))
        if is_cyclone:
            matched.append("#CycloneAlert")

        # 7. #Monsoon2026
        is_monsoon = bool(self.monsoon_regex.search(text_lower)) or \
                     "monsoon" in event_lower or \
                     ("2026" in text_lower and any(r in text_lower for r in ["rain", "monsoon", "rainfall"]))
        if is_monsoon:
            matched.append("#Monsoon2026")

        # 8. #IMD Check and Fallback
        is_explicit_imd = bool(self.imd_regex.search(text_lower)) or \
                          "imd" in source_lower or \
                          source_type_lower == "weather_api"

        # Mandatory Fallback: If not under any specific category, it falls on #IMD
        if not matched:
            matched.append("#IMD")
        elif is_explicit_imd and "#IMD" not in matched:
            matched.append("#IMD")

        unique_tags = []
        for tag in matched:
            if tag not in unique_tags:
                unique_tags.append(tag)

        return unique_tags

hashtag_categorizer = HashtagCategorizer()
