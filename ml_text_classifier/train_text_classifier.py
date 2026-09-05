"""
train_text_classifier.py

Trains a binary text classifier:
    1 = disaster-related threat
    0 = not disaster-related

Uses TF-IDF (word n-grams) + Logistic Regression: fast to train on CPU,
no GPU needed, works well as a baseline even on multilingual text.

Run prepare_text_dataset.py first to produce disaster_text_dataset.csv.

Output: text_classifier.joblib  (fitted vectorizer + classifier pipeline)
"""
from pathlib import Path
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix

ROOT_DIR = Path(__file__).resolve().parent
DATA_FILE = ROOT_DIR / "disaster_text_dataset.csv"
MODEL_OUT = ROOT_DIR / "text_classifier.joblib"


def main():
    print(f"Loading data from {DATA_FILE}...", flush=True)
    df = pd.read_csv(DATA_FILE)
    df["text"] = df["text"].fillna("").astype(str)
    
    X_train, X_val, y_train, y_val = train_test_split(
        df["text"], df["label"], test_size=0.15, random_state=42, stratify=df["label"]
    )

    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            max_features=50000,
            ngram_range=(1, 2),
            analyzer="word",
            min_df=2,
            sublinear_tf=True,
        )),
        ("clf", LogisticRegression(
            max_iter=1000,
            class_weight="balanced",
            C=1.0,
        )),
    ])

    print("Training TF-IDF + Logistic Regression model...", flush=True)
    pipeline.fit(X_train, y_train)

    preds = pipeline.predict(X_val)
    print("\nValidation report:", flush=True)
    print(classification_report(y_val, preds, target_names=["not_disaster", "disaster"]), flush=True)
    print("Confusion matrix:", flush=True)
    print(confusion_matrix(y_val, preds), flush=True)

    joblib.dump(pipeline, MODEL_OUT)
    print(f"\nSaved model to {MODEL_OUT}", flush=True)


if __name__ == "__main__":
    main()
