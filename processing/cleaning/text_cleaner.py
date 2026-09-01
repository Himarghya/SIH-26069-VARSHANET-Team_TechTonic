import re
from typing import List, Tuple, Dict

INDIAN_LANGUAGE_SCRIPTS = {
    "hi": (0x0900, 0x097F), # Devanagari (Hindi, Marathi)
    "bn": (0x0980, 0x09FF), # Bengali
    "ta": (0x0B80, 0x0BFF), # Tamil
    "te": (0x0C00, 0x0C7F), # Telugu
    "kn": (0x0C80, 0x0CFF), # Kannada
    "ml": (0x0D00, 0x0D7F), # Malayalam
    "gu": (0x0A80, 0x0AFF), # Gujarati
    "pa": (0x0A00, 0x0A7F), # Punjabi (Gurmukhi)
    "or": (0x0B00, 0x0B7F), # Odia
}

class TextCleaner:
    def __init__(self):
        self.hashtag_pattern = re.compile(r"#[A-Za-z0-9_]+")
        self.url_pattern = re.compile(r"https?://\S+|www\.\S+")
        self.mention_pattern = re.compile(r"@[A-Za-z0-9_]+")
        self.spam_keywords = ["crypto", "forex", "casino", "giveaway", "free followers", "click here", "buy now", "discount code"]

    def detect_language(self, text: str) -> str:
        for char in text:
            code = ord(char)
            for lang, (start, end) in INDIAN_LANGUAGE_SCRIPTS.items():
                if start <= code <= end:
                    return lang
        return "en"

    def extract_hashtags(self, text: str) -> List[str]:
        found = self.hashtag_pattern.findall(text)
        return list(set(found))

    def generate_ai_hashtags(self, text: str, event_type: str = "Rainfall", city: str = "India", state: str = "") -> List[str]:
        """
        AI Contextual Hashtag Generator: Automatically predicts and extracts high-relevance
        hashtags (#IMD, #Monsoon2026, #MumbaiRains, #Cloudburst, #FloodAlert) based on text and location.
        """
        tags = ["#IMD", "#Monsoon2026"]
        lower_text = (text or "").lower()
        event_lower = (event_type or "").lower()
        
        # 1. Location-specific hashtag
        if city and city.lower() not in ["india", "region", "district", "none"]:
            clean_city = re.sub(r'[^A-Za-z0-9]', '', city.title())
            if any(w in lower_text or w in event_lower for w in ["rain", "flood", "cloudburst", "waterlog", "downpour"]):
                tags.append(f"#{clean_city}Rains")
            elif "heat" in lower_text or "heat" in event_lower:
                tags.append(f"#{clean_city}Heatwave")
            else:
                tags.append(f"#{clean_city}Weather")

        # 2. Hazard-specific hashtags
        if any(w in lower_text or w in event_lower for w in ["rain", "shower", "downpour", "precipitation"]):
            tags.append("#HeavyRainfall")
        if any(w in lower_text or w in event_lower for w in ["flood", "waterlog", "submerge", "inundat"]):
            tags.append("#FloodAlert")
            tags.append("#UrbanFlooding")
        if any(w in lower_text or w in event_lower for w in ["cloudburst", "flash flood", "deluge"]):
            tags.append("#Cloudburst")
            tags.append("#FlashFlood")
        if any(w in lower_text or w in event_lower for w in ["heat", "temperature", "loo", "hot"]):
            tags.append("#HeatwaveWarning")
        if any(w in lower_text or w in event_lower for w in ["cyclone", "storm", "squall", "depression"]):
            tags.append("#CycloneAlert")
        if any(w in lower_text or w in event_lower for w in ["thunder", "lightning", "strike"]):
            tags.append("#Thunderstorm")
        if any(w in lower_text or w in event_lower for w in ["fog", "visibility", "smog"]):
            tags.append("#DenseFog")
        if any(w in lower_text or w in event_lower for w in ["dust", "sandstorm", "andhi"]):
            tags.append("#DustStorm")
        if any(w in lower_text or w in event_lower for w in ["wind", "gust", "gale"]):
            tags.append("#StrongWinds")

        # 3. Include any existing hashtag found in text
        raw_tags = self.extract_hashtags(text)
        tags.extend(raw_tags)

        # Deduplicate while preserving case
        seen = set()
        unique_tags = []
        for t in tags:
            clean_t = t if t.startswith("#") else f"#{t}"
            if clean_t.lower() not in seen:
                seen.add(clean_t.lower())
                unique_tags.append(clean_t)

        return unique_tags

    def clean_text(self, text: str) -> Tuple[str, List[str], str, bool]:
        if not text:
            return "", [], "en", False
            
        lower_text = text.lower()
        is_spam = any(spam in lower_text for spam in self.spam_keywords)
        hashtags = self.extract_hashtags(text)
        language = self.detect_language(text)
        
        cleaned = self.url_pattern.sub("", text)
        cleaned = self.mention_pattern.sub("", cleaned)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        
        return cleaned, hashtags, language, is_spam

cleaner = TextCleaner()