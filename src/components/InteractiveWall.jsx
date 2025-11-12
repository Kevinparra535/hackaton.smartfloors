import { useState, useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import styled from 'styled-components';

const HtmlContainer = styled.div`
  width: ${(props) => props.$width}px;
  height: ${(props) => props.$height}px;
  background: rgba(10, 10, 10, 0.9);
  border: 2px solid ${(props) => (props.$isHovered ? '#00ff88' : '#646cff')};
  border-radius: 8px;
  padding: 20px;
  color: white;
  font-family: 'Inter', system-ui, sans-serif;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(100, 108, 255, 0.3);
  pointer-events: auto;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ff88;
    box-shadow: 0 8px 32px rgba(0, 255, 136, 0.4);
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Title = styled.h2`
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #646cff;
  text-align: center;
`;

const Content = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
`;

/**
 * InteractiveWall - Simple vertical wall plane on the left side with HTML overlay
 * HTML is integrated in 3D space and respects depth/occlusion
 */
export default function InteractiveWall() {
  const { camera, controls } = useThree();
  const [isHovered, setIsHovered] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: 1200,
    height: 600,
    aspectRatio: window.innerWidth / window.innerHeight
  });

  // Zoom animation state
  const isZooming = useRef(false);
  const zoomTarget = useRef(new THREE.Vector3(9, 0, 0)); // Camera position when zoomed
  const lookAtTarget = useRef(new THREE.Vector3(15, 0, 0)); // Look at wall center
  const zoomProgress = useRef(0);

  // Update dimensions based on screen aspect ratio
  useEffect(() => {
    const updateDimensions = () => {
      const aspectRatio = window.innerWidth / window.innerHeight;
      const baseWidth = 1200;
      const baseHeight = baseWidth / aspectRatio;

      setDimensions({
        width: baseWidth,
        height: baseHeight,
        aspectRatio
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleHtmlClick = () => {
    console.log('🖱️ HTML clicked - starting zoom animation');
    
    // Start zoom animation
    isZooming.current = true;
    zoomProgress.current = 0;

    // Disable OrbitControls during zoom
    if (controls) {
      controls.enabled = false;
    }
  };

  // Handle zoom animation
  useFrame(() => {
    if (!isZooming.current || !camera) return;

    zoomProgress.current += 0.05; // Speed of zoom
    const isComplete = zoomProgress.current >= 1;

    if (isComplete) {
      zoomProgress.current = 1;
      isZooming.current = false;
    }

    // Easing function
    const t = zoomProgress.current;
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    // Smoothly move camera to zoom position
    camera.position.lerp(zoomTarget.current, eased * 0.15);

    // Update controls target smoothly
    if (controls?.target) {
      controls.target.lerp(lookAtTarget.current, eased * 0.15);
    }

    // When zoom completes, snap to final position
    if (isComplete) {
      camera.position.copy(zoomTarget.current);
      if (controls?.target) {
        controls.target.copy(lookAtTarget.current);
      }
      // Keep controls disabled to maintain view
      if (controls) {
        controls.update();
      }
    }
  });

  return (
    <group position={[15, 0, 0]}>
      {/* Simple wall plane - no interaction */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial
          color='#1a1a1a'
          metalness={0.8}
          roughness={0.2}
          opacity={1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* HTML Content integrated in 3D space */}
      <Html
        transform
        occlude="blending"
        distanceFactor={2.5}
        position={[0, 0, 0.1]}
        rotation={[0, -Math.PI / 2, 0]}
        zIndexRange={[100, 0]}
      >
        <HtmlContainer
          $width={dimensions.width}
          $height={dimensions.height}
          $isHovered={isHovered}
          onClick={handleHtmlClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Title>SmartFloors Monitor</Title>
          <Content>
            <p>
              <strong>Relación de aspecto:</strong> {dimensions.aspectRatio.toFixed(2)}
            </p>
            <p>
              <strong>Dimensiones:</strong> {dimensions.width}x{dimensions.height}px
            </p>
            <p>
              <strong>Resolución:</strong> {window.innerWidth}x{window.innerHeight}px
            </p>
          </Content>
        </HtmlContainer>
      </Html>
    </group>
  );
}
