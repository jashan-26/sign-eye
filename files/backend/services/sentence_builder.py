"""Rule-based sentence builder. Replaceable by an LLM/seq2seq model later."""
from __future__ import annotations

GREETINGS = {"HELLO", "WELCOME"}


def dedupe(signs: list) -> list:
    out: list = []
    for s in signs:
        s = s.strip().upper()
        if s and (not out or out[-1] != s):
            out.append(s)
    return out


def build_sentence(signs: list, known_words: set | None = None) -> str:
    """HELLO MY NAME JASHAN -> 'Hello, my name is Jashan.'

    A token after NAME that is not in the vocabulary is treated as a name.
    """
    tokens = dedupe(signs)
    if not tokens:
        return ""
    known = known_words or set()
    out: list = []
    i = 0
    while i < len(tokens):
        t = tokens[i]
        if t == "I":
            out.append("I")
        else:
            out.append(t.lower())
        if t == "NAME" and i + 1 < len(tokens) and tokens[i + 1] not in known:
            out.append("is")
            out.append(tokens[i + 1].capitalize())
            i += 1
        i += 1
    if tokens[0] in GREETINGS and len(out) > 1:
        out[0] = out[0] + ","
    out[0] = out[0][0].upper() + out[0][1:]
    text = " ".join(out)
    return text if text.endswith((".", "!", "?")) else text + "."
