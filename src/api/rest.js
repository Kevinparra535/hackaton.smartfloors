/**
 * REST API Client for SmartFloors Backend
 * Provides functions to fetch data from REST endpoints
 */

const BASE_URL = 'http://localhost:3000/api/v1';

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
const apiFetch = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error en la petición');
    }

    return data;
  } catch (error) {
    console.error(`❌ [REST API Error] ${endpoint}:`, error.message);
    throw error;
  }
};

/**
 * Fetch all floors data
 * @returns {Promise<Array>} Array of floor objects
 */
export const fetchAllFloors = async () => {
  console.log('📡 [REST API] Fetching all floors...');
  const response = await apiFetch('/floors');
  console.log('✅ [REST API] Floors loaded:', response.data.length);
  return response.data;
};

/**
 * Fetch single floor by ID
 * @param {number} floorId - Floor ID (1-100)
 * @returns {Promise<object>} Floor object
 */
export const fetchFloorById = async (floorId) => {
  console.log(`📡 [REST API] Fetching floor ${floorId}...`);
  const response = await apiFetch(`/floors/${floorId}`);
  console.log(`✅ [REST API] Floor ${floorId} loaded`);
  return response.data;
};

/**
 * Fetch floor statistics
 * @returns {Promise<object>} Statistics object
 */
export const fetchFloorStats = async () => {
  console.log('📡 [REST API] Fetching floor statistics...');
  const response = await apiFetch('/floors/stats');
  console.log('✅ [REST API] Statistics loaded');
  return response.data;
};

/**
 * Fetch floor history
 * @param {number} floorId - Floor ID
 * @param {number} limit - Number of records to fetch (1-1440)
 * @returns {Promise<Array>} Array of historical records
 */
export const fetchFloorHistory = async (floorId, limit = 60) => {
  console.log(`📡 [REST API] Fetching history for floor ${floorId} (limit: ${limit})...`);
  const response = await apiFetch(`/floors/${floorId}/history?limit=${limit}`);
  console.log(`✅ [REST API] History loaded: ${response.data.history.length} records`);
  return response.data;
};

/**
 * Fetch floor predictions
 * @param {number} floorId - Floor ID
 * @param {number} minutesAhead - Minutes to predict (10-180)
 * @returns {Promise<object>} Predictions object
 */
export const fetchFloorPredictions = async (floorId, minutesAhead = 60) => {
  console.log(`📡 [REST API] Fetching predictions for floor ${floorId} (${minutesAhead} min)...`);
  const response = await apiFetch(`/floors/${floorId}/predictions?minutesAhead=${minutesAhead}`);
  console.log(`✅ [REST API] Predictions loaded for floor ${floorId}`);
  return response.data;
};

/**
 * Fetch all alerts
 * @returns {Promise<Array>} Array of alert objects
 */
export const fetchAlerts = async () => {
  console.log('📡 [REST API] Fetching alerts...');
  const response = await apiFetch('/alerts');
  console.log(`✅ [REST API] Alerts loaded: ${response.data.alerts.length} active`);
  return response.data.alerts;
};

/**
 * Check server health
 * @returns {Promise<object>} Health status object
 */
export const checkHealth = async () => {
  console.log('📡 [REST API] Checking server health...');
  const response = await fetch('http://localhost:3000/health');
  const data = await response.json();
  console.log('✅ [REST API] Server status:', data.status);
  return data;
};

// Export all functions
export default {
  fetchAllFloors,
  fetchFloorById,
  fetchFloorStats,
  fetchFloorHistory,
  fetchFloorPredictions,
  fetchAlerts,
  checkHealth
};
