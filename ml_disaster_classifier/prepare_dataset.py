"""
prepare_dataset.py

Downloads two Kaggle datasets and reorganizes them into a binary folder
structure that torchvision.datasets.ImageFolder can load directly:

    data/
        disaster/   <- images from varpit94/disaster-images-dataset
        normal/     <- images from puneet6060/intel-image-classification

WHY TWO DATASETS?
The varpit94 dataset only contains disaster photos (fire, flood, earthquake,
cyclone). It has no "not a disaster" images. A model trained only on that
learns nothing about what a normal scene looks like, and will guess randomly
(or always say "disaster") on ordinary photos like pets, people, or streets.

The intel-image-classification dataset (buildings, forest, glacier, mountain,
sea, street) provides realistic, everyday, non-disaster photos as the
negative class, which is required for a real binary classifier.

Requires a Kaggle API token at ~/.kaggle/kaggle.json (or KAGGLE_USERNAME /
KAGGLE_KEY env vars) for kagglehub to authenticate.
"""
import os
import shutil
from pathlib import Path

import kagglehub

BASE_DIR = Path(__file__).resolve().parent
OUT_DIR = BASE_DIR / "data"
DISASTER_DIR = OUT_DIR / "disaster"
NORMAL_DIR = OUT_DIR / "normal"
IMG_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

# Cap per-class image count so the two classes stay roughly balanced and
# training doesn't take forever on a laptop GPU/CPU.
MAX_PER_CLASS = 4000


def find_images(root: Path, is_disaster: bool = False):
    for dirpath, _, filenames in os.walk(root):
        if is_disaster and "non_damage" in dirpath.lower():
            continue
        for fn in filenames:
            if Path(fn).suffix.lower() in IMG_EXTS:
                yield Path(dirpath) / fn


def collect(root: Path, dest: Path, limit: int, is_disaster: bool = False):
    dest.mkdir(parents=True, exist_ok=True)
    count = 0
    for img_path in find_images(root, is_disaster=is_disaster):
        if count >= limit:
            break
        target = dest / f"{count:06d}{img_path.suffix.lower()}"
        try:
            shutil.copy(img_path, target)
            count += 1
        except Exception as e:
            print(f"Skipping {img_path}: {e}")
    print(f"Copied {count} images into {dest}")


def main():
    print("Downloading disaster dataset (positive class)...")
    disaster_path = kagglehub.dataset_download("varpit94/disaster-images-dataset")
    print("Disaster dataset at:", disaster_path)

    print("Downloading normal-scene dataset (negative class)...")
    normal_path = kagglehub.dataset_download("puneet6060/intel-image-classification")
    print("Normal-scene dataset at:", normal_path)

    collect(Path(disaster_path), DISASTER_DIR, MAX_PER_CLASS, is_disaster=True)
    collect(Path(normal_path), NORMAL_DIR, MAX_PER_CLASS, is_disaster=False)

    # Also include diverse negative examples: CDD Non_Damage Wildlife & Human portraits
    cdd_wildlife = Path(disaster_path) / "Comprehensive Disaster Dataset(CDD)" / "Non_Damage" / "Non_Damage_Wildlife_Forest"
    cdd_human = Path(disaster_path) / "Comprehensive Disaster Dataset(CDD)" / "Non_Damage" / "human"
    if cdd_wildlife.exists():
        collect(cdd_wildlife, NORMAL_DIR, 2500, is_disaster=False)
    if cdd_human.exists():
        collect(cdd_human, NORMAL_DIR, 500, is_disaster=False)

    n_dis = len(list(DISASTER_DIR.glob("*")))
    n_norm = len(list(NORMAL_DIR.glob("*")))
    print(f"\nFinal dataset: disaster={n_dis} normal={n_norm}")
    print(f"Data ready at: {OUT_DIR.resolve()}")
    if n_dis == 0 or n_norm == 0:
        print("WARNING: one of the classes is empty. Check dataset paths/structure.")


if __name__ == "__main__":
    main()
