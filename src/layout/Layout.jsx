import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Header from './Header';
import SocketDebugger from '../components/SocketDebugger';

import { useRealTimeData } from '../hooks/useRealTimeData';
import { useVisualizationMode } from '../hooks/useVisualizationMode';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100dvh;
  background: #0a0a0a;
`;

const Main = styled.main`
  flex: 1;
  overflow: hidden;
  position: relative;
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

const Layout = () => {
  const { floorData, predictions, alerts, isConnected, isLoading } = useRealTimeData();
  const { currentMode } = useVisualizationMode();

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
    <LayoutContainer>
      <Header
        isConnected={isConnected}
        alerts={alerts}
      />
      <Main>
        <Outlet context={{ floorData, predictions, alerts, isLoading, currentMode }} />
      </Main>
      {/* <SocketDebugger /> */}
    </LayoutContainer>
  );
};

export default Layout;
