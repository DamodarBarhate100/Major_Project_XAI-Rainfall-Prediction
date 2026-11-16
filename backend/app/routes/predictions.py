from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Body, Depends, Query

from app.dependencies import get_prediction_service
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.prediction_service import PredictionService

router = APIRouter(tags=["predictions"])


@router.post("/predict", response_model=PredictionResponse)
def predict(
    lat: float | None = Query(default=None, ge=-90, le=90, description="Target Latitude"),
    lon: float | None = Query(default=None, ge=-180, le=180, description="Target Longitude"),
    city: str | None = Query(default=None, description="Target City Name"),
    payload: PredictionRequest | None = Body(default=None),
    service: PredictionService = Depends(get_prediction_service),
) -> PredictionResponse:
    request_data = payload or PredictionRequest()
    if request_data.observation is None:
        request_data.observation = {}

    if lat is not None and lon is not None:
        request_data.observation["lat"] = lat
        request_data.observation["lon"] = lon
        request_data.observation["latitude"] = lat
        request_data.observation["longitude"] = lon
    if city is not None:
        request_data.observation["city"] = city

    return service.predict(request_data)


@router.get("/latest", response_model=PredictionResponse)
def latest(
    lat: float | None = Query(default=None, ge=-90, le=90, description="Target Latitude"),
    lon: float | None = Query(default=None, ge=-180, le=180, description="Target Longitude"),
    city: str | None = Query(default=None, description="Target City Name"),
    service: PredictionService = Depends(get_prediction_service),
) -> PredictionResponse:
    observation: dict[str, Any] = {}
    if lat is not None and lon is not None:
        observation["lat"] = lat
        observation["lon"] = lon
        observation["latitude"] = lat
        observation["longitude"] = lon
    if city is not None:
        observation["city"] = city

    if observation:
        return service.predict(PredictionRequest(observation=observation))

    return service.latest()


@router.get("/satellite/latest")
def satellite_latest(
    lat: float | None = Query(default=None, ge=-90, le=90, description="Target Latitude"),
    lon: float | None = Query(default=None, ge=-180, le=180, description="Target Longitude"),
    city: str | None = Query(default=None, description="Target City Name"),
    service: PredictionService = Depends(get_prediction_service),
) -> dict[str, Any]:
    pred_response = latest(lat=lat, lon=lon, city=city, service=service)
    
    gradcam_data = pred_response.xai.gradcam if pred_response.xai else None
    image_url = None
    if gradcam_data and getattr(gradcam_data, "original_url", None):
        image_url = gradcam_data.original_url
    elif gradcam_data and getattr(gradcam_data, "image_url", None):
        image_url = gradcam_data.image_url
    else:
        image_url = "/mock/satellite.png"

    return {
        "available": True,
        "image_url": image_url,
        "timestamp": pred_response.metadata.timestamp.isoformat(),
        "location": pred_response.metadata.location or (
            f"{pred_response.metadata.latitude}°N, {pred_response.metadata.longitude}°E"
            if pred_response.metadata.latitude is not None else "India Subcontinent"
        ),
        "channel_label": pred_response.metadata.source or "INSAT-3DR Imager (TIR1/MIR/TIR2)",
    }
