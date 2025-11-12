import {
  LegendContainer,
  LegendTitle,
  LegendItems,
  LegendItem,
  ColorIndicator,
  LegendText,
  LegendLabel,
  LegendDescription,
  ModeDescription
} from '../styles/VisualizationControls.styled';

const COLOR_STATES = [
  {
    color: '#00b4d8',
    label: 'Óptimo',
    description: 'Condiciones ideales'
  },
  {
    color: '#ffd966',
    label: 'Alerta Media',
    description: 'Requiere atención'
  },
  {
    color: '#ff4d4f',
    label: 'Crítico',
    description: 'Acción inmediata'
  },
  {
    color: '#9d4edd',
    label: 'Riesgo Combinado',
    description: 'Múltiples problemas'
  }
];

const ENERGY_STATES = [
  {
    color: '#4da6ff',
    label: 'Frío + Bajo Consumo',
    description: '3 barras azules, pulso suave'
  },
  {
    color: '#4da6ff',
    label: 'Frío + Alto Consumo',
    description: '8 barras azules + arcos eléctricos'
  },
  {
    color: '#00ff88',
    label: 'Óptimo',
    description: '5 barras verdes, flujo constante'
  },
  {
    color: '#ff8c00',
    label: 'Cálido + Bajo Consumo',
    description: '4 barras naranjas, shimmer térmico'
  },
  {
    color: '#ff4444',
    label: 'Cálido + Alto Consumo',
    description: '10 barras rojas + distorsión + arcos'
  },
  {
    color: '#ff0000',
    label: 'Crítico',
    description: '15 barras rojas, máxima intensidad'
  }
];

const MODE_DESCRIPTIONS = {
  heat_layer: 'Los pisos se colorean según su estado térmico',
  volumetric: 'Niebla interna muestra intensidad térmica',
  energy_bars: 'Barras verticales muestran temperatura y consumo eléctrico',
  hybrid: 'Combina múltiples efectos de visualización'
};

/**
 * ColorLegend - Leyenda explicativa de colores/estados
 * @param {Object} props
 * @param {string} props.currentMode - Modo de visualización actual
 */
const ColorLegend = ({ currentMode }) => {
  const statesToShow = currentMode === 'energy_bars' ? ENERGY_STATES : COLOR_STATES;

  return (
    <LegendContainer>
      {/* <LegendTitle>
        {currentMode === 'energy_bars' ? 'Estados de Energía' : 'Estados del Sistema'}
      </LegendTitle> */}

      <LegendItems>
        {statesToShow.map((state) => (
          <LegendItem key={state.label}>
            <ColorIndicator $color={state.color} />
            <LegendText>
              <LegendLabel $color={state.color}>{state.label}</LegendLabel>
              <LegendDescription>{state.description}</LegendDescription>
            </LegendText>
          </LegendItem>
        ))}
      </LegendItems>

      {/* <ModeDescription>
        <strong>Modo actual:</strong>{' '}
        {MODE_DESCRIPTIONS[currentMode] || 'Descripción no disponible'}
      </ModeDescription> */}
    </LegendContainer>
  );
};

export default ColorLegend;
