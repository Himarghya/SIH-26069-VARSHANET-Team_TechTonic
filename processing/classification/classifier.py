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
    "Drought",
    "Other"
]

# Keywords & Synonyms including Indian regional terms
EVENT_KEYWORDS = {
    "Heavy Rainfall": [
        "heavy rain", "heavy rainfall", "torrential rain", "incessant rain", "downpour", "deluge", 
        "mumbai rains", "delhi rains", "bhopal rains", "chennai rains", "barish", "bhaari barish", "masladhar barish"
    ],
    "Rainfall": [
        "rain", "rainfall", "shower", "drizzle", "wet spell", "monsoon shower", "precipitation", "barsat", "paani girna"
    ],
    "Flash Flood": [
        "flash flood", "sudden flood", "surging water", "nallah overflow", "river breached", "dam overflow"
    ],
    "Urban Flooding": [
        "waterlogging", "water logged", "submerged roads", "water accumulation", "street flooding", "underpass flooded", "drain overflow"
    ],
    "Flood": [
        "flood", "flooding", "inundated", "submerged", "deluged", "baadh", "jal-bharav", "paani bhar gaya", "relief camp"
    ],
    "Thunderstorm": [
        "thunderstorm", "thunder", "toofan", "aandhi toofan", "rumbling", "squall", "convective storm"
    ],
    "Lightning": [
        "lightning", "lightning strike", "thunderbolt", "bijli giri", "bijli kadakna", "electrocution risk"
    ],
    "Cloudburst": [
        "cloudburst", "cloud burst", "badal fata", "extreme localized downpour", "debris flow"
    ],
    "Hailstorm": [
        "hailstorm", "hail", "hailstones", "ice pellets", "ole pade", "pather barish"
    ],
    "Landslide": [
        "landslide", "mudslide", "rockfall", "hill collapse", "bhooskhalan", "road blocked ghat"
    ],
    "Cyclone": [
        "cyclone", "cyclonic storm", "super cyclone", "deep depression", "eye of cyclone", "coastal landfall", "chakravat"
    ],
    "Heatwave": [
        "heatwave", "heat wave", "loo", "scorching heat", "extreme temperature", "loo chalna", "sunstroke", "tapman"
    ],
    "Cold Wave": [
        "cold wave", "severe cold", "chilling winds", "freezing temperature", "sheet lahar", "thandi", "pala"
    ],
    "Fog": [
        "fog", "dense fog", "smog", "poor visibility", "zero visibility", "kohra", "dhund"
    ],
    "Dust Storm": [
        "dust storm", "sandstorm", "aandhi", "dhool bhari aandhi", "haboob", "blowing dust"
    ],
    "Strong Winds": [
        "strong winds", "gale", "high speed winds", "uprooted trees", "damaged hoardings", "tez hawa"
    ],
    "Drought": [
        "drought", "dry spell", "water crisis", "sukha", "crop failure", "groundwater depleted"
    ]
}

class WeatherClassifier:
    def __init__(self):
        # Build compiled regex dict for high performance
        self.compiled_rules = {}
        for category, keywords in EVENT_KEYWORDS.items():
            patterns = [rf"\b{re.escape(kw)}\b" for kw in keywords]
            self.compiled_rules[category] = re.compile("|".join(patterns), re.IGNORECASE)

    def rule_based_score(self, text: str) -> Dict[str, float]:
        scores = {}
        lower = text.lower()
        
        # Check specific prioritized categories first
        for category, regex in self.compiled_rules.items():
            matches = regex.findall(lower)
            if matches:
                # Count and weight matches
                scores[category] = min(0.98, 0.60 + len(matches) * 0.15)
                
        # If no specific matches, default to Other
        if not scores:
            scores["Other"] = 0.50
            
        return scores

    def ml_based_score(self, text: str) -> Dict[str, float]:
        """
        Lightweight fast inference simulating statistical classifier scores.
        """
        lower = text.lower()
        scores = {}
        
        # Check for characteristic n-grams
        if any(w in lower for w in ["water", "flood", "submerge", "river", "boat"]):
            if "waterlog" in lower or "road" in lower or "traffic" in lower:
                scores["Urban Flooding"] = 0.88
            elif "flash" in lower or "sudden" in lower:
                scores["Flash Flood"] = 0.90
            else:
                scores["Flood"] = 0.85
                
        if any(w in lower for w in ["rain", "barish", "shower", "pour", "mm"]):
            if any(w in lower for w in ["heavy", "bhaari", "torrential", "cm", "gauge"]):
                scores["Heavy Rainfall"] = 0.92
            else:
                scores["Rainfall"] = 0.82
                
        if any(w in lower for w in ["thunder", "bijli", "lightning", "strike", "bolt"]):
            if "lightning" in lower or "bijli giri" in lower:
                scores["Lightning"] = 0.91
            else:
                scores["Thunderstorm"] = 0.87
                
        if any(w in lower for w in ["heat", "loo", "temperature", "deg", "celsius", "45", "48"]):
            scores["Heatwave"] = 0.89
            
        if any(w in lower for w in ["fog", "visibility", "runway", "flights delayed", "kohra"]):
            scores["Fog"] = 0.88
            
        if any(w in lower for w in ["cyclone", "landfall", "depression", "imd alert", "evacuate"]):
            scores["Cyclone"] = 0.93
            
        if any(w in lower for w in ["landslide", "debris", "ghat", "rockfall"]):
            scores["Landslide"] = 0.91
            
        if not scores:
            scores["Other"] = 0.40
            
        return scores

    def classify(self, text: str, hashtags: List[str] = None) -> Tuple[str, float, Dict]:
        hashtags = hashtags or []
        combined_text = text + " " + " ".join(hashtags)
        
        rule_scores = self.rule_based_score(combined_text)
        ml_scores = self.ml_based_score(combined_text)
        
        all_categories = set(rule_scores.keys()).union(set(ml_scores.keys()))
        final_scores = {}
        
        for cat in all_categories:
            r_score = rule_scores.get(cat, 0.0)
            m_score = ml_scores.get(cat, 0.0)
            # Weighted hybrid formula: 0.4 * keyword + 0.6 * ML
            final_scores[cat] = round(0.4 * r_score + 0.6 * m_score, 3)
            
        # Get top category
        sorted_cats = sorted(final_scores.items(), key=lambda x: x[1], reverse=True)
        top_category, top_confidence = sorted_cats[0]
        
        if top_confidence < 0.35:
            top_category = "Other"
            top_confidence = 0.40
            
        details = {
            "top_category": top_category,
            "confidence": top_confidence,
            "rule_scores": rule_scores,
            "ml_scores": ml_scores,
            "all_scores": final_scores
        }
        
        return top_category, top_confidence, details

classifier = WeatherClassifier()
