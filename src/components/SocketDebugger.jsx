import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getSocket } from '../api/socket';

const DebugPanel = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid #646cff;
  border-radius: 8px;
  padding: 16px;
  max-width: 400px;
  max-height: 400px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  z-index: 9999;
  box-shadow: 0 4px 16px rgba(100, 108, 255, 0.3);
`;

const Title = styled.h3`
  color: #646cff;
  margin: 0 0 12px 0;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Status = styled.div`
  color: ${(props) => (props.$connected ? '#00ff88' : '#ff4d4f')};
  font-weight: bold;
  margin-bottom: 12px;

  &::before {
    content: '●';
    margin-right: 6px;
  }
`;

const Info = styled.div`
  color: #ffffff;
  margin-bottom: 8px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

const Label = styled.span`
  color: #646cff;
  font-weight: bold;
`;

const EventLog = styled.div`
  margin-top: 12px;
  max-height: 200px;
  overflow-y: auto;
  border-top: 1px solid rgba(100, 108, 255, 0.3);
  padding-top: 8px;
`;

const Event = styled.div`
  color: #00ff88;
  margin-bottom: 4px;
  font-size: 11px;
  padding: 4px;
  background: rgba(0, 255, 136, 0.05);
  border-radius: 3px;
  word-wrap: break-word;
`;

const CloseButton = styled.button`
  background: transparent;
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;

  &:hover {
    background: rgba(255, 77, 79, 0.1);
  }
`;

const ClearButton = styled.button`
  background: transparent;
  border: 1px solid #646cff;
  color: #646cff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  margin-top: 8px;
  width: 100%;

  &:hover {
    background: rgba(100, 108, 255, 0.1);
  }
`;

/**
 * SocketDebugger - Visual debugging component for WebSocket
 * Add this to App.jsx temporarily: <SocketDebugger />
 */
export default function SocketDebugger() {
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState(null);
  const [transport, setTransport] = useState(null);
  const [events, setEvents] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const socket = getSocket();

    const updateStatus = () => {
      setIsConnected(socket.connected);
      setSocketId(socket.id);
      setTransport(socket.io?.engine?.transport?.name);
    };

    const logEvent = (eventName, data) => {
      const timestamp = new Date().toLocaleTimeString();
      setEvents((prev) => [
        { timestamp, eventName, data: JSON.stringify(data, null, 2) },
        ...prev.slice(0, 19) // Keep last 20 events
      ]);
    };

    // Listen to connection events
    socket.on('connect', () => {
      updateStatus();
      logEvent('connect', { id: socket.id });
    });

    socket.on('disconnect', (reason) => {
      updateStatus();
      logEvent('disconnect', { reason });
    });

    socket.on('connect_error', (error) => {
      logEvent('connect_error', { message: error.message });
    });

    // Listen to custom events
    socket.on('floorData', (data) => {
      logEvent('floorData', data);
    });

    socket.on('alert', (data) => {
      logEvent('alert', data);
    });

    socket.on('predictions', (data) => {
      logEvent('predictions', data);
    });

    // Initial status
    updateStatus();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('floorData');
      socket.off('alert');
      socket.off('predictions');
    };
  }, []);

  if (!isVisible) return null;

  return (
    <DebugPanel>
      <Title>
        🔍 WebSocket Debugger
        <CloseButton onClick={() => setIsVisible(false)}>✕</CloseButton>
      </Title>

      <Status $connected={isConnected}>{isConnected ? 'CONNECTED' : 'DISCONNECTED'}</Status>

      {isConnected && (
        <>
          <Info>
            <Label>Socket ID:</Label> {socketId || 'N/A'}
          </Info>
          <Info>
            <Label>Transport:</Label> {transport || 'N/A'}
          </Info>
        </>
      )}

      <Info>
        <Label>URL:</Label> http://localhost:3000
      </Info>

      <EventLog>
        <Label>Event Log ({events.length}):</Label>
        {events.length === 0 ? (
          <Event style={{ color: '#888' }}>No events yet...</Event>
        ) : (
          events.map((event, idx) => (
            <Event key={idx}>
              <strong>[{event.timestamp}]</strong> {event.eventName}
              <br />
              {event.data}
            </Event>
          ))
        )}
      </EventLog>

      <ClearButton onClick={() => setEvents([])}>Clear Events</ClearButton>
    </DebugPanel>
  );
}
