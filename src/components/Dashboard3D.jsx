import { Canvas } from '@react-three/fiber';
import BuildingScene from '../scenes/BuildingScene';
import { Environment } from '@react-three/drei';

/**
 * Dashboard3D component - Canvas wrapper for 3D visualization
 * @param {Object} props
 * @param {Object} props.floorData - Floor data for visualization
 * @param {Function} props.onFloorClick - Callback for floor click events
 */
const Dashboard3D = ({ floorData, onFloorClick }) => {
  return (
    <Canvas shadows gl={{ antialias: true, alpha: false }} style={{}}>
      <BuildingScene
        floorData={floorData}
        onFloorClick={onFloorClick}
      />
    </Canvas>
  );
};

export default Dashboard3D;
