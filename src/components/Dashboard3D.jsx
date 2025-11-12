import { Canvas } from '@react-three/fiber';
import BuildingScene from '../scenes/BuildingScene';
import { Environment } from '@react-three/drei';

/**
 * Dashboard3D component - Canvas wrapper for 3D visualization
 * @param {Object} props
 * @param {Object} props.floorData - Floor data for visualization
 * @param {Object} props.predictions - Predictions data from ML model
 * @param {Function} props.onFloorClick - Callback for floor click events
 */
const Dashboard3D = ({ floorData, predictions }) => {
  return (
    <Canvas shadows gl={{ antialias: true, alpha: false }} style={{}}>
      <BuildingScene floorData={floorData} predictions={predictions} />
    </Canvas>
  );
};

export default Dashboard3D;
