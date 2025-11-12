import styled from 'styled-components';

import {
  InfoPanel,
  InfoTitle,
  MetricCard,
  MetricGrid,
  MetricLabel,
  MetricValue
} from '../styles/Sidebar.styled';

const InfoContainer = styled.div`
  width: 400px;
  background: rgba(10, 10, 10, 0.95);
  border: 2px solid #646cff;
  border-radius: 12px;
  padding: 20px;
  color: white;
  font-family: 'Inter', system-ui, sans-serif;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(100, 108, 255, 0.5);
  pointer-events: auto;

  &:hover {
    border-color: #00ff88;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 77, 79, 0.2);
  border: 1px solid #ff4d4f;
  border-radius: 6px;
  color: #ff4d4f;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 77, 79, 0.4);
    transform: scale(1.05);
  }
`;

const ViewChartsButton = styled.button`
  width: 100%;
  margin-top: 16px;
  background: rgba(100, 108, 255, 0.2);
  border: 2px solid #646cff;
  border-radius: 8px;
  color: #646cff;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: rgba(100, 108, 255, 0.4);
    border-color: #00ff88;
    color: #00ff88;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(100, 108, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ViewAlertsButton = styled.button`
  width: 100%;
  margin-top: 12px;
  background: rgba(255, 77, 79, 0.2);
  border: 2px solid #ff4d4f;
  border-radius: 8px;
  color: #ff4d4f;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: rgba(255, 77, 79, 0.4);
    border-color: #ffd966;
    color: #ffd966;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 77, 79, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

/**
 * FloorInfoPanel - 3D HTML panel displaying floor metrics
 * @param {Object} props
 * @param {Object} props.floorData - Floor data to display
 * @param {Function} props.onClose - Callback when close button is clicked
 * @param {Function} props.onViewCharts - Callback when view charts button is clicked
 * @param {Function} props.onViewAlerts - Callback when view alerts button is clicked
 */
export default function FloorInfoPanel({ floorData, onClose, onViewCharts, onViewAlerts }) {
  if (!floorData) return null;

  const handleClose = (e) => {
    e.stopPropagation();
    if (onClose) onClose();
  };

  const handleViewCharts = (e) => {
    e.stopPropagation();
    if (onViewCharts) onViewCharts();
  };

  const handleViewAlerts = (e) => {
    e.stopPropagation();
    if (onViewAlerts) onViewAlerts();
  };

  return (
    <InfoPanel>
      <InfoTitle>
        {floorData
          ? `${floorData.name || `Piso ${floorData.floorId}`} - Métricas`
          : 'Pasa el cursor sobre un piso'}

        <CloseButton onClick={handleClose}>✕ Cerrar</CloseButton>
      </InfoTitle>

      <MetricGrid>
        <MetricCard>
          <MetricLabel>🌡️ Temperatura</MetricLabel>
          <MetricValue>{floorData.temperature}°C</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>💧 Humedad</MetricLabel>
          <MetricValue>{floorData.humidity}%</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>⚡ Consumo</MetricLabel>
          <MetricValue>{floorData.powerConsumption} kW</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>� Ocupación</MetricLabel>
          <MetricValue>{floorData.occupancy}%</MetricValue>
        </MetricCard>
        <MetricCard style={{ gridColumn: 'span 2' }}>
          <MetricLabel>📊 Estado</MetricLabel>
          <MetricValue style={{ fontSize: '1rem', textTransform: 'capitalize' }}>
            {floorData.status === 'normal' && '✅ Normal'}
            {floorData.status === 'warning' && '⚠️ Advertencia'}
            {floorData.status === 'danger' && '🚨 Peligro'}
          </MetricValue>
        </MetricCard>
      </MetricGrid>

      <ViewChartsButton onClick={handleViewCharts}>📈 Ver Gráficas de Tendencia</ViewChartsButton>
      <ViewAlertsButton onClick={handleViewAlerts}>⚠️ Ver Tabla de Alertas</ViewAlertsButton>
    </InfoPanel>
  );
}
