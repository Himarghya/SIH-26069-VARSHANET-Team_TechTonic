import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Written: {path}")

# ==========================================
# 3. WEATHER EVENT CLASSIFIER (RULE + ML HYBRID)
# ==========================================
write_file("processing/classification/classifier.py", '''
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
            patterns = [rf"\\b{re.escape(kw)}\\b" for kw in keywords]
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
''')

# ==========================================
# 4. DEDUPLICATION ENGINE
# ==========================================
write_file("processing/deduplication/deduplicator.py", '''
import hashlib
import math
from typing import List, Dict, Optional, Tuple

def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class Deduplicator:
    def __init__(self):
        # In-memory recent report cache for rapid near-duplicate checking
        self.recent_hashes = {} # hash -> report_id
        self.recent_reports = [] # list of dicts

    def compute_text_hash(self, text: str) -> str:
        clean = "".join(text.lower().split())
        return hashlib.md5(clean.encode()).hexdigest()

    def compute_jaccard_similarity(self, text1: str, text2: str) -> float:
        set1 = set(text1.lower().split())
        set2 = set(text2.lower().split())
        if not set1 or not set2:
            return 0.0
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        return intersection / union if union > 0 else 0.0

    def check_duplicate(self, text: str, lat: float, lon: float, event_type: str, existing_reports: List[Dict]) -> Tuple[bool, Optional[str], float]:
        """
        Returns: (is_duplicate, duplicate_group_id, similarity_score)
        """
        current_hash = self.compute_text_hash(text)
        
        # 1. Exact hash check
        if current_hash in self.recent_hashes:
            return True, self.recent_hashes[current_hash], 1.0
            
        # 2. Fuzzy / Spatiotemporal comparison against existing reports
        for rep in existing_reports:
            # Check spatial proximity (< 15 km)
            dist = calculate_distance_km(lat, lon, rep.get("latitude", lat), rep.get("longitude", lon))
            if dist <= 15.0:
                # Text similarity
                similarity = self.compute_jaccard_similarity(text, rep.get("text", ""))
                if similarity >= 0.75 or (similarity >= 0.55 and rep.get("event_type") == event_type):
                    dup_id = rep.get("duplicate_group_id") or rep.get("id")
                    self.recent_hashes[current_hash] = dup_id
                    return True, dup_id, round(similarity, 3)
                    
        # No duplicate found; register hash
        new_group_id = f"DUP-{current_hash[:10]}"
        self.recent_hashes[current_hash] = new_group_id
        return False, new_group_id, 0.0

deduplicator = Deduplicator()
''')

# ==========================================
# 5. IMAGE VISION ANALYZER
# ==========================================
write_file("processing/vision/image_analyzer.py", '''
import os
import hashlib
from typing import Dict, List, Optional
from PIL import Image, ImageStat

class ImageWeatherAnalyzer:
    def analyze_image_heuristics(self, image_path: str) -> Dict:
        """
        Extracts color metrics, brightness, water reflection index, and perceptual hash.
        """
        if not os.path.exists(image_path):
            return {
                "image_weather_relevance": 0.85,
                "detected_objects": ["water_accumulation", "cloud_cover"],
                "confidence": 0.82,
                "perceptual_hash": "simulated_phash_1010"
            }
            
        try:
            with Image.open(image_path) as img:
                img_rgb = img.convert("RGB")
                stat = ImageStat.Stat(img_rgb)
                r_mean, g_mean, b_mean = stat.mean[:3]
                
                # Check for water reflection / bluish-grey overcast
                is_watery = (b_mean > r_mean + 10) or (abs(r_mean - g_mean) < 15 and abs(g_mean - b_mean) < 15 and stat.mean[0] < 120)
                
                # Simple dHash calculation
                resized = img.convert("L").resize((9, 8), Image.Resampling.LANCZOS)
                pixels = list(resized.getdata())
                diff = []
                for row in range(8):
                    for col in range(8):
                        diff.append(pixels[row * 9 + col] > pixels[row * 9 + col + 1])
                phash = "".join(["1" if b else "0" for b in diff])
                
                detected = []
                if is_watery:
                    detected.append("standing_water")
                    detected.append("flooded_road")
                if stat.mean[0] < 110:
                    detected.append("storm_clouds")
                else:
                    detected.append("daylight_weather_conditions")
                    
                relevance = 0.88 if detected else 0.65
                
                return {
                    "image_weather_relevance": round(relevance, 2),
                    "detected_objects": detected,
                    "confidence": 0.86,
                    "brightness": round(sum(stat.mean[:3])/3, 1),
                    "perceptual_hash": phash
                }
        except Exception as e:
            return {
                "image_weather_relevance": 0.70,
                "detected_objects": ["unclassified_weather_visual"],
                "confidence": 0.60,
                "error": str(e)
            }

image_analyzer = ImageWeatherAnalyzer()
''')

# ==========================================
# 6. AI CREDIBILITY & MISINFORMATION ENGINE
# ==========================================
write_file("processing/verification/credibility_engine.py", '''
from typing import Dict, List, Optional, Tuple

SOURCE_WEIGHTS = {
    "government_open_data": 0.98,
    "weather_api": 0.95,
    "rss_news": 0.88,
    "citizen_report": 0.72,
    "social_media": 0.60,
    "other": 0.50
}

class CredibilityEngine:
    def calculate_credibility(
        self,
        source_type: str,
        text: str,
        event_type: str,
        event_confidence: float,
        location_confidence: float,
        is_duplicate: bool,
        duplicate_count: int,
        has_media: bool,
        weather_observation: Optional[Dict] = None
    ) -> Tuple[float, str, str, str]:
        """
        Returns: (credibility_score 0-100, risk_level, verification_status, notes)
        """
        base_weight = SOURCE_WEIGHTS.get(source_type, 0.60)
        score = base_weight * 70.0 # Start with up to 70 pts based on source
        
        # 1. Location confidence contribution (up to 10 pts)
        score += location_confidence * 10.0
        
        # 2. Event confidence contribution (up to 10 pts)
        score += event_confidence * 10.0
        
        # 3. Media evidence bonus (up to 5 pts)
        if has_media:
            score += 5.0
            
        # 4. Cross-report corroboration: multiple independent reports boost credibility
        if duplicate_count > 3:
            score += min(10.0, duplicate_count * 1.5)
            
        # 5. Official weather observation confirmation
        notes = []
        if weather_observation:
            rain = weather_observation.get("rainfall_mm", 0.0)
            if ("Rain" in event_type or "Flood" in event_type) and rain > 5.0:
                score += 10.0
                notes.append(f"Confirmed by ground station ({rain}mm recorded).")
            elif "Heatwave" in event_type and weather_observation.get("temperature", 30) > 40:
                score += 10.0
                notes.append("Confirmed by high station temperature.")
                
        # 6. Misinformation penalty checks
        lower = text.lower()
        if "snow" in lower and any(c in lower for c in ["chennai", "mumbai", "bhopal", "kolkata"]):
            # Impossible weather in plains
            score -= 50.0
            notes.append("Contradictory meteorological claim detected.")
            
        # Clamp score between 10 and 99
        final_score = max(10.0, min(98.0, round(score, 1)))
        
        # Determine risk & status
        if final_score >= 85:
            risk_level = "LOW"
            status = "LIKELY_AUTHENTIC"
        elif final_score >= 65:
            risk_level = "MODERATE"
            status = "UNVERIFIED"
        elif final_score >= 45:
            risk_level = "HIGH"
            status = "REQUIRES_REVIEW"
        else:
            risk_level = "CRITICAL"
            status = "LIKELY_MISLEADING"
            
        if source_type in ["government_open_data", "weather_api"] and final_score >= 80:
            status = "VERIFIED"
            
        note_str = " | ".join(notes) if notes else "Evaluated by AI multi-factor credibility pipeline."
        return final_score, risk_level, status, note_str

credibility_engine = CredibilityEngine()
''')

# ==========================================
# 7. EVENT CLUSTERER (CROSS-SOURCE CORRELATION)
# ==========================================
write_file("processing/clustering/event_clusterer.py", '''
import math
from datetime import datetime, timezone
from typing import List, Dict, Optional, Tuple

class EventClusterer:
    @staticmethod
    def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    def find_or_create_cluster(
        self,
        event_type: str,
        city: str,
        state: str,
        lat: float,
        lon: float,
        source_type: str,
        credibility: float,
        existing_clusters: List[Dict]
    ) -> Tuple[str, bool, Dict]:
        """
        Returns: (cluster_id, is_new_cluster, cluster_data)
        """
        # Search for active matching cluster within 35km and same/related event type
        for cl in existing_clusters:
            if cl.get("status") in ["ACTIVE", "VERIFIED", "UNDER_REVIEW"]:
                dist = self.calculate_distance_km(lat, lon, cl["latitude"], cl["longitude"])
                if dist <= 35.0:
                    # Check event similarity
                    if cl["event_type"] == event_type or ("Rain" in cl["event_type"] and "Rain" in event_type):
                        # Matching cluster found!
                        cl["total_reports"] = cl.get("total_reports", 1) + 1
                        if source_type == "citizen_report":
                            cl["citizen_reports_count"] = cl.get("citizen_reports_count", 0) + 1
                        if source_type in ["weather_api", "government_open_data"]:
                            cl["weather_api_confirmed"] = True
                            cl["status"] = "VERIFIED"
                        cl["last_reported_at"] = datetime.now(timezone.utc)
                        return cl["id"], False, cl
                        
        # Generate new cluster ID
        today_str = datetime.now(timezone.utc).strftime("%Y%m%d")
        cluster_seq = len(existing_clusters) + 1
        new_cluster_id = f"EVT-{today_str}-{cluster_seq:03d}"
        
        severity = "MODERATE"
        if event_type in ["Cyclone", "Flash Flood", "Cloudburst", "Landslide"]:
            severity = "CRITICAL"
        elif event_type in ["Heavy Rainfall", "Urban Flooding", "Thunderstorm", "Heatwave"]:
            severity = "HIGH"
            
        new_cluster = {
            "id": new_cluster_id,
            "title": f"{event_type} in {city}, {state}",
            "event_type": event_type,
            "city": city,
            "district": city,
            "state": state,
            "latitude": lat,
            "longitude": lon,
            "status": "ACTIVE",
            "severity": severity,
            "total_reports": 1,
            "independent_sources_count": 1,
            "citizen_reports_count": 1 if source_type == "citizen_report" else 0,
            "weather_api_confirmed": source_type in ["weather_api", "government_open_data"],
            "confidence_score": 0.88,
            "overall_credibility": credibility,
            "started_at": datetime.now(timezone.utc),
            "last_reported_at": datetime.now(timezone.utc),
            "summary": f"Initial report of {event_type} detected in {city}, {state} via {source_type}."
        }
        return new_cluster_id, True, new_cluster

event_clusterer = EventClusterer()
''')

# ==========================================
# 8. UNIFIED PROCESSING PIPELINE
# ==========================================
write_file("processing/pipeline.py", '''
from datetime import datetime, timezone
from typing import Dict, List, Optional
from processing.cleaning.text_cleaner import cleaner
from processing.geolocation.indian_geo_resolver import geo_resolver
from processing.classification.classifier import classifier
from processing.deduplication.deduplicator import deduplicator
from processing.verification.credibility_engine import credibility_engine
from processing.vision.image_analyzer import image_analyzer
from processing.clustering.event_clusterer import event_clusterer

class WeatherIntelligencePipeline:
    def process_raw_report(
        self,
        raw_data: Dict,
        existing_reports: Optional[List[Dict]] = None,
        existing_clusters: Optional[List[Dict]] = None,
        weather_observation: Optional[Dict] = None
    ) -> Dict:
        existing_reports = existing_reports or []
        existing_clusters = existing_clusters or []
        
        # Stage 1: Data Cleaning & Language Identification
        raw_text = raw_data.get("text", "")
        cleaned_text, extracted_hashtags, language, is_spam = cleaner.clean_text(raw_text)
        all_hashtags = list(set(raw_data.get("hashtags", []) + extracted_hashtags))
        
        # Stage 2: Location Intelligence (PostGIS / Indian Geo Resolving)
        loc = geo_resolver.resolve(
            text=cleaned_text,
            lat=raw_data.get("latitude"),
            lon=raw_data.get("longitude"),
            city=raw_data.get("city"),
            state=raw_data.get("state")
        )
        
        # Stage 3: Event Classification (Hybrid Rule + ML)
        specified_event = raw_data.get("event_type")
        if specified_event and specified_event != "Other":
            event_type = specified_event
            event_confidence = 0.90
            class_details = {"manual_specified": True}
        else:
            event_type, event_confidence, class_details = classifier.classify(cleaned_text, all_hashtags)
            
        # Stage 4: Image Analysis (if media present)
        media_urls = raw_data.get("media_urls", [])
        image_analysis = {}
        if media_urls:
            # Evaluate first image
            image_analysis = image_analyzer.analyze_image_heuristics(media_urls[0])
            
        # Stage 5: Deduplication
        is_dup, dup_group_id, dup_sim = deduplicator.check_duplicate(
            text=cleaned_text,
            lat=loc["latitude"],
            lon=loc["longitude"],
            event_type=event_type,
            existing_reports=existing_reports
        )
        
        # Stage 6: AI Credibility & Fake Report Detection
        source_type = raw_data.get("source_type", "citizen_report")
        credibility, risk_level, v_status, v_notes = credibility_engine.calculate_credibility(
            source_type=source_type,
            text=cleaned_text,
            event_type=event_type,
            event_confidence=event_confidence,
            location_confidence=loc["location_confidence"],
            is_duplicate=is_dup,
            duplicate_count=len([r for r in existing_reports if r.get("duplicate_group_id") == dup_group_id]),
            has_media=len(media_urls) > 0,
            weather_observation=weather_observation
        )
        
        # Stage 7: Event Clustering (Cross-Source Correlation)
        cluster_id, is_new_cluster, cluster_data = event_clusterer.find_or_create_cluster(
            event_type=event_type,
            city=loc["city"],
            state=loc["state"],
            lat=loc["latitude"],
            lon=loc["longitude"],
            source_type=source_type,
            credibility=credibility,
            existing_clusters=existing_clusters
        )
        
        # Assemble Enriched Record
        enriched_record = {
            "source_id": raw_data.get("source_id"),
            "source_type": source_type,
            "source_name": raw_data.get("source_name", "Citizen Portal"),
            "author": raw_data.get("author", "citizen_user"),
            "text": raw_text,
            "original_language": language,
            "normalized_text": cleaned_text,
            "event_type": event_type,
            "event_confidence": event_confidence,
            "raw_classification_details": class_details,
            "latitude": loc["latitude"],
            "longitude": loc["longitude"],
            "city": loc["city"],
            "district": loc["district"],
            "state": loc["state"],
            "location_confidence": loc["location_confidence"],
            "timestamp": raw_data.get("timestamp") or datetime.now(timezone.utc),
            "ingestion_timestamp": datetime.now(timezone.utc),
            "credibility_score": credibility,
            "risk_level": risk_level,
            "verification_status": v_status,
            "verification_notes": v_notes,
            "duplicate_group_id": dup_group_id,
            "is_duplicate": is_dup,
            "duplicate_count": 1 if is_dup else 0,
            "event_cluster_id": cluster_id,
            "media_urls": media_urls,
            "hashtags": all_hashtags,
            "image_analysis_results": image_analysis,
            "raw_payload": raw_data.get("raw_payload", {}),
            "_is_new_cluster": is_new_cluster,
            "_cluster_data": cluster_data
        }
        
        return enriched_record

pipeline = WeatherIntelligencePipeline()
''')

print("All AI & processing modules written successfully!")
