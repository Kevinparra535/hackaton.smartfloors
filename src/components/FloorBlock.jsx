import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import {
  calculateHeatState,
  HEAT_LAYER_COLORS,
  HEAT_LAYER_SETTINGS
} from '../config/heatLayerConfig';
import { getVolumetricConfig, VISUALIZATION_MODES } from '../config/visualizationModes';
import VolumetricFog from './VolumetricFog';

/**
 * FloorBlock component - 3D representation of a building floor with Heat Layer visualization
 * @param {Object} props
 * @param {Object} props.data - Floor data (floorId, name, temperature, humidity, powerConsumption, occupancy, status)
 * @param {number} props.position - Y position of the floor
 * @param {Function} props.onClick - Callback when floor is clicked for zoom
 */
export default function FloorBlock({ data, position, onClick }) {
  const meshRef = useRef();
  const materialRef = useRef();

  // Estado reactivo para el modo de visualización
  const [visualizationMode, setVisualizationMode] = useState(() => {
    return localStorage.getItem('smartfloors-viz-mode') || VISUALIZATION_MODES.VOLUMETRIC;
  });

  // Calculate heat state dynamically based on real-time metrics
  const heatState = calculateHeatState(data);
  const colors = HEAT_LAYER_COLORS[heatState];
  const settings = HEAT_LAYER_SETTINGS;
  const shouldPulse = heatState === 'critical' || heatState === 'combined_risk';

  // Get volumetric configuration
  const volumetricData = getVolumetricConfig(heatState);

  // Determinar qué mostrar basado en el modo actual
  const showVolumetric = visualizationMode === VISUALIZATION_MODES.VOLUMETRIC;
  const showHeatLayer = visualizationMode === VISUALIZATION_MODES.HEAT_LAYER;

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

  // Handle click for zoom functionality
  const handleClick = (event) => {
    event.stopPropagation(); // Prevent event bubbling

    if (onClick) {
      onClick({
        floorData: data,
        floorY: position,
        floorId: data.floorId
      });
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
      materialRef.current.emissiveIntensity = pulse * settings.emissiveIntensity[heatState];

      // Subtle scale pulse
      meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * settings.pulseSpeed) * 0.02;
      meshRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * settings.pulseSpeed) * 0.02;
    } else {
      // Static emissive intensity for non-pulsing states
      materialRef.current.emissiveIntensity = settings.emissiveIntensity[heatState];
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <group position={[0, position, 0]}>
      {/* Main floor block with heat layer material */}
      <mesh
        ref={meshRef}
        onPointerDown={handleClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[3, 1.5, 3]} />
        <meshStandardMaterial
          ref={materialRef}
          color={showHeatLayer ? colors.primary : '#1a1a1a'}
          emissive={showHeatLayer ? colors.emissive : '#000000'}
          emissiveIntensity={showHeatLayer ? settings.emissiveIntensity[heatState] : 0}
          metalness={0.6}
          roughness={0.3}
          envMapIntensity={1}
          transparent
          opacity={showHeatLayer ? settings.mainOpacity : 0.4}
        />
      </mesh>

      {/* Outer glow effect with gradient secondary color */}
      {showHeatLayer && (
        <mesh scale={[1.05, 1.05, 1.05]}>
          <boxGeometry args={[3, 1.5, 3]} />
          <meshBasicMaterial color={colors.secondary} transparent opacity={0.15} wireframe />
        </mesh>
      )}

      {/* Volumetric Fog - Internal thermal smoke/fog */}
      {showVolumetric && (
        <VolumetricFog config={volumetricData.config} settings={volumetricData.settings} />
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

      {/* Ambient light based on heat state */}
      {showHeatLayer && (
        <pointLight
          position={[0, 0, 0]}
          color={colors.emissive}
          intensity={settings.pointLightIntensity[heatState]}
          distance={settings.pointLightDistance}
          decay={2}
        />
      )}

      {/* Heat state label (small text showing current state) */}
      {showHeatLayer && (
        <Text
          position={[0, -0.3, 1.6]}
          fontSize={0.10}
          color='#ffffff'
          anchorX='center'
          anchorY='middle'
          outlineWidth={0.02}
          outlineColor='#000000'
        >
          {heatState.replace('_', ' ').toUpperCase()}
        </Text>
      )}
    </group>
  );
}
