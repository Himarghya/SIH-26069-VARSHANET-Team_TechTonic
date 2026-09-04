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

WEATHER_HASHTAGS = [
    "#IMD", "#Weather", "#Rainfall", "#HeavyRain", "#Flood", "#Thunderstorm",
    "#Lightning", "#Heatwave", "#ColdWave", "#Fog", "#DustStorm", "#StrongWinds",
    "#Cyclone", "#Landslide", "#Cloudburst", "#Hailstorm", "#Monsoon", "#WeatherUpdate",
    "#UrbanFlood", "#Waterlogging", "#DelhiRains", "#MumbaiRains", "#BhopalRains", "#ChennaiRains"
]

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

    def clean_text(self, text: str) -> Tuple[str, List[str], str, bool]:
        """
        Returns: (normalized_text, hashtags, language, is_spam)
        """
        if not text:
            return "", [], "en", False
            
        # Spam check
        lower_text = text.lower()
        is_spam = any(spam in lower_text for spam in self.spam_keywords)
        
        # Extract hashtags
        hashtags = self.extract_hashtags(text)
        
        # Detect language
        language = self.detect_language(text)
        
        # Remove URLs and mentions for analysis normalization
        cleaned = self.url_pattern.sub("", text)
        cleaned = self.mention_pattern.sub("", cleaned)
        
        # Normalize whitespace
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        
        return cleaned, hashtags, language, is_spam

cleaner = TextCleaner()
