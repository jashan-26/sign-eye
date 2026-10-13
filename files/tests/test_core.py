from ai.inference.smoothing import PredictionSmoother
from backend.services.sentence_builder import build_sentence, dedupe


def test_dedupe():
    assert dedupe(["hello", "HELLO", "yes"]) == ["HELLO", "YES"]


def test_sentence_name():
    known = {"HELLO", "MY", "NAME", "I", "YOU"}
    assert build_sentence(["HELLO", "MY", "NAME", "JASHAN"], known) == "Hello, my name is Jashan."


def test_sentence_empty():
    assert build_sentence([]) == ""


def test_smoother_emits_once():
    s = PredictionSmoother()
    assert [s.feed("HELLO", 0.95) for _ in range(20)].count("HELLO") == 1


def test_smoother_low_confidence():
    s = PredictionSmoother()
    assert all(s.feed("HELLO", 0.3) is None for _ in range(20))
