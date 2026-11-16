/**
 * Dashboard.jsx — Overview & Live Satellite Intelligence Page
 *
 * Information hierarchy: WHERE → WHAT → HOW CONFIDENT → WHY → EVIDENCE
 *
 * Interactive capabilities:
 * - City selector covering all major Indian cities & meteorological zones
 * - Quick-selection pills for popular regional hubs
 * - Custom coordinate input for any point on the subcontinent
 * - Interactive Leaflet map with auto-centering and risk radiation rings
 * - Real-time 3D-CNN inference and probability distribution
 * - Physical atmospheric feature contributions (SHAP)
 * - Tri-mode satellite evidence viewer (Raw Satellite, Grad-CAM Heatmap, Blended Overlay)
 */
import { useState, useMemo } from 'react';
import { RefreshCw, MapPin, Search, Sliders, ChevronDown, Compass } from 'lucide-react';
import { useLatestPrediction } from '../hooks/useLatestPrediction.js';

import PageHeader from '../components/PageHeader.jsx';
import RiskCard from '../components/RiskCard.jsx';
import ProbabilityChart from '../components/ProbabilityChart.jsx';
import EvidenceViewer from '../components/EvidenceViewer.jsx';
import SHAPChart from '../components/SHAPChart.jsx';
import RiskMap from '../components/RiskMap.jsx';
import DataStatus from '../components/DataStatus.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';

/* ── Comprehensive Catalog of Indian Cities ──────────────────── */
export const TARGET_CITIES = [
  // Metros
  { id: 'mumbai', name: 'Mumbai, Maharashtra', shortName: 'Mumbai', lat: 19.0760, lon: 72.8777, region: 'West Coast' },
  { id: 'delhi', name: 'Delhi / NCR', shortName: 'Delhi', lat: 28.6139, lon: 77.2090, region: 'Northern Plains' },
  { id: 'bengaluru', name: 'Bengaluru, Karnataka', shortName: 'Bengaluru', lat: 12.9716, lon: 77.5946, region: 'South Deccan' },
  { id: 'kolkata', name: 'Kolkata, West Bengal', shortName: 'Kolkata', lat: 22.5726, lon: 88.3639, region: 'Eastern Delta' },
  { id: 'chennai', name: 'Chennai, Tamil Nadu', shortName: 'Chennai', lat: 13.0827, lon: 80.2707, region: 'Coromandel Coast' },
  { id: 'hyderabad', name: 'Hyderabad, Telangana', shortName: 'Hyderabad', lat: 17.3850, lon: 78.4867, region: 'Deccan Plateau' },
  { id: 'ahmedabad', name: 'Ahmedabad, Gujarat', shortName: 'Ahmedabad', lat: 23.0225, lon: 72.5714, region: 'Western India' },
  { id: 'pune', name: 'Pune, Maharashtra', shortName: 'Pune', lat: 18.5204, lon: 73.8567, region: 'Western Ghats' },

  // Central India
  { id: 'indore', name: 'Indore, Madhya Pradesh', shortName: 'Indore', lat: 22.7196, lon: 75.8577, region: 'Central India' },
  { id: 'bhopal', name: 'Bhopal, Madhya Pradesh', shortName: 'Bhopal', lat: 23.2599, lon: 77.4126, region: 'Central India' },
  { id: 'nagpur', name: 'Nagpur, Maharashtra', shortName: 'Nagpur', lat: 21.1458, lon: 79.0882, region: 'Central India' },
  { id: 'raipur', name: 'Raipur, Chhattisgarh', shortName: 'Raipur', lat: 21.2514, lon: 81.6296, region: 'Central India' },

  // North & Himalayas
  { id: 'jaipur', name: 'Jaipur, Rajasthan', shortName: 'Jaipur', lat: 26.9124, lon: 75.7873, region: 'North West' },
  { id: 'lucknow', name: 'Lucknow, Uttar Pradesh', shortName: 'Lucknow', lat: 26.8467, lon: 80.9462, region: 'Gangetic Plains' },
  { id: 'chandigarh', name: 'Chandigarh', shortName: 'Chandigarh', lat: 30.7333, lon: 76.7794, region: 'Northern Plains' },
  { id: 'amritsar', name: 'Amritsar, Punjab', shortName: 'Amritsar', lat: 31.6340, lon: 74.8723, region: 'Northern Plains' },
  { id: 'varanasi', name: 'Varanasi, Uttar Pradesh', shortName: 'Varanasi', lat: 25.3176, lon: 82.9739, region: 'Gangetic Plains' },
  { id: 'dehradun', name: 'Dehradun, Uttarakhand', shortName: 'Dehradun', lat: 30.3165, lon: 78.0322, region: 'Himalayan Foothills' },
  { id: 'shimla', name: 'Shimla, Himachal Pradesh', shortName: 'Shimla', lat: 31.1048, lon: 77.1734, region: 'Western Himalayas' },
  { id: 'srinagar', name: 'Srinagar, Jammu & Kashmir', shortName: 'Srinagar', lat: 34.0837, lon: 74.7973, region: 'Kashmir Valley' },

  // East & North East
  { id: 'patna', name: 'Patna, Bihar', shortName: 'Patna', lat: 25.5941, lon: 85.1376, region: 'Eastern Plains' },
  { id: 'bhubaneswar', name: 'Bhubaneswar, Odisha', shortName: 'Bhubaneswar', lat: 20.2961, lon: 85.8245, region: 'Eastern Coast' },
  { id: 'ranchi', name: 'Ranchi, Jharkhand', shortName: 'Ranchi', lat: 23.3441, lon: 85.3096, region: 'Eastern India' },
  { id: 'guwahati', name: 'Guwahati, Assam', shortName: 'Guwahati', lat: 26.1445, lon: 91.7362, region: 'North East' },

  // South & Coastal
  { id: 'kochi', name: 'Kochi, Kerala', shortName: 'Kochi', lat: 9.9312, lon: 76.2673, region: 'South West Coast' },
  { id: 'goa', name: 'Panaji, Goa', shortName: 'Goa', lat: 15.4909, lon: 73.8278, region: 'Konkan Coast' },
  { id: 'visakhapatnam', name: 'Visakhapatnam, Andhra Pradesh', shortName: 'Vizag', lat: 17.6868, lon: 83.2185, region: 'Eastern Coast' },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram, Kerala', shortName: 'Trivandrum', lat: 8.5241, lon: 76.9366, region: 'Southern Tip' },
];

const QUICK_CITIES = ['mumbai', 'delhi', 'bengaluru', 'kolkata', 'chennai', 'hyderabad', 'indore', 'pune', 'guwahati', 'kochi'];

/* ── Section wrapper ───────────────────────────────────────── */
function Section({ label, right, children, noPadding = false }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '11px 28px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-surface)',
        }}
      >
        <span className="label">{label}</span>
        {right && (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{right}</span>
        )}
      </div>
      {noPadding ? children : (
        <div style={{ padding: '0 28px 24px' }}>{children}</div>
      )}
    </div>
  );
}

/* ── Main Dashboard Component ──────────────────────────────── */
export default function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState(TARGET_CITIES[0]);
  const [showCustomCoords, setShowCustomCoords] = useState(false);
  const [customLat, setCustomLat] = useState('19.0760');
  const [customLon, setCustomLon] = useState('72.8777');
  const [searchFilter, setSearchFilter] = useState('');

  // Hook receives target coordinates and city identifier
  const { data, loading, error, refetch } = useLatestPrediction(
    selectedLocation.lat,
    selectedLocation.lon,
    selectedLocation.id
  );

  // Group cities by region for clean dropdown presentation
  const groupedCities = useMemo(() => {
    const groups = {};
    TARGET_CITIES.forEach((city) => {
      if (searchFilter && !city.name.toLowerCase().includes(searchFilter.toLowerCase())) {
        return;
      }
      if (!groups[city.region]) groups[city.region] = [];
      groups[city.region].push(city);
    });
    return groups;
  }, [searchFilter]);

  const handleApplyCustomCoords = (e) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      const customLoc = {
        id: 'custom',
        name: `Custom Location (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`,
        shortName: 'Custom Target',
        lat,
        lon,
        region: 'Subcontinent Grid',
      };
      setSelectedLocation(customLoc);
      refetch(lat, lon, 'custom');
      setShowCustomCoords(false);
    }
  };

  /* ── Loading State ── */
  if (loading && !data) {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 28px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-surface)',
          }}
        >
          <span className="label" style={{ letterSpacing: '0.14em' }}>
            MAJOR PROJECT - GROUP - 5 / LIVE SATELLITE INTELLIGENCE
          </span>
        </div>
        <div style={{ padding: '40px 28px' }}>
          <LoadingState label={`Running 3D-CNN satellite inference for ${selectedLocation.name}…`} lines={6} />
        </div>
      </div>
    );
  }

  /* ── Error State ── */
  if (error && !data) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '40px 28px',
        }}
      >
        <ErrorState
          message={error}
          onRetry={() => refetch(selectedLocation.lat, selectedLocation.lon, selectedLocation.id)}
        />
      </div>
    );
  }

  const { prediction, probabilities, xai, metadata, system } = data || {};

  /* ── City Selector & Action Controls ───────────────────────── */
  const DashboardControls = (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
      {/* City Dropdown */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: '2px 10px',
        }}
      >
        <MapPin size={12} color="var(--accent)" />
        <select
          aria-label="Select City Target"
          style={{
            border: 'none',
            background: 'transparent',
            padding: '6px 4px',
            color: 'var(--text-primary)',
            fontSize: '12px',
            fontWeight: 500,
            outline: 'none',
            cursor: 'pointer',
          }}
          value={selectedLocation.id}
          onChange={(e) => {
            const city = TARGET_CITIES.find((c) => c.id === e.target.value);
            if (city) {
              setSelectedLocation(city);
            }
          }}
          disabled={loading}
        >
          {Object.entries(groupedCities).map(([region, cities]) => (
            <optgroup key={region} label={region}>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </optgroup>
          ))}
          {selectedLocation.id === 'custom' && (
            <option value="custom">{selectedLocation.name}</option>
          )}
        </select>
      </div>

      {/* Custom Coordinates Toggle */}
      <button
        onClick={() => setShowCustomCoords(!showCustomCoords)}
        className="btn"
        style={{
          fontSize: '11px',
          padding: '6px 10px',
          background: showCustomCoords ? 'var(--nav-active-bg)' : 'transparent',
        }}
        title="Input custom GPS coordinates"
      >
        <Compass size={12} />
        Coordinates
      </button>

      {/* Live Inference Refresh Button */}
      <button
        onClick={() => refetch(selectedLocation.lat, selectedLocation.lon, selectedLocation.id)}
        disabled={loading}
        className="btn btn-primary"
        style={{ padding: '6px 14px', fontSize: '11px', fontWeight: 600 }}
        aria-label="Run Live Inference"
      >
        <RefreshCw
          size={11}
          style={{ animation: loading ? 'spin 1.2s linear infinite' : 'none' }}
        />
        {loading ? 'Inferencing…' : 'Run Live Inference'}
      </button>
    </div>
  );

  return (
    <main className="animate-fade-in">
      {/* ── Page Header ────────────────────────────────────────── */}
      <PageHeader
        page="Overview"
        sub={<DataStatus system={system} />}
        right={DashboardControls}
      />

      {/* ── Custom Coordinates Sub-Bar (Expandable) ─────────────── */}
      {showCustomCoords && (
        <div
          className="animate-fade-in"
          style={{
            padding: '12px 28px',
            background: 'var(--bg-raised)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Target Custom Coordinates:
          </span>
          <form onSubmit={handleApplyCustomCoords} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Lat:
              <input
                type="number"
                step="0.0001"
                min="-90"
                max="90"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                style={{
                  marginLeft: '4px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  border: '1px solid var(--border)',
                  borderRadius: '3px',
                  width: '90px',
                }}
              />
            </label>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Lon:
              <input
                type="number"
                step="0.0001"
                min="-180"
                max="180"
                value={customLon}
                onChange={(e) => setCustomLon(e.target.value)}
                style={{
                  marginLeft: '4px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  border: '1px solid var(--border)',
                  borderRadius: '3px',
                  width: '90px',
                }}
              />
            </label>
            <button type="submit" className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '11px' }}>
              Set Coordinates
            </button>
          </form>
        </div>
      )}

      {/* ── Quick City Pills Bar ──────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '9px 28px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600,
            marginRight: '6px',
            flexShrink: 0,
          }}
        >
          Quick Select:
        </span>
        {QUICK_CITIES.map((cityId) => {
          const city = TARGET_CITIES.find((c) => c.id === cityId);
          if (!city) return null;
          const isSelected = selectedLocation.id === city.id;
          return (
            <button
              key={city.id}
              onClick={() => setSelectedLocation(city)}
              style={{
                fontSize: '11px',
                padding: '3px 10px',
                borderRadius: '12px',
                border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: isSelected ? 'var(--nav-active-bg)' : 'transparent',
                color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
            >
              {city.shortName}
            </button>
          );
        })}
      </div>

      {/* ── 1. MAP — WHERE ────────────────────────────────────── */}
      <Section
        label="Geospatial Impact Area"
        right={
          metadata?.location
            ? `${metadata.location} (${selectedLocation.lat.toFixed(3)}°N, ${selectedLocation.lon.toFixed(3)}°E)`
            : selectedLocation.name
        }
        noPadding
      >
        <RiskMap
          metadata={{
            ...metadata,
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lon,
            location: metadata?.location || selectedLocation.name,
          }}
          prediction={prediction}
          height={400}
          zoom={7}
        />
      </Section>

      {/* ── 2. Risk summary + Probability side by side ─────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* WHAT + HOW CONFIDENT */}
        <div style={{ borderRight: '1px solid var(--border)' }}>
          <div
            style={{
              padding: '11px 28px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-surface)',
            }}
          >
            <span className="label">Current Risk Classification</span>
          </div>
          <RiskCard
            prediction={prediction}
            metadata={{
              ...metadata,
              location: metadata?.location || selectedLocation.name,
              latitude: selectedLocation.lat,
              longitude: selectedLocation.lon,
            }}
          />
        </div>

        {/* PROBABILITY DISTRIBUTION */}
        <div>
          <div
            style={{
              padding: '11px 28px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-surface)',
            }}
          >
            <span className="label">Risk Probability Distribution</span>
          </div>
          <div style={{ padding: '20px 28px 24px' }}>
            <ProbabilityChart probabilities={probabilities} />
          </div>
        </div>
      </div>

      {/* ── 3. FEATURE CONTRIBUTIONS — WHY ────────────────────── */}
      <Section label="Explainable AI — Meteorological & Satellite Feature Attribution">
        <div style={{ paddingTop: '16px' }}>
          <SHAPChart shap={xai?.shap} loading={false} />
        </div>
      </Section>

      {/* ── 4. MODEL EVIDENCE — SATELLITE + GRAD-CAM ──────────── */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <div
          style={{
            padding: '11px 28px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-surface)',
          }}
        >
          <span className="label">Satellite Observation Evidence & Spatial Attention</span>
        </div>
        <EvidenceViewer
          gradcam={xai?.gradcam}
          metadata={{
            timestamp: metadata?.timestamp,
            channel_label: metadata?.source,
            location: metadata?.location || selectedLocation.name,
          }}
          loading={false}
        />
      </div>
    </main>
  );
}
