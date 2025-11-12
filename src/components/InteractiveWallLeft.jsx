import { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import styled from 'styled-components';
import AlertsTable from './AlertsTable';

const HtmlContainer = styled.div`
  width: 100%;
  height: calc(100% - 0px);
  border: 2px solid #ff4d4f;
  border-radius: 8px;
  color: white;
  font-family: 'Inter', system-ui, sans-serif;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(255, 77, 79, 0.3);
  pointer-events: auto;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  background: rgba(26, 26, 26, 0.95);

  /* Text clarity improvements */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: 'kern' 1;
  font-kerning: normal;

  /* Prevent blurring on transform */
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;

  &:hover {
    border-color: #00ff88;
  }
`;

const Title = styled.h2`
  margin: 0;
  padding: 16px 20px;
  font-size: 24px;
  color: #ff4d4f;
  text-align: center;
  border-bottom: 1px solid rgba(255, 77, 79, 0.3);
  background: rgba(26, 26, 26, 0.5);
  flex-shrink: 0;

  /* Text clarity */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 20px;
  background: rgba(255, 77, 79, 0.2);
  border: 2px solid #ff4d4f;
  border-radius: 8px;
  color: #ff4d4f;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: rgba(255, 77, 79, 0.4);
    border-color: #ff7875;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(255, 77, 79, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }
`;

/**
 * InteractiveWallLeft - Left side wall with Alerts Table
 * Positioned at x = -15 (opposite side of the main wall)
 * @param {Object} props
 * @param {Object} props.cameraControlsRef - Reference to camera controls
 * @param {Array} props.alerts - Array of alerts to display
 * @param {boolean} props.shouldFocus - External trigger to focus the alerts table
 * @param {Function} props.onFocusComplete - Callback when focus animation completes
 */
export default function InteractiveWallLeft({
  cameraControlsRef,
  alerts = [],
  shouldFocus = false,
  onFocusComplete
}) {
  const [isFocused, setIsFocused] = useState(false);
  const { size } = useThree();
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
  }, [size.width, size.height]);

  // Handle external focus trigger (from FloorInfoPanel button)
  useEffect(() => {
    if (shouldFocus && !isFocused) {
      handleClick();
      if (onFocusComplete) {
        onFocusComplete();
      }
    }
  }, [shouldFocus]); // eslint-disable-line react-hooks/exhaustive-deps

  // Disable camera controls when table is focused
  useEffect(() => {
    if (!cameraControlsRef?.current) return;

    const controls = cameraControlsRef.current;

    if (isFocused) {
      controls.enabled = false;
      console.log('🔒 Camera controls disabled - Alerts table scroll enabled');
    } else {
      controls.enabled = true;
      console.log('🔓 Camera controls enabled - Alerts table scroll disabled');
    }

    return () => {
      if (controls) {
        controls.enabled = true;
      }
    };
  }, [isFocused, cameraControlsRef]);

  const handleClick = () => {
    if (!cameraControlsRef?.current) {
      console.error('❌ CameraControls not available');
      return;
    }

    const controls = cameraControlsRef.current;
    const wallPosition = { x: -15, y: 0, z: 0 };

    // Dolly to left wall - camera needs to be on the RIGHT side looking LEFT
    console.log('🎬 Dolly to Alerts Table wall (left)');
    console.log('📊 isFocused will be set to TRUE - AlertsTable should render');
    console.log('📊 Alerts data:', alerts.length, 'alerts');
    controls.setLookAt(
      wallPosition.x + 4, // Camera at -11 (between center and wall)
      0,
      0, // Camera at same Y and Z as wall center
      wallPosition.x, // Look at wall at -15
      0,
      0,
      true // Smooth transition
    );
    setIsFocused(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();

    if (!cameraControlsRef?.current) {
      console.error('❌ CameraControls not available');
      return;
    }

    const controls = cameraControlsRef.current;

    // Reset camera to default view
    console.log('🔄 Resetting camera from alerts table');
    controls.setLookAt(
      0,
      0,
      10, // Default camera position
      0,
      0,
      0, // Look at center
      true // Smooth transition
    );
    setIsFocused(false);
  };

  return (
    <group position={[-15, 0, 0]}>
      {/* Wall plane on the left side */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[0.1, 0, 0]}>
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
        occlude={false}
        distanceFactor={2.5}
        position={[0, 0, -0.5]}
        rotation={[0, Math.PI / 2, 0]}
        zIndexRange={[100, 0]}
        center
        calculatePosition={(el, camera, size) => {
          return [size.width / 2, size.height / 2];
        }}
        style={{
          marginTop: '50px',
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          overflow: 'visible',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          // Anti-aliasing and quality improvements
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility',
          imageRendering: 'crisp-edges'
        }}
      >
        <HtmlContainer
          $width={dimensions.width}
          $height={dimensions.height}
          style={{ cursor: isFocused ? 'default' : 'pointer', position: 'relative' }}
          onClick={!isFocused ? handleClick : undefined}
        >
          <Title>⚠️ Tabla de Alertas - SmartFloors</Title>

          {isFocused && <CloseButton onClick={handleClose}>✕ Cerrar Tabla</CloseButton>}

          <ContentWrapper>
            {isFocused ? (
              <>
                {console.log('✅ Rendering AlertsTable with', alerts.length, 'alerts')}
                <AlertsTable alerts={alerts} />
              </>
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '18px',
                  textAlign: 'center',
                  padding: '40px',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >
                <div style={{ fontSize: '48px' }}>⚠️</div>
                <div>Haz click para ver la tabla de alertas detallada</div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.4)' }}>
                  Timestamp • Piso • Variable • Nivel • Recomendación
                </div>
              </div>
            )}
          </ContentWrapper>
        </HtmlContainer>
      </Html>
    </group>
  );
}
