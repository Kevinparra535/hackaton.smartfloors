import {
  Environment,
  PerspectiveCamera,
  Stars,
  SpotLight,
  CameraControls
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import FloorBlock from '../components/FloorBlock';
import FloatingParticles from '../components/FloatingParticles';
import GradientBackground from '../components/GradientBackground';
import InteractiveWall from '../components/InteractiveWall';
import { useCameraZoom } from '../hooks/useCameraZoom';
import { useRef } from 'react';
import * as THREE from 'three';

/**
 * BuildingScene - 3D scene containing all floor blocks with immersive effects
 * @param {Object} props
 * @param {Object} props.floorData - Data for all floors
 * @param {Function} props.onFloorHover - Callback when a floor is hovered
 * @param {Function} props.onFloorClick - Callback when a floor is clicked for zoom
 */
const BuildingScene = ({ floorData, onFloorHover, onFloorClick }) => {
  const cameraControlsRef = useRef();
  const { resetCamera } = useCameraZoom();
  const lastClickedFloor = useRef(null);

  const handleHover = (data) => {
    onFloorHover(data);
  };
  const handleClick = (clickData) => {
    if (onFloorClick) {
      onFloorClick(clickData);
    }

    // Dolly camera to the clicked floor using CameraControls
    if (clickData?.floorY !== undefined && cameraControlsRef.current) {
      const controls = cameraControlsRef.current;

      // Check if clicking the same floor - reset camera
      if (lastClickedFloor.current === clickData.floorId) {
        console.log('🔄 Resetting camera to default view');
        controls.setLookAt(
          10,
          6,
          5, // Default camera position
          0,
          0,
          0, // Look at center
          true // Smooth transition
        );
        lastClickedFloor.current = null;
        return;
      }

      // Get current camera position to calculate dolly direction
      const targetPosition = {
        x: 0, // Center X (floors are centered)
        y: clickData.floorY, // Floor Y position
        z: 0 // Center Z
      };

      // Use setLookAt to dolly the camera closer to the floor
      // This physically moves the camera (dolly) instead of just changing target
      controls.setLookAt(
        3,
        clickData.floorY,
        5, // Move camera closer to the floor
        targetPosition.x,
        targetPosition.y,
        targetPosition.z, // Look at floor
        true // Enable smooth transition
      );

      lastClickedFloor.current = clickData.floorId;
      console.log('🎬 Dolly to floor:', clickData.floorId, 'at Y:', clickData.floorY);
    }
  };

  // Calculate Y positions for floors (stacked vertically)
  const getFloorPosition = (floorNumber) => {
    // Center the building vertically (5 floors)
    // Space floors 2 units apart for better visibility
    return (floorNumber - 3) * 1.5;
  };

  return (
    <>
      {/* Camera setup with better positioning */}
      <PerspectiveCamera makeDefault position={[10, 6, 5]} fov={55} />

      {/* Fog for depth and atmosphere */}
      <fog attach='fog' args={['#0a0a0a', 5, 30]} />

      {/* Enhanced Lighting Setup */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -5]} intensity={0.8} color='#646cff' />
      <pointLight position={[10, 5, 10]} intensity={0.5} color='#00ff88' />
      <spotLight
        position={[0, 20, 0]}
        angle={0.6}
        penumbra={1}
        intensity={0.5}
        castShadow
        color='#ffffff'
      />

      {/* Immersive Background Elements */}
      <GradientBackground />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <FloatingParticles count={150} />

      {/* Interactive wall - Right side with integrated 3D HTML */}
      <InteractiveWall cameraControlsRef={cameraControlsRef} />

      {/* Environment for reflections */}
      <Environment preset='city' background={false} />

      {/* Floor blocks - 5 floors */}
      {floorData && Object.keys(floorData).length > 0
        ? Object.values(floorData).map((floor) => (
            <FloorBlock
              key={floor.floorId}
              data={floor}
              position={getFloorPosition(floor.floorId)}
              onHover={handleHover}
              onClick={handleClick}
            />
          ))
        : // Show placeholder blocks while data is loading
          [1, 2, 3].map((floorId) => (
            <FloorBlock
              key={`placeholder-${floorId}`}
              data={{
                floorId,
                name: `Piso ${floorId}`,
                temperature: 0,
                humidity: 0,
                powerConsumption: 0,
                occupancy: 0,
                status: 'normal'
              }}
              position={getFloorPosition(floorId)}
              onHover={handleHover}
              onClick={handleClick}
            />
          ))}

      {/* Ground plane with enhanced materials */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -6, 0]}
        receiveShadow
        onDoubleClick={resetCamera}
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color='#0d0d0d'
          metalness={0.4}
          roughness={0.6}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Post-processing effects for immersion */}
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
        {/* <DepthOfField focusDistance={0.1} focalLength={0.05} bokehScale={3} /> */}
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>

      {/* Controls */}
      <CameraControls
        ref={cameraControlsRef}
        makeDefault
        minDistance={0.5}
        maxDistance={100}
        smoothTime={0.25}
        draggingSmoothTime={0.25}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

export default BuildingScene;
