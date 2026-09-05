"""
image_analyzer.py

Disaster vs. Not-Disaster Image Analyzer for VARSHANET VisionGuard.
Powered by fine-tuned ResNet18 trained on Kaggle Comprehensive Disaster Dataset (CDD)
and Intel Normal-Scene Dataset (buildings, forest, mountain, sea, street, wildlife, human).

Verdict logic:
    verdict == "DISASTER" if disaster_prob >= threshold (default 0.85) else "NOT_DISASTER"
"""
import os
import io
import json
import base64
import urllib.request
from typing import Dict, Any, Optional
from pathlib import Path

from PIL import Image, ImageFile
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms, models

ImageFile.LOAD_TRUNCATED_IMAGES = True

_MODEL_DIR = os.environ.get("DISASTER_MODEL_DIR", os.path.dirname(__file__))
_WEIGHTS_PATH = os.path.join(_MODEL_DIR, "disaster_binary_classifier.pt")
_LABELS_PATH = os.path.join(_MODEL_DIR, "class_names.json")

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
DEFAULT_THRESHOLD = float(os.environ.get("DISASTER_THRESHOLD", "0.85"))

_tf = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

_model = None
_class_names = []
HAS_DISASTER_MODEL = False

try:
    if os.path.exists(_WEIGHTS_PATH) and os.path.exists(_LABELS_PATH):
        with open(_LABELS_PATH, "r") as f:
            _class_names = json.load(f)
        _model = models.resnet18(weights=None)
        _model.fc = nn.Linear(_model.fc.in_features, len(_class_names))
        _model.load_state_dict(torch.load(_WEIGHTS_PATH, map_location=DEVICE))
        _model.to(DEVICE)
        _model.eval()
        HAS_DISASTER_MODEL = True
        print(f"[VisionGuard] Loaded trained ResNet18 ({_WEIGHTS_PATH}) on {DEVICE}")
    else:
        print(f"[VisionGuard] Model weights not found at {_WEIGHTS_PATH}")
except Exception as e:
    print(f"[VisionGuard] Error loading disaster model: {e}")

print(f"[DEBUG] image_analyzer.py loaded from: {__file__} | HAS_DISASTER_MODEL={HAS_DISASTER_MODEL}")


def load_image_from_source(source: str) -> Optional[Image.Image]:
    """Safely decodes Base64 data URLs, remote URLs, or local file paths into a PIL Image."""
    if not source:
        return None
    try:
        if source.startswith("data:image"):
            header, encoded = source.split(",", 1)
            return Image.open(io.BytesIO(base64.b64decode(encoded))).convert("RGB")
        if source.startswith(("http://", "https://")):
            req = urllib.request.Request(source, headers={"User-Agent": "VARSHANET-VisionGuard/4.0"})
            with urllib.request.urlopen(req, timeout=6) as response:
                return Image.open(io.BytesIO(response.read())).convert("RGB")
        if os.path.exists(source):
            return Image.open(source).convert("RGB")

        # Resolve local server upload paths (/uploads/xxx.jpg)
        fname = os.path.basename(source)
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        candidate_paths = [
            os.path.join(project_root, source.lstrip("/\\")),
            os.path.join(project_root, "backend", source.lstrip("/\\")),
            os.path.join(project_root, "backend", "uploads", fname),
            os.path.join(project_root, "uploads", fname),
        ]
        for p in candidate_paths:
            if os.path.exists(p):
                return Image.open(p).convert("RGB")
    except Exception as e:
        print(f"[VisionGuard] Image load error: {e}")
    return None


class ImageWeatherAnalyzer:
    def __init__(self):
        self.model_version = "VARSHANET-VisionGuard (Fine-Tuned ResNet18 Binary Classifier)"
        self.threshold = DEFAULT_THRESHOLD

    def analyze_pil_image(self, pil_img: Image.Image, threshold: Optional[float] = None) -> Dict[str, Any]:
        """
        Runs binary disaster classification on a PIL Image.
        Returns whether the image contains genuine disaster ground proof or a normal everyday scene.
        """
        thresh = threshold if threshold is not None else self.threshold
        if not HAS_DISASTER_MODEL or _model is None:
            return {
                "media_type": "image",
                "verdict": "ERROR",
                "is_weather_related": False,
                "is_disaster": False,
                "is_authentic": False,
                "model_verdict": "ERROR: MODEL NOT LOADED",
                "admin_verdict": "UNVERIFIED: ML MODEL UNAVAILABLE",
                "admin_recommendation": "⚠️ MANUAL REVIEW REQUIRED",
                "verdict_reason": "Trained disaster_binary_classifier.pt was not found on this server.",
                "detected_category": "Model Unavailable",
                "top_predictions": [],
                "authenticity_score": 0.0,
                "weather_relevance_confidence": 0.0,
                "fake_probability": 100.0,
                "disaster_prob": 0.0,
                "class_probs": {},
            }

        img_rgb = pil_img.convert("RGB")
        tensor = _tf(img_rgb).unsqueeze(0).to(DEVICE)
        with torch.no_grad():
            logits = _model(tensor)
            probs = F.softmax(logits, dim=1).squeeze(0).cpu()

        class_probs = {_class_names[i]: float(probs[i].item()) for i in range(len(_class_names))}
        disaster_prob = class_probs.get("disaster", 0.0)
        normal_prob = class_probs.get("normal", 0.0)

        is_disaster = disaster_prob >= thresh
        verdict = "DISASTER" if is_disaster else "NOT_DISASTER"

        if is_disaster:
            model_verdict = "TRUE: DISASTER GROUND PROOF"
            admin_verdict = "TRUE: DISASTER GROUND PROOF"
            admin_recommendation = "✅ RECOMMEND VERIFY"
            verdict_reason = f"Verified disaster ground proof (disaster confidence: {disaster_prob * 100:.1f}%)."
            detected_category = f"Disaster Ground Proof ({disaster_prob * 100:.1f}%)"
        else:
            model_verdict = "FALSE: NOT DISASTER RELATED"
            admin_verdict = "FALSE: NOT DISASTER RELATED"
            admin_recommendation = "❌ RECOMMEND REJECT"
            verdict_reason = f"Normal scene detected: non-disaster confidence is {normal_prob * 100:.1f}%."
            detected_category = f"Normal Everyday Scene ({normal_prob * 100:.1f}%)"

        return {
            "media_type": "image",
            "verdict": verdict,
            "disaster_prob": round(disaster_prob, 4),
            "class_probs": class_probs,
            "is_weather_related": is_disaster,
            "is_disaster": is_disaster,
            "is_authentic": is_disaster,
            "model_verdict": model_verdict,
            "admin_verdict": admin_verdict,
            "admin_recommendation": admin_recommendation,
            "verdict_reason": verdict_reason,
            "detected_category": detected_category,
            "authenticity_score": round(disaster_prob, 4),
            "weather_relevance_confidence": round(disaster_prob * 100, 1),
            "fake_probability": round(normal_prob * 100, 1),
            "top_predictions": [
                f"{name.capitalize()}: {round(score, 4)}"
                for name, score in sorted(class_probs.items(), key=lambda x: x[1], reverse=True)
            ],
        }

    def analyze_image_heuristics(self, image_source: str) -> Dict[str, Any]:
        img = load_image_from_source(image_source)
        if img is not None:
            return self.analyze_pil_image(img)
        return {
            "media_type": "image",
            "verdict": "NOT_DISASTER",
            "is_weather_related": False,
            "is_disaster": False,
            "is_authentic": False,
            "model_verdict": "FALSE: NOT A DISASTER PHOTO",
            "admin_verdict": "FALSE: NO MEDIA",
            "admin_recommendation": "❌ RECOMMEND REJECT",
            "verdict_reason": "No media proof attached.",
            "detected_category": "No Media",
            "authenticity_score": 0.0,
            "weather_relevance_confidence": 0.0,
            "fake_probability": 100.0,
            "disaster_prob": 0.0,
            "class_probs": {},
            "top_predictions": [],
        }

    def analyze_image(self, image_source: str) -> Dict[str, Any]:
        return self.analyze_image_heuristics(image_source)


image_analyzer = ImageWeatherAnalyzer()
