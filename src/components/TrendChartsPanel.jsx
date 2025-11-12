import React from 'react';
import styled from 'styled-components';
const TrendChartsContainer = styled.div`
  background: rgba(26, 26, 26, 0.95);
  border-radius: 12px;
  padding: 20px;
  width: 320px;
  border: 1px solid rgba(100, 108, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

const PanelTitle = styled.h3`
  color: #ffffff;
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
`;

// Estilo para simular un gráfico (barra gris con una línea dentro)
const MockChart = styled.div`
  padding: 10px;
  background: rgba(100, 108, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(100, 108, 255, 0.2);
`;

const ChartLabel = styled.div`
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const ChartArea = styled.div`
  height: 50px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &::after { /* Simulación de la línea de tendencia */
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 150%;
    height: 2px;
    background: #00ff88;
    transform: rotate(-5deg) translateY(-50%);
    box-shadow: 0 0 5px #00ff88;
  }
`;

export default function TrendChartsPanel() {
  return (
    <TrendChartsContainer>
      <PanelTitle>
        📈 Tendencias (Últimas 4h)
      </PanelTitle>
      <ChartsGrid>
        <MockChart>
          <ChartLabel>🌡️ Temperatura (°C)</ChartLabel>
          <ChartArea />
        </MockChart>
        <MockChart>
          <ChartLabel>💧 Humedad Relativa (%)</ChartLabel>
          <ChartArea style={{ 
            '&::after': { 
              background: '#646cff', 
              transform: 'rotate(10deg) translateY(-50%)' 
            } 
          }} /> 
        </MockChart>
        <MockChart>
          <ChartLabel>⚡ Energía (kW)</ChartLabel>
          <ChartArea style={{ 
            '&::after': { 
              background: '#ff9900', 
              transform: 'rotate(0deg) translateY(-50%)' 
            } 
          }} /> 
        </MockChart>
      </ChartsGrid>
    </TrendChartsContainer>
  );
}