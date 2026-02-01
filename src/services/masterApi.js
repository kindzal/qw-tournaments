// src/services/masterApi.js
import axios from 'axios';

const MASTER_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!MASTER_API_BASE_URL) {
  console.warn('VITE_API_BASE_URL is not defined. Please set it in your .env file.');
}

/**
 * Creates an axios instance for master API
 */
const masterApiClient = axios.create({
  baseURL: MASTER_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generic error handler for API requests
 */
const handleApiError = (error, endpoint) => {
  console.error(`Master API Error (${endpoint}):`, error);
  
  if (error.response) {
    throw new Error(`Server error: ${error.response.status} - ${error.response.statusText}`);
  } else if (error.request) {
    throw new Error('No response from server. Please check your connection.');
  } else {
    throw new Error(`Request failed: ${error.message}`);
  }
};

/**
 * Fetch all tournaments
 * @returns {Promise<Array>} Array of tournament objects
 */
export const fetchTournaments = async () => {
  try {
    
	 const response = await masterApiClient.get('', {
      params: { action: 'tournaments' }
    });
    
    // Filter out Hidden and Cancelled tournaments
    const filtered = response.data.filter(
      t => t.status !== 'Hidden' && t.status !== 'Cancelled'
    );
    
    return filtered;
  } catch (error) {
    handleApiError(error, 'tournaments');
  }
};

/**
 * Fetch all tournaments including hidden/cancelled (for dropdown)
 * @returns {Promise<Array>} Array of all tournament objects
 */
export const fetchAllTournaments = async () => {
  try {
     const response = await masterApiClient.get('', {
      params: { action: 'tournaments' }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'tournaments (all)');
  }
};

/**
 * Fetch single tournament by slug
 * @param {string} slug - Tournament slug
 * @returns {Promise<Object>} Tournament object
 */
export const fetchTournamentBySlug = async (slug) => {
  try {
    
	const response = await masterApiClient.get('', {
      params: { action: 'tournament', slug: '${slug}'}
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `tournament/${slug}`);
  }
};

export default {
  fetchTournaments,
  fetchAllTournaments,
  fetchTournamentBySlug
};
