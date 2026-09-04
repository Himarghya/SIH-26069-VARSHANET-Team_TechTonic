"""
predict.py
----------
Two-stage disaster prediction pipeline:

  Stage 1 (disaster_detector.keras):
      Is this photo a disaster at all? -> Disaster / Normal

  Stage 2 (disaster_classifier.keras), only runs if Stage 1 says "Disaster":
      Which disaster is it? -> Flood / Earthquake / Cyclone / Wildfire / ...

Usage:
    python predict.py path/to/photo.jpg
"""

import sys
import json

import numpy as np
import tensorflow as tf

IMG_SIZE = (224, 224)

BINARY_MODEL_PATH = "disaster_detector.keras"
MULTICLASS_MODEL_PATH = "disaster_classifier.keras"
CLASS_NAMES_PATH = "class_names.json"

# Stage 1 threshold: model outputs P(Normal). Below this, we call it a
# disaster. Tune based on your validation results (see training_history_*.png).
NORMAL_PROB_THRESHOLD = 0.5

# Stage 2 threshold: minimum confidence to commit to a specific disaster type
# rather than reporting "disaster detected, type unclear".
TYPE_CONFIDENCE_THRESHOLD = 0.40


def load_models():
    binary_model = tf.keras.models.load_model(BINARY_MODEL_PATH)
    multiclass_model = tf.keras.models.load_model(MULTICLASS_MODEL_PATH)
    with open(CLASS_NAMES_PATH) as f:
        class_names = json.load(f)
    return binary_model, multiclass_model, class_names


def _load_and_preprocess(image_path: str):
    # NOTE: do NOT call preprocess_input here — the saved models already
    # include a preprocess_input layer internally (see build_model() in
    # train_binary.py / train_multiclass.py). Applying it twice rescales
    # pixel values incorrectly and produces wrong predictions on every image.
    img = tf.keras.utils.load_img(image_path, target_size=IMG_SIZE)
    arr = tf.keras.utils.img_to_array(img)  # raw [0, 255] float32
    arr = np.expand_dims(arr, axis=0)
    return arr


def predict_image(image_path: str, binary_model=None, multiclass_model=None, class_names=None):
    if binary_model is None or multiclass_model is None or class_names is None:
        binary_model, multiclass_model, class_names = load_models()

    arr = _load_and_preprocess(image_path)

    # --- Stage 1: disaster or not? ---
    # Trained with class order ['Disaster', 'Normal'] (label_mode='binary'
    # assigns 0 = Disaster, 1 = Normal alphabetically).
    p_normal = float(binary_model.predict(arr, verbose=0)[0][0])
    p_disaster = 1.0 - p_normal
    is_disaster = p_normal < NORMAL_PROB_THRESHOLD

    result = {
        "is_disaster": is_disaster,
        "disaster_probability": round(p_disaster, 4),
    }

    if not is_disaster:
        result["message"] = "No disaster detected."
        return result

    # --- Stage 2: which disaster? ---
    preds = multiclass_model.predict(arr, verbose=0)[0]
    ranked = sorted(zip(class_names, preds.tolist()), key=lambda x: x[1], reverse=True)
    top_label, top_conf = ranked[0]

    result["predicted_class"] = top_label
    result["type_confidence"] = round(top_conf, 4)
    result["type_confident"] = top_conf >= TYPE_CONFIDENCE_THRESHOLD
    result["all_type_scores"] = [(n, round(s, 4)) for n, s in ranked]

    if result["type_confident"]:
        result["message"] = f"Disaster detected: {top_label}."
    else:
        result["message"] = (
            f"Disaster detected, but type is unclear (best guess: {top_label})."
        )

    return result


def main():
    if len(sys.argv) != 2:
        print("Usage: python predict.py <path_to_image>")
        sys.exit(1)

    image_path = sys.argv[1]
    result = predict_image(image_path)

    print("\n--- Prediction ---")
    print(f"Disaster present: {'YES' if result['is_disaster'] else 'NO'} "
          f"({result['disaster_probability'] * 100:.1f}% confidence)")

    if result["is_disaster"]:
        print(f"Type: {result['predicted_class']} "
              f"({result['type_confidence'] * 100:.1f}% confidence)")
        print("\nAll type scores:")
        for name, score in result["all_type_scores"]:
            print(f"  {name:15s} {score * 100:5.1f}%")
    else:
        print("No disaster detected in this image.")


if __name__ == "__main__":
    main()
