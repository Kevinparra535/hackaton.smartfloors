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
  const response = await apiFetch('/floors');

  return response.data;
};

/**
 * Fetch single floor by ID
 * @param {number} floorId - Floor ID (1-100)
 * @returns {Promise<object>} Floor object
 */
export const fetchFloorById = async (floorId) => {
  const response = await apiFetch(`/floors/${floorId}`);

  return response.data;
};

/**
 * Fetch floor statistics
 * @returns {Promise<object>} Statistics object
 */
export const fetchFloorStats = async () => {
  const response = await apiFetch('/floors/stats');

  return response.data;
};

/**
 * Fetch floor history
 * @param {number} floorId - Floor ID
 * @param {number} limit - Number of records to fetch (1-1440)
 * @returns {Promise<Array>} Array of historical records
 */
export const fetchFloorHistory = async (floorId, limit = 60) => {
  const response = await apiFetch(`/floors/${floorId}/history?limit=${limit}`);

  return response.data;
};

/**
 * Fetch floor predictions
 * @param {number} floorId - Floor ID
 * @param {number} minutesAhead - Minutes to predict (10-180)
 * @returns {Promise<object>} Predictions object
 */
export const fetchFloorPredictions = async (floorId, minutesAhead = 60) => {
  const response = await apiFetch(`/floors/${floorId}/predictions?minutesAhead=${minutesAhead}`);

  return response.data;
};

/**
 * Fetch all alerts
 * @returns {Promise<Array>} Array of alert objects
 */
export const fetchAlerts = async () => {
  const response = await apiFetch('/alerts');

  return response.data.alerts;
};

/**
 * Fetch alerts with filters
 * @param {object} filters - Filter parameters
 * @param {string} filters.severity - Severity filter (critical, warning, info)
 * @param {number} filters.floorId - Floor ID filter (1-100)
 * @param {string} filters.type - Anomaly type filter
 * @param {number} filters.limit - Maximum results (1-100)
 * @param {boolean} filters.isPredictive - Filter predictive alerts
 * @param {string} filters.startDate - Start date (ISO 8601)
 * @param {string} filters.endDate - End date (ISO 8601)
 * @returns {Promise<object>} Alerts response with data and metadata
 */
export const fetchAlertsWithFilters = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  // Add filters to query string
  if (filters.severity && filters.severity !== 'all') {
    queryParams.append('severity', filters.severity);
  }
  if (filters.floorId && filters.floorId !== 'all') {
    queryParams.append('floorId', filters.floorId);
  }
  if (filters.type && filters.type !== 'all') {
    queryParams.append('type', filters.type);
  }
  if (filters.limit) {
    queryParams.append('limit', filters.limit);
  }
  if (filters.isPredictive !== undefined) {
    queryParams.append('isPredictive', filters.isPredictive);
  }
  if (filters.startDate) {
    queryParams.append('startDate', filters.startDate);
  }
  if (filters.endDate) {
    queryParams.append('endDate', filters.endDate);
  }

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/alerts?${queryString}` : '/alerts';

  const response = await apiFetch(endpoint);

  return {
    alerts: response.data.alerts,
    count: response.data.count,
    filters: response.data.filters || {}
  };
};

/**
 * Check server health
 * @returns {Promise<object>} Health status object
 */
export const checkHealth = async () => {
  const response = await fetch('http://localhost:3000/health');
  const data = await response.json();

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
  fetchAlertsWithFilters,
  checkHealth
};
