import os
from datetime import datetime, timezone

from pydantic import ValidationError

from app.config import Settings
from app.schemas.metrics import MetricsResponse
from app.services.artifact_reader import read_json_artifact
from app.services.errors import ArtifactMalformed


class MetricsService:
    def __init__(self, settings: Settings):
        self._settings = settings

    def get_metrics(self) -> MetricsResponse:
        raw = read_json_artifact(self._settings.metrics_path, "Metrics")

        # If raw already matches MetricsResponse schema directly
        if isinstance(raw, dict) and "overall" in raw and "per_class" in raw and "confusion_matrix" in raw:
            try:
                return MetricsResponse.model_validate(raw)
            except ValidationError:
                pass

        mtime = os.path.getmtime(self._settings.metrics_path) if self._settings.metrics_path else 0
        evaluated_at = datetime.fromtimestamp(mtime, tz=timezone.utc)

        if isinstance(raw, dict) and "metrics" in raw:
            m = raw["metrics"]
            cm = raw.get("confusion_matrix", {})
            payload = {
                "overall": {
                    "accuracy": m.get("accuracy", 0.0),
                    "f1": m.get("macro_f1", m.get("f1", 0.0)),
                    "precision": m.get("precision"),
                    "recall": m.get("recall"),
                    "roc_auc": m.get("roc_auc"),
                },
                "per_class": m.get("classes", m.get("per_class", {})),
                "confusion_matrix": {
                    "labels": cm.get("class_names", cm.get("labels", [])),
                    "matrix": cm.get("matrix", []),
                },
                "evaluation_set": raw.get("evaluation_set", "Held-out Validation Event (18 Aug 2026)"),
                "evaluated_at": raw.get("evaluated_at", evaluated_at.isoformat()),
            }
        else:
            payload = raw

        try:
            return MetricsResponse.model_validate(payload)
        except ValidationError as exc:
            raise ArtifactMalformed("Metrics artifact does not satisfy the API contract.") from exc
