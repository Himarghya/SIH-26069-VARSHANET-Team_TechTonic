"""
text_analyzer.py

Disaster-Related vs Not Disaster-Related Text Threat Classifier for VARSHANET.
Trained on Multilingual Disaster Response Messages (TF-IDF + Logistic Regression).

Verdict logic:
    verdict == "DISASTER_RELATED_THREAT" if disaster_prob >= threshold (default 0.60) else "NOT_DISASTER_RELATED"
"""
import os
import joblib
from pathlib import Path
from typing import Dict, Any, Optional

_CURRENT_DIR = Path(__file__).resolve().parent
_PROJECT_ROOT = _CURRENT_DIR.parent.parent

_CANDIDATE_PATHS = [
    _CURRENT_DIR / "text_classifier.joblib",
    _PROJECT_ROOT / "backend" / "ml" / "classifier" / "text_classifier.joblib",
    _PROJECT_ROOT / "ml_text_classifier" / "text_classifier.joblib",
    Path("/app/processing/nlp/text_classifier.joblib"),
    Path("/app/backend/ml/classifier/text_classifier.joblib"),
    Path("/app/ml_text_classifier/text_classifier.joblib"),
]

_model = None
HAS_TEXT_MODEL = any(p.exists() for p in _CANDIDATE_PATHS)


def ensure_text_model():
    global _model, HAS_TEXT_MODEL
    if _model is not None:
        return _model
    for path in _CANDIDATE_PATHS:
        if path.exists():
            try:
                _model = joblib.load(str(path))
                HAS_TEXT_MODEL = True
                print(f"[TextGuard] Loaded trained Text Classifier from {path}", flush=True)
                break
            except Exception as e:
                print(f"[TextGuard] Error loading model from {path}: {e}", flush=True)
    return _model

DEFAULT_THRESHOLD = float(os.environ.get("TEXT_DISASTER_THRESHOLD", "0.55"))


class TextAnalyzer:
    def __init__(self):
        pass

    @property
    def model(self):
        return ensure_text_model()

    @property
    def has_model(self):
        return ensure_text_model() is not None

    def analyze_text(self, text: str, threshold: Optional[float] = None) -> Dict[str, Any]:
        t = threshold if threshold is not None else DEFAULT_THRESHOLD
        cleaned = (text or "").strip()

        if not cleaned:
            return {
                "text": "",
                "is_disaster": False,
                "verdict": "EMPTY_TEXT",
                "disaster_prob": 0.0,
                "confidence_pct": 0.0,
                "label": "No Text Entered",
                "badge_color": "slate",
            }

        # Comprehensive multilingual hazard keywords across all disaster types
        hazard_keywords = [
            # Flood & Water
            "flood", "floods", "flooding", "waterlogging", "waterlogged", "submerged", "underpass", "overflowing",
            "overflow", "drowning", "drown", "heavy rain", "inundation", "inundated", "river rising", "dam overflow",
            "paani", "pani", "baadh", "badh", "jalbharao", "doob", "dub gaya", "pani bhar",
            # Earthquakes & Structural Damage
            "earthquake", "quake", "tremor", "tremors", "aftershock", "building collapse", "roof collapse",
            "wall collapse", "collapsed", "cracked", "rubble", "debris", "bhookamp", "bhukamp", "makaan gir",
            "gir gaya", "tut gaya", "deewar gir",
            # Fires & Explosions
            "fire", "fires", "wildfire", "blaze", "inferno", "smoke", "cylinder blast", "explosion", "burnt",
            "aag lag", "aag lagi", "dhuan", "jal gaya",
            # Storms & Cyclones
            "storm", "storms", "cyclone", "typhoon", "tornado", "cloudburst", "lightning", "thunderstorm",
            "squall", "gale", "hailstorm", "toofan", "tufan", "aandhi", "bijli gir",
            # Landslides & Avalanches
            "landslide", "mudslide", "rockfall", "road blocked", "avalanche", "pahad gir", "pahad tut",
            "malba", "chattana",
            # Emergency, Rescue, Casualties
            "rescue", "evacuate", "evacuation", "disaster", "stranded", "trapped", "casualty", "casualties",
            "injured", "injury", "death", "fatalities", "electrocution", "fas gaye", "phans gaye", "bachao",
            "madad", "emergency", "urgent help"
        ]

        if not self.has_model or self.model is None:
            # Fallback heuristic: keyword matching
            lower = cleaned.lower()
            matches = [k for k in hazard_keywords if k in lower]
            prob = min(0.98, 0.50 + (0.15 * len(matches))) if matches else 0.15
            is_disaster = prob >= t
            return {
                "text": cleaned,
                "is_disaster": is_disaster,
                "verdict": "DISASTER_RELATED_THREAT" if is_disaster else "NOT_DISASTER_RELATED",
                "disaster_prob": round(prob, 4),
                "confidence_pct": round((prob if is_disaster else (1.0 - prob)) * 100, 1),
                "disaster_score_pct": round(prob * 100, 1),
                "label": "Verified Disaster Threat" if is_disaster else "Non-Disaster / Normal",
                "badge_color": "amber" if is_disaster else "emerald",
                "source": "heuristic_fallback",
            }

        try:
            probs = self.model.predict_proba([cleaned])[0]
            prob = float(probs[1])

            # Calibrate with multilingual disaster/weather hazard keywords (English, Hindi, Hinglish)
            lower = cleaned.lower()
            keyword_hits = [k for k in hazard_keywords if k in lower]
            if keyword_hits:
                boost = min(0.40, 0.15 * len(keyword_hits))
                prob = min(0.99, max(prob, 0.65) + boost)

            is_disaster = bool(prob >= t)
            verdict = "DISASTER_RELATED_THREAT" if is_disaster else "NOT_DISASTER_RELATED"

            return {
                "text": cleaned,
                "is_disaster": is_disaster,
                "verdict": verdict,
                "disaster_prob": round(prob, 4),
                "confidence_pct": round((prob if is_disaster else (1.0 - prob)) * 100, 1),
                "disaster_score_pct": round(prob * 100, 1),
                "label": "Verified Disaster Threat" if is_disaster else "Non-Disaster / Normal",
                "badge_color": "amber" if is_disaster else "emerald",
                "threshold": t,
                "source": "ml_pipeline",
            }
        except Exception as e:
            print(f"[TextGuard] Inference error: {e}")
            return {
                "text": cleaned,
                "is_disaster": False,
                "verdict": "ERROR",
                "disaster_prob": 0.0,
                "confidence_pct": 0.0,
                "label": "Inference Error",
                "badge_color": "amber",
                "error": str(e),
            }


text_analyzer = TextAnalyzer()
