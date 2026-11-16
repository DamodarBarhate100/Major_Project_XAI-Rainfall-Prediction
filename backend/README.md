# VarshaDrishti Backend

FastAPI integration layer for the VarshaDrishti Explainable Satellite Rainfall Risk Intelligence frontend and ML/XAI pipeline.

## Features

- **Live City Predictions**: `GET /api/latest?lat=...&lon=...` or `GET /api/latest?city=...` for any city in India
- **3D-CNN Inference**: Multi-temporal temporal sequence modeling across INSAT-3DR channels (MIR, TIR1, TIR2)
- **Grad-CAM Explainability**: Live spatial class activation heatmap generation served via `/generated/gradcam/...`
- **Atmospheric XAI (SHAP)**: Cloud top temperature, moisture gradients, precipitable water, brightness temperature difference, and stability indices
- **Historical Event Replay**: `GET /api/historical` and `GET /api/historical/{event_id}`
- **Model Evaluation Metrics**: `GET /api/metrics`

## Run

```powershell
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The API docs are available at `http://localhost:8000/docs`; health check at `GET /health`.

## Configuration

Settings are configured via `.env` or environment variables:
- `BHOOMIDRISHTI_CORS_ORIGINS`: JSON array of allowed origins (e.g. `["http://localhost:5173"]`)
- `BHOOMIDRISHTI_PREDICTOR_CLASS`: Predictor import path (`app.adapters.ml_predictor:Predictor`)
- `BHOOMIDRISHTI_METRICS_PATH`: Path to metrics JSON artifact
- `BHOOMIDRISHTI_HISTORICAL_EVENTS_PATH`: Path to historical events JSON artifact

## Endpoints

- `GET /health` — Service health
- `GET /api/latest` — Latest prediction; accepts optional `city`, `lat`, `lon` query params
- `POST /api/predict` — Prediction request with observation dictionary
- `GET /api/satellite/latest` — Latest satellite image metadata for city or location
- `GET /api/metrics` — Validated evaluation metrics artifact
- `GET /api/historical` — Available historical replay events
- `GET /api/historical/{event_id}` — Full prediction and Grad-CAM for historical event

## Tests

```powershell
$env:PYTHONPATH="backend;varshadrishti-ml"; python -m pytest backend/tests
```
