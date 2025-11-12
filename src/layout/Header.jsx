import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { ConnectionStatus, HeaderStyled, Title } from '../styles/Header.styled';
import AlertsDropdown from '../components/AlertsDropdown';

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

const Header = ({ isConnected, alerts = [] }) => {
  return (
    <HeaderStyled>
      <Title>SmartFloors AI</Title>

      <Nav>
        <TabLink to='/' end>
          🏢 Dashboard 3D
        </TabLink>
        <TabLink to='/analytics'>📊 Análisis</TabLink>
      </Nav>

      <AlertsDropdown alerts={alerts} />

      <ConnectionStatus $connected={isConnected}>
        {isConnected ? 'Conectado' : 'Desconectado'}
      </ConnectionStatus>
    </HeaderStyled>
  );
};

export default Header;
