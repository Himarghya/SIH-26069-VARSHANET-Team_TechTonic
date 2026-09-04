"""
infer.py

Single-image disaster / not-disaster inference.

CLI usage:
    python infer.py path/to/image.jpg
    python infer.py path/to/image.jpg --threshold 0.85

Programmatic usage (drop-in for a pipeline like VarshaNet's
processing/vision/image_analyzer.py):

    from infer import load_model, analyze_pil_image
    model, class_names = load_model()
    result = analyze_pil_image(pil_img, model, class_names, threshold=0.85)
    # result = {"verdict": "DISASTER" | "NOT_DISASTER",
    #           "disaster_prob": 0.97,
    #           "class_probs": {"disaster": 0.97, "normal": 0.03}}
"""
import argparse
import json
from pathlib import Path

import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms, models

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMG_SIZE = 224

tf = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(IMG_SIZE),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])


BASE_DIR = Path(__file__).resolve().parent

def load_model(model_path="disaster_binary_classifier.pt", labels_path="class_names.json"):
    model_p = Path(model_path)
    if not model_p.is_file():
        model_p = BASE_DIR / model_path
    labels_p = Path(labels_path)
    if not labels_p.is_file():
        labels_p = BASE_DIR / labels_path

    with open(labels_p) as f:
        class_names = json.load(f)
    model = models.resnet18(weights=None)
    model.fc = nn.Linear(model.fc.in_features, len(class_names))
    model.load_state_dict(torch.load(model_p, map_location=DEVICE))
    model.to(DEVICE)
    model.eval()
    return model, class_names


def analyze_pil_image(pil_img: Image.Image, model, class_names, threshold: float = 0.85):
    """
    threshold: minimum probability required for the "disaster" class before
    the image is flagged DISASTER. Raise this (e.g. 0.9) if you're seeing
    false positives on ordinary photos; lower it if real disaster photos
    are being missed.
    """
    img = pil_img.convert("RGB")
    x = tf(img).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        logits = model(x)
        probs = F.softmax(logits, dim=1).squeeze(0).cpu()

    class_probs = {class_names[i]: probs[i].item() for i in range(len(class_names))}
    disaster_prob = class_probs.get("disaster", 0.0)
    verdict = "DISASTER" if disaster_prob >= threshold else "NOT_DISASTER"

    return {
        "verdict": verdict,
        "disaster_prob": disaster_prob,
        "class_probs": class_probs,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("image_path")
    parser.add_argument("--threshold", type=float, default=0.85)
    parser.add_argument("--model", default="disaster_binary_classifier.pt")
    parser.add_argument("--labels", default="class_names.json")
    args = parser.parse_args()

    model, class_names = load_model(args.model, args.labels)
    img = Image.open(args.image_path)
    result = analyze_pil_image(img, model, class_names, threshold=args.threshold)

    print(f"\nImage: {args.image_path}")
    print(f"Verdict: {result['verdict']}")
    print(f"Disaster probability: {result['disaster_prob']:.4f}")
    print(f"All class probabilities: {result['class_probs']}")


if __name__ == "__main__":
    main()
