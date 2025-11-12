import styled from 'styled-components';
import { useState } from 'react';

import Dashboard3D from '../components/Dashboard3D';
import AlertsPanel from '../components/AlertsPanel';
import PredictionsPanel from '../components/PredictionsPanel';
import ColorLegend from '../components/ColorLegend';

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
import { useOutletContext } from 'react-router-dom';

const EmptyInfo = styled.div`
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  padding: 20px;
  font-size: 0.9rem;
`;

const Home = () => {
  const { floorData, predictions, isLoading, currentMode } = useOutletContext();

  const [hoveredFloor, setHoveredFloor] = useState(null);
  const [focusedFloor, setFocusedFloor] = useState(null);

  const handleFloorClick = (clickData) => {
    // Store the clicked floor for potential UI updates
    setFocusedFloor(clickData?.floorData || null);
  };

  const displayedFloor = !isLoading && (hoveredFloor || focusedFloor || floorData[1]);
  const displayedPredictions = hoveredFloor
    ? predictions[hoveredFloor.floorId]
    : focusedFloor
      ? predictions[focusedFloor.floorId]
      : predictions[1];
  const displayedFloorName = hoveredFloor
    ? hoveredFloor.name || `Piso ${hoveredFloor.floorId}`
    : focusedFloor
      ? focusedFloor.name || `Piso ${focusedFloor.floorId}`
      : null;

  return (
    <MainContent>
      <CanvasWrapper>
        <Dashboard3D
          floorData={floorData}
          onFloorHover={setHoveredFloor}
          onFloorClick={handleFloorClick}
        />
      </CanvasWrapper>

      {/* Color Legend - Leyenda de estados */}
      <ColorLegend currentMode={currentMode} />

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

      {/* <PredictionsPanel predictions={displayedPredictions} floorName={displayedFloorName} /> */}

      {/* <AlertsPanel alerts={alerts} /> */}
    </MainContent>
  );
};

export default Home;
