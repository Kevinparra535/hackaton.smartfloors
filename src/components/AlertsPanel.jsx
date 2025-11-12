import { AnimatePresence } from 'framer-motion';
import {
  Panel,
  Title,
  AlertItem,
  AlertHeader,
  AlertFloor,
  AlertTime,
  AlertMessage,
  EmptyState
} from '../styles/AlertsPanel.styled';

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
      <Title>🚨 Alertas Recientes</Title>
      <AnimatePresence mode='popLayout'>
        {alerts.length === 0 ? (
          <EmptyState>Sin alertas por el momento. Todos los sistemas normales.</EmptyState>
        ) : (
          alerts.map((alert) => {
            // Prioritize severity over status, normalize values
            const severityValue = alert.severity || alert.status || 'normal';

            return (
              <AlertItem
                key={alert.id}
                $severity={severityValue}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertHeader>
                  <AlertFloor>
                    {alert.isPredictive && '🔮 '}
                    {alert.floorName || alert.name || `Piso ${alert.floorId || alert.floor}`}
                  </AlertFloor>
                  <AlertTime>{formatTime(alert.timestamp)}</AlertTime>
                </AlertHeader>
                <AlertMessage>
                  {alert.message ||
                    `${alert.type || 'Alerta'}: ${alert.value || 'Anomalía detectada'}`}
                  {alert.minutesAhead && ` (en ${alert.minutesAhead} min)`}
                </AlertMessage>
                {alert.recommendation && severityValue === 'danger' && (
                  <AlertMessage style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.3rem' }}>
                    💡 {alert.recommendation}
                  </AlertMessage>
                )}
              </AlertItem>
            );
          })
        )}
      </AnimatePresence>
    </Panel>
  );
}
