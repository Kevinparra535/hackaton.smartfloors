import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * GradientBackground - Animated gradient sphere background
 * Creates an immersive backdrop with subtle color shifts
 */
const GradientBackground = () => {
  const sphereRef = useRef();

  useFrame((state) => {
    if (sphereRef.current) {
      // Subtle rotation for dynamic feel
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={sphereRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[50, 32, 32]} />
      <meshBasicMaterial
        side={THREE.BackSide}
        color="#0a0a0a"
        fog={false}
      />
    </mesh>
  );
};

export default GradientBackground;
