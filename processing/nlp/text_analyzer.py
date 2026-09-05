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
]

_model = None
HAS_TEXT_MODEL = False

for path in _CANDIDATE_PATHS:
    if path.exists():
        try:
            _model = joblib.load(str(path))
            HAS_TEXT_MODEL = True
            print(f"[TextGuard] Loaded trained Text Classifier from {path}")
            break
        except Exception as e:
            print(f"[TextGuard] Error loading model from {path}: {e}")

DEFAULT_THRESHOLD = float(os.environ.get("TEXT_DISASTER_THRESHOLD", "0.60"))


class TextAnalyzer:
    def __init__(self):
        self.model = _model
        self.has_model = HAS_TEXT_MODEL

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

        if not self.has_model or self.model is None:
            # Fallback heuristic: keyword matching
            keywords = ["flood", "water", "rain", "cyclone", "fire", "quake", "river", "storm", "drown", "paani", "baadh", "aag", "storm", "wind"]
            lower = cleaned.lower()
            matches = [k for k in keywords if k in lower]
            prob = min(0.95, 0.45 + (0.2 * len(matches))) if matches else 0.25
            is_disaster = prob >= t
            return {
                "text": cleaned,
                "is_disaster": is_disaster,
                "verdict": "DISASTER_RELATED_THREAT" if is_disaster else "NOT_DISASTER_RELATED",
                "disaster_prob": round(prob, 4),
                "confidence_pct": round(prob * 100, 1),
                "label": "Disaster Threat Detected" if is_disaster else "Non-Threat / Normal",
                "badge_color": "rose" if is_disaster else "emerald",
                "source": "heuristic_fallback",
            }

        try:
            probs = self.model.predict_proba([cleaned])[0]
            prob = float(probs[1])

            # Calibrate with multilingual disaster/weather hazard keywords (English, Hindi, Hinglish)
            hazard_keywords = [
                "flood", "waterlogging", "waterlogged", "submerged", "underpass", "overflowing", "overflow",
                "drowning", "drown", "heavy rain", "storm", "cyclone", "cloudburst", "landslide",
                "inundation", "inundated", "rescue", "evacuate", "evacuation", "disaster", "stranded",
                "casualty", "electrocution", "lightning strike", "river rising", "dam overflow",
                "paani", "pani", "baadh", "badh", "jalbharao", "toofan", "tufan", "aag", "bhookamp",
                "fas gaye", "phns gye", "madad", "gira", "tuta"
            ]
            lower = cleaned.lower()
            keyword_hits = [k for k in hazard_keywords if k in lower]
            if keyword_hits:
                boost = min(0.35, 0.12 * len(keyword_hits))
                prob = min(0.99, prob + boost)

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
                "badge_color": "rose" if is_disaster else "emerald",
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
