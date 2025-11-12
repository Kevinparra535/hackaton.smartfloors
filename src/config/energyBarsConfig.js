import * as THREE from 'three';

/**
 * Energy Bars Configuration
 * Sistema de barras/líneas de energía que combina temperatura + consumo eléctrico
 */

/**
 * Energy States basados en temperatura y consumo
 */
export const ENERGY_STATES = {
  COLD_LOW: 'cold_low',           // Frío + bajo consumo
  COLD_HIGH: 'cold_high',         // Frío + alto consumo
  OPTIMAL: 'optimal',             // Temperatura normal + consumo normal
  WARM_LOW: 'warm_low',           // Caliente + bajo consumo
  WARM_HIGH: 'warm_high',         // Caliente + alto consumo
  CRITICAL: 'critical'            // Temperatura crítica + consumo crítico
};

/**
 * Energy Visual Configuration
 * Configuración visual por estado de energía
 */
export const ENERGY_VISUALS = {
  cold_low: {
    // Ambiente frío con bajo consumo - azules sutiles
    color: '#4dd0e1',
    secondaryColor: '#00acc1',
    barCount: 3,
    barIntensity: 0.3,
    opacity: 0.4,
    glowIntensity: 0.2,
    animationSpeed: 0.5,
    effect: 'gentle_pulse',
    ambientColor: '#00bcd4',
    distortion: false,
    electricArcs: false,
    name: 'Frío/Bajo Consumo'
  },
  cold_high: {
    // Ambiente frío pero alto consumo - azules con arcos eléctricos
    color: '#00e5ff',
    secondaryColor: '#00b8d4',
    barCount: 8,
    barIntensity: 0.7,
    opacity: 0.6,
    glowIntensity: 0.6,
    animationSpeed: 2.0,
    effect: 'electric_pulse',
    ambientColor: '#00e5ff',
    distortion: false,
    electricArcs: true,
    name: 'Frío/Alto Consumo'
  },
  optimal: {
    // Condiciones óptimas - verde equilibrado
    color: '#00ff88',
    secondaryColor: '#00e676',
    barCount: 5,
    barIntensity: 0.5,
    opacity: 0.5,
    glowIntensity: 0.4,
    animationSpeed: 1.0,
    effect: 'steady_flow',
    ambientColor: '#00ff88',
    distortion: false,
    electricArcs: false,
    name: 'Óptimo'
  },
  warm_low: {
    // Caliente pero bajo consumo - naranjas suaves
    color: '#ffa726',
    secondaryColor: '#ff9800',
    barCount: 4,
    barIntensity: 0.4,
    opacity: 0.5,
    glowIntensity: 0.3,
    animationSpeed: 1.2,
    effect: 'heat_shimmer',
    ambientColor: '#ff9800',
    distortion: true,
    electricArcs: false,
    name: 'Caliente/Bajo Consumo'
  },
  warm_high: {
    // Caliente con alto consumo - rojos intensos con distorsión
    color: '#ff5722',
    secondaryColor: '#f44336',
    barCount: 10,
    barIntensity: 0.8,
    opacity: 0.7,
    glowIntensity: 0.7,
    animationSpeed: 2.5,
    effect: 'heat_wave',
    ambientColor: '#ff5722',
    distortion: true,
    electricArcs: true,
    name: 'Caliente/Alto Consumo'
  },
  critical: {
    // Estado crítico - rojo extremo con máxima distorsión
    color: '#ff1744',
    secondaryColor: '#d50000',
    barCount: 15,
    barIntensity: 1.0,
    opacity: 0.9,
    glowIntensity: 1.0,
    animationSpeed: 3.5,
    effect: 'critical_overload',
    ambientColor: '#ff1744',
    distortion: true,
    electricArcs: true,
    name: 'Crítico'
  }
};

/**
 * Energy Bars Settings
 */
export const ENERGY_BAR_SETTINGS = {
  // Bar dimensions
  barWidth: 0.08,
  barHeight: 1.0,
  barDepth: 0.08,
  
  // Bar spacing
  barSpacing: 0.25,
  
  // Arc settings
  arcCount: 3,
  arcRadius: 0.3,
  arcThickness: 0.02,
  
  // Animation
  pulseSpeed: 1.5,
  flowSpeed: 1.0,
  arcSpeed: 2.0,
  
  // Distortion
  distortionIntensity: 0.1,
  distortionSpeed: 1.0,
  
  // Glow
  glowDistance: 4,
  glowDecay: 2
};

/**
 * Calculate energy state based on temperature and power consumption
 * @param {number} temperature - Temperature in °C
 * @param {number} powerConsumption - Power in kW
 * @returns {string} Energy state
 */
export const calculateEnergyState = (temperature, powerConsumption) => {
  const isCold = temperature < 20;
  const isWarm = temperature > 24;
  const isCriticalTemp = temperature < 16 || temperature > 28;
  
  const isLowPower = powerConsumption < 130;
  const isHighPower = powerConsumption > 140;
  const isCriticalPower = powerConsumption > 160;

  // Critical state - temperatura o consumo en niveles peligrosos
  if (isCriticalTemp || isCriticalPower) {
    return ENERGY_STATES.CRITICAL;
  }

  // Caliente con alto consumo
  if (isWarm && isHighPower) {
    return ENERGY_STATES.WARM_HIGH;
  }

  // Caliente con bajo consumo
  if (isWarm && isLowPower) {
    return ENERGY_STATES.WARM_LOW;
  }

  // Frío con alto consumo (AC funcionando mucho)
  if (isCold && isHighPower) {
    return ENERGY_STATES.COLD_HIGH;
  }

  // Frío con bajo consumo
  if (isCold && isLowPower) {
    return ENERGY_STATES.COLD_LOW;
  }

  // Óptimo - temperatura y consumo en rangos normales
  return ENERGY_STATES.OPTIMAL;
};

/**
 * Get energy configuration for a floor
 * @param {Object} floor - Floor data
 * @returns {Object} Energy configuration
 */
export const getEnergyConfig = (floor) => {
  const state = calculateEnergyState(floor.temperature, floor.powerConsumption);
  const config = ENERGY_VISUALS[state];
  
  return {
    state,
    config,
    settings: ENERGY_BAR_SETTINGS,
    temperature: floor.temperature,
    powerConsumption: floor.powerConsumption
  };
};
