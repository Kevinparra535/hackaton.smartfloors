import styled from 'styled-components';
import { useRealTimeData } from './hooks/useRealTimeData';
import { ConnectionStatus, Header, Title } from './styles/Header.styled';

import { AppContainer } from './styles/AppContainer.styled';
import Home from './pages/Home';

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

      <Home
        floorData={floorData}
        isLoading={isLoading}
        predictions={predictions}
        alerts={alerts}
      />
    </AppContainer>
  );
}

export default App;
