import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Panel,
  Title,
  TimeSelector,
  TimeButton,
  MetricCard,
  MetricHeader,
  MetricName,
  Confidence,
  ValueRow,
  Label,
  Value,
  PredictedValue,
  Trend,
  EmptyState
} from '../styles/PredictionsPanel.styled';

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
          // Filter out timestamp and non-metric fields
          if (metric === 'timestamp' || !data || !data.predictions) {
            return null;
          }

          const selectedPrediction = data.predictions.find((p) => p.minutesAhead === selectedTime);
          if (!selectedPrediction) {
            return null;
          }

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
