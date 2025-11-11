import { io } from 'socket.io-client';

// WebSocket connection configuration
const SOCKET_URL = 'ws://localhost:3000';

let socket = null;

/**
 * Initialize and return socket connection
 * @returns {Socket} Socket.IO client instance
 */
export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      path: '/realtime',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('✅ Connected to SmartFloors backend');
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from backend');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
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

  socketInstance.on('floorData', (data) => {
    callback(data);
  });
};

/**
 * Subscribe to alerts
 * @param {Function} callback - Function to call with alert data
 */
export const subscribeToAlerts = (callback) => {
  const socketInstance = getSocket();

  socketInstance.on('alert', (alert) => {
    callback(alert);
  });
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
