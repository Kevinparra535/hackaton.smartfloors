import { useState, useEffect, useCallback } from 'react';
import {
  subscribeToFloorData,
  subscribeToAlerts,
  subscribeToPredictions,
  disconnectSocket
} from '../api/socket';
import { fetchAllFloors, fetchAlerts } from '../api/rest';
import { getFloorStatus } from '../utils/webSocket.utils';
import { mapSeverityToStatus } from '../utils/alertValidation';

/**
 * Custom hook to manage real-time floor data and alerts
 * @returns {Object} Floor data, alerts, and connection status
 */
export const useRealTimeData = () => {
  const [floorData, setFloorData] = useState();
  const [predictions, setPredictions] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleFloorData = useCallback((data) => {
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
    } else if (data.floorId) {
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

  const handleAlert = useCallback((alertData) => {
    if (alertData.alerts && Array.isArray(alertData.alerts)) {
      const allNewAlerts = [];

      alertData.alerts.forEach((alertGroup) => {
        if (alertGroup.anomalies && Array.isArray(alertGroup.anomalies)) {
          alertGroup.anomalies.forEach((anomaly, index) => {
            // Validate severity values
            const normalizedSeverity = anomaly.severity?.toLowerCase();
            const displaySeverity = mapSeverityToStatus(normalizedSeverity);

            const newAlert = {
              id: `${alertGroup.floorId}_${alertGroup.timestamp}_${index}`,
              floorId: alertGroup.floorId,
              floorName: alertGroup.floorName,
              type: anomaly.type,
              severity: displaySeverity, // Use normalized severity
              originalSeverity: anomaly.severity, // Keep original for debugging
              message: anomaly.message,
              value: anomaly.value,
              recommendation: anomaly.recommendation,
              isPredictive: anomaly.isPredictive || false,
              minutesAhead: anomaly.minutesAhead,
              timestamp: anomaly.timestamp || alertGroup.timestamp
            };

            allNewAlerts.push(newAlert);
          });
        }
      });

      setAlerts((prev) => [...allNewAlerts, ...prev].slice(0, 10));
    } else {
      console.warn('⚠️ [handleAlert] Invalid alert data - missing alerts array');
    }
  }, []);

  const handlePredictions = useCallback((data) => {
    ('🔮 [handlePredictions] Received predictions data:', data);

    if (data.predictions && Array.isArray(data.predictions)) {
      const updatedPredictions = {};

      data.predictions.forEach((floorPrediction) => {
        updatedPredictions[floorPrediction.floorId] = floorPrediction.predictions;
      });

      setPredictions(updatedPredictions);
    } else {
      console.warn('⚠️ [handlePredictions] Invalid predictions data structure:', data);
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);

      try {
        const floors = await fetchAllFloors();

        const processedFloors = {};
        floors.forEach((floor) => {
          const status = getFloorStatus(floor);
          processedFloors[floor.floorId] = {
            ...floor,
            status
          };
        });

        setFloorData(processedFloors);

        try {
          const alertsData = await fetchAlerts();

          const formattedAlerts = [];

          alertsData.forEach((alertGroup) => {
            if (alertGroup.anomalies && Array.isArray(alertGroup.anomalies)) {
              alertGroup.anomalies.forEach((anomaly, index) => {
                // Normalize severity for consistency
                const normalizedSeverity = anomaly.severity?.toLowerCase();
                const displaySeverity = mapSeverityToStatus(normalizedSeverity);

                formattedAlerts.push({
                  id: `${alertGroup.floorId}_${alertGroup.timestamp}_${index}`,
                  floorId: alertGroup.floorId,
                  floorName: alertGroup.floorName,
                  type: anomaly.type,
                  severity: displaySeverity, // Use normalized severity
                  originalSeverity: anomaly.severity,
                  message: anomaly.message,
                  value: anomaly.value,
                  recommendation: anomaly.recommendation,
                  isPredictive: anomaly.isPredictive || false,
                  minutesAhead: anomaly.minutesAhead,
                  timestamp: anomaly.timestamp || alertGroup.timestamp
                });
              });
            }
          });

          formattedAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setAlerts(formattedAlerts.slice(0, 10));
        } catch (alertError) {
          console.warn('⚠️ [useRealTimeData] Could not load alerts:', alertError.message);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('❌ [useRealTimeData] Error loading initial data:', error.message);
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    subscribeToFloorData(handleFloorData);
    subscribeToAlerts(handleAlert);
    subscribeToPredictions(handlePredictions);

    setIsConnected(true);

    return () => {
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
