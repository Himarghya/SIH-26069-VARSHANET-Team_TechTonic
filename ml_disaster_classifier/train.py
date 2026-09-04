"""
train.py

Fine-tunes a ResNet18 (ImageNet-pretrained) into a binary classifier:
    "disaster"  vs  "normal"

Run prepare_dataset.py first so ./data/disaster and ./data/normal exist.

Outputs:
    disaster_binary_classifier.pt   - model weights
    class_names.json                - ["disaster", "normal"] index mapping
"""
import copy
import json
import random
from pathlib import Path

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms, models
from sklearn.metrics import classification_report, confusion_matrix
from PIL import Image, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True

SEED = 42
random.seed(SEED)
torch.manual_seed(SEED)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
MODEL_OUT = BASE_DIR / "disaster_binary_classifier.pt"
LABELS_OUT = BASE_DIR / "class_names.json"
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 15
LR = 1e-4
VAL_SPLIT = 0.15
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

train_tf = transforms.Compose([
    transforms.RandomResizedCrop(IMG_SIZE, scale=(0.8, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(0.15, 0.15, 0.1),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])
val_tf = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(IMG_SIZE),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])


def build_dataloaders():
    full_ds = datasets.ImageFolder(DATA_DIR)
    class_names = full_ds.classes  # alphabetical -> ['disaster', 'normal']
    print(f"Detected classes: {class_names}")

    n_val = int(len(full_ds) * VAL_SPLIT)
    n_train = len(full_ds) - n_val
    train_subset, val_subset = random_split(
        full_ds, [n_train, n_val], generator=torch.Generator().manual_seed(SEED)
    )

    # Apply different transforms to train vs val by wrapping copies of the dataset.
    train_ds = copy.copy(full_ds)
    train_ds.transform = train_tf
    val_ds = copy.copy(full_ds)
    val_ds.transform = val_tf
    train_subset.dataset = train_ds
    val_subset.dataset = val_ds

    labels = [full_ds.samples[i][1] for i in range(len(full_ds))]
    class_counts = [labels.count(i) for i in range(len(class_names))]
    weights = [len(labels) / c for c in class_counts]
    class_weights = torch.tensor(weights, dtype=torch.float32)
    print(f"Class counts: {dict(zip(class_names, class_counts))}")

    # num_workers=0 for safe Windows multiprocessing compatibility
    train_loader = DataLoader(train_subset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_subset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)
    return train_loader, val_loader, class_names, class_weights


def build_model(num_classes=2):
    model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
    # Freeze early layers, fine-tune the last block + classifier head only.
    for p in model.parameters():
        p.requires_grad = False
    for p in model.layer4.parameters():
        p.requires_grad = True
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    return model.to(DEVICE)


def train():
    print(f"Training on device: {DEVICE}")
    train_loader, val_loader, class_names, class_weights = build_dataloaders()
    model = build_model(len(class_names))
    criterion = nn.CrossEntropyLoss(weight=class_weights.to(DEVICE))
    optimizer = optim.Adam([p for p in model.parameters() if p.requires_grad], lr=LR)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode="max", patience=2, factor=0.5)

    best_acc = 0.0
    best_state = None
    all_preds, all_labels = [], []

    for epoch in range(1, EPOCHS + 1):
        model.train()
        running_loss = 0.0
        for imgs, labels in train_loader:
            imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
            optimizer.zero_grad()
            out = model(imgs)
            loss = criterion(out, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * imgs.size(0)
        train_loss = running_loss / len(train_loader.dataset)

        model.eval()
        correct, total = 0, 0
        epoch_preds, epoch_labels = [], []
        with torch.no_grad():
            for imgs, labels in val_loader:
                imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
                out = model(imgs)
                preds = out.argmax(1)
                correct += (preds == labels).sum().item()
                total += labels.size(0)
                epoch_preds.extend(preds.cpu().tolist())
                epoch_labels.extend(labels.cpu().tolist())
        val_acc = correct / total
        scheduler.step(val_acc)
        print(f"Epoch {epoch}/{EPOCHS} - train_loss={train_loss:.4f} val_acc={val_acc:.4f}", flush=True)

        if val_acc > best_acc:
            best_acc = val_acc
            best_state = copy.deepcopy(model.state_dict())
            all_preds, all_labels = epoch_preds, epoch_labels

    model.load_state_dict(best_state)
    print(f"\nBest val accuracy: {best_acc:.4f}\n")
    print(classification_report(all_labels, all_preds, target_names=class_names))
    print("Confusion matrix:")
    print(confusion_matrix(all_labels, all_preds))

    torch.save(model.state_dict(), MODEL_OUT)
    with open(LABELS_OUT, "w") as f:
        json.dump(class_names, f, indent=2)
    print(f"\nSaved model to {MODEL_OUT}")
    print(f"Saved class labels to {LABELS_OUT}")


if __name__ == "__main__":
    train()
