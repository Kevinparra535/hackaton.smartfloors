import {
  Environment,
  PerspectiveCamera,
  Stars,
  SpotLight,
  CameraControls,
  Html
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import FloorBlock from '../components/FloorBlock';
import FloatingParticles from '../components/FloatingParticles';
import GradientBackground from '../components/GradientBackground';
import InteractiveWall from '../components/InteractiveWall';
import FloorInfoPanel from '../components/FloorInfoPanel';
import { useCameraZoom } from '../hooks/useCameraZoom';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import PredictionsPanel from '../components/PredictionsPanel';
import FloorPredictionsPanel from '../components/PredictionsPanel';

/**
 * BuildingScene - 3D scene containing all floor blocks with immersive effects
 * @param {Object} props
 * @param {Object} props.floorData - Data for all floors
 * @param {Object} props.predictions - Predictions data from ML model
 * @param {Function} props.onFloorClick - Callback when a floor is clicked for zoom
 */
const BuildingScene = ({ floorData, predictions, onFloorClick }) => {
  const cameraControlsRef = useRef();
  const { resetCamera } = useCameraZoom();
  const lastClickedFloor = useRef(null);
  const [selectedFloorId, setSelectedFloorId] = useState(1);
  const [selectedFloorData, setSelectedFloorData] = useState(null);
  const [infoPanelPosition, setInfoPanelPosition] = useState([0, 0, 0]);
  const [predictionsPanelPosition, setPredictionsPanelPosition] = useState([0, 0, 0]);

  const DEFAULT_CAMERA_POSITION = [0, 0, 10];

  const handleClick = (clickData) => {
    if (onFloorClick) {
      onFloorClick(clickData);
    }

    setSelectedFloorId(clickData.floorId);

    // Combinar datos del piso con sus predicciones
    const floorPredictions = predictions?.[clickData.floorId] || null;
    console.log('🔮 [BuildingScene] Predictions for floor', clickData.floorId, ':', floorPredictions);
    console.log('🔮 [BuildingScene] All predictions:', predictions);
    
    const floorDataWithPredictions = {
      ...clickData.floorData,
      predictions: floorPredictions
    };

    console.log('📦 [BuildingScene] Floor data with predictions:', floorDataWithPredictions);
    setSelectedFloorData(floorDataWithPredictions);

    setInfoPanelPosition([-3.5, clickData.floorY, 0]);
    setPredictionsPanelPosition([3.5, clickData.floorY, 0]); // Right side of floor

    if (clickData?.floorY !== undefined && cameraControlsRef.current) {
      const controls = cameraControlsRef.current;

      if (lastClickedFloor.current === clickData.floorId) {
        console.log('🔄 Resetting camera to default view');
        controls.setLookAt(
          -10,
          6,
          5, // DEFAULT_CAMERA_POSITION
          0,
          0,
          0, // DEFAULT_CAMERA_TARGET
          true
        );
        lastClickedFloor.current = null;
        setSelectedFloorData(null);
        controls.enabled = true;
        return;
      }

      const targetPosition = {
        x: 0,
        y: clickData.floorY,
        z: 0
      };

      // Position camera closer in front of the floor for better view
      controls.setLookAt(
        0, // x: Centered horizontally with floor
        clickData.floorY + 0.5, // y: Slightly above floor level for better perspective
        5, // z: Closer to the floor (reduced from 8 to 5)
        targetPosition.x,
        targetPosition.y,
        targetPosition.z,
        true
      );

      setTimeout(() => {
        if (controls) {
          controls.enabled = false;
          console.log('🔒 Camera controls locked');
        }
      }, 300);

      lastClickedFloor.current = clickData.floorId;
    }
  };

  const handleViewCharts = () => {
    if (cameraControlsRef.current) {
      const controls = cameraControlsRef.current;

      // Dolly to InteractiveWall position (right side)
      controls.setLookAt(
        7, // x: Position to view the wall from left
        0, // y: Center height
        0, // z: Aligned with wall
        15, // Look at wall X position
        0, // Look at wall Y
        0, // Look at wall Z
        true // Smooth transition
      );

      console.log('📊 Dolly to charts view');
    }
  };

  const getFloorPosition = (floorNumber) => {
    return (floorNumber - 3) * 1.5;
  };

  return (
    <>
      {/* Camera setup with better positioning */}
      <PerspectiveCamera makeDefault position={DEFAULT_CAMERA_POSITION} fov={55} />

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
      <InteractiveWall cameraControlsRef={cameraControlsRef} selectedFloorId={selectedFloorId} />

      {/* Floor Info Panel - Shows when a floor is clicked */}
      {selectedFloorData && (
        <Html
          center
          sprite
          occlude={false}
          transform={false}
          distanceFactor={6}
          zIndexRange={[9999, 0]}
          position={infoPanelPosition}
          style={{ pointerEvents: 'none' }}
        >
          <FloorInfoPanel
            floorData={selectedFloorData}
            onViewCharts={handleViewCharts}
            onClose={() => {
              if (cameraControlsRef.current) {
                cameraControlsRef.current.enabled = true;
                console.log('🔓 Camera controls unlocked');
              }

              if (cameraControlsRef.current) {
                cameraControlsRef.current.setLookAt(
                  0,
                  0,
                  10, // DEFAULT_CAMERA_POSITION
                  0,
                  0,
                  0, // DEFAULT_CAMERA_TARGET
                  true
                );
              }

              setSelectedFloorData(null);
              lastClickedFloor.current = null;
            }}
          />
        </Html>
      )}

      {/* Predictions Panel - Right side of floor */}
      {selectedFloorData && (
        <Html
          center
          sprite
          occlude={false}
          transform={false}
          distanceFactor={6}
          zIndexRange={[9999, 0]}
          position={predictionsPanelPosition}
          style={{ pointerEvents: 'auto' }}
        >
          {console.log('🎨 [BuildingScene] Rendering PredictionsPanel at position:', predictionsPanelPosition)}
          <FloorPredictionsPanel
            predictions={selectedFloorData.predictions}
            floorName={selectedFloorData.name}
          />
        </Html>
      )}

      {/* Environment for reflections */}
      <Environment preset='city' background={false} />

      {/* Floor blocks - 5 floors */}
      {floorData && Object.keys(floorData).length > 0
        ? Object.values(floorData).map((floor) => (
            <FloorBlock
              key={floor.floorId}
              data={floor}
              position={getFloorPosition(floor.floorId)}
              onClick={handleClick}
            />
          ))
        : [1, 2, 3].map((floorId) => (
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
