import { Canvas } from '@react-three/fiber';
import BuildingScene from '../scenes/BuildingScene';

/**
 * Dashboard3D component - Canvas wrapper for 3D visualization
 * @param {Object} props
 * @param {Object} props.floorData - Floor data for visualization
 * @param {Function} props.onFloorHover - Callback for floor hover events
 */
export default function Dashboard3D({ floorData, onFloorHover }) {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: false }}
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      }}
    >
      <BuildingScene floorData={floorData} onFloorHover={onFloorHover} />
    </Canvas>
  );
}
