import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { getFloorHeatConfig } from '../config/heatLayerConfig';
import { getVolumetricConfig, VISUALIZATION_MODES } from '../config/visualizationModes';
import { getEnergyConfig } from '../config/energyBarsConfig';
import VolumetricFog from './VolumetricFog';
import EnergyBars from './EnergyBars';

/**
 * FloorBlock component - 3D representation of a building floor with Heat Layer visualization
 * @param {Object} props
 * @param {Object} props.data - Floor data (floorId, name, temperature, humidity, powerConsumption, occupancy, status)
 * @param {number} props.position - Y position of the floor
 * @param {Function} props.onHover - Callback when floor is hovered
 */
export default function FloorBlock({ data, position, onHover }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const isHoveredRef = useRef(false);

  // Estado reactivo para el modo de visualización
  const [visualizationMode, setVisualizationMode] = useState(() => {
    return localStorage.getItem('smartfloors-viz-mode') || VISUALIZATION_MODES.VOLUMETRIC;
  });

  // Get heat layer configuration for this floor
  const heatConfig = getFloorHeatConfig(data.floorId);
  const { state, colors, settings, shouldPulse } = heatConfig;

  // Get volumetric configuration
  const volumetricData = getVolumetricConfig(state);
  
  // Get energy bars configuration
  const energyData = getEnergyConfig(data);
  
  // Determinar qué mostrar basado en el modo actual
  const showVolumetric = visualizationMode === VISUALIZATION_MODES.VOLUMETRIC;
  const showHeatLayer = visualizationMode === VISUALIZATION_MODES.HEAT_LAYER;
  const showEnergyBars = visualizationMode === VISUALIZATION_MODES.ENERGY_BARS ||
                        visualizationMode === VISUALIZATION_MODES.HYBRID;

  // Escuchar cambios de modo de visualización
  useEffect(() => {
    const handleModeChange = (event) => {
      const newMode = event.detail.mode;
      console.log(`🔄 [FloorBlock ${data.floorId}] Modo cambiado a: ${newMode}`);
      setVisualizationMode(newMode);
    };

    window.addEventListener('visualizationModeChange', handleModeChange);
    
    return () => {
      window.removeEventListener('visualizationModeChange', handleModeChange);
    };
  }, [data.floorId]);

  // Log heat layer state for debugging
  useEffect(() => {
    console.log(`🌡️ [FloorBlock ${data.floorId}] Heat Layer State:`, {
      floorId: data.floorId,
      state,
      colors,
      shouldPulse,
      opacity: settings.mainOpacity
    });
  }, [data.floorId, state, colors, shouldPulse, settings.mainOpacity]);

  // Handle hover state
  const handlePointerOver = () => {
    if (!isHoveredRef.current) {
      isHoveredRef.current = true;
      document.body.style.cursor = 'pointer';
      if (onHover) {
        onHover(data);
      }
    }
  };

  const handlePointerOut = () => {
    if (isHoveredRef.current) {
      isHoveredRef.current = false;
      document.body.style.cursor = 'default';
      if (onHover) {
        onHover(null);
      }
    }
  };

  // Update material colors when heat state changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(colors.primary);
      materialRef.current.emissive.set(colors.emissive);
      materialRef.current.needsUpdate = true;
    }
  }, [colors.primary, colors.emissive, data.floorId]);

  // Pulse animation for critical and combined_risk states
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    if (shouldPulse) {
      // Pulse animation using configured speed
      const pulse = Math.sin(state.clock.elapsedTime * settings.pulseSpeed) * 0.3 + 0.7;
      materialRef.current.emissiveIntensity = pulse * settings.emissiveIntensity[heatConfig.state];
      
      // Subtle scale pulse
      meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * settings.pulseSpeed) * 0.02;
      meshRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * settings.pulseSpeed) * 0.02;
    } else {
      // Static emissive intensity for non-pulsing states
      materialRef.current.emissiveIntensity = settings.emissiveIntensity[heatConfig.state];
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <group position={[0, position, 0]}>
      {/* Main floor block with heat layer material */}
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerMove={handlePointerOver}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[3, 1.5, 3]} />
        <meshStandardMaterial
          ref={materialRef}
          color={showHeatLayer ? colors.primary : '#1a1a1a'}
          emissive={showHeatLayer ? colors.emissive : '#000000'}
          emissiveIntensity={showHeatLayer ? settings.emissiveIntensity[state] : 0}
          metalness={0.6}
          roughness={0.3}
          envMapIntensity={1}
          transparent
          opacity={showHeatLayer ? settings.mainOpacity : (showEnergyBars ? 0.3 : 0.4)}
        />
      </mesh>

      {/* Outer glow effect with gradient secondary color */}
      {showHeatLayer && (
        <mesh scale={[1.05, 1.05, 1.05]}>
          <boxGeometry args={[3, 1.5, 3]} />
          <meshBasicMaterial
            color={colors.secondary}
            transparent
            opacity={0.15}
            wireframe
          />
        </mesh>
      )}

      {/* Volumetric Fog - Internal thermal smoke/fog */}
      {showVolumetric && (
        <VolumetricFog 
          config={volumetricData.config} 
          settings={volumetricData.settings}
        />
      )}

      {/* Energy Bars - Temperature + Power Consumption visualization */}
      {showEnergyBars && (
        <EnergyBars
          config={energyData.config}
          settings={energyData.settings}
        />
      )}

      {/* Floor label with better visibility */}
      <Text
        position={[0, 0, 1.6]}
        fontSize={0.3}
        color='#ffffff'
        anchorX='center'
        anchorY='middle'
        outlineWidth={0.02}
        outlineColor='#000000'
      >
        {data.name || `Piso ${data.floorId}`}
      </Text>

      {/* Heat state indicator sphere */}
      {showHeatLayer && (
        <mesh position={[1.6, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial 
            color={colors.primary} 
            emissive={colors.emissive} 
            emissiveIntensity={settings.emissiveIntensity[state] * 2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      )}

      {/* Ambient light based on heat state */}
      {showHeatLayer && (
        <pointLight 
          position={[0, 0, 0]} 
          color={colors.emissive} 
          intensity={settings.pointLightIntensity[state]}
          distance={settings.pointLightDistance}
          decay={2}
        />
      )}

      {/* Heat state label (small text showing current state) */}
      {showHeatLayer && (
        <Text
          position={[0, -0.9, 0]}
          fontSize={0.15}
          color={colors.primary}
          anchorX='center'
          anchorY='middle'
          outlineWidth={0.01}
          outlineColor='#000000'
        >
          {state.replace('_', ' ').toUpperCase()}
        </Text>
      )}
    </group>
  );
}
