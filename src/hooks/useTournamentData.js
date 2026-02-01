// src/hooks/useTournamentData.js
import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

/**
 * Generic hook for fetching data with loading and error states
 * @param {Function} fetchFunction - API function to call
 * @param {Array} dependencies - Dependencies array for useEffect
 * @returns {Object} { data, loading, error, refetch }
 */
const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook to fetch standings
 */
export const useStandings = () => {
  return useFetch(api.fetchStandings);
};

/**
 * Hook to fetch players
 */
export const usePlayers = () => {
  return useFetch(api.fetchPlayers);
};

/**
 * Hook to fetch group games
 */
export const useGroupGames = () => {
  return useFetch(api.fetchGroupGames);
};

/**
 * Hook to fetch playoff games
 */
export const usePlayoffGames = () => {
  return useFetch(api.fetchPlayoffGames);
};

/**
 * Hook to fetch teams
 */
export const useTeams = () => {
  return useFetch(api.fetchTeams);
};

/**
 * Hook to fetch schedule config
 */
export const useScheduleConfig = () => {
  return useFetch(api.fetchScheduleConfig);
};

/**
 * Hook to fetch all games
 */
export const useAllGames = () => {
  return useFetch(api.fetchAllGames);
};

/**
 * Hook to fetch all tournament data at once
 * Useful for initial application load
 */
export const useAllTournamentData = () => {
  const [data, setData] = useState({
    standings: null,
    players: null,
    groupGames: null,
    playoffGames: null,
    teams: null,
    scheduleConfig: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.fetchAllTournamentData();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching tournament data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, loading, error, refetch: fetchAll };
};

/**
 * Hook with auto-refresh capability
 * @param {Function} fetchFunction - API function to call
 * @param {number} intervalMs - Refresh interval in milliseconds (0 to disable)
 */
export const useAutoRefresh = (fetchFunction, intervalMs = 0) => {
  const { data, loading, error, refetch } = useFetch(fetchFunction);

  useEffect(() => {
    if (intervalMs > 0) {
      const interval = setInterval(() => {
        refetch();
      }, intervalMs);

      return () => clearInterval(interval);
    }
  }, [intervalMs, refetch]);

  return { data, loading, error, refetch };
};
