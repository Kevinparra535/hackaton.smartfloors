import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * VolumetricFog - Niebla/humo térmico volumétrico interno
 * @param {Object} props
 * @param {Object} props.config - Configuración volumétrica del estado
 * @param {Object} props.settings - Settings generales de volumetría
 */
export default function VolumetricFog({ config, settings }) {
  const particlesRef = useRef();
  const fogRef = useRef();
  const glowRef = useRef();

  // Generate particles based on density
  const particlePositions = useMemo(() => {
    const positions = [];
    const count = config.particleCount;

    for (let i = 0; i < count; i++) {
      // Random position within volume bounds
      const x = (Math.random() - 0.5) * settings.particleSpread;
      const y = (Math.random() - 0.5) * settings.volumeSize[1];
      const z = (Math.random() - 0.5) * settings.particleSpread;
      
      positions.push(x, y, z);
    }

    return new Float32Array(positions);
  }, [config.particleCount, settings.particleSpread, settings.volumeSize]);

  // Particle animation - rising smoke/fog effect
  useFrame((state) => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < positions.length; i += 3) {
      // Rise effect
      positions[i + 1] += config.particleSpeed * 0.01;

      // Turbulence effect for critical states
      if (config.turbulence) {
        positions[i] += Math.sin(time * 2 + i) * 0.005;
        positions[i + 2] += Math.cos(time * 2 + i) * 0.005;
      }

      // Reset particle when it reaches top
      if (positions[i + 1] > settings.volumeSize[1] / 2) {
        positions[i + 1] = -settings.volumeSize[1] / 2;
        positions[i] = (Math.random() - 0.5) * settings.particleSpread;
        positions[i + 2] = (Math.random() - 0.5) * settings.particleSpread;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    // Rotation effect
    particlesRef.current.rotation.y += settings.rotationSpeed * 0.01;

    // Pulsate effect for critical states
    if (config.pulsate && fogRef.current) {
      const pulse = Math.sin(time * 1.5) * 0.2 + 0.8;
      fogRef.current.material.opacity = config.opacity * pulse;
      
      if (glowRef.current) {
        glowRef.current.material.opacity = config.glow * pulse;
      }
    }
  });

  return (
    <group position={settings.volumePosition}>
      {/* Main volumetric fog - semi-transparent box */}
      <mesh ref={fogRef}>
        <boxGeometry args={settings.volumeSize} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={config.glow}
          transparent
          opacity={config.opacity}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer glow layer */}
      <mesh ref={glowRef} scale={[1.1, 1.1, 1.1]}>
        <boxGeometry args={settings.volumeSize} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={config.glow * 0.3}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Particle system - smoke/fog particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach='attributes-position'
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={settings.particleSize}
          color={config.color}
          transparent
          opacity={config.opacity * 0.6}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Point light for volumetric glow effect */}
      <pointLight
        position={[0, 0, 0]}
        color={config.emissive}
        intensity={config.glow * 2}
        distance={settings.glowDistance}
        decay={settings.glowDecay}
      />
    </group>
  );
}
