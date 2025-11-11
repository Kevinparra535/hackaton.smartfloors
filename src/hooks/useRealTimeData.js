import { useState, useEffect, useCallback } from 'react';
import {
  subscribeToFloorData,
  subscribeToAlerts,
  subscribeToPredictions,
  disconnectSocket
} from '../api/socket';
import { fetchAllFloors, fetchAlerts } from '../api/rest';

const INITIAL_FLOOR_DATA = {
  1: {
    floorId: 1,
    name: 'Piso 1',
    occupancy: 0,
    temperature: 22,
    humidity: 45,
    powerConsumption: 120,
    status: 'normal',
    timestamp: new Date().toISOString()
  },
  2: {
    floorId: 2,
    name: 'Piso 2',
    occupancy: 0,
    temperature: 22,
    humidity: 45,
    powerConsumption: 120,
    status: 'normal',
    timestamp: new Date().toISOString()
  },
  3: {
    floorId: 3,
    name: 'Piso 3',
    occupancy: 0,
    temperature: 22,
    humidity: 45,
    powerConsumption: 120,
    status: 'normal',
    timestamp: new Date().toISOString()
  },
  4: {
    floorId: 4,
    name: 'Piso 4',
    occupancy: 0,
    temperature: 22,
    humidity: 45,
    powerConsumption: 120,
    status: 'normal',
    timestamp: new Date().toISOString()
  },
  5: {
    floorId: 5,
    name: 'Piso 5',
    occupancy: 0,
    temperature: 22,
    humidity: 45,
    powerConsumption: 120,
    status: 'normal',
    timestamp: new Date().toISOString()
  }
};

/**
 * Determine floor status based on environmental conditions
 * @param {Object} floor - Floor data
 * @returns {string} Status: 'normal', 'warning', or 'danger'
 */
const getFloorStatus = (floor) => {
  const { temperature, humidity, powerConsumption } = floor;

  // Danger conditions
  if (temperature > 26 || temperature < 18) return 'danger';
  if (humidity > 70 || humidity < 30) return 'danger';
  if (powerConsumption > 150) return 'danger';

  // Warning conditions
  if (temperature > 24 || temperature < 20) return 'warning';
  if (humidity > 60 || humidity < 35) return 'warning';
  if (powerConsumption > 135) return 'warning';

  return 'normal';
};

/**
 * Custom hook to manage real-time floor data and alerts
 * @returns {Object} Floor data, alerts, and connection status
 */
export const useRealTimeData = () => {
  const [floorData, setFloorData] = useState(INITIAL_FLOOR_DATA);
  const [predictions, setPredictions] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle incoming floor data
  const handleFloorData = useCallback((data) => {
    console.log('📊 Processing floor data:', data);

    // Handle array of floors from backend
    if (data.floors && Array.isArray(data.floors)) {
      const updatedFloors = {};

      data.floors.forEach((floor) => {
        const status = getFloorStatus(floor);
        updatedFloors[floor.floorId] = {
          ...floor,
          status
        };
      });

      setFloorData(updatedFloors);
    }
    // Handle single floor update (if backend sends individual updates)
    else if (data.floorId) {
      const status = getFloorStatus(data);
      setFloorData((prev) => ({
        ...prev,
        [data.floorId]: {
          ...data,
          status
        }
      }));
    }
  }, []);

  // Handle incoming alerts
  const handleAlert = useCallback((alertData) => {
    console.log('🚨 Processing alert:', alertData);

    // Backend sends alerts with anomalies array inside
    // Format: { floorId, floorName, anomalies: [...], timestamp, severity }
    if (alertData.anomalies && Array.isArray(alertData.anomalies)) {
      const newAlerts = alertData.anomalies.map((anomaly, index) => ({
        id: `${alertData.floorId}_${alertData.timestamp}_${index}`,
        floorId: alertData.floorId,
        floorName: alertData.floorName,
        type: anomaly.type,
        severity: anomaly.severity,
        message: anomaly.message,
        value: anomaly.value,
        recommendation: anomaly.recommendation,
        timestamp: anomaly.timestamp || alertData.timestamp
      }));

      // Add new alerts to the beginning, keep last 10
      setAlerts((prev) => [...newAlerts, ...prev].slice(0, 10));
    }
  }, []);

  // Handle incoming predictions
  const handlePredictions = useCallback((data) => {
    console.log('🔮 Processing predictions:', data);

    if (data.predictions && Array.isArray(data.predictions)) {
      const updatedPredictions = {};

      data.predictions.forEach((floorPrediction) => {
        updatedPredictions[floorPrediction.floorId] = floorPrediction.predictions;
      });

      setPredictions(updatedPredictions);
    }
  }, []);

  // Load initial data from REST API
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('🔄 [useRealTimeData] Loading initial data from REST API...');
      setIsLoading(true);

      try {
        // Fetch initial floor data
        const floors = await fetchAllFloors();

        // Process floors with status calculation
        const processedFloors = {};
        floors.forEach((floor) => {
          const status = getFloorStatus(floor);
          processedFloors[floor.floorId] = {
            ...floor,
            status
          };
        });

        setFloorData(processedFloors);
        console.log('✅ [useRealTimeData] Initial floor data loaded:', floors.length, 'floors');

        // Fetch initial alerts
        try {
          const alertsData = await fetchAlerts();

          // Backend returns alerts with anomalies array
          // Format each alert's anomaly as a separate alert for display
          const formattedAlerts = [];

          alertsData.forEach((alertGroup) => {
            if (alertGroup.anomalies && Array.isArray(alertGroup.anomalies)) {
              alertGroup.anomalies.forEach((anomaly, index) => {
                formattedAlerts.push({
                  id: `${alertGroup.floorId}_${alertGroup.timestamp}_${index}`,
                  floorId: alertGroup.floorId,
                  floorName: alertGroup.floorName,
                  type: anomaly.type,
                  severity: anomaly.severity,
                  message: anomaly.message,
                  value: anomaly.value,
                  recommendation: anomaly.recommendation,
                  timestamp: anomaly.timestamp || alertGroup.timestamp
                });
              });
            }
          });

          // Sort by timestamp (newest first) and take last 10
          formattedAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setAlerts(formattedAlerts.slice(0, 10));

          console.log(
            '✅ [useRealTimeData] Initial alerts loaded:',
            formattedAlerts.length,
            'alerts'
          );
        } catch (alertError) {
          console.warn('⚠️ [useRealTimeData] Could not load alerts:', alertError.message);
          // Continue without alerts - not critical
        }

        setIsLoading(false);
      } catch (error) {
        console.error('❌ [useRealTimeData] Error loading initial data:', error.message);
        setIsLoading(false);
        // Keep using INITIAL_FLOOR_DATA as fallback
      }
    };

    loadInitialData();
  }, []);

  // Subscribe to WebSocket updates
  useEffect(() => {
    console.log('🔌 [useRealTimeData] Subscribing to WebSocket events...');

    // Subscribe to real-time data
    subscribeToFloorData(handleFloorData);
    subscribeToAlerts(handleAlert);
    subscribeToPredictions(handlePredictions);

    setIsConnected(true);

    // Cleanup on unmount
    return () => {
      console.log('🔌 [useRealTimeData] Disconnecting from WebSocket...');
      disconnectSocket();
      setIsConnected(false);
    };
  }, [handleFloorData, handleAlert, handlePredictions]);

  return {
    floorData,
    predictions,
    alerts,
    isConnected,
    isLoading
  };
};
