import re
from typing import Dict, Tuple, List

EVENT_CATEGORIES = [
    "Rainfall",
    "Heavy Rainfall",
    "Thunderstorm",
    "Lightning",
    "Flood",
    "Urban Flooding",
    "Flash Flood",
    "Cyclone",
    "Heatwave",
    "Cold Wave",
    "Fog",
    "Dust Storm",
    "Strong Winds",
    "Hailstorm",
    "Cloudburst",
    "Landslide",
    "Drought"
]

# Strict Non-Weather / Political / Foreign Blacklist
STRICT_BLACKLIST = [
    # 1. Foreign / Non-India Locations
    r"\bnepal\b", r"\bkathmandu\b", r"\bpokhara\b", r"\bbangladesh\b", r"\bdhaka\b",
    r"\bpakistan\b", r"\blahore\b", r"\bkarachi\b", r"\bislamabad\b", r"\bchina\b",
    r"\btaiwan\b", r"\bjapan\b", r"\btokyo\b", r"\bsri lanka\b", r"\bcolombo\b",
    r"\bmyanmar\b", r"\bbirma\b", r"\bafghanistan\b", r"\busa\b", r"\bunited states\b",
    r"\bflorida\b", r"\btexas\b", r"\beurope\b", r"\buk\b", r"\blondon\b",
    
    # 2. Political Figures, Ministers & Celebrity Commentary
    r"\bmodi\b", r"\bpm modi\b", r"\bprime minister\b", r"\brahul gandhi\b", r"\bamit shah\b",
    r"\bchief minister\b", r"\bcm \b", r"\bminister\b", r"\bpolitician\b", r"\bpolitical\b",
    r"\bpolitics\b", r"\bparty\b", r"\belection\b", r"\bvoting\b", r"\bvoters\b",
    r"\bbjp\b", r"\bcongress\b", r"\btmc\b", r"\baap\b", r"\btrinamool\b", r"\bshiv sena\b",
    r"\bmla\b", r"\bmp\b", r"\bparliament\b", r"\bassembly\b", r"\bsonu sood\b",
    r"\bcelebrity\b", r"\bactor\b", r"\bactress\b", r"\bjournalist\b", r"\bjibe\b",
    r"\bmarketing\b", r"\bcremat\b", r"\bbury\b", r"\bburying\b", r"\btakes stock\b",
    r"\brally\b", r"\bspeech\b", r"\bprotest\b", r"\bgrilling\b", r"\bscuffle\b",
    r"\bpolice\b", r"\bcbi\b", r"\bed\b", r"\barrest\b", r"\bbail\b", r"\bcourt\b",
    r"\bmurder\b", r"\bcrime\b", r"\bswindle\b", r"\bnrc\b", r"\bcensus\b",
    
    # 3. Business, Finance, Stocks, Real Estate, Education
    r"\bshares\b", r"\bstock\b", r"\bstocks\b", r"\bmarket cap\b", r"\bipo\b", r"\bderivative\b",
    r"\bsensex\b", r"\bnifty\b", r"\bclosing price\b", r"\brevenue\b", r"\bprofit\b",
    r"\bcrore incentive\b", r"\bmineral mission\b", r"\bplastics\b", r"\buber\b",
    r"\blayoffs\b", r"\blaid off\b", r"\brestructuring\b", r"\brera\b", r"\brealtor\b",
    r"\bmba\b", r"\bexam\b", r"\bexams\b", r"\bentrance\b", r"\bb-school\b", r"\badmissions\b",
    r"\bcricket\b", r"\bipl\b", r"\bmatch\b", r"\bmovie\b", r"\bbox office\b"
]

COMPILED_BLACKLIST = [re.compile(p, re.IGNORECASE) for p in STRICT_BLACKLIST]

# Positive Genuine Meteorological Keywords (Weather places & conditions)
EVENT_KEYWORDS = {
    "Cloudburst": [
        "cloudburst", "cloud burst", "badal fata", "debris flow", "extreme localized downpour", "torrential cloudburst"
    ],
    "Urban Flooding": [
        "waterlogging", "water logged", "water-logged", "submerged roads", "water accumulation",
        "street flooding", "underpass flooded", "drain overflow", "submerged vehicles", "waterlogged streets", "jal-bharav"
    ],
    "Flash Flood": [
        "flash flood", "sudden flood", "surging water", "nallah overflow", "river breached",
        "dam overflow", "barrage discharge", "flood fury", "inundated villages", "inundated low-lying"
    ],
    "Flood": [
        "flood alert", "flood situation", "river water rises", "danger mark", "river swollen",
        "inundated", "submerged", "deluged", "baadh", "paani bhar gaya", "cwc alert", "river overflow"
    ],
    "Heavy Rainfall": [
        "heavy rain", "heavy rainfall", "torrential rain", "incessant rain", "downpour", "deluge", 
        "mumbai rains", "delhi rains", "bhopal rains", "chennai rains", "guwahati rains", "bhaari barish",
        "masladhar barish", "red alert for rain", "orange alert for rain", "excess rainfall"
    ],
    "Rainfall": [
        "rain", "rainfall", "shower", "showers", "drizzle", "wet spell", "monsoon shower", "precipitation",
        "barsat", "paani girna", "light rain", "moderate rain", "monsoon rains", "intermittent rain", "cloudy skies with rain"
    ],
    "Thunderstorm": [
        "thunderstorm", "thunder", "toofan", "aandhi toofan", "rumbling", "squall", "convective storm",
        "lightning and thunder", "gusty winds and rain"
    ],
    "Lightning": [
        "lightning", "lightning strike", "thunderbolt", "bijli giri", "bijli kadakna", "electrocution risk",
        "killed by lightning", "struck by lightning"
    ],
    "Cyclone": [
        "cyclone", "cyclonic storm", "super cyclone", "deep depression", "eye of cyclone", "coastal landfall",
        "chakravat", "cyclone alert", "cyclone warning"
    ],
    "Heatwave": [
        "heatwave", "heat wave", "loo", "scorching heat", "extreme temperature", "loo chalna", "sunstroke",
        "maximum temperature", "severe heatwave", "tapman", "heat index"
    ],
    "Cold Wave": [
        "cold wave", "severe cold", "chilling winds", "freezing temperature", "sheet lahar", "thandi", "pala", "dense frost"
    ],
    "Fog": [
        "dense fog", "smog", "poor visibility", "zero visibility", "kohra", "dhund", "fog delays flights", "shallow fog"
    ],
    "Dust Storm": [
        "dust storm", "sandstorm", "aandhi", "dhool bhari aandhi", "haboob", "blowing dust"
    ],
    "Strong Winds": [
        "strong winds", "gale", "high speed winds", "uprooted trees", "damaged hoardings", "tez hawa", "wind gusts"
    ],
    "Hailstorm": [
        "hailstorm", "hail", "hailstones", "ice pellets", "ole pade", "pather barish"
    ],
    "Landslide": [
        "landslide", "mudslide", "rockfall", "hill collapse", "bhooskhalan", "road blocked ghat", "debris block highway"
    ],
    "Drought": [
        "drought", "dry spell", "water crisis", "sukha", "groundwater depleted", "drought hit"
    ]
}

class WeatherClassifier:
    def __init__(self):
        self.compiled_rules = {}
        for category, keywords in EVENT_KEYWORDS.items():
            patterns = [rf"\b{re.escape(kw)}\b" for kw in keywords]
            self.compiled_rules[category] = re.compile("|".join(patterns), re.IGNORECASE)

    def is_strictly_weather(self, text: str) -> Tuple[bool, str, float]:
        """
        Determines if the text is genuinely meteorological, within India,
        and FREE from foreign/Nepal news or political/celebrity figure names.
        """
        lower = text.lower()
        
        # 1. Check strict blacklist (Nepal, foreign, PM Modi, politicians, celebrities)
        for b_regex in COMPILED_BLACKLIST:
            if b_regex.search(lower):
                return False, "Non-Weather / Foreign / Political", 0.0
                
        # 2. Count positive meteorological matches
        category_matches: Dict[str, int] = {}
        for category, regex in self.compiled_rules.items():
            matches = regex.findall(lower)
            if matches:
                category_matches[category] = len(matches)
                
        total_weather_matches = sum(category_matches.values())
        if total_weather_matches == 0:
            return False, "Non-Weather News", 0.0
            
        # Get top matching category
        sorted_cats = sorted(category_matches.items(), key=lambda x: x[1], reverse=True)
        top_cat, top_count = sorted_cats[0]
        confidence = min(0.98, 0.65 + top_count * 0.12)
        
        return True, top_cat, confidence

    def classify(self, text: str, hashtags: List[str] = None) -> Tuple[str, float, Dict]:
        hashtags = hashtags or []
        combined_text = text + " " + " ".join(hashtags)
        
        is_weather, top_cat, conf = self.is_strictly_weather(combined_text)
        
        if not is_weather:
            return "Non-Weather News", 0.0, {
                "is_weather": False,
                "top_category": "Non-Weather News",
                "confidence": 0.0,
                "reason": "Text rejected: contains foreign location, political figure, or non-meteorological content."
            }
            
        return top_cat, conf, {
            "is_weather": True,
            "top_category": top_cat,
            "confidence": conf
        }

classifier = WeatherClassifier()