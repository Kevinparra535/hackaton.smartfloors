/**
 * Visualization Modes Configuration
 * Sistema para cambiar entre diferentes estilos de visualización
 */

/**
 * Available Visualization Modes
 */
export const VISUALIZATION_MODES = {
  HEAT_LAYER: 'heat_layer', // Capas de color en los pisos
  VOLUMETRIC: 'volumetric' // Niebla/humo térmico interno
};

/**
 * Current Active Mode
 * Se lee dinámicamente del localStorage o usa VOLUMETRIC como default
 */
const getActiveMode = () => {
  if (typeof window !== 'undefined') {
    const savedMode = localStorage.getItem('smartfloors-viz-mode');
    if (savedMode && Object.values(VISUALIZATION_MODES).includes(savedMode)) {
      return savedMode;
    }
  }
  return VISUALIZATION_MODES.VOLUMETRIC;
};

export const ACTIVE_MODE = getActiveMode();

/**
 * Volumetric Fog Configuration
 * Configuración de niebla/humo térmico por estado
 */
export const VOLUMETRIC_CONFIG = {
  optimal: {
    color: '#00b4d8', // Azul frío
    density: 0.3, // Densidad baja (poco humo)
    opacity: 0.2, // Muy transparente
    particleCount: 50, // Pocas partículas
    particleSpeed: 0.3, // Movimiento lento
    glow: 0.1, // Sin glow
    emissive: '#00b4d8',
    name: 'Niebla Óptima'
  },
  warning: {
    color: '#ffd966', // Amarillo
    density: 0.5, // Densidad media
    opacity: 0.35, // Semi-transparente
    particleCount: 100, // Partículas medias
    particleSpeed: 0.6, // Movimiento moderado
    glow: 0.3, // Glow moderado
    emissive: '#ffb703',
    name: 'Niebla de Alerta'
  },
  critical: {
    color: '#ff4d4f', // Rojo intenso
    density: 0.8, // Densidad alta (mucho humo)
    opacity: 0.5, // Opaco
    particleCount: 200, // Muchas partículas
    particleSpeed: 1.2, // Movimiento rápido
    glow: 0.6, // Glow fuerte
    emissive: '#dc2f02',
    name: 'Humo Crítico',
    pulsate: true // Efecto de pulsación
  },
  combined_risk: {
    color: '#9d4edd', // Morado denso
    density: 1.0, // Densidad máxima
    opacity: 0.65, // Muy opaco
    particleCount: 300, // Máximas partículas
    particleSpeed: 1.8, // Movimiento muy rápido
    glow: 0.9, // Glow máximo
    emissive: '#7209b7',
    name: 'Tormenta Térmica',
    pulsate: true, // Efecto de pulsación
    turbulence: true // Efecto de turbulencia
  }
};

/**
 * Volumetric Visual Settings
 */
export const VOLUMETRIC_SETTINGS = {
  // Particle System
  particleSize: 0.15, // Tamaño de partículas individuales
  particleSpread: 1.2, // Dispersión dentro del volumen

  // Animation
  rotationSpeed: 0.2, // Velocidad de rotación del humo
  riseSpeed: 0.5, // Velocidad de ascenso del humo
  turbulenceIntensity: 0.3, // Intensidad de turbulencia

  // Fog Volume
  volumeSize: [2.6, 1.2, 2.6], // Tamaño del volumen interno (ligeramente menor que el piso)
  volumePosition: [0, 0, 0], // Posición dentro del piso

  // Glow Effect
  glowDistance: 3, // Distancia del glow volumétrico
  glowDecay: 2, // Decaimiento del glow

  // Performance
  maxParticles: 300, // Máximo de partículas por piso
  updateFrequency: 60 // FPS de actualización
};

/**
 * Get volumetric configuration for a heat state
 * @param {string} state - Heat state (optimal, warning, critical, combined_risk)
 * @returns {Object} Volumetric configuration
 */
export const getVolumetricConfig = (state) => {
  return {
    config: VOLUMETRIC_CONFIG[state] || VOLUMETRIC_CONFIG.optimal,
    settings: VOLUMETRIC_SETTINGS
  };
};

/**
 * Check if volumetric mode is active
 * @returns {boolean}
 */
export const isVolumetricActive = () => {
  const mode = getActiveMode();
  return mode === VISUALIZATION_MODES.VOLUMETRIC;
};

/**
 * Check if heat layer mode is active
 * @returns {boolean}
 */
export const isHeatLayerActive = () => {
  const mode = getActiveMode();
  return mode === VISUALIZATION_MODES.HEAT_LAYER;
};
