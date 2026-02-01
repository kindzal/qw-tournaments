// src/services/api.js
import axios from 'axios';

/**
 * Generic error handler for API requests
 */
const handleApiError = (error, endpoint) => {
  console.error(`API Error (${endpoint}):`, error);
  
  if (error.response) {
    // Server responded with error status
    throw new Error(`Server error: ${error.response.status} - ${error.response.statusText}`);
  } else if (error.request) {
    // Request made but no response received
    throw new Error('No response from server. Please check your connection.');
  } else {
    // Error setting up the request
    throw new Error(`Request failed: ${error.message}`);
  }
};

/**
 * Create axios client with dynamic base URL
 */
const createApiClient = (baseURL) => {
  return axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Fetch standings data
 * @param {string} baseApiUrl - Base API URL for the tournament
 * @returns {Promise<Array>} Array of standings objects
 */
export const fetchStandings = async (baseApiUrl) => {
  try {
    const client = createApiClient(baseApiUrl);
    const response = await client.get('', {
      params: { endpoint: 'standings' }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'standings');
  }
};

/**
 * Fetch players data
 * @param {string} baseApiUrl - Base API URL for the tournament
 * @returns {Promise<Array>} Array of player objects with statistics
 */
export const fetchPlayers = async (baseApiUrl) => {
  try {
    const client = createApiClient(baseApiUrl);
    const response = await client.get('', {
      params: { endpoint: 'players' }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'players');
  }
};

/**
 * Fetch group stage games
 * @param {string} baseApiUrl - Base API URL for the tournament
 * @returns {Promise<Array>} Array of group game objects
 */
export const fetchGroupGames = async (baseApiUrl) => {
  try {
    const client = createApiClient(baseApiUrl);
    const response = await client.get('', {
      params: { endpoint: 'groupGames' }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'groupGames');
  }
};

/**
 * Fetch playoff games
 * @param {string} baseApiUrl - Base API URL for the tournament
 * @returns {Promise<Array>} Array of playoff game objects
 */
export const fetchPlayoffGames = async (baseApiUrl) => {
  try {
    const client = createApiClient(baseApiUrl);
    const response = await client.get('', {
      params: { endpoint: 'playoffGames' }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'playoffGames');
  }
};

/**
 * Fetch teams data
 * @param {string} baseApiUrl - Base API URL for the tournament
 * @returns {Promise<Array>} Array of team objects
 */
export const fetchTeams = async (baseApiUrl) => {
  try {
    const client = createApiClient(baseApiUrl);
    const response = await client.get('', {
      params: { endpoint: 'teams' }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'teams');
  }
};

/**
 * Fetch schedule configuration
 * @param {string} baseApiUrl - Base API URL for the tournament
 * @returns {Promise<Array>} Array of schedule config objects
 */
export const fetchScheduleConfig = async (baseApiUrl) => {
  try {
    const client = createApiClient(baseApiUrl);
    const response = await client.get('', {
      params: { endpoint: 'scheduleConfig' }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'scheduleConfig');
  }
};

/**
 * Fetch all games (optional - combines group and playoff games)
 * @param {string} baseApiUrl - Base API URL for the tournament
 * @returns {Promise<Array>} Array of all game objects
 */
export const fetchAllGames = async (baseApiUrl) => {
  try {
    const client = createApiClient(baseApiUrl);
    const response = await client.get('', {
      params: { endpoint: 'allGames' }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'allGames');
  }
};

export default {
  fetchStandings,
  fetchPlayers,
  fetchGroupGames,
  fetchPlayoffGames,
  fetchTeams,
  fetchScheduleConfig,
  fetchAllGames
};
