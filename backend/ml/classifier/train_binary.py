"""
train_binary.py
----------------
STAGE 1 of the pipeline. Trains a binary classifier that decides whether a
photo shows a natural disaster AT ALL (Disaster) or an everyday, non-disaster
scene (Normal).

Positive class ("Disaster"): every image in varpit94/disaster-images-dataset,
regardless of which disaster type it is (Flood, Earthquake, Cyclone,
Wildfire, ...) — they all get relabeled to a single "Disaster" class.

Negative class ("Normal"): puneet6060/intel-image-classification, which has
everyday scenes (buildings, forest, glacier, mountain, sea, street) with no
disasters — used as the "not a disaster" examples.

Usage:
    python train_binary.py
Outputs:
    disaster_detector.keras           -> trained binary model
    training_history_binary.png       -> accuracy/loss curves
"""

import os
import shutil
import pathlib

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import matplotlib.pyplot as plt

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
INITIAL_EPOCHS = 8
FINE_TUNE_EPOCHS = 6
SEED = 42

# Cap how many images we pull from each source so the two classes stay
# roughly balanced and training stays fast. Set to None to use everything.
MAX_IMAGES_PER_CLASS = 3000

STAGING_DIR = "binary_dataset"  # Disaster/ and Normal/ subfolders go here


def _find_class_root(root: pathlib.Path) -> pathlib.Path:
    """Find the directory whose immediate children are the class folders."""
    candidates = [root] + [p for p in root.rglob("*") if p.is_dir()]
    for candidate in candidates:
        subdirs = [d for d in candidate.iterdir() if d.is_dir()]
        if len(subdirs) >= 2:
            has_images = any(
                f.suffix.lower() in (".jpg", ".jpeg", ".png")
                for d in subdirs
                for f in d.glob("*")
            )
            if has_images:
                return candidate
    raise RuntimeError(f"Could not locate class folders under {root}")


def _collect_images(class_root: pathlib.Path, limit: int | None):
    """Yield image file paths from all sub-folders of class_root, capped."""
    count = 0
    for d in class_root.iterdir():
        if not d.is_dir():
            continue
        for f in d.glob("*"):
            if f.suffix.lower() not in (".jpg", ".jpeg", ".png"):
                continue
            yield f
            count += 1
            if limit is not None and count >= limit:
                return


def build_binary_dataset() -> str:
    """Downloads both source datasets and materializes a
    binary_dataset/Disaster and binary_dataset/Normal folder of symlinks (with copy fallback)."""
    import kagglehub

    print("Downloading disaster images dataset...")
    disaster_path = kagglehub.dataset_download("varpit94/disaster-images-dataset")
    disaster_root = _find_class_root(pathlib.Path(disaster_path))

    print("Downloading normal/everyday scenes dataset...")
    normal_path = kagglehub.dataset_download("puneet6060/intel-image-classification")
    normal_root = _find_class_root(pathlib.Path(normal_path))

    staging = pathlib.Path(STAGING_DIR)
    if staging.exists():
        shutil.rmtree(staging)
    (staging / "Disaster").mkdir(parents=True)
    (staging / "Normal").mkdir(parents=True)

    def _link_or_copy(src: pathlib.Path, dst: pathlib.Path):
        try:
            os.symlink(src.resolve(), dst)
        except OSError:
            shutil.copy2(src.resolve(), dst)

    print("Linking/staging Disaster images...")
    for i, f in enumerate(_collect_images(disaster_root, MAX_IMAGES_PER_CLASS)):
        _link_or_copy(f, staging / "Disaster" / f"d_{i}{f.suffix}")

    print("Linking/staging Normal images...")
    for i, f in enumerate(_collect_images(normal_root, MAX_IMAGES_PER_CLASS)):
        _link_or_copy(f, staging / "Normal" / f"n_{i}{f.suffix}")

    n_disaster = len(list((staging / "Disaster").iterdir()))
    n_normal = len(list((staging / "Normal").iterdir()))
    print(f"Disaster images: {n_disaster} | Normal images: {n_normal}")

    return str(staging)


def build_datasets(data_dir: str):
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="training",
        seed=SEED,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="binary",
    )
    val_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="validation",
        seed=SEED,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="binary",
    )

    class_names = train_ds.class_names  # e.g. ['Disaster', 'Normal']
    print("Class order (0/1):", class_names)

    val_batches = tf.data.experimental.cardinality(val_ds)
    test_ds = val_ds.take(val_batches // 2)
    val_ds = val_ds.skip(val_batches // 2)

    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.prefetch(AUTOTUNE)
    val_ds = val_ds.prefetch(AUTOTUNE)
    test_ds = test_ds.prefetch(AUTOTUNE)

    return train_ds, val_ds, test_ds, class_names


def build_model():
    data_augmentation = tf.keras.Sequential(
        [
            layers.RandomFlip("horizontal"),
            layers.RandomRotation(0.1),
            layers.RandomZoom(0.1),
            layers.RandomContrast(0.1),
        ],
        name="data_augmentation",
    )

    base_model = MobileNetV2(
        input_shape=IMG_SIZE + (3,), include_top=False, weights="imagenet"
    )
    base_model.trainable = False

    inputs = tf.keras.Input(shape=IMG_SIZE + (3,))
    x = data_augmentation(inputs)
    x = preprocess_input(x)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(64, activation="relu")(x)
    outputs = layers.Dense(1, activation="sigmoid")(x)

    model = models.Model(inputs, outputs)
    return model, base_model


def plot_history(h1, h2, out_path="training_history_binary.png"):
    acc = h1.history["accuracy"] + h2.history["accuracy"]
    val_acc = h1.history["val_accuracy"] + h2.history["val_accuracy"]
    loss = h1.history["loss"] + h2.history["loss"]
    val_loss = h1.history["val_loss"] + h2.history["val_loss"]

    fig, axes = plt.subplots(1, 2, figsize=(12, 4))
    axes[0].plot(acc, label="train acc")
    axes[0].plot(val_acc, label="val acc")
    axes[0].set_title("Binary Detector Accuracy")
    axes[0].legend()

    axes[1].plot(loss, label="train loss")
    axes[1].plot(val_loss, label="val loss")
    axes[1].set_title("Binary Detector Loss")
    axes[1].legend()

    plt.tight_layout()
    plt.savefig(out_path)
    print(f"Saved training curves to {out_path}")


def main():
    data_dir = os.environ.get("BINARY_DATA_DIR") or build_binary_dataset()
    train_ds, val_ds, test_ds, class_names = build_datasets(data_dir)

    # class_names[0] should be 'Disaster' alphabetically before 'Normal' —
    # verify, since predict.py assumes index 0 = Disaster.
    assert class_names == ["Disaster", "Normal"], (
        f"Unexpected class order {class_names}; predict.py assumes "
        "['Disaster', 'Normal']"
    )

    model, base_model = build_model()
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="binary_crossentropy",
        metrics=["accuracy"],
    )
    model.summary()

    print("\n--- Phase 1: training the classification head ---")
    history_1 = model.fit(train_ds, validation_data=val_ds, epochs=INITIAL_EPOCHS)

    print("\n--- Phase 2: fine-tuning top layers of MobileNetV2 ---")
    base_model.trainable = True
    for layer in base_model.layers[:-30]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
        loss="binary_crossentropy",
        metrics=["accuracy"],
    )

    total_epochs = INITIAL_EPOCHS + FINE_TUNE_EPOCHS
    history_2 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=total_epochs,
        initial_epoch=history_1.epoch[-1] + 1,
    )

    print("\n--- Evaluating on held-out test set ---")
    test_loss, test_acc = model.evaluate(test_ds)
    print(f"Test accuracy: {test_acc:.4f}  |  Test loss: {test_loss:.4f}")

    model.save("disaster_detector.keras")
    print("Saved model -> disaster_detector.keras")

    plot_history(history_1, history_2)


if __name__ == "__main__":
    main()
