import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * FloatingParticles - Ambient particles floating around the building
 * Creates an immersive atmosphere with subtle animated particles
 */
const FloatingParticles = ({ count = 100 }) => {
  const particlesRef = useRef();

  // Generate random positions for particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 25;
      const y = Math.random() * 15 - 5;
      const z = (Math.random() - 0.5) * 25;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);

  // Animate particles with slow floating motion
  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Slow vertical drift
        positions[i + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.002;
        
        // Reset if particle drifts too high
        if (positions[i + 1] > 15) {
          positions[i + 1] = -5;
        }
        
        // Subtle horizontal drift
        positions[i] += Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.001;
        positions[i + 2] += Math.cos(state.clock.elapsedTime * 0.2 + i) * 0.001;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#646cff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default FloatingParticles;
