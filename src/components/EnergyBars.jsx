import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * EnergyBars - Barras/líneas de energía verticales que muestran temperatura + consumo eléctrico
 * @param {Object} props
 * @param {Object} props.config - Configuración del estado de energía
 * @param {Object} props.settings - Settings de las barras
 */
export default function EnergyBars({ config, settings }) {
  const barsGroupRef = useRef();
  const arcsGroupRef = useRef();

  // Generate bar positions in a grid pattern
  const barPositions = useMemo(() => {
    const positions = [];
    const count = config.barCount;
    const radius = 1.0;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      positions.push({ x, z, delay: i * 0.2 });
    }

    return positions;
  }, [config.barCount]);

  // Generate electric arc points
  const arcPoints = useMemo(() => {
    if (!config.electricArcs) return [];

    const arcs = [];
    for (let i = 0; i < settings.arcCount; i++) {
      const angle = (i / settings.arcCount) * Math.PI * 2;
      arcs.push({ angle, phase: Math.random() * Math.PI * 2 });
    }
    return arcs;
  }, [config.electricArcs, settings.arcCount]);

  // Animation loop
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Animate energy bars
    if (barsGroupRef.current) {
      barsGroupRef.current.children.forEach((bar, index) => {
        const delay = barPositions[index].delay;

        switch (config.effect) {
          case 'gentle_pulse':
            // Suave pulsación para estado frío/bajo consumo
            bar.scale.y = 0.8 + Math.sin(time * config.animationSpeed + delay) * 0.2;
            bar.material.opacity = config.opacity * (0.8 + Math.sin(time + delay) * 0.2);
            break;

          case 'electric_pulse':
            // Pulsos eléctricos rápidos
            bar.scale.y = 0.6 + Math.sin(time * config.animationSpeed * 2 + delay) * 0.4;
            bar.material.emissiveIntensity =
              config.barIntensity * (0.7 + Math.sin(time * 3 + delay) * 0.3);
            break;

          case 'steady_flow':
            // Flujo constante para estado óptimo
            bar.scale.y = 0.9 + Math.sin(time * config.animationSpeed + delay) * 0.1;
            bar.position.y = Math.sin(time * 0.5 + delay) * 0.05;
            break;

          case 'heat_shimmer':
            // Ondulación de calor suave
            bar.position.x += Math.sin(time * 2 + delay) * 0.003;
            bar.position.z += Math.cos(time * 2 + delay) * 0.003;
            bar.scale.y = 0.85 + Math.sin(time * config.animationSpeed + delay) * 0.15;
            break;

          case 'heat_wave':
            // Distorsión de calor intensa
            bar.position.x += Math.sin(time * 3 + delay) * 0.01;
            bar.position.z += Math.cos(time * 3 + delay) * 0.01;
            bar.scale.y = 0.7 + Math.sin(time * config.animationSpeed + delay) * 0.3;
            bar.material.emissiveIntensity =
              config.barIntensity * (0.8 + Math.sin(time * 2 + delay) * 0.2);
            break;

          case 'critical_overload':
            // Estado crítico con máxima distorsión
            bar.position.x += Math.sin(time * 5 + delay) * 0.02;
            bar.position.z += Math.cos(time * 5 + delay) * 0.02;
            bar.scale.y = 0.5 + Math.sin(time * config.animationSpeed + delay) * 0.5;
            bar.material.emissiveIntensity =
              config.barIntensity * (0.9 + Math.sin(time * 4 + delay) * 0.1);
            bar.material.opacity = config.opacity * (0.9 + Math.sin(time * 3 + delay) * 0.1);
            break;
        }
      });
    }

    // Animate electric arcs
    if (arcsGroupRef.current && config.electricArcs) {
      arcsGroupRef.current.rotation.y = time * settings.arcSpeed * 0.3;

      arcsGroupRef.current.children.forEach((arc, index) => {
        const pulse = Math.sin(time * settings.arcSpeed + arcPoints[index].phase);
        arc.material.opacity = config.opacity * 0.6 * (0.5 + pulse * 0.5);
        arc.material.emissiveIntensity = config.barIntensity * (0.8 + pulse * 0.2);
      });
    }
  });

  return (
    <group>
      {/* Energy Bars - Vertical bars showing energy flow */}
      <group ref={barsGroupRef}>
        {barPositions.map((pos, index) => (
          <mesh key={`bar-${index}`} position={[pos.x, 0, pos.z]}>
            <boxGeometry args={[settings.barWidth, settings.barHeight, settings.barDepth]} />
            <meshStandardMaterial
              color={config.color}
              emissive={config.color}
              emissiveIntensity={config.barIntensity}
              transparent
              opacity={config.opacity}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Electric Arcs - Only for high power states */}
      {config.electricArcs && (
        <group ref={arcsGroupRef}>
          {arcPoints.map((arc, index) => (
            <mesh key={`arc-${index}`} rotation={[0, arc.angle, 0]}>
              <torusGeometry
                args={[settings.arcRadius, settings.arcThickness, 8, 32, Math.PI * 0.5]}
              />
              <meshStandardMaterial
                color={config.secondaryColor}
                emissive={config.secondaryColor}
                emissiveIntensity={config.barIntensity}
                transparent
                opacity={config.opacity * 0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Ambient point light based on energy state */}
      <pointLight
        position={[0, 0, 0]}
        color={config.ambientColor}
        intensity={config.glowIntensity * 2}
        distance={settings.glowDistance}
        decay={settings.glowDecay}
      />

      {/* Heat distortion effect (visual cue only) */}
      {config.distortion && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.3, 16, 16]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={0.05}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}
