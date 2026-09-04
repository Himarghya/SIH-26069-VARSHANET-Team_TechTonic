"""
train.py
--------
Trains a multi-class disaster image classifier (Flood, Earthquake, Cyclone,
Wildfire, ... — whatever classes exist as sub-folders in the dataset) using
transfer learning on MobileNetV2.

Dataset: varpit94/disaster-images-dataset (Kaggle)
The dataset is organized as:
    <root>/<some_folder>/<ClassName>/<image files>

Usage:
    python train.py
Outputs:
    disaster_classifier.keras   -> trained model
    class_names.json            -> ordered list of class labels
    training_history.png        -> accuracy/loss curves
"""

import os
import json
import pathlib

import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import matplotlib.pyplot as plt

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
INITIAL_EPOCHS = 10
FINE_TUNE_EPOCHS = 8
SEED = 42


def download_dataset() -> str:
    """Downloads the Kaggle dataset and returns the local path to the
    directory that actually contains the class sub-folders."""
    # Check pre-structured project dataset first if available
    script_dir = os.path.dirname(os.path.abspath(__file__))
    prep_dir = os.path.join(script_dir, "..", "data", "cdd_dataset")
    if os.path.exists(prep_dir) and len(os.listdir(prep_dir)) >= 2:
        print("Found prepared CDD class dataset at:", os.path.abspath(prep_dir))
        return os.path.abspath(prep_dir)

    import kagglehub

    path = kagglehub.dataset_download("varpit94/disaster-images-dataset")
    print("Path to dataset files:", path)

    # The kaggle archive sometimes nests everything inside one more folder.
    # Walk the tree and find the first directory that itself contains only
    # sub-directories (i.e. the class folders), and has at least 2 classes.
    root = pathlib.Path(path)
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
                return str(candidate)

    raise RuntimeError(
        f"Could not auto-locate the class folders under {path}. "
        "Please inspect the folder structure manually and set DATA_DIR."
    )


def build_datasets(data_dir: str):
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="training",
        seed=SEED,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
    )
    val_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="validation",
        seed=SEED,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
    )

    class_names = train_ds.class_names
    print("Detected classes:", class_names)

    # Split validation into val + test (half/half)
    val_batches = tf.data.experimental.cardinality(val_ds)
    test_ds = val_ds.take(val_batches // 2)
    val_ds = val_ds.skip(val_batches // 2)

    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.prefetch(buffer_size=AUTOTUNE)
    test_ds = test_ds.prefetch(buffer_size=AUTOTUNE)

    return train_ds, val_ds, test_ds, class_names


def build_model(num_classes: int) -> tf.keras.Model:
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
    base_model.trainable = False  # freeze for initial training

    inputs = tf.keras.Input(shape=IMG_SIZE + (3,))
    x = data_augmentation(inputs)
    x = preprocess_input(x)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = models.Model(inputs, outputs)
    return model, base_model


def plot_history(history_1, history_2, out_path="training_history.png"):
    acc = history_1.history["accuracy"] + history_2.history["accuracy"]
    val_acc = history_1.history["val_accuracy"] + history_2.history["val_accuracy"]
    loss = history_1.history["loss"] + history_2.history["loss"]
    val_loss = history_1.history["val_loss"] + history_2.history["val_loss"]

    fig, axes = plt.subplots(1, 2, figsize=(12, 4))
    axes[0].plot(acc, label="train acc")
    axes[0].plot(val_acc, label="val acc")
    axes[0].set_title("Accuracy")
    axes[0].legend()

    axes[1].plot(loss, label="train loss")
    axes[1].plot(val_loss, label="val loss")
    axes[1].set_title("Loss")
    axes[1].legend()

    plt.tight_layout()
    plt.savefig(out_path)
    print(f"Saved training curves to {out_path}")


def main():
    data_dir = os.environ.get("DATA_DIR") or download_dataset()
    train_ds, val_ds, test_ds, class_names = build_datasets(data_dir)

    model, base_model = build_model(num_classes=len(class_names))
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.summary()

    print("\n--- Phase 1: training the classification head ---")
    history_1 = model.fit(
        train_ds, validation_data=val_ds, epochs=INITIAL_EPOCHS
    )

    print("\n--- Phase 2: fine-tuning top layers of MobileNetV2 ---")
    base_model.trainable = True
    # Freeze all but the last ~30 layers so fine-tuning is fast & stable
    for layer in base_model.layers[:-30]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
        loss="categorical_crossentropy",
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

    model.save("disaster_classifier.keras")
    with open("class_names.json", "w") as f:
        json.dump(class_names, f, indent=2)
    print("Saved model -> disaster_classifier.keras")
    print("Saved class labels -> class_names.json")

    plot_history(history_1, history_2)


if __name__ == "__main__":
    main()
