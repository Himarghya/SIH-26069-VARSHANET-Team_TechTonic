"""
train_disaster_text_transformer.py
-----------------------------------
TEXT-based disaster classifier, v2: fine-tunes a pretrained multilingual
transformer (distilbert-base-multilingual-cased) instead of TF-IDF + Logistic
Regression. Same task: "is this text disaster-related, or not?" — better
accuracy on multilingual/noisy text, at the cost of needing more compute
(ideally a GPU) and longer training time.

IMPORTANT — isolation from your other models:
- This saves to its own folder: TEXT_TRANSFORMER_DIR (below).
- It does NOT touch text_disaster_model/ (the TF-IDF version) or whatever
  folder your separate disaster-IMAGE-classification model uses.
- All function/variable names here are distinct from the TF-IDF script
  (predict_disaster_text vs predict_text, etc.) so you can safely import
  or paste both into the same notebook without one overwriting the other.

Install first:
    pip install transformers datasets torch scikit-learn kagglehub accelerate
"""

import os
import re
import glob
import numpy as np
import pandas as pd
import torch

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, classification_report

from datasets import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
    pipeline,
)

import kagglehub

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------
BASE_MODEL_NAME = "distilbert-base-multilingual-cased"
TEXT_TRANSFORMER_DIR = "text_disaster_transformer_model"  # own folder, don't reuse elsewhere
NUM_EPOCHS = 3
BATCH_SIZE = 16
MAX_LENGTH = 128
LEARNING_RATE = 2e-5

os.makedirs(TEXT_TRANSFORMER_DIR, exist_ok=True)


# ---------------------------------------------------------------------------
# STEP 1 — Download dataset
# ---------------------------------------------------------------------------
def download_disaster_dataset():
    path = kagglehub.dataset_download(
        "landlord/multilingual-disaster-response-messages"
    )
    print("Path to dataset files:", path)
    return path


# ---------------------------------------------------------------------------
# STEP 2 — Load CSV, show columns
# ---------------------------------------------------------------------------
def load_disaster_dataframe(dataset_path):
    csv_files = glob.glob(os.path.join(dataset_path, "**", "*.csv"), recursive=True)
    if not csv_files:
        raise FileNotFoundError(
            f"No CSV files found under {dataset_path}. "
            f"Inspect the folder with os.listdir() and adjust this function."
        )

    print(f"\nFound {len(csv_files)} CSV file(s):")
    for f in csv_files:
        print(" -", f)

    main_csv = max(csv_files, key=os.path.getsize)
    print(f"\nLoading main file: {main_csv}")
    df = pd.read_csv(main_csv)

    print("\nColumns found:", list(df.columns))
    print("Shape:", df.shape)
    print(df.head(3))
    return df


# ---------------------------------------------------------------------------
# STEP 3 — Build binary labels (same convention as the TF-IDF version:
# 'related' column, 2/"unsure" folded into 1). Adjust column names if the
# printout in step 2 shows different ones.
# ---------------------------------------------------------------------------
def prepare_disaster_labels(df, text_col=None, label_col=None):
    if text_col is None:
        for candidate in ["message", "text", "Message", "Text"]:
            if candidate in df.columns:
                text_col = candidate
                break
    if label_col is None:
        for candidate in ["related", "label", "target", "Related"]:
            if candidate in df.columns:
                label_col = candidate
                break

    if text_col is None or label_col is None:
        raise ValueError(
            f"Could not auto-detect text/label columns. "
            f"Available columns: {list(df.columns)}\n"
            f"Call prepare_disaster_labels(df, text_col='...', label_col='...') explicitly."
        )

    print(f"\nUsing text_col='{text_col}', label_col='{label_col}'")

    df = df[[text_col, label_col]].dropna()
    df = df.rename(columns={text_col: "text", label_col: "label"})
    df["label"] = df["label"].apply(lambda x: 1 if float(x) != 0 else 0)

    print("Label distribution:\n", df["label"].value_counts())
    return df


def light_clean(text):
    # Transformers handle raw-ish text well; only strip URLs and collapse whitespace.
    text = str(text)
    text = re.sub(r"http\S+|www\S+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


# ---------------------------------------------------------------------------
# STEP 4 — Tokenize + build HF datasets
# ---------------------------------------------------------------------------
def build_hf_datasets(df, tokenizer):
    df["text"] = df["text"].apply(light_clean)
    df = df[df["text"].str.len() > 0]

    train_df, test_df = train_test_split(
        df, test_size=0.2, random_state=42, stratify=df["label"]
    )

    train_ds = Dataset.from_pandas(train_df[["text", "label"]], preserve_index=False)
    test_ds = Dataset.from_pandas(test_df[["text", "label"]], preserve_index=False)

    def tokenize_fn(batch):
        return tokenizer(
            batch["text"], truncation=True, padding="max_length", max_length=MAX_LENGTH
        )

    train_ds = train_ds.map(tokenize_fn, batched=True)
    test_ds = test_ds.map(tokenize_fn, batched=True)

    train_ds = train_ds.rename_column("label", "labels")
    test_ds = test_ds.rename_column("label", "labels")

    train_ds.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])
    test_ds.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])

    return train_ds, test_ds


def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=1)
    return {
        "accuracy": accuracy_score(labels, preds),
        "f1": f1_score(labels, preds),
    }


# ---------------------------------------------------------------------------
# STEP 5 — Fine-tune
# ---------------------------------------------------------------------------
def fine_tune_disaster_transformer(train_ds, test_ds):
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(
        BASE_MODEL_NAME, num_labels=2
    )

    training_args = TrainingArguments(
        output_dir=os.path.join(TEXT_TRANSFORMER_DIR, "checkpoints"),
        num_train_epochs=NUM_EPOCHS,
        per_device_train_batch_size=BATCH_SIZE,
        per_device_eval_batch_size=BATCH_SIZE,
        learning_rate=LEARNING_RATE,
        eval_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        logging_steps=50,
        fp16=torch.cuda.is_available(),
        report_to="none",
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_ds,
        eval_dataset=test_ds,
        compute_metrics=compute_metrics,
    )

    trainer.train()
    metrics = trainer.evaluate()
    print("\nFinal eval metrics:", metrics)

    preds = trainer.predict(test_ds)
    y_pred = np.argmax(preds.predictions, axis=1)
    y_true = preds.label_ids
    print("\nClassification report:\n", classification_report(y_true, y_pred))

    return trainer, tokenizer, model


# ---------------------------------------------------------------------------
# STEP 6 — Save (own folder, own filenames)
# ---------------------------------------------------------------------------
def save_disaster_transformer(model, tokenizer):
    final_dir = os.path.join(TEXT_TRANSFORMER_DIR, "final_model")
    model.save_pretrained(final_dir)
    tokenizer.save_pretrained(final_dir)
    print(f"\nSaved fine-tuned model + tokenizer to {final_dir}")
    return final_dir


# ---------------------------------------------------------------------------
# STEP 7 — Inference
# ---------------------------------------------------------------------------
def load_disaster_text_pipeline():
    final_dir = os.path.join(TEXT_TRANSFORMER_DIR, "final_model")
    return pipeline("text-classification", model=final_dir, tokenizer=final_dir)


def predict_disaster_text(text, clf_pipeline=None):
    """
    Returns a human-readable verdict string. Loads the saved fine-tuned
    model automatically if clf_pipeline isn't passed in.
    """
    if clf_pipeline is None:
        clf_pipeline = load_disaster_text_pipeline()

    cleaned = light_clean(text)
    if not cleaned:
        return "Not a disaster-related text."

    result = clf_pipeline(cleaned, truncation=True, max_length=MAX_LENGTH)[0]
    label = result["label"]  # e.g. "LABEL_0" or "LABEL_1"
    score = result["score"]

    is_disaster = label.endswith("1")
    if is_disaster:
        return f"This IS disaster-related. (confidence: {score:.2f})"
    else:
        return f"Not a disaster-related text. (confidence: {score:.2f})"


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    dataset_path = download_disaster_dataset()
    df = load_disaster_dataframe(dataset_path)
    df = prepare_disaster_labels(df)  # edit text_col / label_col here if needed

    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_NAME)
    train_ds, test_ds = build_hf_datasets(df, tokenizer)

    trainer, tokenizer, model = fine_tune_disaster_transformer(train_ds, test_ds)
    save_disaster_transformer(model, tokenizer)

    clf_pipeline = load_disaster_text_pipeline()
    
    test_samples = [
        "Major flood in Bhopal, water level rising rapidly and streets submerged, please send rescue boats!",
        "We desperately need food and clean drinking water after the severe earthquake collapsed buildings in our area.",
        "Just had a great dinner with family at a restaurant in the city.",
        "Beautiful sunny morning for a walk in the park with my dog.",
        "Heavy rain expected this afternoon, don't forget to take an umbrella when going to the office.",
        "Strong cyclone winds tore down power lines and trees blocking the main highway."
    ]
    print("\n--- Test Sentences Evaluation ---")
    for sample in test_samples:
        print(f"Input: {sample}")
        print(f"Output: {predict_disaster_text(sample, clf_pipeline)}\n")
