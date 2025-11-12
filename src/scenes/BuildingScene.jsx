import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import FloorBlock from '../components/FloorBlock';

/**
 * BuildingScene - 3D scene containing all floor blocks
 * @param {Object} props
 * @param {Object} props.floorData - Data for all floors
 * @param {Function} props.onFloorHover - Callback when a floor is hovered
 */
const BuildingScene = ({ floorData, onFloorHover }) => {
  const handleHover = (data) => {
    onFloorHover(data);
  };

  // Calculate Y positions for floors (stacked vertically)
  const getFloorPosition = (floorNumber) => {
    // Center the building vertically (5 floors)
    return floorNumber - 3; // Space floors 1.2 units apart
  };

  return (
    <>
      {/* Camera setup */}
      <PerspectiveCamera makeDefault position={[8, 4, 8]} fov={50} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -5]} intensity={0.5} />

      {/* Environment for reflections */}
      <Environment preset='city' />

      {/* Floor blocks - 5 floors */}
      {floorData && Object.keys(floorData).length > 0
        ? Object.values(floorData).map((floor) => (
            <FloorBlock
              key={floor.floorId}
              data={floor}
              position={getFloorPosition(floor.floorId)}
              onHover={handleHover}
            />
          ))
        : // Show placeholder blocks while data is loading
          [1, 2, 3, 4, 5].map((floorId) => (
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
            />
          ))}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color='#1a1a1a' metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

export default BuildingScene;
