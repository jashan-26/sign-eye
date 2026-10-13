"""PyTorch Multi-Layer Perceptron (MLP) for Sign Language Gesture Classification."""
import torch
import torch.nn as nn

class SignEyeNet(nn.Module):
    def __init__(self, input_dim: int = 63, num_classes: int = 51):
        super().__init__()
        self.fc1 = nn.Linear(input_dim, 256)
        self.bn1 = nn.BatchNorm1d(256)
        self.relu1 = nn.ReLU()
        self.drop1 = nn.Dropout(0.3)
        
        self.fc2 = nn.Linear(256, 256)
        self.bn2 = nn.BatchNorm1d(256)
        self.relu2 = nn.ReLU()
        self.drop2 = nn.Dropout(0.3)
        
        self.fc3 = nn.Linear(256, 128)
        self.bn3 = nn.BatchNorm1d(128)
        self.relu3 = nn.ReLU()
        
        self.out = nn.Linear(128, num_classes)
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Residual connection over fc1 and fc2
        h1 = self.drop1(self.relu1(self.bn1(self.fc1(x))))
        h2 = self.drop2(self.relu2(self.bn2(self.fc2(h1)))) + h1
        h3 = self.relu3(self.bn3(self.fc3(h2)))
        return self.out(h3)
