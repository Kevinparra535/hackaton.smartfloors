import { Canvas } from '@react-three/fiber';
import BuildingScene from '../scenes/BuildingScene';
import { Environment } from '@react-three/drei';

/**
 * Dashboard3D component - Canvas wrapper for 3D visualization
 * @param {Object} props
 * @param {Object} props.floorData - Floor data for visualization
 * @param {Function} props.onFloorHover - Callback for floor hover events
 */
const Dashboard3D = ({ floorData, onFloorHover }) => {
  return (
    <Canvas shadows gl={{ antialias: true, alpha: false }} style={{}}>
      <BuildingScene floorData={floorData} onFloorHover={onFloorHover} />
    </Canvas>
  );
};

export default Dashboard3D;
