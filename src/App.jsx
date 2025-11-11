import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Dashboard3D from './components/Dashboard3D';
import AlertsPanel from './components/AlertsPanel';
import PredictionsPanel from './components/PredictionsPanel';
import { useRealTimeData } from './hooks/useRealTimeData';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
  overflow: hidden;
`;

const Header = styled.header`
  background: rgba(26, 26, 26, 0.95);
  padding: 16px 24px;
  border-bottom: 1px solid rgba(100, 108, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  color: #ffffff;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: '🏢';
    font-size: 2rem;
  }
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${(props) => (props.$connected ? '#00ff88' : '#ff4d4f')};
  font-size: 0.9rem;
  font-weight: 500;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 8px currentColor;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
`;

const CanvasWrapper = styled.div`
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InfoPanel = styled.div`
  background: rgba(26, 26, 26, 0.95);
  border-radius: 12px;
  padding: 20px;
  width: 320px;
  border: 1px solid rgba(100, 108, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

const InfoTitle = styled.h3`
  color: #ffffff;
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const MetricCard = styled.div`
  background: rgba(100, 108, 255, 0.1);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(100, 108, 255, 0.2);
`;

const MetricLabel = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetricValue = styled.div`
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 700;
`;

const EmptyInfo = styled.div`
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  padding: 20px;
  font-size: 0.9rem;
`;

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

  const displayedFloor = hoveredFloor || floorData[1];
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
