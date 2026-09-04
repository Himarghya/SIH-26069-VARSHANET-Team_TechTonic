"""
predict_torch.py
----------------
Evaluates a single image with the PyTorch MobileNet disaster classifier.

Usage:
    python predict_torch.py path/to/image.jpg
"""

import sys
import json
from PIL import Image
import torch
import torch.nn as nn
from torchvision import transforms, models

MODEL_PATH = "disaster_classifier_pytorch.pt"
CLASS_NAMES_PATH = "class_names.json"
CONFIDENCE_THRESHOLD = 0.45

with open(CLASS_NAMES_PATH) as f:
    class_names = json.load(f)

weights = models.MobileNet_V2_Weights.DEFAULT
model = models.mobilenet_v2(weights=weights)
in_features = model.classifier[1].in_features
model.classifier = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(in_features, 128),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(128, len(class_names))
)

if torch.cuda.is_available():
    model.load_state_dict(torch.load(MODEL_PATH))
    model = model.cuda()
else:
    model.load_state_dict(torch.load(MODEL_PATH, map_location="cpu"))
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def predict_image(image_path: str):
    img = Image.open(image_path).convert("RGB")
    tensor = transform(img).unsqueeze(0)
    if torch.cuda.is_available():
        tensor = tensor.cuda()

    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1).squeeze(0).cpu().numpy()

    top_idx = int(probs.argmax())
    top_label = class_names[top_idx]
    top_conf = float(probs[top_idx])

    ranked = sorted(zip(class_names, probs.tolist()), key=lambda x: x[1], reverse=True)
    return {
        "predicted_class": top_label,
        "confidence": round(top_conf, 4),
        "is_confident": top_conf >= CONFIDENCE_THRESHOLD,
        "all_scores": [(name, round(score, 4)) for name, score in ranked]
    }

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python predict_torch.py <path_to_image>")
        sys.exit(1)

    res = predict_image(sys.argv[1])
    print("\n--- Prediction ---")
    if res["is_confident"]:
        print(f"Disaster type: {res['predicted_class']}")
    else:
        print(f"Best guess: {res['predicted_class']} (low confidence — image may not clearly show a disaster)")
    print(f"Confidence: {res['confidence'] * 100:.1f}%")
    print("\nAll class scores:")
    for name, score in res["all_scores"]:
        print(f"  {name:30s} {score * 100:5.1f}%")
