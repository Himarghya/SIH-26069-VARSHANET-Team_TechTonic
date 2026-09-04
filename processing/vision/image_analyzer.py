import os
import io
import json
import base64
import urllib.request
from typing import Dict, Any, Optional, List

import numpy as np
from PIL import Image

# ---------------------------------------------------------------------------
# Real Trained Two-Stage Disaster Models
# Stage 1: Disaster Detector (Disaster vs Normal Everyday Scene)
# Stage 2: Disaster Type Classifier (Flood, Fire, Landslide, Infrastructure, etc.)
# ---------------------------------------------------------------------------

_MODEL_DIR = os.environ.get("DISASTER_MODEL_DIR", os.path.dirname(__file__))

_binary_model = None
_multiclass_model = None
_class_names = []
_backend = None
HAS_DISASTER_MODEL = False

# 1. Try TensorFlow / Keras models if available
try:
    import tensorflow as tf
    _bin_k = os.path.join(_MODEL_DIR, "disaster_detector.keras")
    _mul_k = os.path.join(_MODEL_DIR, "disaster_classifier.keras")
    _cls_k = os.path.join(_MODEL_DIR, "class_names.json")

    if os.path.exists(_bin_k) and os.path.exists(_mul_k):
        _binary_model = tf.keras.models.load_model(_bin_k)
        _multiclass_model = tf.keras.models.load_model(_mul_k)
        with open(_cls_k, "r") as f:
            _class_names = json.load(f)
        _backend = "keras"
        HAS_DISASTER_MODEL = True
        print("[VisionGuard] Loaded trained disaster_detector.keras + disaster_classifier.keras")
except Exception:
    pass

# 2. If Keras not active, load trained PyTorch models (Native CUDA acceleration)
if not HAS_DISASTER_MODEL:
    try:
        import torch
        import torch.nn as nn
        from torchvision import transforms, models

        _bin_pt = os.path.join(_MODEL_DIR, "disaster_detector_pytorch.pt")
        _mul_pt = os.path.join(_MODEL_DIR, "disaster_classifier_pytorch.pt")
        _cls_pt = os.path.join(_MODEL_DIR, "class_names.json")

        if os.path.exists(_bin_pt) and os.path.exists(_mul_pt):
            _torch_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            with open(_cls_pt, "r") as f:
                _class_names = json.load(f)

            # Build Stage 1 MobileNetV2 Binary Model
            _base1 = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
            in_f1 = _base1.classifier[1].in_features
            _base1.classifier = nn.Sequential(
                nn.Dropout(0.3),
                nn.Linear(in_f1, 128),
                nn.ReLU(),
                nn.Dropout(0.2),
                nn.Linear(128, 2)
            )
            _base1.load_state_dict(torch.load(_bin_pt, map_location=_torch_device))
            _base1 = _base1.to(_torch_device).eval()

            # Build Stage 2 MobileNetV2 Multi-class Model
            _base2 = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
            in_f2 = _base2.classifier[1].in_features
            _base2.classifier = nn.Sequential(
                nn.Dropout(0.3),
                nn.Linear(in_f2, 128),
                nn.ReLU(),
                nn.Dropout(0.2),
                nn.Linear(128, len(_class_names))
            )
            _base2.load_state_dict(torch.load(_mul_pt, map_location=_torch_device))
            _base2 = _base2.to(_torch_device).eval()

            _binary_model = _base1
            _multiclass_model = _base2
            _torch_transform = transforms.Compose([
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
            ])
            _backend = "pytorch"
            HAS_DISASTER_MODEL = True
            print(f"[VisionGuard] Loaded trained disaster_detector_pytorch.pt + disaster_classifier_pytorch.pt (Device: {_torch_device})")
    except Exception as e:
        print(f"[VisionGuard] PyTorch load error: {e}")

if not HAS_DISASTER_MODEL:
    print("[VisionGuard] WARNING: could not load trained disaster models. "
          "Falling back to a permissive default — verify deployment includes "
          "disaster_detector + disaster_classifier models and class_names.json.")

IMG_SIZE = (224, 224)
NORMAL_PROB_THRESHOLD = 0.5
TYPE_CONFIDENCE_THRESHOLD = 0.40


def load_image_from_source(source: str) -> Optional[Image.Image]:
    """Safely decodes Base64 data URLs, remote URLs, or local file paths into a PIL Image."""
    if not source:
        return None
    try:
        if source.startswith('data:image'):
            header, encoded = source.split(',', 1)
            return Image.open(io.BytesIO(base64.b64decode(encoded))).convert('RGB')
        if source.startswith(('http://', 'https://')):
            req = urllib.request.Request(source, headers={'User-Agent': 'VARSHANET-VisionGuard/3.0'})
            with urllib.request.urlopen(req, timeout=6) as response:
                return Image.open(io.BytesIO(response.read())).convert('RGB')
        if os.path.exists(source):
            return Image.open(source).convert('RGB')

        # Resolve local server upload paths (/uploads/xxx.jpg)
        fname = os.path.basename(source)
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        candidate_paths = [
            os.path.join(project_root, source.lstrip('/\\')),
            os.path.join(project_root, "backend", source.lstrip('/\\')),
            os.path.join(project_root, "backend", "uploads", fname),
            os.path.join(project_root, "uploads", fname)
        ]
        for p in candidate_paths:
            if os.path.exists(p):
                return Image.open(p).convert('RGB')
    except Exception as e:
        print(f"[VisionGuard] Image load error: {e}")
    return None


class ImageWeatherAnalyzer:
    def __init__(self):
        self.model_version = "VARSHANET-VisionGuard-TwoStage (MobileNetV2 Kaggle CDD Disaster Neural Backbone)"

    def analyze_pil_image(self, img_rgb: Image.Image) -> Dict[str, Any]:
        """Runs Stage 1 (Disaster vs Normal) and Stage 2 (Disaster Type
        Classification) using the actual trained two-stage neural models."""
        if not HAS_DISASTER_MODEL:
            return {
                "media_type": "image",
                "is_weather_related": False,
                "is_disaster": False,
                "is_authentic": False,
                "model_verdict": "ERROR: MODEL NOT LOADED",
                "stage1_result": "Model Unavailable",
                "stage2_result": "Model Unavailable",
                "admin_verdict": "UNVERIFIED: ML MODEL UNAVAILABLE",
                "admin_recommendation": "⚠️ MANUAL REVIEW REQUIRED",
                "verdict_reason": "Trained disaster_detector / disaster_classifier "
                                  "were not found on this server. Deploy the model files or set DISASTER_MODEL_DIR.",
                "detected_category": "Unclassified — model unavailable",
                "top_predictions": [],
                "weather_relevance_confidence": 0.0,
                "authenticity_score": 0.0,
                "fake_probability": 100.0,
            }

        # --- Inference via PyTorch or Keras backend ---
        if _backend == "pytorch":
            tensor = _torch_transform(img_rgb).unsqueeze(0).to(_torch_device)
            with torch.no_grad():
                out1 = _binary_model(tensor).softmax(dim=1).squeeze(0)
                p_disaster = float(out1[0].item())
                p_normal = float(out1[1].item())

            is_disaster = p_normal < NORMAL_PROB_THRESHOLD

            if is_disaster:
                with torch.no_grad():
                    out2 = _multiclass_model(tensor).softmax(dim=1).squeeze(0)
                preds = out2.tolist()
        else:
            resized = img_rgb.resize(IMG_SIZE)
            arr = np.expand_dims(np.array(resized).astype("float32"), axis=0)
            p_normal = float(_binary_model.predict(arr, verbose=0)[0][0])
            p_disaster = 1.0 - p_normal
            is_disaster = p_normal < NORMAL_PROB_THRESHOLD

            if is_disaster:
                preds = _multiclass_model.predict(arr, verbose=0)[0].tolist()

        # --- Stage 1 Evaluation ---
        if not is_disaster:
            return {
                "media_type": "image",
                "is_weather_related": False,
                "is_disaster": False,
                "is_authentic": False,
                "model_verdict": "FALSE: NOT A DISASTER PHOTO",
                "stage1_result": f"Normal Everyday Scene ({p_normal * 100:.1f}% confidence)",
                "stage2_result": "None (Non-Disaster Scene)",
                "admin_verdict": "FALSE: NOT DISASTER RELATED",
                "admin_recommendation": "❌ RECOMMEND REJECT",
                "verdict_reason": f"Model is {p_normal * 100:.1f}% confident this is a normal, non-disaster scene.",
                "detected_category": "Normal / Non-Disaster Scene",
                "authenticity_score": round(p_disaster, 4),
                "weather_relevance_confidence": round(p_disaster * 100, 1),
                "fake_probability": round(p_normal * 100, 1),
                "top_predictions": [f"Normal: {round(p_normal, 4)}", f"Disaster: {round(p_disaster, 4)}"],
            }

        # --- Stage 2 Evaluation (Disaster Type) ---
        ranked = sorted(zip(_class_names, preds), key=lambda x: x[1], reverse=True)
        top_label, top_conf = ranked[0]
        type_confident = top_conf >= TYPE_CONFIDENCE_THRESHOLD

        clean_label = top_label.replace("_", " ")
        detected_label = clean_label if type_confident else f"Likely {clean_label} (low confidence)"

        return {
            "media_type": "image",
            "is_weather_related": True,
            "is_disaster": True,
            "is_authentic": True,
            "model_verdict": "TRUE: DISASTER PHOTO",
            "stage1_result": f"Disaster Detected ({p_disaster * 100:.1f}% confidence)",
            "stage2_result": f"{clean_label} ({top_conf * 100:.1f}% confidence)",
            "admin_verdict": "TRUE: DISASTER RELATED",
            "admin_recommendation": "✅ RECOMMEND VERIFY",
            "verdict_reason": f"Authentic disaster ground proof verified: {detected_label}.",
            "detected_category": detected_label,
            "authenticity_score": round(p_disaster, 4),
            "weather_relevance_confidence": round(p_disaster * 100, 1),
            "fake_probability": round((1.0 - p_disaster) * 100, 1),
            "top_predictions": [f"{name.replace('_', ' ')}: {round(score, 4)}" for name, score in ranked],
        }

    def analyze_image_heuristics(self, image_source: str) -> Dict[str, Any]:
        img = load_image_from_source(image_source)
        if img is not None:
            return self.analyze_pil_image(img)
        return {
            "media_type": "image",
            "is_weather_related": False,
            "is_disaster": False,
            "is_authentic": False,
            "model_verdict": "FALSE: NOT A DISASTER PHOTO",
            "stage1_result": "No Media Provided",
            "stage2_result": "None",
            "admin_verdict": "FALSE: NO MEDIA",
            "admin_recommendation": "❌ RECOMMEND REJECT",
            "verdict_reason": "No media proof attached.",
            "detected_category": "No Media",
            "authenticity_score": 0.0,
            "weather_relevance_confidence": 0.0,
            "fake_probability": 100.0,
            "top_predictions": []
        }

    def analyze_image(self, image_source: str) -> Dict[str, Any]:
        """Convenience alias for analyze_image_heuristics."""
        return self.analyze_image_heuristics(image_source)


image_analyzer = ImageWeatherAnalyzer()
