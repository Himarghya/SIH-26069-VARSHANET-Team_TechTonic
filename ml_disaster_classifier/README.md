# Disaster Detection System

Given an uploaded photo, this system automatically:

1. **Detects whether it shows a disaster at all** (vs. an everyday, normal scene)
2. **If it's a disaster, identifies which type** — Flood, Earthquake, Cyclone,
   Wildfire, or whatever classes exist in the dataset

It's a **two-stage transfer-learning pipeline** built on MobileNetV2.

```
photo --> [Stage 1: Disaster Detector]  --> "Normal"     --> stop, report "no disaster"
                     |
                     v
               "Disaster"
                     |
                     v
        [Stage 2: Disaster Type Classifier] --> "Flood" / "Earthquake" / ...
```

## Why two stages instead of one?

The original disaster-images dataset only contains disaster photos — there's
no "everyday scene" class in it. A model trained only on that data will
always force a guess between Flood/Earthquake/Cyclone/etc., even for a photo
of your cat. Stage 1 fixes that by learning what a disaster *looks like at
all*, using a second dataset of ordinary scenes as negative examples.

## 1. Setup

```bash
pip install -r requirements.txt
```

You need a Kaggle API token (`kaggle.json`) available so `kagglehub` can
download the datasets — see https://github.com/Kagglehub/kagglehub for auth
setup, or place `kaggle.json` in `~/.kaggle/`.

## 2. Train Stage 1 — the disaster detector

```bash
python train_binary.py
```

What it does:
- Downloads `varpit94/disaster-images-dataset` (all disaster types combined
  → relabeled as a single "Disaster" class).
- Downloads `puneet6060/intel-image-classification` (buildings, forests,
  streets, mountains, sea, glaciers — used as "Normal" / non-disaster
  examples).
- Builds a balanced binary dataset (capped at `MAX_IMAGES_PER_CLASS` per
  class, default 3000) and trains a MobileNetV2-based binary classifier.
- Saves `disaster_detector.keras` and `training_history_binary.png`.

## 3. Train Stage 2 — the disaster type classifier

```bash
python train_multiclass.py
```

Same as before: trains on the disaster dataset's own sub-folders (Flood,
Earthquake, Cyclone, Wildfire, ...) to classify *which* disaster it is.
Saves `disaster_classifier.keras` and `class_names.json`.

*(Run this in any order relative to Stage 1 — they're independent models.)*

## 4. Predict on a single photo (CLI)

```bash
python predict.py path/to/photo.jpg
```

Example — disaster photo:
```
--- Prediction ---
Disaster present: YES (94.2% confidence)
Type: Flood (88.1% confidence)

All type scores:
  Flood            88.1%
  Cyclone           6.3%
  Earthquake        3.4%
  Wildfire          2.2%
```

Example — random, non-disaster photo:
```
--- Prediction ---
Disaster present: NO (91.7% confidence)
No disaster detected in this image.
```

## 5. Upload-a-photo web app

```bash
streamlit run app.py
```

Shows both stages live: a Stage 1 verdict (disaster / no disaster) and, if
a disaster is detected, a Stage 2 breakdown of which type it most likely is.

## Tuning

- **`NORMAL_PROB_THRESHOLD`** (in `predict.py` / `app.py`, default 0.5):
  lower it to make Stage 1 more trigger-happy about flagging disasters
  (fewer missed disasters, more false alarms); raise it for the opposite.
- **`TYPE_CONFIDENCE_THRESHOLD`** (default 0.40): minimum Stage 2 confidence
  before committing to a specific disaster type rather than reporting
  "disaster detected, type unclear."
- **`MAX_IMAGES_PER_CLASS`** in `train_binary.py`: increase for a more
  thorough Stage 1 model if you have the compute/time; set to `None` to use
  every available image.
- **Class imbalance in Stage 2**: if one disaster type has far more images
  than others, consider `class_weight=...` in `train_multiclass.py`'s
  `model.fit()`, computed via
  `sklearn.utils.class_weight.compute_class_weight`.
- **Accuracy**: swap `MobileNetV2` for a larger backbone like
  `EfficientNetB0` if you have a GPU, or unfreeze more base-model layers
  during fine-tuning.
