import { SelectorContainer, SelectorLabel, Select } from '../styles/VisualizationControls.styled';

const MODES = [
  { value: 'heat_layer', label: 'Capas de Color' },
  { value: 'volumetric', label: 'Niebla Térmica' },
  { value: 'energy_bars', label: 'Barras de Energía' },
  { value: 'hybrid', label: 'Híbrido' }
];

/**
 * VisualizationSelector - Selector de modo de visualización
 * @param {Object} props
 * @param {string} props.currentMode - Modo actual activo
 * @param {Function} props.onModeChange - Callback cuando cambia el modo
 */
const VisualizationSelector = ({ currentMode, onModeChange }) => {
  const handleChange = (e) => {
    const newMode = e.target.value;
    onModeChange(newMode);
  };

  return (
    <SelectorContainer>
      <Select
        id='viz-mode-select'
        value={currentMode}
        onChange={handleChange}
        title='Cambiar modo de visualización'
      >
        {MODES.map((mode) => (
          <option key={mode.value} value={mode.value}>
            {mode.label}
          </option>
        ))}
      </Select>
    </SelectorContainer>
  );
};

export default VisualizationSelector;
