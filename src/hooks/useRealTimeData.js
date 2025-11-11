import { useState, useEffect, useCallback } from 'react';
import {
  subscribeToFloorData,
  subscribeToAlerts,
  subscribeToPredictions,
  disconnectSocket
} from '../api/socket';

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
  const handleAlert = useCallback((alert) => {
    const newAlert = {
      ...alert,
      id: Date.now(),
      timestamp: alert.timestamp || new Date().toISOString()
    };

    setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
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

  useEffect(() => {
    // Subscribe to real-time data
    subscribeToFloorData(handleFloorData);
    subscribeToAlerts(handleAlert);
    subscribeToPredictions(handlePredictions);

    setIsConnected(true);

    // Cleanup on unmount
    return () => {
      disconnectSocket();
      setIsConnected(false);
    };
  }, [handleFloorData, handleAlert, handlePredictions]);

  return {
    floorData,
    predictions,
    alerts,
    isConnected
  };
};
