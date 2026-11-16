/**
 * useLatestPrediction.js
 * Polls getLatest(lat, lon, city) on a configurable interval.
 * Components see: { data, loading, error, refetch }
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { getLatest, POLLING_INTERVAL_MS } from '../services/api.js';

export function useLatestPrediction(lat, lon, city) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const intervalRef = useRef(null);

  // Memoize the fetch function so it updates when lat/lon/city change
  const fetch = useCallback(async (fetchLat = lat, fetchLon = lon, fetchCity = city) => {
    setError(null);
    try {
      const result = await getLatest(fetchLat, fetchLon, fetchCity);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [lat, lon, city]);

  // Re-run the fetch and reset the polling timer whenever the location changes
  useEffect(() => {
    setLoading(true); // Trigger loading UI immediately on location change
    fetch();

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetch, POLLING_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [fetch]);

  // Allow manual refetching, optionally overriding coordinates/city
  const refetch = useCallback((overrideLat, overrideLon, overrideCity) => {
    setLoading(true);
    fetch(overrideLat, overrideLon, overrideCity);
  }, [fetch]);

  return { data, loading, error, refetch };
}
