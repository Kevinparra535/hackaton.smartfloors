import styled from 'styled-components';
import { useState } from 'react';

import Dashboard3D from '../components/Dashboard3D';
import AlertsPanel from '../components/AlertsPanel';
import PredictionsPanel from '../components/PredictionsPanel';

import {
  InfoPanel,
  InfoTitle,
  MetricCard,
  MetricGrid,
  MetricLabel,
  MetricValue,
  Sidebar
} from '../styles/Sidebar.styled';

import { CanvasWrapper, MainContent } from '../styles/AppContainer.styled';

const EmptyInfo = styled.div`
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  padding: 20px;
  font-size: 0.9rem;
`;

const Home = ({ floorData, isLoading, predictions, alerts }) => {
  const [hoveredFloor, setHoveredFloor] = useState(null);

  const displayedFloor = !isLoading && (hoveredFloor || floorData[1]);
  const displayedPredictions = hoveredFloor ? predictions[hoveredFloor.floorId] : predictions[1];
  const displayedFloorName = hoveredFloor
    ? hoveredFloor.name || `Piso ${hoveredFloor.floorId}`
    : null;

  return (
    <MainContent>
      <CanvasWrapper>
        <Dashboard3D floorData={floorData} onFloorHover={setHoveredFloor} />
      </CanvasWrapper>

      <Sidebar>
        <InfoPanel>
          <InfoTitle>
            {hoveredFloor
              ? `${hoveredFloor.name || `Piso ${hoveredFloor.floorId}`} - Métricas`
              : 'Pasa el cursor sobre un piso'}
          </InfoTitle>
          {displayedFloor ? (
            <MetricGrid>
              <MetricCard>
                <MetricLabel>🌡️ Temperatura</MetricLabel>
                <MetricValue>{displayedFloor.temperature}°C</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricLabel>💧 Humedad</MetricLabel>
                <MetricValue>{displayedFloor.humidity}%</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricLabel>⚡ Consumo</MetricLabel>
                <MetricValue>{displayedFloor.powerConsumption} kW</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricLabel>� Ocupación</MetricLabel>
                <MetricValue>{displayedFloor.occupancy}%</MetricValue>
              </MetricCard>
              <MetricCard style={{ gridColumn: 'span 2' }}>
                <MetricLabel>📊 Estado</MetricLabel>
                <MetricValue style={{ fontSize: '1rem', textTransform: 'capitalize' }}>
                  {displayedFloor.status === 'normal' && '✅ Normal'}
                  {displayedFloor.status === 'warning' && '⚠️ Advertencia'}
                  {displayedFloor.status === 'danger' && '🚨 Peligro'}
                </MetricValue>
              </MetricCard>
            </MetricGrid>
          ) : (
            <EmptyInfo>Pasa el cursor sobre un piso para ver las métricas detalladas</EmptyInfo>
          )}
        </InfoPanel>

        <PredictionsPanel predictions={displayedPredictions} floorName={displayedFloorName} />

        <AlertsPanel alerts={alerts} />
      </Sidebar>
    </MainContent>
  );
};

export default Home;
