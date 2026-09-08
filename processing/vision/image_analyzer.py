"""
image_analyzer.py

Disaster vs. Not-Disaster Image Analyzer for VARSHANET VisionGuard.
Two-Stage Forensic Architecture:
  Stage 1: MobileNetV3 Semantic Entity Discriminator (ImageNet-1K).
           Detects non-disaster entities (wildlife/animals, food, domestic electronics/gadgets)
           with high precision and immediate short-circuiting to prevent false alarms.
  Stage 2: Fine-Tuned ResNet18 Binary Classifier.
           Evaluates disaster ground proof vs. normal outdoor scenes.
"""
from __future__ import annotations

import os
import io
import json
import base64
import urllib.request
import threading
from pathlib import Path
from typing import Dict, Any, Optional, Tuple, List

from PIL import Image, ImageFile
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms, models

ImageFile.LOAD_TRUNCATED_IMAGES = True

_MODEL_DIR = os.environ.get("DISASTER_MODEL_DIR", os.path.dirname(__file__))
_WEIGHTS_PATH = os.path.join(_MODEL_DIR, "disaster_binary_classifier.pt")
_LABELS_PATH = os.path.join(_MODEL_DIR, "class_names.json")
_MOBILENET_PATH = os.path.join(_MODEL_DIR, "mobilenet_v3_small-047dcff4.pth")

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
DEFAULT_THRESHOLD = float(os.environ.get("DISASTER_THRESHOLD", "0.85"))

_tf_resnet = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

_tf_mobilenet = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

try:
    torch.set_num_threads(1)
    torch.set_num_interop_threads(1)
except Exception:
    pass

_model_lock = threading.Lock()
_resnet_model: Optional[nn.Module] = None
_mobilenet_model: Optional[nn.Module] = None
_mobilenet_categories: List[str] = []
_class_names: List[str] = ["disaster", "normal"]
_models_loaded = False

# Non-disaster semantic category mappings in ImageNet-1K:
# 0..397 are all animal / bird / reptile / fish / wildlife species
ANIMAL_CLASS_MAX_IDX = 397

# 923..965 are foods, dishes, fruits, vegetables
FOOD_CLASS_MIN_IDX = 923
FOOD_CLASS_MAX_IDX = 965

# Known everyday indoor electronics and objects (subset of classes >= 398)
EVERYDAY_INDOOR_NAMES = {
    "cellular telephone", "laptop", "desktop computer", "notebook",
    "coffee mug", "cup", "dining table", "studio couch", "water bottle",
    "packet", "pill bottle", "sunglass", "sunglasses", "jersey", "suit",
    "sweatshirt", "running shoe", "backpack", "umbrella", "toilet seat",
    "refrigerator", "microwave", "toaster", "electric guitar", "acoustic guitar",
    "television", "computer keyboard", "mouse", "ipod", "remote control"
}


def ensure_models() -> bool:
    """
    Lazily loads the fine-tuned ResNet18 and MobileNetV3-Small discriminator into memory.
    Keeps startup memory ~90MB so Render passes port binding and health checks instantly.
    """
    global _resnet_model, _mobilenet_model, _mobilenet_categories, _class_names, _models_loaded
    if _models_loaded:
        return True

    with _model_lock:
        if _models_loaded:
            return True

        if os.path.exists(_LABELS_PATH):
            try:
                with open(_LABELS_PATH, "r") as f:
                    _class_names = json.load(f)
            except Exception as e:
                print(f"[VisionGuard] Failed to load class names: {e}")
                _class_names = ["disaster", "normal"]

        if os.path.exists(_WEIGHTS_PATH):
            try:
                r_model = models.resnet18(weights=None)
                r_model.fc = nn.Linear(r_model.fc.in_features, len(_class_names))
                state_dict = torch.load(_WEIGHTS_PATH, map_location=DEVICE)
                r_model.load_state_dict(state_dict)
                r_model.to(DEVICE)
                r_model.eval()
                _resnet_model = r_model
                print(f"[VisionGuard] Loaded trained ResNet18 from {_WEIGHTS_PATH} on {DEVICE}", flush=True)
            except Exception as e:
                print(f"[VisionGuard] ResNet18 load failed: {e}", flush=True)

        try:
            m_model = models.mobilenet_v3_small(weights=None)
            if os.path.exists(_MOBILENET_PATH):
                m_state = torch.load(_MOBILENET_PATH, map_location=DEVICE)
                m_model.load_state_dict(m_state)
            else:
                m_model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
            m_model.to(DEVICE)
            m_model.eval()
            _mobilenet_model = m_model
            _mobilenet_categories = models.MobileNet_V3_Small_Weights.DEFAULT.meta["categories"]
            print(f"[VisionGuard] Loaded MobileNetV3-Small discriminator on {DEVICE}", flush=True)
        except Exception as e:
            print(f"[VisionGuard] MobileNetV3 load error: {e}", flush=True)

        _models_loaded = (_resnet_model is not None)
        return _models_loaded


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
        self.model_version = "VARSHANET-VisionGuard (Two-Stage Forensics: MobileNetV3 + ResNet18)"
        self.threshold = DEFAULT_THRESHOLD

    def analyze_pil_image(self, pil_img: Image.Image, threshold: Optional[float] = None) -> Dict[str, Any]:
        """
        Runs two-stage disaster classification on a PIL Image:
        Stage 1: MobileNetV3 semantic entity discrimination (wildlife, pets, food, indoor items).
        Stage 2: Fine-tuned ResNet18 binary disaster classifier.
        """
        ensure_models()
        thresh = threshold if threshold is not None else self.threshold
        if _resnet_model is None:
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

        # Stage 1: MobileNetV3 Semantic Entity Discrimination
        top1_idx = -1
        top1_prob = 0.0
        if _mobilenet_model is not None and len(_mobilenet_categories) == 1000:
            m_tensor = _tf_mobilenet(img_rgb).unsqueeze(0).to(DEVICE)
            with torch.no_grad():
                m_logits = _mobilenet_model(m_tensor)
                m_probs = F.softmax(m_logits, dim=-1).squeeze(0).cpu()

            top5 = torch.topk(m_probs, 5)
            top1_idx = int(top5.indices[0].item())
            top1_name = _mobilenet_categories[top1_idx]
            top1_prob = float(top5.values[0].item())

            # 1. Animal & Wildlife Detection Filter
            total_animal_prob = float(sum(m_probs[i].item() for i in range(ANIMAL_CLASS_MAX_IDX + 1)))
            if top1_idx <= ANIMAL_CLASS_MAX_IDX and (top1_prob >= 0.15 or total_animal_prob >= 0.35):
                top_entity = top1_name.replace("_", " ").title()
                return {
                    "media_type": "image",
                    "verdict": "NOT_DISASTER",
                    "disaster_prob": 0.01,
                    "class_probs": {"disaster": 0.01, "normal": 0.99},
                    "is_weather_related": False,
                    "is_disaster": False,
                    "is_authentic": True,
                    "model_verdict": "FALSE: NOT DISASTER RELATED",
                    "admin_verdict": "NON_DISASTER_REJECT",
                    "admin_recommendation": "❌ RECOMMEND REJECT",
                    "verdict_reason": f"Wildlife / Animal detected ({top_entity}, confidence: {total_animal_prob * 100:.1f}%). Non-disaster entity.",
                    "detected_category": f"Wildlife / Animal ({top_entity})",
                    "authenticity_score": 0.01,
                    "weather_relevance_confidence": 1.0,
                    "fake_probability": 99.0,
                    "top_predictions": [
                        f"{_mobilenet_categories[int(idx.item())].title()}: {round(float(prob.item()), 4)}"
                        for idx, prob in zip(top5.indices, top5.values)
                    ],
                }

            # 2. Food & Produce Filter
            total_food_prob = float(sum(m_probs[i].item() for i in range(FOOD_CLASS_MIN_IDX, FOOD_CLASS_MAX_IDX + 1)))
            if (FOOD_CLASS_MIN_IDX <= top1_idx <= FOOD_CLASS_MAX_IDX) and (top1_prob >= 0.15 or total_food_prob >= 0.35):
                top_entity = top1_name.replace("_", " ").title()
                return {
                    "media_type": "image",
                    "verdict": "NOT_DISASTER",
                    "disaster_prob": 0.01,
                    "class_probs": {"disaster": 0.01, "normal": 0.99},
                    "is_weather_related": False,
                    "is_disaster": False,
                    "is_authentic": True,
                    "model_verdict": "FALSE: NOT DISASTER RELATED",
                    "admin_verdict": "NON_DISASTER_REJECT",
                    "admin_recommendation": "❌ RECOMMEND REJECT",
                    "verdict_reason": f"Food / Produce detected ({top_entity}). Non-disaster entity.",
                    "detected_category": f"Food / Produce ({top_entity})",
                    "authenticity_score": 0.01,
                    "weather_relevance_confidence": 1.0,
                    "fake_probability": 99.0,
                    "top_predictions": [
                        f"{_mobilenet_categories[int(idx.item())].title()}: {round(float(prob.item()), 4)}"
                        for idx, prob in zip(top5.indices, top5.values)
                    ],
                }

            # 3. Domestic / Indoor Gadgets Filter
            if top1_name in EVERYDAY_INDOOR_NAMES and top1_prob >= 0.20:
                top_entity = top1_name.replace("_", " ").title()
                return {
                    "media_type": "image",
                    "verdict": "NOT_DISASTER",
                    "disaster_prob": 0.01,
                    "class_probs": {"disaster": 0.01, "normal": 0.99},
                    "is_weather_related": False,
                    "is_disaster": False,
                    "is_authentic": True,
                    "model_verdict": "FALSE: NOT DISASTER RELATED",
                    "admin_verdict": "NON_DISASTER_REJECT",
                    "admin_recommendation": "❌ RECOMMEND REJECT",
                    "verdict_reason": f"Everyday object detected ({top_entity}). Non-disaster entity.",
                    "detected_category": f"Everyday Object ({top_entity})",
                    "authenticity_score": 0.01,
                    "weather_relevance_confidence": 1.0,
                    "fake_probability": 99.0,
                    "top_predictions": [
                        f"{_mobilenet_categories[int(idx.item())].title()}: {round(float(prob.item()), 4)}"
                        for idx, prob in zip(top5.indices, top5.values)
                    ],
                }

        # Stage 2: Fine-Tuned ResNet18 Binary Disaster Classifier
        tensor = _tf_resnet(img_rgb).unsqueeze(0).to(DEVICE)
        with torch.no_grad():
            logits = _resnet_model(tensor)
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

        top_preds = [
            f"{name.capitalize()}: {round(score, 4)}"
            for name, score in sorted(class_probs.items(), key=lambda x: x[1], reverse=True)
        ]
        if top1_idx >= 0 and _mobilenet_categories:
            top_preds.append(f"Scene Entity: {_mobilenet_categories[top1_idx].title()} ({top1_prob * 100:.1f}%)")

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
            "top_predictions": top_preds,
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
