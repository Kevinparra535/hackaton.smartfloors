import { useState, useEffect, useCallback } from 'react';
import { subscribeToFloorData, subscribeToAlerts, disconnectSocket } from '../api/socket';

const INITIAL_FLOOR_DATA = {
  1: { floor: 1, temperature: 22, humidity: 45, energy: 2.1, status: 'normal' },
  2: { floor: 2, temperature: 24, humidity: 50, energy: 2.5, status: 'normal' },
  3: { floor: 3, temperature: 23, humidity: 48, energy: 2.3, status: 'normal' }
};

/**
 * Custom hook to manage real-time floor data and alerts
 * @returns {Object} Floor data, alerts, and connection status
 */
export const useRealTimeData = () => {
  const [floorData, setFloorData] = useState(INITIAL_FLOOR_DATA);
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Handle incoming floor data
  const handleFloorData = useCallback((data) => {
    setFloorData((prev) => ({
      ...prev,
      [data.floor]: data
    }));
  }, []);

  // Handle incoming alerts
  const handleAlert = useCallback((alert) => {
    const newAlert = {
      ...alert,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
  }, []);

  useEffect(() => {
    // Subscribe to real-time data
    subscribeToFloorData(handleFloorData);
    subscribeToAlerts(handleAlert);

    setIsConnected(true);

    // Cleanup on unmount
    return () => {
      disconnectSocket();
      setIsConnected(false);
    };
  }, [handleFloorData, handleAlert]);

  return {
    floorData,
    alerts,
    isConnected
  };
};
