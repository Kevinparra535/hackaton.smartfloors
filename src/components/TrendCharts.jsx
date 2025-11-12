import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import styled from 'styled-components';
import { fetchFloorHistory } from '../api/rest';

const ChartsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: rgba(10, 10, 10, 0.9);
  border-radius: 8px;
  overflow-y: auto;
`;

const FloorSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  padding: 12px;
  background: rgba(10, 10, 10, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(100, 108, 255, 0.2);
`;

const FloorButton = styled.button`
  padding: 8px 16px;
  background: ${(props) => (props.$active ? 'rgba(100, 108, 255, 0.4)' : 'rgba(26, 26, 26, 0.8)')};
  border: 2px solid ${(props) => (props.$active ? '#646cff' : 'rgba(100, 108, 255, 0.3)')};
  border-radius: 6px;
  color: ${(props) => (props.$active ? '#00ff88' : '#fff')};
  cursor: pointer;
  font-size: 14px;
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  transition: all 0.2s ease;
  min-width: 80px;

  &:hover {
    background: rgba(100, 108, 255, 0.3);
    border-color: #00ff88;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ChartSection = styled.div`
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid rgba(100, 108, 255, 0.3);
  border-radius: 8px;
  padding: 16px;

  &:hover {
    border-color: rgba(100, 108, 255, 0.6);
  }
`;

const ChartTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #646cff;
  font-weight: 600;
  text-align: center;
`;

const CustomTooltip = styled.div`
  background: rgba(10, 10, 10, 0.95);
  border: 1px solid #646cff;
  border-radius: 4px;
  padding: 10px;

  .label {
    color: #fff;
    font-weight: bold;
    margin-bottom: 4px;
  }

  .value {
    color: #00ff88;
    font-size: 14px;
  }
`;

const CustomTooltipContent = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltip>
        <p className='label'>{label}</p>
        <p className='value'>{`${payload[0].name}: ${payload[0].value}${payload[0].unit || ''}`}</p>
      </CustomTooltip>
    );
  }
  return null;
};

/**
 * TrendCharts - Display historical trends for temperature, humidity, and power consumption
 * @param {Object} props
 * @param {number} props.floorId - Initial floor ID to display charts for (1-5)
 */
export default function TrendCharts({ floorId: initialFloorId = 1 }) {
  const [selectedFloor, setSelectedFloor] = useState(initialFloorId);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Floor colors for multi-floor view
  const FLOOR_COLORS = {
    1: '#ff4d4f',
    2: '#1890ff',
    3: '#00ff88',
    4: '#ffd966',
    5: '#9d4edd'
  };

  const FLOOR_NAMES = {
    1: 'Piso 1',
    2: 'Piso 2',
    3: 'Piso 3',
    4: 'Piso 4',
    5: 'Piso 5'
  };

  // Fetch historical data when selectedFloor changes
  useEffect(() => {
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const generateSampleData = () => {
      const data = [];
      const now = new Date();

      // Generate 24 points (every 10 minutes for 4 hours)
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 10 * 60 * 1000);
        data.push({
          time: formatTime(time),
          temperature: 20 + Math.random() * 8,
          humidity: 40 + Math.random() * 20,
          power: 50 + Math.random() * 30
        });
      }

      return data;
    };

    const loadHistoricalData = async () => {
      setIsLoading(true);
      try {
        if (selectedFloor === 'all') {
          // Load data for all floors
          const allData = {};

          for (let floor = 1; floor <= 5; floor++) {
            try {
              const history = await fetchFloorHistory(floor, 48);

              if (history && history.length > 0) {
                allData[floor] = history.map((point) => ({
                  time: formatTime(point.timestamp),
                  temperature: parseFloat(point.temperature),
                  humidity: parseFloat(point.humidity),
                  power: parseFloat(point.powerConsumption)
                }));
              } else {
                allData[floor] = generateSampleData();
              }
            } catch (error) {
              console.error(`❌ Error loading data for floor ${floor}:`, error);
              allData[floor] = generateSampleData();
            }
          }

          // Merge all floors data into single dataset with multiple lines
          const mergedData = [];
          const timePoints = allData[1]?.map((point) => point.time) || [];

          timePoints.forEach((time, index) => {
            const dataPoint = { time };

            for (let floor = 1; floor <= 5; floor++) {
              if (allData[floor] && allData[floor][index]) {
                dataPoint[`temperature${floor}`] = allData[floor][index].temperature;
                dataPoint[`humidity${floor}`] = allData[floor][index].humidity;
                dataPoint[`power${floor}`] = allData[floor][index].power;
              }
            }

            mergedData.push(dataPoint);
          });

          setChartData(mergedData);
        } else {
          // Load data for single floor
          const history = await fetchFloorHistory(selectedFloor, 48);

          if (history && history.length > 0) {
            const formattedData = history.map((point) => ({
              time: formatTime(point.timestamp),
              temperature: parseFloat(point.temperature),
              humidity: parseFloat(point.humidity),
              power: parseFloat(point.powerConsumption)
            }));

            setChartData(formattedData);
          } else {
            setChartData(generateSampleData());
          }
        }
      } catch (error) {
        console.error('❌ Error loading historical data:', error);
        setChartData(generateSampleData());
      } finally {
        setIsLoading(false);
      }
    };

    loadHistoricalData();
  }, [selectedFloor]);

  if (isLoading) {
    return (
      <ChartsContainer>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: '#646cff',
            fontSize: '18px'
          }}
        >
          Cargando datos históricos...
        </div>
      </ChartsContainer>
    );
  }

  return (
    <ChartsContainer>
      {/* Floor Selector */}
      <FloorSelector>
        <FloorButton $active={selectedFloor === 'all'} onClick={() => setSelectedFloor('all')}>
          Todos los Pisos
        </FloorButton>
        {[1, 2, 3, 4, 5].map((floor) => (
          <FloorButton
            key={floor}
            $active={selectedFloor === floor}
            onClick={() => setSelectedFloor(floor)}
          >
            {FLOOR_NAMES[floor]}
          </FloorButton>
        ))}
      </FloorSelector>

      {/* Temperature Chart */}
      <ChartSection>
        <ChartTitle>
          Temperatura (°C) - Últimas 4 horas
          {selectedFloor !== 'all' && ` - ${FLOOR_NAMES[selectedFloor]}`}
        </ChartTitle>
        <ResponsiveContainer width='100%' height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' stroke='rgba(100, 108, 255, 0.1)' />
            <XAxis dataKey='time' stroke='#888' style={{ fontSize: '12px' }} />
            <YAxis stroke='#888' style={{ fontSize: '12px' }} domain={[15, 35]} />
            <Tooltip content={<CustomTooltipContent />} />
            <Legend wrapperStyle={{ color: '#fff', fontSize: '12px' }} />
            {selectedFloor === 'all' ? (
              // Multiple lines for all floors
              [1, 2, 3, 4, 5].map((floor) => (
                <Line
                  key={`temp-${floor}`}
                  type='monotone'
                  dataKey={`temperature${floor}`}
                  stroke={FLOOR_COLORS[floor]}
                  strokeWidth={2}
                  dot={false}
                  name={FLOOR_NAMES[floor]}
                  unit='°C'
                />
              ))
            ) : (
              // Single line for selected floor
              <Line
                type='monotone'
                dataKey='temperature'
                stroke='#ff4d4f'
                strokeWidth={2}
                dot={{ fill: '#ff4d4f', r: 3 }}
                activeDot={{ r: 5 }}
                name='Temperatura'
                unit='°C'
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </ChartSection>

      {/* Humidity Chart */}
      <ChartSection>
        <ChartTitle>
          Humedad Relativa (%) - Últimas 4 horas
          {selectedFloor !== 'all' && ` - ${FLOOR_NAMES[selectedFloor]}`}
        </ChartTitle>
        <ResponsiveContainer width='100%' height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' stroke='rgba(100, 108, 255, 0.1)' />
            <XAxis dataKey='time' stroke='#888' style={{ fontSize: '12px' }} />
            <YAxis stroke='#888' style={{ fontSize: '12px' }} domain={[0, 100]} />
            <Tooltip content={<CustomTooltipContent />} />
            <Legend wrapperStyle={{ color: '#fff', fontSize: '12px' }} />
            {selectedFloor === 'all' ? (
              // Multiple lines for all floors
              [1, 2, 3, 4, 5].map((floor) => (
                <Line
                  key={`humidity-${floor}`}
                  type='monotone'
                  dataKey={`humidity${floor}`}
                  stroke={FLOOR_COLORS[floor]}
                  strokeWidth={2}
                  dot={false}
                  name={FLOOR_NAMES[floor]}
                  unit='%'
                />
              ))
            ) : (
              // Single line for selected floor
              <Line
                type='monotone'
                dataKey='humidity'
                stroke='#1890ff'
                strokeWidth={2}
                dot={{ fill: '#1890ff', r: 3 }}
                activeDot={{ r: 5 }}
                name='Humedad'
                unit='%'
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </ChartSection>

      {/* Power Consumption Chart */}
      <ChartSection>
        <ChartTitle>
          Consumo de Energía (kW) - Últimas 4 horas
          {selectedFloor !== 'all' && ` - ${FLOOR_NAMES[selectedFloor]}`}
        </ChartTitle>
        <ResponsiveContainer width='100%' height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' stroke='rgba(100, 108, 255, 0.1)' />
            <XAxis dataKey='time' stroke='#888' style={{ fontSize: '12px' }} />
            <YAxis stroke='#888' style={{ fontSize: '12px' }} domain={[0, 100]} />
            <Tooltip content={<CustomTooltipContent />} />
            <Legend wrapperStyle={{ color: '#fff', fontSize: '12px' }} />
            {selectedFloor === 'all' ? (
              // Multiple lines for all floors
              [1, 2, 3, 4, 5].map((floor) => (
                <Line
                  key={`power-${floor}`}
                  type='monotone'
                  dataKey={`power${floor}`}
                  stroke={FLOOR_COLORS[floor]}
                  strokeWidth={2}
                  dot={false}
                  name={FLOOR_NAMES[floor]}
                  unit=' kW'
                />
              ))
            ) : (
              // Single line for selected floor
              <Line
                type='monotone'
                dataKey='power'
                stroke='#00ff88'
                strokeWidth={2}
                dot={{ fill: '#00ff88', r: 3 }}
                activeDot={{ r: 5 }}
                name='Energía'
                unit=' kW'
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </ChartSection>
    </ChartsContainer>
  );
}
