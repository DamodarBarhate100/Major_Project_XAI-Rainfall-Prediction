from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

_BASE_DIR = Path(__file__).resolve().parent.parent
_DEFAULT_METRICS_PATH = _BASE_DIR / "artifacts" / "metrics.json"
_DEFAULT_HISTORICAL_PATH = _BASE_DIR / "artifacts" / "historical_events.json"


class Settings(BaseSettings):
    """Runtime configuration. Routes never expose configured file paths."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="BHOOMIDRISHTI_",
        extra="ignore"
    )

    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
    )
    predictor_class: str | None = "app.adapters.ml_predictor:Predictor"
    predictor_kwargs: dict[str, object] = Field(default_factory=dict)
    metrics_path: Path | None = Field(default_factory=lambda: _DEFAULT_METRICS_PATH if _DEFAULT_METRICS_PATH.is_file() else None)
    historical_events_path: Path | None = Field(default_factory=lambda: _DEFAULT_HISTORICAL_PATH if _DEFAULT_HISTORICAL_PATH.is_file() else None)


@lru_cache
def get_settings() -> Settings:
    return Settings()
