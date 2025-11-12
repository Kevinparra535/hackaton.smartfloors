import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const STATUS_COLORS = {
  normal: '#00ff88',
  warning: '#ffd966',
  danger: '#ff4d4f'
};

/**
 * FloorBlock component - 3D representation of a building floor
 * @param {Object} props
 * @param {Object} props.data - Floor data (floorId, name, temperature, humidity, powerConsumption, occupancy, status)
 * @param {number} props.position - Y position of the floor
 * @param {Function} props.onHover - Callback when floor is hovered
 */
export default function FloorBlock({ data, position, onHover }) {
  const meshRef = useRef();
  const materialRef = useRef();

  const color = STATUS_COLORS[data.status] || STATUS_COLORS.normal;

  // Monitor color changes for debugging
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(color);
      materialRef.current.emissive.set(color);
      materialRef.current.needsUpdate = true;
    }
  }, [color, data.floorId]);

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
        <boxGeometry args={[3, 1, 3]} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
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
        {data.name || `Piso ${data.floorId}`}
      </Text>

      {/* Status indicator */}
      <mesh position={[1.6, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      </mesh>
    </group>
  );
}
