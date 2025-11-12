import { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import styled from 'styled-components';
import TrendCharts from './TrendCharts';

const HtmlContainer = styled.div`
  width: 100%;
  height: calc(100% - 0px);
  border: 2px solid #646cff;
  border-radius: 8px;
  color: white;
  font-family: 'Inter', system-ui, sans-serif;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(100, 108, 255, 0.3);
  pointer-events: auto;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: #00ff88;
  }
`;

const Title = styled.h2`
  margin: 0;
  padding: 16px 20px;
  font-size: 24px;
  color: #646cff;
  text-align: center;
  border-bottom: 1px solid rgba(100, 108, 255, 0.3);
  background: rgba(26, 26, 26, 0.5);
  flex-shrink: 0;
`;

const ChartsWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

/**
 * InteractiveWall - Simple vertical wall plane with HTML overlay
 */
export default function InteractiveWall({ cameraControlsRef, selectedFloorId = 1 }) {
  const [isFocused, setIsFocused] = useState(false);
  const { size } = useThree(); // Get canvas size instead of window size
  const [dimensions, setDimensions] = useState({
    width: 1200,
    height: 700,
    aspectRatio: size.width / size.height
  });

  // Update dimensions based on canvas aspect ratio
  useEffect(() => {
    const updateDimensions = () => {
      const aspectRatio = size.width / size.height;
      const baseWidth = 1200;
      const baseHeight = baseWidth / aspectRatio;

      setDimensions({
        width: baseWidth,
        height: baseHeight,
        aspectRatio
      });
    };

    updateDimensions();
  }, [size.width, size.height]); // Update when canvas size changes

  const handleClick = () => {
    if (!cameraControlsRef?.current) {
      console.error('❌ CameraControls not available');
      return;
    }

    const controls = cameraControlsRef.current;
    const wallPosition = { x: 15, y: 0, z: 0 };

    if (isFocused) {
      // Reset camera to default view
      console.log('🔄 Resetting camera from HTML');
      controls.setLookAt(
        10,
        6,
        5, // Default camera position
        0,
        0,
        0, // Look at center
        true // Smooth transition
      );
      setIsFocused(false);
    } else {
      // Dolly to HTML wall - close enough to fill the screen
      // Center camera at same Y position as HTML for better framing
      console.log('🎬 Dolly to HTML wall');
      controls.setLookAt(
        wallPosition.x - 4,
        0,
        0, // Camera at same Y height as HTML center
        wallPosition.x,
        0,
        0, // Look directly at HTML center
        true // Smooth transition
      );
      setIsFocused(true);
    }
  };

  return (
    <group position={[15, 0, 0]}>
      {/* Simple wall plane - no interaction */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0.1, 0, 0]}>
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
        occlude='blending'
        distanceFactor={2.5}
        position={[0, 0, 1]}
        rotation={[0, -Math.PI / 2, 0]}
        zIndexRange={[100, 0]}
        center
        style={{
          marginTop: '50px',
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          overflow: 'visible',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start'
        }}
      >
        <HtmlContainer
          $width={dimensions.width}
          $height={dimensions.height}
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        >
          <Title>SmartFloors Analytics - Piso {selectedFloorId}</Title>
          <ChartsWrapper>
            <TrendCharts floorId={selectedFloorId} />
          </ChartsWrapper>
        </HtmlContainer>
      </Html>
    </group>
  );
}
