# Natural Disaster Image Classifier

Given an uploaded photo, this model predicts which **natural disaster** it shows —
Flood, Earthquake, Cyclone, Wildfire, or whatever classes exist in the dataset —
not just flood/non-flood.

It uses **transfer learning on MobileNetV2** (fast to train, works well on
a few thousand images per class) fine-tuned on the Kaggle
`varpit94/disaster-images-dataset` dataset.

## 1. Setup

```bash
pip install -r requirements.txt
```

You also need a Kaggle API token (`kaggle.json`) available so `kagglehub`
can download the dataset — see https://github.com/Kagglehub/kagglehub for
auth setup, or place `kaggle.json` in `~/.kaggle/`.

## 2. Train the model

```bash
python train.py
```

What it does:
1. Downloads the dataset via `kagglehub` and auto-detects the folder that
   contains one sub-folder per disaster class (e.g. `Flood/`, `Earthquake/`,
   `Cyclone/`, `Wildfire/`).
2. Builds an 80/10/10 train/val/test split.
3. Trains a classification head on top of a frozen, ImageNet-pretrained
   MobileNetV2 (Phase 1), then unfreezes the last ~30 layers and fine-tunes
   at a low learning rate (Phase 2).
4. Saves:
   - `disaster_classifier.keras` — the trained model
   - `class_names.json` — ordered list of class labels the model predicts
   - `training_history.png` — accuracy/loss curves

If your dataset is already downloaded locally and you don't want to
re-download, set an env var pointing straight at the class-folder root:

```bash
DATA_DIR=/path/to/dataset/root python train.py
```

## 3. Predict on a single photo (CLI)

```bash
python predict.py path/to/photo.jpg
```

Example output:
```
--- Prediction ---
Disaster type: Flood
Confidence: 92.3%

All class scores:
  Flood            92.3%
  Cyclone           4.1%
  Earthquake        2.0%
  Wildfire          1.6%
```

If the top score is below the confidence threshold (default 45%), the
script flags it as a low-confidence guess rather than stating it plainly —
useful for photos that don't clearly show a disaster at all.

## 4. Upload-a-photo web app

```bash
streamlit run app.py
```

This opens a browser page where a user can drag-and-drop or upload a
photo and instantly see the predicted disaster type plus a confidence
breakdown across all classes.

## Notes / tuning tips

- **Class imbalance**: if one disaster type has far more images than
  others, consider adding `class_weight=...` to `model.fit()` in
  `train.py`, computed via
  `sklearn.utils.class_weight.compute_class_weight`.
- **More accuracy**: increase `FINE_TUNE_EPOCHS`, unfreeze more base-model
  layers, or swap `MobileNetV2` for a larger backbone like `EfficientNetB0`
  if you have a GPU.
- **"Not a disaster" case**: if you want the model to explicitly say
  "no disaster detected" for random photos (selfies, landscapes, etc.),
  add a `Normal`/`None` class folder with everyday photos to the training
  set — right now the model always picks its closest matching disaster
  class, tempered only by the confidence threshold in `predict.py`/`app.py`.
