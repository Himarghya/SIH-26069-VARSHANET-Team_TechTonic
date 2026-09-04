"""
predict.py
----------
Loads the trained disaster classifier and predicts the disaster type
(Flood, Earthquake, Cyclone, Wildfire, ... or "No disaster detected" if
confidence is low) for a single uploaded image.

Usage:
    python predict.py path/to/photo.jpg
"""

import sys
import os
import json

import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

IMG_SIZE = (224, 224)
MODEL_PATH = "disaster_classifier.keras"
CLASS_NAMES_PATH = "class_names.json"

# Below this confidence, we tell the user we're not sure rather than
# forcing a guess.
CONFIDENCE_THRESHOLD = 0.45


def load_model_and_classes():
    model = tf.keras.models.load_model(MODEL_PATH)
    with open(CLASS_NAMES_PATH) as f:
        class_names = json.load(f)
    return model, class_names


def predict_image(image_path: str, model=None, class_names=None):
    if model is None or class_names is None:
        model, class_names = load_model_and_classes()

    img = tf.keras.utils.load_img(image_path, target_size=IMG_SIZE)
    arr = tf.keras.utils.img_to_array(img)
    arr = np.expand_dims(arr, axis=0)
    arr = preprocess_input(arr)

    preds = model.predict(arr, verbose=0)[0]
    top_idx = int(np.argmax(preds))
    top_label = class_names[top_idx]
    top_conf = float(preds[top_idx])

    ranked = sorted(
        zip(class_names, preds.tolist()), key=lambda x: x[1], reverse=True
    )

    result = {
        "predicted_class": top_label,
        "confidence": round(top_conf, 4),
        "is_confident": top_conf >= CONFIDENCE_THRESHOLD,
        "all_scores": [(name, round(score, 4)) for name, score in ranked],
    }
    return result


def main():
    if len(sys.argv) != 2:
        print("Usage: python predict.py <path_to_image>")
        sys.exit(1)

    image_path = sys.argv[1]
    result = predict_image(image_path)

    print("\n--- Prediction ---")
    if result["is_confident"]:
        print(f"Disaster type: {result['predicted_class']}")
    else:
        print(
            f"Best guess: {result['predicted_class']} "
            f"(low confidence — image may not clearly show a disaster)"
        )
    print(f"Confidence: {result['confidence'] * 100:.1f}%")
    print("\nAll class scores:")
    for name, score in result["all_scores"]:
        print(f"  {name:15s} {score * 100:5.1f}%")


if __name__ == "__main__":
    main()
