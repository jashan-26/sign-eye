"""Train script for SignEye gesture recognition ML model."""
import json
import os
from pathlib import Path
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split

from ai.datasets.generator import SignDataset
from ai.models.model import SignEyeNet

ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = ROOT / "ai/models/signeye_static.pt"
SAMPLES_JSON_PATH = ROOT / "ai/models/default_samples.json"
FRONTEND_SAMPLES_PATH = ROOT / "frontend/public/default_samples.json"

def train():
    print("==========================================")
    print("     SignEye ML Model Training Pipeline   ")
    print("==========================================")
    
    dataset = SignDataset(samples_per_class=350)
    print(f"Total vocabulary classes: {len(dataset.vocab)}")
    print(f"Total dataset size: {len(dataset)} landmark samples")
    
    train_size = int(0.85 * len(dataset))
    val_size = len(dataset) - train_size
    train_set, val_set = random_split(dataset, [train_size, val_size])
    
    train_loader = DataLoader(train_set, batch_size=128, shuffle=True)
    val_loader = DataLoader(val_set, batch_size=128, shuffle=False)
    
    model = SignEyeNet(input_dim=63, num_classes=len(dataset.vocab))
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=0.002, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=40)
    
    epochs = 40
    best_acc = 0.0
    
    for epoch in range(1, epochs + 1):
        model.train()
        train_loss = 0.0
        train_correct = 0
        total_train = 0
        
        for X_b, y_b in train_loader:
            optimizer.zero_grad()
            out = model(X_b)
            loss = criterion(out, y_b)
            loss.backward()
            optimizer.step()
            
            train_loss += loss.item() * X_b.size(0)
            preds = torch.argmax(out, dim=1)
            train_correct += (preds == y_b).sum().item()
            total_train += X_b.size(0)
            
        train_acc = train_correct / total_train
        scheduler.step()
        
        # Validation loop
        model.eval()
        val_loss = 0.0
        val_correct = 0
        total_val = 0
        with torch.no_grad():
            for X_b, y_b in val_loader:
                out = model(X_b)
                loss = criterion(out, y_b)
                val_loss += loss.item() * X_b.size(0)
                preds = torch.argmax(out, dim=1)
                val_correct += (preds == y_b).sum().item()
                total_val += X_b.size(0)
                
        val_acc = val_correct / total_val
        avg_val_loss = val_loss / total_val
        
        if val_acc > best_acc:
            best_acc = val_acc
            MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
            torch.save({
                "model_state": model.state_dict(),
                "vocab": dataset.vocab,
                "label_to_idx": dataset.label_to_idx,
                "input_dim": 63,
                "val_accuracy": best_acc
            }, MODEL_PATH)
            
        if epoch % 5 == 0 or epoch == epochs:
            print(f"Epoch {epoch:02d}/{epochs} - Train Loss: {train_loss/total_train:.4f} | Train Acc: {train_acc*100:.2f}% | Val Loss: {avg_val_loss:.4f} | Val Acc: {val_acc*100:.2f}%")
            
    print(f"\nTraining Complete! Best Validation Accuracy: {best_acc*100:.2f}%")
    print(f"Saved PyTorch Model Weights to: {MODEL_PATH}")
    
    # Export baseline landmark samples JSON for instant seed dataset
    export_samples = []
    for lbl in dataset.vocab:
        base_vec = dataset.data[dataset.label_to_idx[lbl]]
        export_samples.append({"label": lbl, "vec": base_vec})
        
    SAMPLES_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    SAMPLES_JSON_PATH.write_text(json.dumps(export_samples, indent=2))
    
    if FRONTEND_SAMPLES_PATH.parent.exists():
        FRONTEND_SAMPLES_PATH.write_text(json.dumps(export_samples, indent=2))
        print(f"Exported frontend seed samples to: {FRONTEND_SAMPLES_PATH}")

if __name__ == "__main__":
    train()
