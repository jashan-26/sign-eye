"""Landmark feature extraction and normalization matching frontend/lib/features.ts."""
import math
import numpy as np

def normalize_landmarks(landmarks: list[dict[str, float]]) -> list[float]:
    """
    Translates landmarks relative to Wrist (index 0) and scales by distance 
    between Wrist (index 0) and Middle Finger MCP (index 9).
    Matches `toFeatures` in frontend/lib/features.ts.
    """
    if not landmarks or len(landmarks) < 21:
        return [0.0] * 63

    w = landmarks[0]
    ref = landmarks[9]
    dx = ref["x"] - w["x"]
    dy = ref["y"] - w["y"]
    dz = ref["z"] - w["z"]
    scale = math.hypot(dx, dy, dz) or 1.0

    features = []
    for p in landmarks:
        features.append((p["x"] - w["x"]) / scale)
        features.append((p["y"] - w["y"]) / scale)
        features.append((p["z"] - w["z"]) / scale)
    return features

def augment_landmarks(features: list[float], rotation_deg: float = 10.0, jitter_std: float = 0.02) -> list[float]:
    """Applies spatial rotation around Z-axis and gaussian noise for dataset augmentation."""
    vec = np.array(features, dtype=np.float32).reshape(-1, 3)
    
    # Random Z-rotation
    rad = np.radians(np.random.uniform(-rotation_deg, rotation_deg))
    cos_a, sin_a = np.cos(rad), np.sin(rad)
    rot_matrix = np.array([[cos_a, -sin_a, 0], [sin_a, cos_a, 0], [0, 0, 1]], dtype=np.float32)
    
    rotated = vec @ rot_matrix.T
    
    # Scale & Gaussian noise jitter
    scale_factor = np.random.uniform(0.9, 1.1)
    jitter = np.random.normal(0, jitter_std, size=rotated.shape)
    
    augmented = (rotated * scale_factor) + jitter
    return augmented.flatten().tolist()
