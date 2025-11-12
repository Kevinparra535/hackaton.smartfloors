import { SelectorContainer, SelectorLabel, Select } from '../styles/VisualizationControls.styled';

const MODES = [
  { value: 'heat_layer', label: '🌈 Capas de Color', emoji: '🌈' },
  { value: 'volumetric', label: '💨 Niebla Térmica', emoji: '💨' },
  { value: 'energy_bars', label: '⚡ Barras de Energía', emoji: '⚡' },
  { value: 'hybrid', label: '🔥 Híbrido', emoji: '🔥' }
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
      <SelectorLabel htmlFor='viz-mode-select'>
        Visualización:
      </SelectorLabel>
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
