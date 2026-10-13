"""Turns noisy per-frame predictions into stable, de-duplicated sign events."""
from __future__ import annotations
from collections import Counter, deque
from dataclasses import dataclass


@dataclass
class SmootherConfig:
    window: int = 8
    min_votes: int = 5
    min_confidence: float = 0.75
    cooldown_frames: int = 10  # idle frames before the same sign may be emitted again


class PredictionSmoother:
    """Majority vote over a temporal window plus debouncing."""

    def __init__(self, config: SmootherConfig | None = None):
        self.cfg = config or SmootherConfig()
        self._window: deque = deque(maxlen=self.cfg.window)
        self._last: str | None = None
        self._idle = 0

    def reset(self) -> None:
        self._window.clear()
        self._last = None
        self._idle = 0

    def feed(self, label: str | None, confidence: float = 0.0) -> str | None:
        if label is None or confidence < self.cfg.min_confidence:
            self._window.append(None)
            self._idle += 1
            if self._idle >= self.cfg.cooldown_frames:
                self._last = None
            return None
        self._idle = 0
        self._window.append(label)
        votes = Counter(x for x in self._window if x is not None)
        winner, count = votes.most_common(1)[0]
        if count >= self.cfg.min_votes and winner != self._last:
            self._last = winner
            return winner
        return None
