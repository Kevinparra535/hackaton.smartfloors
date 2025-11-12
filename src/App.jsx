import { useState } from 'react';
import styled from 'styled-components';
// ** Importaciones Originales Restauradas **
import Dashboard3D from './components/Dashboard3D';
import AlertsPanel from './components/AlertsPanel';
import { useRealTimeData } from './hooks/useRealTimeData';
import PlantLogo from './assets/leafs_icon.svg';
import PortraitImage from './assets/portrait_image.jpg';

import TrendChartsPanel from './components/TrendChartsPanel';
import './index.css'; // o el nombre correcto del archivo CSS


const getColor = (status) => {
  switch(status){
    case 'CRÍTICO': return '#ff4d4f';//rojo
    case 'MEDIA': return '#ff9900';//naranja
    case 'OK': return '#00ff88';  // Verde
    default: return '#cccccc';
  }
}

const GlobalStatusChip = styled.div`
  background-color: ${(props) => getColor(props.$status)};
  color: #1a1a1a;
  font-weight: bold;
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 0 10px ${(props) => getColor(props.$status)}40;
`;

const HeaderGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    
    /* CÓDIGO AÑADIDO: 1. Centrar el estatus global en el medio */
    ${(props) => props.$isCenter && 'flex-grow: 1; justify-content: center;'}
`;

const HeaderTitle = styled.h2`
    color: #cfcfcf;
    margin: 0;
    font-size: 1.1rem;
    font-weight: 500;
`;

const TimeAndUser = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    
    /* CÓDIGO AÑADIDO: 2. Forzar Hora y Fecha a estar en la misma línea */
    /* Apunta al div contenedor de hora y fecha */
    & > div:last-child { 
      display: flex;
      flex-direction: row; 
      align-items: center;
      gap: 5px; /* Pequeño espacio entre hora y fecha/separador */
    }
`;


const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;

    & > img {
      width: 32px; /* Define el tamaño */
      height: 32px;
      border-radius: 50%; 
      object-fit: cover; 
      border: 2px solid #1a1a1a; 
      margin-right: -4px;
  }

  & > .user-name-text {
    color: #ffffff; /* El color que tiene SmartFloors; cámbialo a tu gusto */
    font-weight: 500;
}
`;

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
  padding: 18px 35px;
  border-bottom: 1px solid rgba(100, 108, 255, 0.2);
  display: flex;
  justify-content: space-between; /* Esencial para dividir los 3 HeaderGroups */
  align-items: center;
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  color: #ffffff;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  
  span{
    color: #00ff88; //cambio de color a floors
  }

  img {
    height: 30px; 
    margin-right: 8px;
    filter: invert(10%) sepia(200%) saturate(800%) hue-rotate(100deg) brightness(100%) contrast(300%);
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

// NUEVOS COMPONENTES PARA LA NAVEGACIÓN
const NavButtonsGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  margin-left: 30px; 
`;

const NavButton = styled.button`
  background-color: ${(props) => (props.$active ? '#4F46E5' : 'transparent')};
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: ${(props) => (props.$active ? '#4F46E5' : 'rgba(255, 255, 255, 0.1)')};
  }
  
  ${(props) => props.$active && 'box-shadow: 0 0 10px rgba(79, 70, 229, 0.5);'}
`;


function App() {
  const { floorData, alerts, isConnected } = useRealTimeData();
  const [hoveredFloor, setHoveredFloor] = useState(null);
  // 1. ESTADO DE PESTAÑA: Define qué vista mostrar ('dashboard' o 'analysis')
  const [activeTab, setActiveTab] = useState('dashboard');


  const globalPredictionStatus = 'CRÍTICO'; // simulacion
  const user = 'Pedro (UX/FE)';
  const dashboardTitle = 'Dashboard General';
  const displayedFloor = hoveredFloor || floorData[1];

  return (
    <AppContainer>
      <Header>
        {/* GRUPO 1: Izquierda (Logo, Título y NAVEGACIÓN) */}
        <HeaderGroup>
          <Title>
            <img src={PlantLogo} alt="SmartFloors Logo" />
            Smart<span>Floors</span>
          </Title>
          {/* El título principal se mantiene como separador visual */}
          <HeaderTitle>| {dashboardTitle}</HeaderTitle>

          {/* 2. BOTONES DE NAVEGACIÓN */}
          <NavButtonsGroup>
            <NavButton 
              $active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')}
            >
              <span role="img" aria-label="3D">🏠</span> Dashboard 3D
            </NavButton>
            <NavButton 
              $active={activeTab === 'analysis'} 
              onClick={() => setActiveTab('analysis')}
            >
              <span role="img" aria-label="Análisis">📈</span> Análisis
            </NavButton>
          </NavButtonsGroup>

        </HeaderGroup>

        {/* GRUPO 2: Centro (Global Status) -> Usa $isCenter para centrarlo */}
        <HeaderGroup $isCenter={true}>
          <GlobalStatusChip $status={globalPredictionStatus}>
            GLOBAL STATUS: {globalPredictionStatus}
          </GlobalStatusChip>
        </HeaderGroup>

        {/* GRUPO 3: Derecha (Usuario, Fecha/Hora, Conexión) */}
        <HeaderGroup>
          <TimeAndUser>

            {/* 2. Fecha en una Línea: Se usa un div con spans para la fecha/hora */}
            <div>
              <span>
                {new Date().toLocaleTimeString('es-Es', {hour: '2-digit', minute: '2-digit'})}
              </span>
              <span>-</span> {/* Separador */}
              <span>
                {new Date().toLocaleDateString('es-Es', {month: 'short', day: 'numeric', year: 'numeric'})}
              </span>
            </div>
          </TimeAndUser>
          
          <ConnectionStatus $connected={isConnected}>
            {isConnected ? 'Conectado' : 'Desconectado'}
          </ConnectionStatus>
        </HeaderGroup>
      </Header>

      {/* 3. CONTENIDO PRINCIPAL CONDICIONAL */}
      <MainContent>
        {activeTab === 'dashboard' ? (
          <>
            {/* VISTA 1: Dashboard 3D (Vista actual) */}
            <CanvasWrapper>
              <Dashboard3D floorData={floorData} onFloorHover={setHoveredFloor} />
            </CanvasWrapper>

            <Sidebar>
              <InfoPanel>
                <InfoTitle>
                  {hoveredFloor ? `Piso ${hoveredFloor.floor} Metrics` : 'Hover over a floor'}
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
                      <MetricLabel>⚡ Energía</MetricLabel>
                      <MetricValue>{displayedFloor.energy} kW</MetricValue>
                    </MetricCard>
                    <MetricCard>
                      <MetricLabel>📊 Estado</MetricLabel>
                      <MetricValue style={{ fontSize: '1rem', textTransform: 'capitalize' }}>
                        {displayedFloor.status}
                      </MetricValue>
                    </MetricCard>
                  </MetricGrid>
                ) : (
                  <EmptyInfo>Hover over a floor to see detailed metrics</EmptyInfo>
                )}
              </InfoPanel>
              
              <AlertsPanel 
                alerts={alerts} 
                onFilterChange={()=> console.log("Filtro Cambiado")}
              />
            </Sidebar>
          </>
        ) : (
          /* VISTA 2: Panel de Análisis */
          /* Ocupa todo el espacio disponible en MainContent, sin Sidebar */
          <TrendChartsPanel 
            floorData={floorData} 
            alerts={alerts}
          />
        )}
      </MainContent>
    </AppContainer>
  );
}

export default App;