"""
train_torch.py
--------------
PyTorch implementation of the MobileNet Disaster Classifier.
Trains directly on the Kaggle Comprehensive Disaster Dataset (CDD)
or pre-structured class directories.

Usage:
    python train_torch.py
Outputs:
    disaster_classifier_pytorch.pt   -> trained model weights
    class_names.json                 -> ordered list of class labels
    training_history_torch.png       -> loss and accuracy curves
"""

import os
import json
import time
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms, models

DATA_DIR = os.environ.get("DATA_DIR")
if not DATA_DIR:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    DATA_DIR = os.path.abspath(os.path.join(script_dir, "..", "data", "cdd_dataset"))

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 18
LR = 1e-4

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using compute device: {device}")
print(f"Loading dataset from: {DATA_DIR}")

transform_train = transforms.Compose([
    transforms.Resize(IMG_SIZE),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.1, contrast=0.1),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

transform_val = transforms.Compose([
    transforms.Resize(IMG_SIZE),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

full_dataset = datasets.ImageFolder(DATA_DIR, transform=transform_train)
class_names = full_dataset.classes
num_classes = len(class_names)
print(f"Detected {num_classes} classes: {class_names}")

train_size = int(0.8 * len(full_dataset))
val_size = len(full_dataset) - train_size
train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

# Build MobileNetV2 Transfer Learning Architecture
weights = models.MobileNet_V2_Weights.DEFAULT
model = models.mobilenet_v2(weights=weights)

# Replace classification head
in_features = model.classifier[1].in_features
model.classifier = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(in_features, 128),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(128, num_classes)
)
model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LR)
scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=EPOCHS)

print(f"\nStarting Training ({EPOCHS} Epochs)...")
history = {"train_loss": [], "train_acc": [], "val_loss": [], "val_acc": []}

for epoch in range(1, EPOCHS + 1):
    model.train()
    running_loss, correct, total = 0.0, 0, 0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * images.size(0)
        _, preds = torch.max(outputs, 1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)

    scheduler.step()
    train_loss = running_loss / total
    train_acc = correct / total

    # Validation
    model.eval()
    val_loss_run, val_correct, val_total = 0.0, 0, 0
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            val_loss_run += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            val_correct += (preds == labels).sum().item()
            val_total += labels.size(0)

    val_loss = val_loss_run / val_total
    val_acc = val_correct / val_total

    history["train_loss"].append(train_loss)
    history["train_acc"].append(train_acc)
    history["val_loss"].append(val_loss)
    history["val_acc"].append(val_acc)

    print(f"Epoch [{epoch:02d}/{EPOCHS}] Train Loss: {train_loss:.4f} Acc: {train_acc*100:.1f}% | Val Loss: {val_loss:.4f} Acc: {val_acc*100:.1f}%")

# Save outputs
torch.save(model.state_dict(), "disaster_classifier_pytorch.pt")
with open("class_names.json", "w") as f:
    json.dump(class_names, f, indent=2)

print("\nSaved model -> disaster_classifier_pytorch.pt")
print("Saved class labels -> class_names.json")

# Plot history
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].plot(history["train_acc"], label="train acc")
axes[0].plot(history["val_acc"], label="val acc")
axes[0].set_title("Accuracy")
axes[0].legend()

axes[1].plot(history["train_loss"], label="train loss")
axes[1].plot(history["val_loss"], label="val loss")
axes[1].set_title("Loss")
axes[1].legend()

plt.tight_layout()
plt.savefig("training_history_torch.png")
print("Saved training curves -> training_history_torch.png")
