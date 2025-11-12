/**
 * Heat Layer Configuration
 * Manual configuration for visual representation of floor heat states
 */

/**
 * Heat Layer States
 * Define visual states for each floor based on conditions
 */
export const HEAT_LAYER_STATES = {
  OPTIMAL: 'optimal',
  WARNING: 'warning',
  CRITICAL: 'critical',
  COMBINED_RISK: 'combined_risk'
};

/**
 * Heat Layer Colors
 * Color mapping for each state
 */
export const HEAT_LAYER_COLORS = {
  [HEAT_LAYER_STATES.OPTIMAL]: {
    primary: '#00b4d8',      // Azul - Óptimo
    secondary: '#0096c7',
    gradient: ['#00b4d8', '#0077b6'],
    emissive: '#00b4d8',
    name: 'Óptimo'
  },
  [HEAT_LAYER_STATES.WARNING]: {
    primary: '#ffd966',      // Amarillo - Alerta media
    secondary: '#ffb703',
    gradient: ['#ffd966', '#ffb703'],
    emissive: '#ffd966',
    name: 'Alerta Media'
  },
  [HEAT_LAYER_STATES.CRITICAL]: {
    primary: '#ff4d4f',      // Rojo - Alerta crítica
    secondary: '#dc2f02',
    gradient: ['#ff4d4f', '#dc2f02'],
    emissive: '#ff4d4f',
    name: 'Crítico'
  },
  [HEAT_LAYER_STATES.COMBINED_RISK]: {
    primary: '#9d4edd',      // Morado - Riesgo combinado
    secondary: '#7209b7',
    gradient: ['#9d4edd', '#7209b7'],
    emissive: '#9d4edd',
    name: 'Riesgo Combinado'
  }
};

/**
 * Manual Heat Layer Configuration
 * Set the heat state for each floor manually
 * 
 * CAMBIAR ESTOS VALORES PARA PROBAR DIFERENTES ESTADOS VISUALES:
 * - 'optimal': Azul
 * - 'warning': Amarillo
 * - 'critical': Rojo
 * - 'combined_risk': Morado
 */
export const MANUAL_HEAT_CONFIG = {
  1: HEAT_LAYER_STATES.OPTIMAL,        // Piso 1: Azul
  2: HEAT_LAYER_STATES.WARNING,        // Piso 2: Amarillo
  3: HEAT_LAYER_STATES.CRITICAL,       // Piso 3: Rojo
  4: HEAT_LAYER_STATES.COMBINED_RISK,  // Piso 4: Morado
  5: HEAT_LAYER_STATES.OPTIMAL         // Piso 5: Azul
};

/**
 * Heat Layer Visual Settings
 * Control visual appearance of heat layers
 */
export const HEAT_LAYER_SETTINGS = {
  // Transparency
  mainOpacity: 0.7,           // Opacidad del bloque principal
  glowOpacity: 0.3,           // Opacidad del resplandor exterior
  
  // Gradient
  gradientIntensity: 0.8,     // Intensidad del gradiente
  
  // Animation
  pulseSpeed: 1.5,            // Velocidad de pulsación (crítico/combinado)
  pulseIntensity: 0.3,        // Intensidad de pulsación
  
  // Glow
  emissiveIntensity: {
    optimal: 0.3,
    warning: 0.5,
    critical: 0.8,
    combined_risk: 0.9
  },
  
  // Light
  pointLightIntensity: {
    optimal: 1,
    warning: 1.5,
    critical: 2.5,
    combined_risk: 3
  },
  pointLightDistance: 6,
  
  // Wireframe glow
  wireframeScale: 1.08,       // Escala del wireframe exterior
  wireframeOpacity: 0.2
};

/**
 * Get heat layer configuration for a specific floor
 * @param {number} floorId - Floor ID (1-5)
 * @returns {Object} Heat layer configuration
 */
export const getFloorHeatConfig = (floorId) => {
  const state = MANUAL_HEAT_CONFIG[floorId] || HEAT_LAYER_STATES.OPTIMAL;
  const colors = HEAT_LAYER_COLORS[state];
  const settings = HEAT_LAYER_SETTINGS;

  return {
    state,
    colors,
    settings,
    shouldPulse: state === HEAT_LAYER_STATES.CRITICAL || state === HEAT_LAYER_STATES.COMBINED_RISK
  };
};

/**
 * Determine heat state based on floor metrics (para uso futuro automático)
 * @param {Object} floor - Floor data
 * @returns {string} Heat layer state
 */
export const calculateHeatState = (floor) => {
  const { temperature, humidity, powerConsumption } = floor;

  // Riesgo combinado: temperatura alta + consumo alto
  if (temperature > 26 && powerConsumption > 140) {
    return HEAT_LAYER_STATES.COMBINED_RISK;
  }

  // Crítico: cualquier métrica en rango peligroso
  if (temperature > 26 || temperature < 18) {
    return HEAT_LAYER_STATES.CRITICAL;
  }
  if (humidity > 70 || humidity < 30) {
    return HEAT_LAYER_STATES.CRITICAL;
  }
  if (powerConsumption > 150) {
    return HEAT_LAYER_STATES.CRITICAL;
  }

  // Advertencia: métricas en rango de alerta
  if (temperature > 24 || temperature < 20) {
    return HEAT_LAYER_STATES.WARNING;
  }
  if (humidity > 60 || humidity < 35) {
    return HEAT_LAYER_STATES.WARNING;
  }
  if (powerConsumption > 135) {
    return HEAT_LAYER_STATES.WARNING;
  }

  // Óptimo: todo en rangos normales
  return HEAT_LAYER_STATES.OPTIMAL;
};
