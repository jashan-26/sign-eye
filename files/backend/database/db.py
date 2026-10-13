import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path

SCHEMA = Path(__file__).with_name("schema.sql")


def _path() -> str:
    return os.getenv("SIGNEYE_DATABASE_URL", "sqlite:///./signeye.db").replace("sqlite:///", "", 1)


@contextmanager
def connect():
    conn = sqlite3.connect(_path())
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    with connect() as conn:
        conn.executescript(SCHEMA.read_text())
