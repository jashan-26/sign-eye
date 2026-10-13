import json
import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.database.db import init_db
from backend.services.sentence_builder import build_sentence

ROOT = Path(__file__).resolve().parents[1]
SIGNS = json.loads((ROOT / "ai/config/signs.json").read_text())
MODEL_PATH = ROOT / os.getenv("SIGNEYE_MODEL_PATH", "ai/models/signeye_static.pt")

app = FastAPI(title="SignEye API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("SIGNEYE_CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _startup() -> None:
    try:
        init_db()
    except Exception:
        pass  # reported through /api/health, never as a raw traceback


@app.get("/api/health")
def health():
    """Drives the AI ONLINE / OFFLINE indicator and reports the model honestly."""
    ready = MODEL_PATH.exists()
    return {
        "api": "online",
        "model_loaded": ready,
        "message": None if ready else "No trained model yet. Train one, or use Demo Mode.",
    }


@app.get("/api/signs")
def signs():
    return SIGNS


class SentenceIn(BaseModel):
    signs: list[str]


@app.post("/api/sentence")
def sentence(body: SentenceIn):
    known = set(SIGNS["words"]) | set(SIGNS["alphabet"])
    return {"sentence": build_sentence(body.signs, known)}
