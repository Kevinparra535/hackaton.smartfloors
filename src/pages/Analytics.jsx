import styled from 'styled-components';
import { useOutletContext } from 'react-router-dom';

const AnalyticsContainer = styled.div`
  padding: 2rem;
  color: #ffffff;
  height: 100%;
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #646cff;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid rgba(100, 108, 255, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #ffffff;
`;

const Metric = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #646cff;
  margin-bottom: 0.5rem;
`;

const Label = styled.div`
  font-size: 0.9rem;
  color: #888;
`;

const FloorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FloorCard = styled.div`
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid rgba(100, 108, 255, 0.3);
  border-radius: 8px;
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr repeat(4, 0.8fr);
  gap: 1rem;
  align-items: center;
`;

const FloorName = styled.div`
  font-weight: 600;
  color: #ffffff;
`;

const FloorMetric = styled.div`
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => props.color || '#646cff'};
`;

const MetricLabel = styled.div`
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.25rem;
`;

const Analytics = () => {
  // const { floorData } = useOutletContext();

  // // Calcular métricas agregadas
  // const totalFloors = floorData.length;
  // const avgOccupancy = floorData.reduce((sum, floor) => sum + floor.occupancy, 0) / totalFloors;
  // const avgTemperature =
  //   floorData.reduce((sum, floor) => sum + floor.temperature, 0) / totalFloors;
  // const totalPower = floorData.reduce((sum, floor) => sum + floor.powerConsumption, 0);

  return (
    <AnalyticsContainer>
      <Title>📊 Análisis y Estadísticas</Title>

      {/* <Grid>
        <Card>
          <CardTitle>Total de Pisos</CardTitle>
          <Metric>{totalFloors}</Metric>
          <Label>Pisos monitoreados</Label>
        </Card>

        <Card>
          <CardTitle>Ocupación Promedio</CardTitle>
          <Metric>{avgOccupancy.toFixed(1)}%</Metric>
          <Label>En tiempo real</Label>
        </Card>

        <Card>
          <CardTitle>Temperatura Promedio</CardTitle>
          <Metric>{avgTemperature.toFixed(1)}°C</Metric>
          <Label>Todos los pisos</Label>
        </Card>

        <Card>
          <CardTitle>Consumo Total</CardTitle>
          <Metric>{totalPower.toFixed(0)} kW</Metric>
          <Label>Energía actual</Label>
        </Card>
      </Grid>

      <Title style={{ fontSize: '1.5rem' }}>Detalle por Piso</Title>
      <FloorList>
        {floorData.map((floor) => (
          <FloorCard key={floor.floorId}>
            <FloorName>{floor.name}</FloorName>

            <FloorMetric>
              <MetricValue color='#646cff'>{floor.occupancy}%</MetricValue>
              <MetricLabel>Ocupación</MetricLabel>
            </FloorMetric>

            <FloorMetric>
              <MetricValue color='#ff6b6b'>{floor.temperature.toFixed(1)}°C</MetricValue>
              <MetricLabel>Temperatura</MetricLabel>
            </FloorMetric>

            <FloorMetric>
              <MetricValue color='#51cf66'>{floor.humidity}%</MetricValue>
              <MetricLabel>Humedad</MetricLabel>
            </FloorMetric>

            <FloorMetric>
              <MetricValue color='#ffd966'>{floor.powerConsumption.toFixed(0)} kW</MetricValue>
              <MetricLabel>Consumo</MetricLabel>
            </FloorMetric>
          </FloorCard>
        ))}
      </FloorList> */}
    </AnalyticsContainer>
  );
};

export default Analytics;
