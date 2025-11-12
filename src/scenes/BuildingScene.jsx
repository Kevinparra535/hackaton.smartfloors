import { useRef, useState, useEffect } from 'react';
import { Environment, PerspectiveCamera, Stars, CameraControls, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

import FloorBlock from '../components/FloorBlock';
import FloatingParticles from '../components/FloatingParticles';
import GradientBackground from '../components/GradientBackground';
import InteractiveWall from '../components/InteractiveWall';
import InteractiveWallLeft from '../components/InteractiveWallLeft';
import FloorInfoPanel from '../components/FloorInfoPanel';
import FloorPredictionsPanel from '../components/PredictionsPanel';

import { useCameraZoom } from '../hooks/useCameraZoom';

const CAMERA_CONFIG = {
  DEFAULT_POSITION: [0, 0, 10],
  DEFAULT_TARGET: [0, 0, 0],
  RESET_POSITION: [-10, 6, 5],
  FOV: 55,
  MIN_DISTANCE: 0.5,
  MAX_DISTANCE: 100,
  SMOOTH_TIME: 0.25,
  LOCK_DELAY: 300
};

const FLOOR_CONFIG = {
  SPACING: 1.5,
  CENTER_OFFSET: 3,
  INFO_PANEL_OFFSET: -3.5,
  PREDICTIONS_PANEL_OFFSET: 3.5
};

const LIGHTING_CONFIG = {
  ambient: { intensity: 0.3 },
  directional: {
    position: [10, 15, 5],
    intensity: 1.5,
    shadowMapSize: 2048
  },
  point1: { position: [-10, 10, -5], intensity: 0.8, color: '#646cff' },
  point2: { position: [10, 5, 10], intensity: 0.5, color: '#00ff88' },
  spot: {
    position: [0, 20, 0],
    angle: 0.6,
    penumbra: 1,
    intensity: 0.5,
    color: '#ffffff'
  }
};

const GROUND_CONFIG = {
  position: [0, -6, 0],
  size: [30, 30],
  color: '#0d0d0d',
  metalness: 0.4,
  roughness: 0.6
};

const PLACEHOLDER_FLOORS = [1, 2, 3];

/**
 * Calculate vertical position for a floor based on its number
 * @param {number} floorNumber - Floor number (1-5)
 * @returns {number} Y position in 3D space
 */
const getFloorPosition = (floorNumber) => {
  return (floorNumber - FLOOR_CONFIG.CENTER_OFFSET) * FLOOR_CONFIG.SPACING;
};

/**
 * Create placeholder floor data for loading state
 * @param {number} floorId - Floor ID
 * @returns {Object} Floor data object
 */
const createPlaceholderFloor = (floorId) => ({
  floorId,
  name: `Piso ${floorId}`,
  temperature: 0,
  humidity: 0,
  powerConsumption: 0,
  occupancy: 0,
  status: 'normal'
});

/**
 * BuildingScene - Main 3D scene containing all floor blocks with immersive effects
 * Manages camera controls, floor selection, and interactive panels
 *
 * @param {Object} props
 * @param {Object} props.floorData - Real-time data for all floors (keyed by floorId)
 * @param {Object} props.predictions - ML predictions for all floors (keyed by floorId)
 * @param {Array} props.alerts - Array of alerts for the alerts table
 * @param {Function} props.onFloorClick - Callback when a floor is clicked
 */
const BuildingScene = ({ floorData, predictions, alerts = [], onFloorClick }) => {
  const cameraControlsRef = useRef();
  const lastClickedFloor = useRef(null);
  const { resetCamera } = useCameraZoom();

  const [selectedFloorData, setSelectedFloorData] = useState(null);
  const [infoPanelPosition, setInfoPanelPosition] = useState([0, 0, 0]);
  const [predictionsPanelPosition, setPredictionsPanelPosition] = useState([0, 0, 0]);
  const [shouldFocusAlerts, setShouldFocusAlerts] = useState(false);

  // Effects

  /**
   * Update selected floor data when floorData or predictions change
   * This ensures panels show real-time updates even when a floor is selected
   */
  useEffect(() => {
    if (!selectedFloorData || !lastClickedFloor.current) return;

    const selectedFloorId = lastClickedFloor.current;
    const updatedFloorData = floorData?.[selectedFloorId];
    const updatedPredictions = predictions?.[selectedFloorId] || null;

    if (updatedFloorData) {
      console.log(
        '🔄 [BuildingScene] Updating selected floor data for floor',
        selectedFloorId,
        ':',
        updatedFloorData
      );
      console.log('🔮 [BuildingScene] Updated predictions:', updatedPredictions);

      setSelectedFloorData({
        ...updatedFloorData,
        predictions: updatedPredictions
      });
    }
  }, [floorData, predictions, selectedFloorData]);

  // Event Handlers

  /**
   * Handle floor click - zoom camera and show panels
   * Double-click on same floor resets view
   */
  const handleFloorClick = (clickData) => {
    const { floorId, floorData: clickedFloorData, floorY } = clickData;

    if (onFloorClick) {
      onFloorClick(clickData);
    }

    if (lastClickedFloor.current === floorId) {
      handleResetView();
      return;
    }

    const floorPredictions = predictions?.[floorId] || null;
    const enrichedFloorData = {
      ...clickedFloorData,
      predictions: floorPredictions
    };

    setSelectedFloorData(enrichedFloorData);
    setInfoPanelPosition([FLOOR_CONFIG.INFO_PANEL_OFFSET, floorY, 0]);
    setPredictionsPanelPosition([FLOOR_CONFIG.PREDICTIONS_PANEL_OFFSET, floorY, 0]);

    if (floorY !== undefined && cameraControlsRef.current) {
      const controls = cameraControlsRef.current;

      controls.setLookAt(0, floorY + 0.5, 5, 0, floorY, 0, true);

      setTimeout(() => {
        if (controls) {
          controls.enabled = false;
        }
      }, CAMERA_CONFIG.LOCK_DELAY);

      lastClickedFloor.current = floorId;
    }
  };

  /**
   * Reset camera to default view and clear selection
   */
  const handleResetView = () => {
    if (!cameraControlsRef.current) return;

    const controls = cameraControlsRef.current;

    controls.setLookAt(...CAMERA_CONFIG.RESET_POSITION, ...CAMERA_CONFIG.DEFAULT_TARGET, true);

    controls.enabled = true;
    setSelectedFloorData(null);
    lastClickedFloor.current = null;
  };

  /**
   * Close info panel and reset view
   */
  const handleClosePanel = () => {
    if (!cameraControlsRef.current) return;

    const controls = cameraControlsRef.current;

    controls.enabled = true;
    controls.setLookAt(...CAMERA_CONFIG.DEFAULT_POSITION, ...CAMERA_CONFIG.DEFAULT_TARGET, true);

    setSelectedFloorData(null);
    lastClickedFloor.current = null;
  };

  /**
   * Navigate camera to view charts on interactive wall
   */
  const handleViewCharts = () => {
    if (!cameraControlsRef.current) return;

    cameraControlsRef.current.setLookAt(7, 0, 0, 15, 0, 0, true);
  };

  /**
   * Navigate camera to view alerts table on left wall
   */
  const handleViewAlerts = () => {
    setShouldFocusAlerts(true);
  };

  /**
   * Reset alerts focus trigger after animation completes
   */
  const handleAlertsFocusComplete = () => {
    setShouldFocusAlerts(false);
  };

  return (
    <>
      {/* Camera & Fog */}

      <PerspectiveCamera
        makeDefault
        position={CAMERA_CONFIG.DEFAULT_POSITION}
        fov={CAMERA_CONFIG.FOV}
      />
      <fog attach='fog' args={['#0a0a0a', 5, 30]} />

      {/* Lighting */}

      <ambientLight intensity={LIGHTING_CONFIG.ambient.intensity} />
      <directionalLight
        position={LIGHTING_CONFIG.directional.position}
        intensity={LIGHTING_CONFIG.directional.intensity}
        castShadow
        shadow-mapSize-width={LIGHTING_CONFIG.directional.shadowMapSize}
        shadow-mapSize-height={LIGHTING_CONFIG.directional.shadowMapSize}
      />
      <pointLight
        position={LIGHTING_CONFIG.point1.position}
        intensity={LIGHTING_CONFIG.point1.intensity}
        color={LIGHTING_CONFIG.point1.color}
      />
      <pointLight
        position={LIGHTING_CONFIG.point2.position}
        intensity={LIGHTING_CONFIG.point2.intensity}
        color={LIGHTING_CONFIG.point2.color}
      />
      <spotLight
        position={LIGHTING_CONFIG.spot.position}
        angle={LIGHTING_CONFIG.spot.angle}
        penumbra={LIGHTING_CONFIG.spot.penumbra}
        intensity={LIGHTING_CONFIG.spot.intensity}
        color={LIGHTING_CONFIG.spot.color}
        castShadow
      />

      {/* Immersive Background */}

      <GradientBackground />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <FloatingParticles count={150} />
      <Environment preset='city' background={false} />

      {/* Interactive Elements */}

      <InteractiveWall
        cameraControlsRef={cameraControlsRef}
        selectedFloorId={selectedFloorData?.floorId || null}
      />

      <InteractiveWallLeft
        cameraControlsRef={cameraControlsRef}
        alerts={alerts}
        shouldFocus={shouldFocusAlerts}
        onFocusComplete={handleAlertsFocusComplete}
      />

      {/* Floor Info Panel (Left) */}

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
            onViewAlerts={handleViewAlerts}
            onClose={handleClosePanel}
          />
        </Html>
      )}

      {/* Predictions Panel (Right) */}

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
          <FloorPredictionsPanel
            predictions={selectedFloorData.predictions}
            floorName={selectedFloorData.name}
          />
        </Html>
      )}

      {/* Floor Blocks */}

      {floorData && Object.keys(floorData).length > 0
        ? Object.values(floorData).map((floor) => (
            <FloorBlock
              key={floor.floorId}
              data={floor}
              position={getFloorPosition(floor.floorId)}
              onClick={handleFloorClick}
            />
          ))
        : PLACEHOLDER_FLOORS.map((floorId) => (
            <FloorBlock
              key={`placeholder-${floorId}`}
              data={createPlaceholderFloor(floorId)}
              position={getFloorPosition(floorId)}
              onClick={handleFloorClick}
            />
          ))}

      {/* Ground Plane */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={GROUND_CONFIG.position}
        receiveShadow
        onDoubleClick={resetCamera}
      >
        <planeGeometry args={GROUND_CONFIG.size} />
        <meshStandardMaterial
          color={GROUND_CONFIG.color}
          metalness={GROUND_CONFIG.metalness}
          roughness={GROUND_CONFIG.roughness}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Post-Processing Effects */}

      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>

      {/* Camera Controls */}

      <CameraControls
        ref={cameraControlsRef}
        makeDefault
        minDistance={CAMERA_CONFIG.MIN_DISTANCE}
        maxDistance={CAMERA_CONFIG.MAX_DISTANCE}
        smoothTime={CAMERA_CONFIG.SMOOTH_TIME}
        draggingSmoothTime={CAMERA_CONFIG.SMOOTH_TIME}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

export default BuildingScene;
