import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import floorTexture from '../assets/build_window.jpg';
import * as THREE from 'three';

const STATUS_COLORS = {
  normal: '##4f46e6',
  warning: '#ffd966',
  danger: '#ff4d4f'
};

/**
 * FloorBlock component - 3D representation of a building floor
 * @param {Object} props
 * @param {Object} props.data - Floor data (temperature, humidity, energy, status)
 * @param {number} props.position - Y position of the floor
 * @param {Function} props.onHover - Callback when floor is hovered
 */
// Valores Mínimos y Máximos que esperas recibir para la métrica (ej. Temperatura)
const MIN_VALUE = 20; // 20°C (frío, seguro)
const MAX_VALUE = 35; // 35°C (caliente, peligroso)

/**
 * Mapea un valor entre MIN_VALUE y MAX_VALUE a un color en un degradado.
 * @param {number} value - Valor de la métrica (ej. temperatura).
 * @returns {string} Código de color hexadecimal.
 */
function getHeatmapColor(value) {
  // Asegura que el valor esté dentro del rango
  const clampedValue = Math.max(MIN_VALUE, Math.min(MAX_VALUE, value));
  
  // Normaliza el valor a un rango de 0 a 1
  const normalized = (clampedValue - MIN_VALUE) / (MAX_VALUE - MIN_VALUE);

  // Crea el objeto de color de Three.js
  const color = new THREE.Color();

  // Usa un degradado de color (ej. HSL para un buen espectro)
  // H: Hue (Tonalidad) - 0.6 (Azul/Verde) a 0.0 (Rojo)
  // S: Saturation (Saturación) - 1.0 (máxima)
  // L: Lightness (Luminosidad) - 0.5 (media)
  // NOTA: Invertimos el normalized (1 - normalized) para que el valor BAJO (MIN_VALUE) 
  // tenga un HUE alto (Verde/Azul) y el valor ALTO (MAX_VALUE) tenga un HUE bajo (Rojo).
  color.setHSL(0.5 * (1 - normalized), 0.9, 0.5); 

  return '#' + color.getHexString();
}
export default function FloorBlock({ data, position, onHover }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const heatmapColor = getHeatmapColor(data.temperature);
  
  const statusColor = STATUS_COLORS[data.status] || STATUS_COLORS.normal;
  

  const color = STATUS_COLORS[data.status] || STATUS_COLORS.normal;

  // Breathing animation when status is warning or danger
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    if (data.status === 'warning' || data.status === 'danger') {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
      materialRef.current.emissiveIntensity = pulse;
      meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      meshRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    } else {
      materialRef.current.emissiveIntensity = 0.2;
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <group position={[0, position, 0]}>
      {/* Floor block */}
      <mesh ref={meshRef} onPointerOver={() => onHover(data)} onPointerOut={() => onHover(null)}>
        <boxGeometry args={[3, 0.8, 3]} />
        <meshStandardMaterial
          ref={materialRef}
          
          
          color={'#181818'}
          emissive={heatmapColor} 
          emissiveIntensity={
            // Controla la intensidad: valor base (0.5) + pulso (si hay alerta)
            data.status === 'warning' || data.status === 'danger' ? 
            materialRef.current?.userData.pulseFactor || 0.5 : 
            0.5 
          }
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Floor label */}
      <Text
        position={[0, 0, 1.6]}
        fontSize={0.3}
        color='#ffffff'
        anchorX='center'
        anchorY='middle'
      >
        Floor {data.floor}
      </Text>

      {/* Status indicator */}
      <mesh position={[1.6, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      </mesh>
    </group>
  );
}
