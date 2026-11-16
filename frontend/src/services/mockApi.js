/**
 * mockApi.js
 * ─────────────────────────────────────────────────────────────
 * ALL development mock responses live here.
 * Components never import from this file directly.
 * Only api.js imports from here and conditionally delegates to it.
 *
 * When the real FastAPI backend is ready, set:
 *   VITE_USE_MOCK=false
 * in .env.local and api.js will route to the real service.
 * ─────────────────────────────────────────────────────────────
 */

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/* ── Shared mock timestamp ───────────────────────────────── */
const MOCK_TS = new Date().toISOString();

export const CITIES_MOCK_DATA = [
  {
    id: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    lat: 22.7196,
    lon: 75.8577,
    class_id: 1,
    label: 'moderate',
    confidence: 0.68,
    probabilities: { no_rain: 0.18, moderate: 0.68, heavy: 0.10, high_impact: 0.04 },
    ctt: -18.5,
    rh: 62,
    pw: 38.5,
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0760,
    lon: 72.8777,
    class_id: 3,
    label: 'high_impact',
    confidence: 0.82,
    probabilities: { no_rain: 0.01, moderate: 0.04, heavy: 0.13, high_impact: 0.82 },
    ctt: -54.0,
    rh: 89,
    pw: 64.2,
  },
  {
    id: 'delhi',
    name: 'Delhi / NCR',
    state: 'Delhi',
    lat: 28.6139,
    lon: 77.2090,
    class_id: 0,
    label: 'no_rain',
    confidence: 0.74,
    probabilities: { no_rain: 0.74, moderate: 0.18, heavy: 0.06, high_impact: 0.02 },
    ctt: -10.0,
    rh: 45,
    pw: 28.0,
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lon: 77.5946,
    class_id: 2,
    label: 'heavy',
    confidence: 0.67,
    probabilities: { no_rain: 0.08, moderate: 0.19, heavy: 0.67, high_impact: 0.06 },
    ctt: -36.0,
    rh: 74,
    pw: 46.0,
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lon: 80.2707,
    class_id: 2,
    label: 'heavy',
    confidence: 0.71,
    probabilities: { no_rain: 0.05, moderate: 0.16, heavy: 0.71, high_impact: 0.08 },
    ctt: -42.0,
    rh: 82,
    pw: 56.0,
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lon: 88.3639,
    class_id: 3,
    label: 'high_impact',
    confidence: 0.85,
    probabilities: { no_rain: 0.01, moderate: 0.03, heavy: 0.11, high_impact: 0.85 },
    ctt: -58.0,
    rh: 91,
    pw: 68.0,
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3850,
    lon: 78.4867,
    class_id: 1,
    label: 'moderate',
    confidence: 0.64,
    probabilities: { no_rain: 0.22, moderate: 0.64, heavy: 0.11, high_impact: 0.03 },
    ctt: -24.0,
    rh: 63,
    pw: 39.0,
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    lat: 23.0225,
    lon: 72.5714,
    class_id: 0,
    label: 'no_rain',
    confidence: 0.81,
    probabilities: { no_rain: 0.81, moderate: 0.14, heavy: 0.04, high_impact: 0.01 },
    ctt: -8.0,
    rh: 42,
    pw: 26.0,
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    lat: 18.5204,
    lon: 73.8567,
    class_id: 2,
    label: 'heavy',
    confidence: 0.63,
    probabilities: { no_rain: 0.09, moderate: 0.21, heavy: 0.63, high_impact: 0.07 },
    ctt: -34.0,
    rh: 72,
    pw: 45.0,
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9124,
    lon: 75.7873,
    class_id: 0,
    label: 'no_rain',
    confidence: 0.88,
    probabilities: { no_rain: 0.88, moderate: 0.09, heavy: 0.02, high_impact: 0.01 },
    ctt: -5.0,
    rh: 35,
    pw: 21.0,
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.8467,
    lon: 80.9462,
    class_id: 1,
    label: 'moderate',
    confidence: 0.70,
    probabilities: { no_rain: 0.15, moderate: 0.70, heavy: 0.11, high_impact: 0.04 },
    ctt: -28.0,
    rh: 69,
    pw: 44.0,
  },
  {
    id: 'patna',
    name: 'Patna',
    state: 'Bihar',
    lat: 25.5941,
    lon: 85.1376,
    class_id: 2,
    label: 'heavy',
    confidence: 0.66,
    probabilities: { no_rain: 0.07, moderate: 0.21, heavy: 0.66, high_impact: 0.06 },
    ctt: -38.0,
    rh: 78,
    pw: 51.0,
  },
  {
    id: 'guwahati',
    name: 'Guwahati',
    state: 'Assam',
    lat: 26.1445,
    lon: 91.7362,
    class_id: 3,
    label: 'high_impact',
    confidence: 0.89,
    probabilities: { no_rain: 0.01, moderate: 0.02, heavy: 0.08, high_impact: 0.89 },
    ctt: -62.0,
    rh: 95,
    pw: 72.0,
  },
  {
    id: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    lat: 9.9312,
    lon: 76.2673,
    class_id: 3,
    label: 'high_impact',
    confidence: 0.84,
    probabilities: { no_rain: 0.01, moderate: 0.03, heavy: 0.12, high_impact: 0.84 },
    ctt: -56.0,
    rh: 92,
    pw: 66.0,
  },
  {
    id: 'shimla',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    lat: 31.1048,
    lon: 77.1734,
    class_id: 2,
    label: 'heavy',
    confidence: 0.65,
    probabilities: { no_rain: 0.10, moderate: 0.19, heavy: 0.65, high_impact: 0.06 },
    ctt: -39.0,
    rh: 76,
    pw: 36.0,
  },
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar',
    state: 'Odisha',
    lat: 20.2961,
    lon: 85.8245,
    class_id: 3,
    label: 'high_impact',
    confidence: 0.79,
    probabilities: { no_rain: 0.02, moderate: 0.05, heavy: 0.14, high_impact: 0.79 },
    ctt: -50.0,
    rh: 87,
    pw: 62.0,
  },
];

/* ── Mock prediction response ────────────────────────────── */
export const mockLatestPrediction = async (lat, lon, city) => {
  await delay(500);

  let target = CITIES_MOCK_DATA[0];
  if (city) {
    const found = CITIES_MOCK_DATA.find(
      (c) => c.id.toLowerCase() === city.toLowerCase() || c.name.toLowerCase() === city.toLowerCase()
    );
    if (found) target = found;
  } else if (lat != null && lon != null) {
    // Find closest by Euclidean distance
    let minDist = Infinity;
    for (const c of CITIES_MOCK_DATA) {
      const d = Math.hypot(c.lat - lat, c.lon - lon);
      if (d < minDist) {
        minDist = d;
        target = c;
      }
    }
  }

  const locationStr = `${target.name}, ${target.state}`;

  return {
    prediction: {
      class_id: target.class_id,
      label: target.label,
      confidence: target.confidence,
    },
    probabilities: target.probabilities,
    xai: {
      gradcam: {
        image_url: `/mock/gradcam_heatmap.png`,
        original_url: `/mock/satellite.png`,
        overlay_url: `/mock/gradcam_overlay.png`,
        available: true,
      },
      shap: {
        available: true,
        features: [
          { name: "Cloud Top Temperature", value: target.ctt, contribution: target.class_id >= 2 ? 0.48 : -0.32 },
          { name: "Tropospheric Moisture Gradient", value: target.rh / 100, contribution: target.rh > 70 ? 0.35 : -0.22 },
          { name: "Brightness Temp Difference", value: -1.2, contribution: 0.18 },
          { name: "Total Precipitable Water", value: target.pw, contribution: target.pw > 45 ? 0.28 : -0.15 },
          { name: "Outgoing LW Radiation", value: 230, contribution: -0.09 },
          { name: "Atmospheric Instability Index", value: -4.5, contribution: 0.31 },
        ],
      },
    },
    metadata: {
      timestamp: new Date().toISOString(),
      location: locationStr,
      latitude: lat != null ? Number(lat) : target.lat,
      longitude: lon != null ? Number(lon) : target.lon,
      source: "INSAT-3DR Imager (Live 3D-CNN Inference)",
    },
    system: {
      model_status: "ready",
      data_status: "fresh",
      last_data_at: new Date().toISOString(),
    },
  };
};

/* ── Mock satellite imagery ──────────────────────────────── */
export const mockSatelliteImage = async () => {
  await delay(400);
  return {
    available: true,
    image_url: "/mock/satellite.png",
    timestamp: MOCK_TS,
    location: "Indore, Madhya Pradesh",
    channel_label: "INSAT-3DR TIR1 (Thermal IR)",
  };
};

/* ── Mock Grad-CAM ───────────────────────────────────────── */
export const mockGradCAM = async () => {
  await delay(500);
  return {
    available: true,
    original_url: "/mock/satellite.png",
    heatmap_url: "/mock/gradcam_heatmap.png",
    overlay_url: "/mock/gradcam_overlay.png",
    timestamp: MOCK_TS,
  };
};

/* ── Mock metrics ────────────────────────────────────────── */
export const mockMetrics = async () => {
  await delay(600);
  return {
    overall: {
      accuracy: 0.6087,
      precision: 0.5453,
      recall: 0.4952,
      f1: 0.4021,
      roc_auc: 0.7650,
    },
    per_class: {
      no_rain: { precision: 0.6429, recall: 0.9643, f1: 0.7714, support: 28 },
      moderate: { precision: 0.0, recall: 0.0, f1: 0.0, support: 14 },
      heavy: { precision: 1.0, recall: 0.0833, f1: 0.1538, support: 12 },
      high_impact: { precision: 0.5385, recall: 0.9333, f1: 0.6829, support: 15 },
    },
    confusion_matrix: {
      labels: ["no_rain", "moderate", "heavy", "high_impact"],
      matrix: [
        [27, 0, 0, 1],
        [11, 0, 0, 3],
        [4, 0, 1, 7],
        [0, 0, 0, 15],
      ],
    },
    evaluation_set: "Held-out validation event (18 Aug 2026) — 69 samples",
    evaluated_at: "2026-08-19T06:00:00+00:00",
  };
};

/* ── Mock historical events ──────────────────────────────── */
export const mockHistoricalList = async () => {
  await delay(400);
  return {
    events: [
      {
        id: "event_2026-08-17",
        name: "Development Event — 17 Aug 2026",
        date: "2026-08-17",
        location: null,
        latitude: null,
        longitude: null,
        type: "high_impact",
        description: "Development dataset event. Real INSAT-3DR satellite observations (temporal sequence T-5..T) processed via 3D-CNN.",
      },
      {
        id: "event_2026-08-18",
        name: "Development Event — 18 Aug 2026",
        date: "2026-08-18",
        location: null,
        latitude: null,
        longitude: null,
        type: "moderate",
        description: "Held-out validation event. Real INSAT-3DR satellite observations (temporal sequence T-5..T) processed via 3D-CNN.",
      },
    ],
  };
};

export const mockHistoricalEvent = async (id) => {
  await delay(600);
  const is17 = id === "event_2026-08-17";
  return {
    event: {
      id: is17 ? "event_2026-08-17" : "event_2026-08-18",
      name: is17 ? "Development Event — 17 Aug 2026" : "Development Event — 18 Aug 2026",
      date: is17 ? "2026-08-17" : "2026-08-18",
      location: null,
      latitude: null,
      longitude: null,
      type: is17 ? "high_impact" : "moderate",
      description: is17
        ? "Development dataset event. Real INSAT-3DR satellite observations (temporal sequence T-5..T) processed via 3D-CNN."
        : "Held-out validation event. Real INSAT-3DR satellite observations (temporal sequence T-5..T) processed via 3D-CNN.",
    },
    prediction: {
      class_id: is17 ? 3 : 1,
      label: is17 ? "high_impact" : "moderate",
      confidence: is17 ? 0.884 : 0.725,
    },
    probabilities: is17
      ? { no_rain: 0.021, moderate: 0.045, heavy: 0.05, high_impact: 0.884 }
      : { no_rain: 0.145, moderate: 0.725, heavy: 0.08, high_impact: 0.05 },
    xai: {
      gradcam: {
        image_url: `/mock/gradcam_heatmap.png`,
        original_url: `/mock/satellite.png`,
        overlay_url: `/mock/gradcam_overlay.png`,
      },
      shap: null,
    },
    metadata: {
      timestamp: is17 ? "2026-08-17T23:45:00Z" : "2026-08-18T23:45:00Z",
      latitude: null,
      longitude: null,
    },
  };
};
