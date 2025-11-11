import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const Panel = styled.div`
  background: rgba(26, 26, 26, 0.95);
  border-radius: 12px;
  padding: 20px;
  width: 320px;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid rgba(100, 108, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(100, 108, 255, 0.5);
    border-radius: 3px;
  }
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 1.4rem;
  margin: 0 0 16px 0;
  font-weight: 600;
`;

const AlertItem = styled(motion.div)`
  background: ${(props) => {
    switch (props.$severity) {
      case 'danger':
        return 'rgba(255, 77, 79, 0.15)';
      case 'warning':
        return 'rgba(255, 217, 102, 0.15)';
      default:
        return 'rgba(0, 255, 136, 0.15)';
    }
  }};
  border-left: 3px solid
    ${(props) => {
      switch (props.$severity) {
        case 'danger':
          return '#ff4d4f';
        case 'warning':
          return '#ffd966';
        default:
          return '#00ff88';
      }
    }};
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
`;

const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const AlertFloor = styled.span`
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
`;

const AlertTime = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
`;

const AlertMessage = styled.p`
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
`;

const EmptyState = styled.div`
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  padding: 40px 20px;
  font-size: 0.9rem;
`;

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * AlertsPanel component - Displays recent alerts with animations
 * @param {Object} props
 * @param {Array} props.alerts - Array of alert objects
 */
export default function AlertsPanel({ alerts }) {
  return (
    <Panel>
      <Title>🚨 Recent Alerts</Title>
      <AnimatePresence mode='popLayout'>
        {alerts.length === 0 ? (
          <EmptyState>No alerts at the moment. All systems normal.</EmptyState>
        ) : (
          alerts.map((alert) => (
            <AlertItem
              key={alert.id}
              $severity={alert.status || alert.severity || 'normal'}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertHeader>
                <AlertFloor>Floor {alert.floor}</AlertFloor>
                <AlertTime>{formatTime(alert.timestamp)}</AlertTime>
              </AlertHeader>
              <AlertMessage>
                {alert.message || `${alert.type || 'Alert'}: ${alert.value || 'Anomaly detected'}`}
              </AlertMessage>
            </AlertItem>
          ))
        )}
      </AnimatePresence>
    </Panel>
  );
}
