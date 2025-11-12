import styled from 'styled-components';

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

const InfoTitle = styled.h2`
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #646cff;
  text-align: center;
  border-bottom: 2px solid rgba(100, 108, 255, 0.3);
  padding-bottom: 12px;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const MetricCard = styled.div`
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(100, 108, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(100, 108, 255, 0.6);
    transform: translateY(-2px);
  }
`;

const MetricLabel = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 6px;
`;

const MetricValue = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #00ff88;
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

/**
 * FloorInfoPanel - 3D HTML panel displaying floor metrics
 * @param {Object} props
 * @param {Object} props.floorData - Floor data to display
 * @param {Function} props.onClose - Callback when close button is clicked
 * @param {Function} props.onViewCharts - Callback when view charts button is clicked
 */
export default function FloorInfoPanel({ floorData, onClose, onViewCharts }) {
  if (!floorData) return null;

  const handleClose = (e) => {
    e.stopPropagation();
    if (onClose) onClose();
  };

  const handleViewCharts = (e) => {
    e.stopPropagation();
    if (onViewCharts) onViewCharts();
  };

  return (
    <InfoContainer style={{ pointerEvents: 'auto', position: 'relative' }}>
      <CloseButton onClick={handleClose}>✕ Cerrar</CloseButton>

      <InfoTitle>{floorData.name || `Piso ${floorData.floorId}`} - Métricas</InfoTitle>

      <MetricGrid>
        <MetricCard>
          <MetricLabel>🌡️ Temperatura</MetricLabel>
          <MetricValue>{floorData.temperature?.toFixed(1)}°C</MetricValue>
        </MetricCard>

        <MetricCard>
          <MetricLabel>💧 Humedad</MetricLabel>
          <MetricValue>{floorData.humidity?.toFixed(1)}%</MetricValue>
        </MetricCard>

        <MetricCard>
          <MetricLabel>⚡ Consumo</MetricLabel>
          <MetricValue>{floorData.powerConsumption?.toFixed(1)} kW</MetricValue>
        </MetricCard>

        <MetricCard>
          <MetricLabel>👥 Ocupación</MetricLabel>
          <MetricValue>{floorData.occupancy?.toFixed(0)}%</MetricValue>
        </MetricCard>

        <MetricCard style={{ gridColumn: 'span 2' }}>
          <MetricLabel>📊 Estado</MetricLabel>
          <MetricValue style={{ fontSize: '16px', textTransform: 'capitalize' }}>
            {floorData.status === 'normal' && '✅ Normal'}
            {floorData.status === 'warning' && '⚠️ Advertencia'}
            {floorData.status === 'danger' && '🚨 Peligro'}
          </MetricValue>
        </MetricCard>
      </MetricGrid>

      <ViewChartsButton onClick={handleViewCharts}>
        📈 Ver Gráficas de Tendencia
      </ViewChartsButton>
    </InfoContainer>
  );
}
