import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import FloorBlock from '../components/FloorBlock';

/**
 * BuildingScene - 3D scene containing all floor blocks
 * @param {Object} props
 * @param {Object} props.floorData - Data for all floors
 * @param {Function} props.onFloorHover - Callback when a floor is hovered
 */
export default function BuildingScene({ floorData, onFloorHover }) {
  const handleHover = (data) => {
    onFloorHover(data);
  };

  // Calculate Y positions for floors (stacked vertically)
  const getFloorPosition = (floorNumber) => {
    return (floorNumber - 2) * 1.2; // Space floors 1.2 units apart
  };

  return (
    <>
      {/* Camera setup */}
      <PerspectiveCamera makeDefault position={[6, 3, 6]} fov={50} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -5]} intensity={0.5} />

      {/* Environment for reflections */}
      <Environment preset='city' />

      {/* Floor blocks */}
      <FloorBlock data={floorData[1]} position={getFloorPosition(1)} onHover={handleHover} />
      <FloorBlock data={floorData[2]} position={getFloorPosition(2)} onHover={handleHover} />
      <FloorBlock data={floorData[3]} position={getFloorPosition(3)} onHover={handleHover} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color='#1a1a1a' metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}
