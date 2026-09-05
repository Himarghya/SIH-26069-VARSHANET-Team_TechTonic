"""
prepare_text_dataset.py

Downloads landlord/multilingual-disaster-response-messages from Kaggle,
auto-detects the CSV file(s) inside it, and builds a single binary-labeled
dataset:

    text   - a disaster-response message (English translation AND/OR the
             original native-language text, so the classifier sees more
             than one language during training)
    label  - 1 = disaster-related threat, 0 = not disaster-related

The source dataset (Figure Eight / Appen "Disaster Response Messages") uses
a 'related' column where: 1 = related to a real disaster/threat,
0 = not related, 2 = irrelevant/ambiguous. We map both 0 and 2 to
"not disaster related" (0), since only label 1 is a confirmed real threat.

Output: disaster_text_dataset.csv  (columns: text, label)
"""
import glob
from pathlib import Path

import pandas as pd
import kagglehub

ROOT_DIR = Path(__file__).resolve().parent
OUT_FILE = ROOT_DIR / "disaster_text_dataset.csv"


def find_candidate_csvs(root: str):
    return glob.glob(f"{root}/**/*.csv", recursive=True)


def main():
    print("Downloading dataset...", flush=True)
    dataset_path = kagglehub.dataset_download(
        "landlord/multilingual-disaster-response-messages"
    )
    print("Dataset at:", dataset_path, flush=True)

    csv_files = find_candidate_csvs(dataset_path)
    print(f"Found {len(csv_files)} CSV file(s): {csv_files}", flush=True)

    frames = []
    for f in csv_files:
        try:
            df = pd.read_csv(f)
        except Exception as e:
            print(f"Skipping {f}: {e}", flush=True)
            continue

        cols = {c.lower(): c for c in df.columns}
        if "message" not in cols or "related" not in cols:
            print(f"Skipping {f}: missing 'message' or 'related' column, has {list(df.columns)}", flush=True)
            continue

        message_col = cols["message"]
        related_col = cols["related"]
        original_col = cols.get("original")

        sub = df[[message_col, related_col]].copy()
        sub.columns = ["text", "related"]
        sub["label"] = (sub["related"] == 1).astype(int)
        frames.append(sub[["text", "label"]].dropna())

        # Also add the native-language 'original' text as extra rows with the
        # same label, so the model gets exposure to non-English phrasing.
        if original_col:
            orig = df[[original_col, related_col]].copy()
            orig.columns = ["text", "related"]
            orig["label"] = (orig["related"] == 1).astype(int)
            orig = orig.dropna()
            orig["text"] = orig["text"].astype(str).str.strip()
            orig = orig[orig["text"] != ""]
            frames.append(orig[["text", "label"]])

    if not frames:
        raise RuntimeError(
            "No usable CSV with 'message' and 'related' columns was found. "
            f"Inspect the downloaded files manually at: {dataset_path}"
        )

    full = pd.concat(frames, ignore_index=True)
    full["text"] = full["text"].astype(str).str.strip()
    full = full.drop_duplicates(subset=["text"])
    full = full[full["text"].str.len() > 0]

    print(f"\nFinal dataset size: {len(full)} rows", flush=True)
    print(full["label"].value_counts(), flush=True)

    full.to_csv(OUT_FILE, index=False)
    print(f"Saved to {OUT_FILE}", flush=True)


if __name__ == "__main__":
    main()
