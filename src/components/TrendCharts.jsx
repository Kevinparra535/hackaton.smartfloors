import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
        <p className="label">{label}</p>
        <p className="value">{`${payload[0].name}: ${payload[0].value}${payload[0].unit || ''}`}</p>
      </CustomTooltip>
    );
  }
  return null;
};

/**
 * TrendCharts - Display historical trends for temperature, humidity, and power consumption
 * @param {Object} props
 * @param {number} props.floorId - Floor ID to display charts for (1-5)
 */
export default function TrendCharts({ floorId = 1 }) {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch historical data when floorId changes
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
        // Fetch last 4 hours of data (240 minutes / 5 min intervals = 48 points)
        const history = await fetchFloorHistory(floorId, 48);
        
        if (history && history.length > 0) {
          const formattedData = history.map((point) => ({
            time: formatTime(point.timestamp),
            temperature: parseFloat(point.temperature),
            humidity: parseFloat(point.humidity),
            power: parseFloat(point.powerConsumption)
          }));
          
          setChartData(formattedData);
        } else {
          // Use sample data if no real data available
          setChartData(generateSampleData());
        }
      } catch (error) {
        console.error('❌ Error loading historical data:', error);
        setChartData(generateSampleData());
      } finally {
        setIsLoading(false);
      }
    };

    loadHistoricalData();
  }, [floorId]);

  if (isLoading) {
    return (
      <ChartsContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          color: '#646cff',
          fontSize: '18px'
        }}>
          Cargando datos históricos...
        </div>
      </ChartsContainer>
    );
  }

  return (
    <ChartsContainer>
      {/* Temperature Chart */}
      <ChartSection>
        <ChartTitle>Temperatura (°C) - Últimas 4 horas</ChartTitle>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 108, 255, 0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="#888"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#888"
              style={{ fontSize: '12px' }}
              domain={[15, 35]}
            />
            <Tooltip content={<CustomTooltipContent />} />
            <Legend 
              wrapperStyle={{ color: '#fff', fontSize: '12px' }}
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#ff4d4f" 
              strokeWidth={2}
              dot={{ fill: '#ff4d4f', r: 3 }}
              activeDot={{ r: 5 }}
              name="Temperatura"
              unit="°C"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartSection>

      {/* Humidity Chart */}
      <ChartSection>
        <ChartTitle>Humedad Relativa (%) - Últimas 4 horas</ChartTitle>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 108, 255, 0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="#888"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#888"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltipContent />} />
            <Legend 
              wrapperStyle={{ color: '#fff', fontSize: '12px' }}
            />
            <Line 
              type="monotone" 
              dataKey="humidity" 
              stroke="#1890ff" 
              strokeWidth={2}
              dot={{ fill: '#1890ff', r: 3 }}
              activeDot={{ r: 5 }}
              name="Humedad"
              unit="%"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartSection>

      {/* Power Consumption Chart */}
      <ChartSection>
        <ChartTitle>Consumo de Energía (kW) - Últimas 4 horas</ChartTitle>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 108, 255, 0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="#888"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#888"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltipContent />} />
            <Legend 
              wrapperStyle={{ color: '#fff', fontSize: '12px' }}
            />
            <Line 
              type="monotone" 
              dataKey="power" 
              stroke="#00ff88" 
              strokeWidth={2}
              dot={{ fill: '#00ff88', r: 3 }}
              activeDot={{ r: 5 }}
              name="Energía"
              unit=" kW"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartSection>
    </ChartsContainer>
  );
}
