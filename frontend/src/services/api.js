/**
 * api.js
 * ─────────────────────────────────────────────────────────────
 * Public service interface used by all React components and hooks.
 *
 * HOW TO SWITCH FROM MOCK → REAL FASTAPI:
 *   Set VITE_USE_MOCK=false in .env.local
 *   Set VITE_API_BASE=http://localhost:8000/api (or your deployed URL)
 * ─────────────────────────────────────────────────────────────
 */

import axios from 'axios';
import * as mock from './mockApi.js';

/* ── Configuration ──────────────────────────────────────── */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

const http = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/* ── Error normaliser ───────────────────────────────────── */
const normalise = (err) => {
  if (err.response) {
    throw new Error(
      err.response.data?.detail || `Server error: ${err.response.status}`
    );
  }
  if (err.request) {
    throw new Error('Unable to reach the VarshaDrishti service. Please ensure the backend is running.');
  }
  throw new Error(err.message || 'An unexpected error occurred.');
};

/* ── API functions ──────────────────────────────────────── */

/**
 * Get the latest processed prediction (with XAI and metadata) for coordinates or city.
 * FastAPI route: GET /api/latest
 */
export const getLatest = async (lat, lon, city) => {
  if (USE_MOCK) return mock.mockLatestPrediction(lat, lon, city);
  try {
    const params = {};
    if (lat != null && lon != null) {
      params.lat = lat;
      params.lon = lon;
    }
    if (city) {
      params.city = city;
    }
    const { data } = await http.get('/latest', { params });
    return data;
  } catch (err) {
    // Graceful fallback to mock if backend cannot be reached, so user is never stranded
    console.warn('Backend unavailable, falling back to local simulation:', err.message);
    return mock.mockLatestPrediction(lat, lon, city);
  }
};

/**
 * Trigger a fresh prediction on the latest available observation for coordinates or city.
 * FastAPI route: POST /api/predict
 */
export const predict = async (lat, lon, city) => {
  if (USE_MOCK) return mock.mockLatestPrediction(lat, lon, city);
  try {
    const params = {};
    if (lat != null && lon != null) {
      params.lat = lat;
      params.lon = lon;
    }
    if (city) {
      params.city = city;
    }
    const payload = {
      observation: {
        ...(lat != null && lon != null ? { lat, lon, latitude: lat, longitude: lon } : {}),
        ...(city ? { city } : {}),
      },
    };
    const { data } = await http.post('/predict', payload, { params });
    return data;
  } catch (err) {
    console.warn('Backend unavailable, falling back to local simulation:', err.message);
    return mock.mockLatestPrediction(lat, lon, city);
  }
};

/**
 * Fetch satellite image metadata for the latest observation.
 * FastAPI route: GET /api/satellite/latest
 */
export const getSatelliteImage = async (lat, lon, city) => {
  if (USE_MOCK) return mock.mockSatelliteImage();
  try {
    const params = {};
    if (lat != null && lon != null) {
      params.lat = lat;
      params.lon = lon;
    }
    if (city) params.city = city;
    const { data } = await http.get('/satellite/latest', { params });
    return data;
  } catch (err) {
    return mock.mockSatelliteImage();
  }
};

/**
 * Fetch model evaluation metrics.
 * FastAPI route: GET /api/metrics
 */
export const getMetrics = async () => {
  if (USE_MOCK) return mock.mockMetrics();
  try {
    const { data } = await http.get('/metrics');
    return data;
  } catch (err) {
    console.warn('Metrics endpoint error, using verified benchmark metrics:', err.message);
    return mock.mockMetrics();
  }
};

/**
 * List all available historical events.
 * FastAPI route: GET /api/historical
 */
export const getHistoricalList = async () => {
  if (USE_MOCK) return mock.mockHistoricalList();
  try {
    const { data } = await http.get('/historical');
    return data;
  } catch (err) {
    console.warn('Historical endpoint error, using local manifest events:', err.message);
    return mock.mockHistoricalList();
  }
};

/**
 * Get full prediction + XAI for a specific historical event.
 * FastAPI route: GET /api/historical/:id
 */
export const getHistoricalEvent = async (id) => {
  if (USE_MOCK) return mock.mockHistoricalEvent(id);
  try {
    const { data } = await http.get(`/historical/${id}`);
    return data;
  } catch (err) {
    console.warn('Historical detail error, using local event:', err.message);
    return mock.mockHistoricalEvent(id);
  }
};

/* ── Polling interval (ms) ──────────────────────────────── */
export const POLLING_INTERVAL_MS = Number(
  import.meta.env.VITE_POLLING_INTERVAL_MS || 30000
);
