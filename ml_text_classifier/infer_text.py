"""
infer_text.py

CLI usage:
    python infer_text.py "The river is rising fast near our village, we need help"
    python infer_text.py "I had cereal for breakfast" --threshold 0.6

Programmatic usage (drop into a pipeline alongside your image classifier):

    from infer_text import load_model, analyze_text
    model = load_model()
    result = analyze_text("Flood water is entering our homes", model)
    # {"verdict": "DISASTER_RELATED_THREAT" | "NOT_DISASTER_RELATED",
    #  "disaster_prob": 0.94}
"""
import argparse
import os
from pathlib import Path
import joblib

ROOT_DIR = Path(__file__).resolve().parent
MODEL_PATH = ROOT_DIR / "text_classifier.joblib"


def load_model(path=MODEL_PATH):
    if not os.path.exists(path):
        return None
    return joblib.load(path)


def analyze_text(text: str, model=None, threshold: float = 0.6):
    if model is None:
        model = load_model()
    if model is None:
        # Fallback if model weights not yet loaded
        return {"verdict": "MODEL_NOT_LOADED", "disaster_prob": 0.0, "is_disaster": False}
    
    probs = model.predict_proba([text])[0]
    prob = float(probs[1])  # P(label == 1, disaster-related)
    verdict = "DISASTER_RELATED_THREAT" if prob >= threshold else "NOT_DISASTER_RELATED"
    return {
        "verdict": verdict,
        "disaster_prob": round(prob, 4),
        "is_disaster": bool(prob >= threshold),
        "threshold": threshold,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("text")
    parser.add_argument("--threshold", type=float, default=0.6)
    parser.add_argument("--model", default=str(MODEL_PATH))
    args = parser.parse_args()

    model = load_model(args.model)
    result = analyze_text(args.text, model, threshold=args.threshold)

    print(f"\nText: {args.text}")
    print(f"Verdict: {result['verdict']}")
    print(f"Disaster probability: {result['disaster_prob']:.4f}")


if __name__ == "__main__":
    main()
