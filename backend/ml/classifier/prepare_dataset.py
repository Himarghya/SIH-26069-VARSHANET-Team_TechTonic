"""
prepare_dataset.py

Downloads Kaggle datasets and reorganizes them into a binary folder
structure that torchvision.datasets.ImageFolder can load directly:

    data/
        disaster/   <- images from varpit94/disaster-images-dataset
        normal/     <- balanced mix of:
                       - puneet6060/intel-image-classification (scenes)
                       - tongpython/cat-and-dog (pets / animals)

WHY MULTIPLE DATASETS?
The varpit94 dataset only contains disaster photos (fire, flood, earthquake,
cyclone). A model trained only on that has never seen normal scenes or animals,
and will falsely flag ordinary photos like dogs/pets as disasters.

Pairing it with both everyday scenery AND pets/animals creates a robust,
realistic negative class.
"""
import os
import shutil
from pathlib import Path
from PIL import Image, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True

import kagglehub

BASE_DIR = Path(__file__).resolve().parent
OUT_DIR = BASE_DIR / "data"
DISASTER_DIR = OUT_DIR / "disaster"
NORMAL_DIR = OUT_DIR / "normal"
IMG_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

MAX_PER_CLASS = 4000


def find_images(root: Path, is_disaster: bool = False):
    for dirpath, _, filenames in os.walk(root):
        if is_disaster and "non_damage" in dirpath.lower():
            continue
        for fn in filenames:
            if Path(fn).suffix.lower() in IMG_EXTS:
                yield Path(dirpath) / fn


def collect(root: Path, dest: Path, limit: int, prefix: str = "", is_disaster: bool = False):
    dest.mkdir(parents=True, exist_ok=True)
    count = 0
    for img_path in find_images(root, is_disaster=is_disaster):
        if count >= limit:
            break
        target = dest / f"{prefix}{count:06d}{img_path.suffix.lower()}"
        try:
            with Image.open(img_path) as im:
                im.verify()
            shutil.copy(img_path, target)
            count += 1
        except Exception:
            pass
    print(f"Copied {count} images from {root.name} into {dest}")


def main():
    if NORMAL_DIR.exists():
        print(f"Cleaning existing {NORMAL_DIR}...")
        shutil.rmtree(NORMAL_DIR)
    if DISASTER_DIR.exists():
        print(f"Cleaning existing {DISASTER_DIR}...")
        shutil.rmtree(DISASTER_DIR)

    NORMAL_DIR.mkdir(parents=True, exist_ok=True)
    DISASTER_DIR.mkdir(parents=True, exist_ok=True)

    print("Downloading disaster dataset (positive class)...")
    disaster_path = kagglehub.dataset_download("varpit94/disaster-images-dataset")
    print("Disaster dataset at:", disaster_path)

    print("Downloading normal-scene dataset (negative class - scenes)...")
    scene_path = kagglehub.dataset_download("puneet6060/intel-image-classification")
    print("Normal-scene dataset at:", scene_path)

    print("Downloading pets/animals dataset (negative class - animals)...")
    animal_path = kagglehub.dataset_download("tongpython/cat-and-dog")
    print("Animal dataset at:", animal_path)

    # 1. Positive class: 4000 disaster photos
    collect(Path(disaster_path), DISASTER_DIR, MAX_PER_CLASS, prefix="disaster_", is_disaster=True)

    # 2. Negative class: 2000 normal scenes + 2000 cats/dogs
    half_cap = MAX_PER_CLASS // 2
    collect(Path(scene_path), NORMAL_DIR, half_cap, prefix="scene_", is_disaster=False)
    collect(Path(animal_path), NORMAL_DIR, half_cap, prefix="animal_", is_disaster=False)

    n_dis = len(list(DISASTER_DIR.glob("*")))
    n_norm = len(list(NORMAL_DIR.glob("*")))
    print(f"\nFinal dataset: disaster={n_dis} normal={n_norm}")
    print(f"Data ready at: {OUT_DIR.resolve()}")
    if n_dis == 0 or n_norm == 0:
        print("WARNING: one of the classes is empty. Check dataset paths/structure.")


if __name__ == "__main__":
    main()
