import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Dashboard3D from './components/Dashboard3D';
import AlertsPanel from './components/AlertsPanel';
import PredictionsPanel from './components/PredictionsPanel';
import { useRealTimeData } from './hooks/useRealTimeData';
import { ConnectionStatus, Header, Title } from './styles/Header.styled';
import {
  InfoPanel,
  InfoTitle,
  MetricCard,
  MetricGrid,
  MetricLabel,
  MetricValue,
  Sidebar
} from './styles/Sidebar.styled';
import { AppContainer, CanvasWrapper, MainContent } from './styles/AppContainer.styled';

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 10, 10, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  z-index: 9999;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(100, 108, 255, 0.2);
  border-top: 4px solid #646cff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 500;
`;

function App() {
  const { floorData, predictions, alerts, isConnected, isLoading } = useRealTimeData();
  const [hoveredFloor, setHoveredFloor] = useState(null);

  const displayedFloor = !isLoading && (hoveredFloor || floorData[1]);
  const displayedPredictions = hoveredFloor ? predictions[hoveredFloor.floorId] : predictions[1];
  const displayedFloorName = hoveredFloor
    ? hoveredFloor.name || `Piso ${hoveredFloor.floorId}`
    : null;

  useEffect(() => {
    console.log(floorData);
  }, [floorData]);

  // Show loading screen while fetching initial data
  if (isLoading) {
    return (
      <LoadingOverlay>
        <LoadingSpinner />
        <LoadingText>🏢 Cargando SmartFloors AI...</LoadingText>
      </LoadingOverlay>
    );
  }

  return (
    <AppContainer>
      <Header>
        <Title>SmartFloors AI</Title>
        <ConnectionStatus $connected={isConnected}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </ConnectionStatus>
      </Header>

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
    </AppContainer>
  );
}

export default App;
