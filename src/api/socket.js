import { io } from 'socket.io-client';

// WebSocket connection configuration
const SOCKET_URL = 'http://localhost:3000';

let socket = null;
const ALERTS = 'new-alerts';
const FLOOR_DATA = 'floor-data';
const PREDICTIONS = 'predictions';

/**
 * Initialize and return socket connection
 * @returns {Socket} Socket.IO client instance
 */
export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    // Debugging: Log all events
    socket.onAny((eventName, ...args) => {
      console.log(`📡 [Socket Event] ${eventName}`, args);
    });

    socket.on('connect', () => {
      console.log('✅ Connected to SmartFloors backend');
      console.log('🔌 Socket ID:', socket.id);
      console.log('🚀 Transport:', socket.io.engine.transport.name);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from backend');
      console.log('📋 Reason:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message);
      console.error('📋 Error details:', error);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Reconnection attempt #', attemptNumber);
    });

    socket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error.message);
    });

    socket.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed after all attempts');
    });
  }

  return socket;
};

/**
 * Subscribe to floor data updates
 * @param {Function} callback - Function to call with floor data
 */
export const subscribeToFloorData = (callback) => {
  const socketInstance = getSocket();

  socketInstance.on(FLOOR_DATA, (data) => {
    callback(data);
  });

  console.log(`👂 Subscribed to ${FLOOR_DATA} events`);
};

/**
 * Subscribe to alerts
 * @param {Function} callback - Function to call with alert data
 */
export const subscribeToAlerts = (callback) => {
  const socketInstance = getSocket();

  socketInstance.on(ALERTS, (alert) => {
    callback(alert);
  });

  console.log(`👂 Subscribed to ${ALERTS} events`);
};

/**
 * Subscribe to predictions
 * @param {Function} callback - Function to call with predictions data
 */
export const subscribeToPredictions = (callback) => {
  const socketInstance = getSocket();

  socketInstance.on(PREDICTIONS, (predictions) => {
    callback(predictions);
  });

  console.log(`👂 Subscribed to ${PREDICTIONS} events`);
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
