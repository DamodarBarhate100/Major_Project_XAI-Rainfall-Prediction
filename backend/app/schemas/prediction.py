from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

RiskLabel = Literal["no_rain", "moderate", "heavy", "high_impact"]
LABEL_BY_CLASS_ID: dict[int, RiskLabel] = {0: "no_rain", 1: "moderate", 2: "heavy", 3: "high_impact"}


class PredictionRequest(BaseModel):
    """Optional observation payload understood by the configured predictor."""

    model_config = ConfigDict(extra="forbid")
    observation: dict[str, Any] | None = None


class Prediction(BaseModel):
    class_id: int = Field(ge=0, le=3)
    label: RiskLabel
    confidence: float = Field(ge=0, le=1)

    @model_validator(mode="after")
    def class_and_label_match(self) -> "Prediction":
        if LABEL_BY_CLASS_ID[self.class_id] != self.label:
            raise ValueError("class_id and label must identify the same risk class")
        return self


class Probabilities(BaseModel):
    no_rain: float = Field(ge=0, le=1)
    moderate: float = Field(ge=0, le=1)
    heavy: float = Field(ge=0, le=1)
    high_impact: float = Field(ge=0, le=1)

    @model_validator(mode="after")
    def sum_is_one(self) -> "Probabilities":
        if abs(sum(self.model_dump().values()) - 1.0) > 0.005:
            raise ValueError("probabilities must sum to approximately 1")
        return self


class GradCam(BaseModel):
    image_url: str | None = None
    original_url: str | None = None
    overlay_url: str | None = None
    available: bool = True


class ShapFeature(BaseModel):
    name: str = Field(min_length=1)
    value: float
    contribution: float


class Shap(BaseModel):
    available: bool = True
    features: list[ShapFeature] = Field(default_factory=list)


class XAI(BaseModel):
    gradcam: GradCam | None = None
    shap: Shap | None = None


class PredictionMetadata(BaseModel):
    timestamp: datetime
    location: str | None = None
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    source: str | None = None

    @field_validator("timestamp")
    @classmethod
    def require_timezone(cls, value: datetime) -> datetime:
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError("timestamp must include a timezone offset")
        return value


class SystemStatus(BaseModel):
    model_status: str = "ready"
    data_status: str = "fresh"
    last_data_at: datetime | None = None


class PredictionResponse(BaseModel):
    prediction: Prediction
    probabilities: Probabilities
    xai: XAI | None = None
    metadata: PredictionMetadata
    system: SystemStatus | None = None
