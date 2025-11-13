import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FiBell } from 'react-icons/fi';
import { ConnectionStatus, HeaderStyled, Title } from '../styles/Header.styled';
import VisualizationSelector from '../components/VisualizationSelector';
import { useVisualizationMode } from '../hooks/useVisualizationMode';

const Nav = styled.nav`
  display: flex;
  gap: 0.5rem;
  margin-left: 2rem;
  flex: 1;
`;

const TabLink = styled(NavLink)`
  padding: 0.6rem 1.5rem;
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid rgba(100, 108, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(100, 108, 255, 0.1);
    border-color: rgba(100, 108, 255, 0.5);
    transform: translateY(-2px);
  }

  &.active {
    background: #646cff;
    border-color: #646cff;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(100, 108, 255, 0.3);
  }
`;

const AlertsButton = styled.button`
  position: relative;
  padding: 0.6rem 1.2rem;
  background: ${(props) => (props.$active ? '#646cff' : 'rgba(26, 26, 26, 0.5)')};
  border: 1px solid ${(props) => (props.$active ? '#646cff' : 'rgba(100, 108, 255, 0.2)')};
  border-radius: 8px;
  color: #ffffff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;

  &:hover {
    background: ${(props) => (props.$active ? '#5a5fcf' : 'rgba(100, 108, 255, 0.1)')};
    border-color: rgba(100, 108, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const AlertBadge = styled.span`
  background: ${(props) =>
    props.$count > 0 ? 'linear-gradient(135deg, #ff4d4f, #ff7875)' : '#333'};
  color: #fff;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 20px;
  text-align: center;
  box-shadow: ${(props) => (props.$count > 0 ? '0 2px 8px rgba(255, 77, 79, 0.4)' : 'none')};
  animation: ${(props) => (props.$count > 0 ? 'pulse 2s infinite' : 'none')};

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

const Header = ({ isConnected, alerts = [], onToggleSidebar, sidebarOpen }) => {
  const { currentMode, setVisualizationMode } = useVisualizationMode();

  return (
    <HeaderStyled>
      <Title>
        <span>SmartFloors</span> AI
      </Title>

      <VisualizationSelector currentMode={currentMode} onModeChange={setVisualizationMode} />

      <AlertsButton onClick={onToggleSidebar} $active={sidebarOpen}>
        <FiBell />
        Alertas
        <AlertBadge $count={alerts.length}>{alerts.length}</AlertBadge>
      </AlertsButton>

      <ConnectionStatus $connected={isConnected}>
        {isConnected ? 'Conectado' : 'Desconectado'}
      </ConnectionStatus>
    </HeaderStyled>
  );
};

export default Header;
