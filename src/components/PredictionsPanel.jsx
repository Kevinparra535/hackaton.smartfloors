import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Panel = styled.div`
  background: rgba(26, 26, 26, 0.95);
  border-radius: 12px;
  padding: 20px;
  width: 320px;
  border: 1px solid rgba(100, 108, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  max-height: 500px;
  overflow-y: auto;

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

const TimeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(100, 108, 255, 0.5);
    border-radius: 2px;
  }
`;

const TimeButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${(props) => (props.$active ? '#646cff' : 'rgba(100, 108, 255, 0.3)')};
  background: ${(props) =>
    props.$active ? 'rgba(100, 108, 255, 0.3)' : 'rgba(100, 108, 255, 0.1)'};
  color: ${(props) => (props.$active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)')};
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    border-color: #646cff;
    background: rgba(100, 108, 255, 0.2);
  }
`;

const MetricCard = styled(motion.div)`
  background: rgba(100, 108, 255, 0.1);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(100, 108, 255, 0.2);
  margin-bottom: 12px;
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const MetricName = styled.div`
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Confidence = styled.div`
  color: ${(props) => {
    if (props.$value >= 0.9) return '#00ff88';
    if (props.$value >= 0.7) return '#ffd966';
    return '#ff4d4f';
  }};
  font-size: 0.75rem;
  font-weight: 600;
`;

const ValueRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.85rem;
`;

const Label = styled.span`
  color: rgba(255, 255, 255, 0.6);
`;

const Value = styled.span`
  color: #ffffff;
  font-weight: 600;
`;

const PredictedValue = styled(Value)`
  color: #646cff;
`;

const Trend = styled.span`
  color: ${(props) => {
    if (props.$direction === 'up') return '#ff4d4f';
    if (props.$direction === 'down') return '#00ff88';
    return '#ffd966';
  }};
  font-size: 1rem;
`;

const EmptyState = styled.div`
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  padding: 40px 20px;
  font-size: 0.9rem;
`;

const getTrend = (current, predicted) => {
  const diff = predicted - current;
  if (Math.abs(diff) < 1) return { direction: 'stable', icon: '→' };
  return diff > 0 ? { direction: 'up', icon: '↑' } : { direction: 'down', icon: '↓' };
};

const getMetricIcon = (metric) => {
  const icons = {
    temperature: '🌡️',
    humidity: '💧',
    powerConsumption: '⚡',
    occupancy: '👥'
  };
  return icons[metric] || '📊';
};

const getMetricUnit = (metric) => {
  const units = {
    temperature: '°C',
    humidity: '%',
    powerConsumption: 'kW',
    occupancy: '%'
  };
  return units[metric] || '';
};

/**
 * PredictionsPanel - Display predictions for selected floor
 * @param {Object} props
 * @param {Object} props.predictions - Predictions data for a floor
 * @param {string} props.floorName - Name of the floor
 */
export default function PredictionsPanel({ predictions, floorName }) {
  const [selectedTime, setSelectedTime] = useState(60); // Default to 60 minutes ahead

  if (!predictions || Object.keys(predictions).length === 0) {
    return (
      <Panel>
        <Title>🔮 Predicciones</Title>
        <EmptyState>
          {floorName
            ? 'No hay predicciones disponibles para este piso'
            : 'Selecciona un piso para ver predicciones'}
        </EmptyState>
      </Panel>
    );
  }

  // Get available time intervals from first metric
  const firstMetric = Object.values(predictions)[0];
  const timeIntervals = firstMetric?.predictions?.map((p) => p.minutesAhead) || [
    10, 20, 30, 40, 50, 60
  ];

  return (
    <Panel>
      <Title>🔮 Predicciones - {floorName}</Title>

      <TimeSelector>
        {timeIntervals.map((minutes) => (
          <TimeButton
            key={minutes}
            $active={selectedTime === minutes}
            onClick={() => setSelectedTime(minutes)}
          >
            +{minutes} min
          </TimeButton>
        ))}
      </TimeSelector>

      <AnimatePresence mode='wait'>
        {Object.entries(predictions).map(([metric, data]) => {
          if (metric === 'timestamp' || !data.predictions) return null;

          const selectedPrediction = data.predictions.find((p) => p.minutesAhead === selectedTime);
          if (!selectedPrediction) return null;

          const predictedValue = selectedPrediction[metric];
          const currentValue = data.currentValue;
          const trend = getTrend(currentValue, predictedValue);

          return (
            <MetricCard
              key={metric}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <MetricHeader>
                <MetricName>
                  {getMetricIcon(metric)}
                  {metric === 'powerConsumption'
                    ? 'Consumo'
                    : metric.charAt(0).toUpperCase() + metric.slice(1)}
                </MetricName>
                <Confidence $value={data.confidence}>
                  {Math.round(data.confidence * 100)}% confianza
                </Confidence>
              </MetricHeader>

              <ValueRow>
                <Label>Actual:</Label>
                <Value>
                  {currentValue.toFixed(1)} {getMetricUnit(metric)}
                </Value>
              </ValueRow>

              <ValueRow>
                <Label>Predicción:</Label>
                <PredictedValue>
                  {predictedValue.toFixed(1)} {getMetricUnit(metric)}{' '}
                  <Trend $direction={trend.direction}>{trend.icon}</Trend>
                </PredictedValue>
              </ValueRow>

              <ValueRow style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                <Label>Método:</Label>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{data.method}</span>
              </ValueRow>
            </MetricCard>
          );
        })}
      </AnimatePresence>
    </Panel>
  );
}
