# Disaster vs. Not-Disaster Image Classifier

## Why this needed a second dataset

`varpit94/disaster-images-dataset` only contains disaster photos (fire, flood,
earthquake, cyclone). It has **no "not a disaster" images at all**. Training
only on it — which is likely what caused the dog-photo false positive — gives
the model no examples of ordinary scenes to contrast against, so it has no
real decision boundary.

To fix that, this setup pairs it with `puneet6060/intel-image-classification`
(buildings, forest, glacier, mountain, sea, street) as the **negative /
"normal"** class — realistic everyday photos with no disaster content.

## Setup

```bash
pip install -r requirements.txt
```

You need a Kaggle API token for `kagglehub` to download datasets:
place `kaggle.json` at `~/.kaggle/kaggle.json` (get it from
Kaggle → Account → Create New API Token), or set `KAGGLE_USERNAME` /
`KAGGLE_KEY` environment variables.

## Run

```bash
python prepare_dataset.py   # downloads both datasets, builds data/disaster + data/normal
python train.py             # fine-tunes ResNet18, saves disaster_binary_classifier.pt
python infer.py path/to/test_image.jpg --threshold 0.85
```

`train.py` prints a classification report and confusion matrix on a held-out
validation split at the end, so you can see precision/recall per class before
trusting it on real uploads.

## Tuning false positives / false negatives

`infer.py`'s `--threshold` controls how confident the model must be before
saying "DISASTER". Test types of predictable false positives from your
VarshaNet fox/dog case in mind:

- Getting **too many false positives** (normal photos flagged as disaster) →
  raise the threshold (e.g. `0.9`–`0.95`).
- Getting **too many false negatives** (real disaster photos missed) →
  lower it (e.g. `0.6`–`0.7`).

Start at `0.85` and adjust based on your validation report.

## Integrating into your existing pipeline

`infer.py`'s `analyze_pil_image(pil_img, model, class_names, threshold)`
returns the same shape of result your `image_analyzer.py` expects
(`verdict`, `disaster_prob`, `class_probs`), so it can be dropped in as your
Stage 1 binary gate, with your existing multiclass model (Fire/Flood/
Landslide) continuing to run as Stage 2 only when Stage 1 says `DISASTER`.
