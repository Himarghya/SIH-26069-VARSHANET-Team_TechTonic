"""
text_analyzer.py

Disaster-Related vs Not Disaster-Related Text Threat Classifier for VARSHANET.
Supports English, Hindi, and Hinglish observation descriptions.
Powered by Multilingual Disaster Response model trained on Kaggle dataset
(landlord/multilingual-disaster-response-messages) with keyword calibration.
"""
import os
import re
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

try:
    import joblib
    for path in _CANDIDATE_PATHS:
        if path.exists():
            _model = joblib.load(str(path))
            HAS_TEXT_MODEL = True
            print(f"[TextGuard] Loaded trained Text Classifier from {path}", flush=True)
            break
except Exception as e:
    print(f"[TextGuard] Error loading joblib model: {e}", flush=True)

# Optional transformer pipeline if loaded and available
_transformer_pipeline = None
_TRANSFORMER_DIR = os.path.join(str(_PROJECT_ROOT), "text_disaster_transformer_model", "final_model")
if os.path.exists(_TRANSFORMER_DIR):
    try:
        from transformers import pipeline
        _transformer_pipeline = pipeline(
            "text-classification",
            model=_TRANSFORMER_DIR,
            tokenizer=_TRANSFORMER_DIR,
            device=-1  # Keep on CPU for serverless/web requests
        )
        print("[TextGuard] Loaded fine-tuned DistilBERT transformer pipeline", flush=True)
    except Exception as e:
        _transformer_pipeline = None

DEFAULT_THRESHOLD = float(os.environ.get("TEXT_DISASTER_THRESHOLD", "0.65"))

HAZARD_KEYWORDS = [
    # English disaster / weather / emergency keywords
    "flood", "flooding", "waterlogging", "waterlogged", "submerged", "underpass", "overflowing", "overflow",
    "drowning", "drown", "heavy rain", "torrential", "storm", "cyclone", "cloudburst", "landslide",
    "inundation", "inundated", "rescue", "evacuate", "evacuation", "disaster", "stranded", "trapped",
    "casualty", "casualties", "electrocution", "lightning strike", "river rising", "dam overflow",
    "power outage", "blackout", "tree fallen", "road blocked", "collapse", "collapsed", "debris",
    "earthquake", "wildfire", "fire outbreak", "leakage", "toxic gas", "alert", "emergency", "ndrf",

    # Hindi & Hinglish disaster keywords
    "paani", "pani", "baadh", "badh", "jalbharao", "toofan", "tufan", "aag", "bhookamp",
    "fas gaye", "phns gye", "madad", "gira", "tuta", "doob", "dooba", "barish", "tez barish",
    "nadi", "bheed", "rahat", "bachao", "fas gaya", "dub gaya", "khamba", "bijli", "sadak band"
]


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

        # Check keyword hits across English, Hindi, and Hinglish
        lower = cleaned.lower()
        keyword_hits = [k for k in HAZARD_KEYWORDS if re.search(r'\b' + re.escape(k) + r'\b', lower) or k in lower]

        prob = 0.0

        # 1. Try transformer pipeline if active
        if _transformer_pipeline is not None:
            try:
                res = _transformer_pipeline(cleaned, truncation=True, max_length=128)[0]
                lbl = res.get("label", "LABEL_0")
                score = res.get("score", 0.5)
                prob = score if lbl.endswith("1") else (1.0 - score)
            except Exception:
                pass

        # 2. Try trained scikit-learn pipeline
        if prob == 0.0 and self.has_model and self.model is not None:
            try:
                probs = self.model.predict_proba([cleaned])[0]
                prob = float(probs[1])
            except Exception:
                pass

        # 3. Keyword grounding & calibration
        if keyword_hits:
            keyword_weight = min(0.40, 0.15 * len(keyword_hits))
            prob = max(prob, 0.60 + keyword_weight)
        elif prob == 0.0:
            # Safe default for non-matching sentences
            prob = 0.20

        prob = min(0.99, max(0.01, prob))
        is_disaster = bool(prob >= t)
        verdict = "DISASTER_RELATED_THREAT" if is_disaster else "NOT_DISASTER_RELATED"
        conf_pct = round((prob if is_disaster else (1.0 - prob)) * 100, 1)

        return {
            "text": cleaned,
            "is_disaster": is_disaster,
            "verdict": verdict,
            "disaster_prob": round(prob, 4),
            "confidence_pct": conf_pct,
            "disaster_score_pct": round(prob * 100, 1),
            "label": "Disaster Threat Detected" if is_disaster else "Non-Disaster / Normal Text",
            "badge_color": "rose" if is_disaster else "emerald",
            "detected_keywords": keyword_hits[:5],
            "threshold": t,
            "source": "TextGuard-NLP",
        }


text_analyzer = TextAnalyzer()
