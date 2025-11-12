import { useState, useEffect } from 'react';
import styled from 'styled-components';
import AlertsTable from '../components/AlertsTable';
import { fetchAlertsWithFilters } from '../api/rest';

/**
 * AlertsTableDemo Component
 * Example page showing how to use AlertsTable component
 */
const AlertsTableDemo = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setIsLoading(true);
        const response = await fetchAlertsWithFilters();
        setAlerts(response.alerts || []);
        setError(null);
      } catch (err) {
        console.error('Error loading alerts:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadAlerts();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Tabla de Alertas</Title>
        <Subtitle>
          Visualización completa de alertas con timestamp, piso, variable, nivel y recomendaciones
        </Subtitle>
      </Header>

      <Content>
        {isLoading && (
          <LoadingState>
            <Spinner />
            <p>Cargando alertas...</p>
          </LoadingState>
        )}

        {error && (
          <ErrorState>
            <p>❌ Error: {error}</p>
          </ErrorState>
        )}

        {!isLoading && !error && <AlertsTable alerts={alerts} />}
      </Content>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: #0a0a0a;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #888;
  font-size: 1rem;
  margin: 0;
`;

const Content = styled.div`
  max-width: 1400px;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #888;

  p {
    margin-top: 1rem;
    font-size: 1rem;
  }
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(100, 108, 255, 0.2);
  border-top-color: #646cff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorState = styled.div`
  background: rgba(255, 77, 79, 0.1);
  border: 1px solid rgba(255, 77, 79, 0.3);
  border-radius: 8px;
  padding: 2rem;
  color: #ff4d4f;
  text-align: center;

  p {
    margin: 0;
    font-size: 1rem;
  }
`;

export default AlertsTableDemo;
