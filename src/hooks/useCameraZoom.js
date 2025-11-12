import { useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Hook to handle smooth camera zoom and focus on floor blocks
 * Uses lerp animation for smooth transitions to target positions
 *
 * @returns {Object} - { zoomToFloor, resetCamera, isAnimating }
 */
export const useCameraZoom = () => {
  const { camera, controls } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const isAnimating = useRef(false);
  const animationProgress = useRef(0);
  const focusedFloorId = useRef(null); // Track currently focused floor
  const isWallFocused = useRef(false); // Track if wall is focused

  // Store initial camera state for reset
  const initialPosition = useRef(new THREE.Vector3(10, 6, 10));
  const initialLookAt = useRef(new THREE.Vector3(0, 0, 0));

  /**
   * Reset camera to initial overview position
   */
  const resetCamera = useCallback(() => {
    if (!camera) return;

    targetPosition.current.copy(initialPosition.current);
    targetLookAt.current.copy(initialLookAt.current);

    // Re-enable controls if they were disabled
    if (controls) {
      controls.enabled = true;
    }

    // Clear focused floor and wall
    focusedFloorId.current = null;
    isWallFocused.current = false;

    isAnimating.current = true;
    animationProgress.current = 0;
  }, [camera, controls]);

  /**
   * Zoom camera to focus on a specific floor
   * If the floor is already focused, reset to overview
   * @param {number} floorY - Y position of the floor
   * @param {number} floorId - ID of the floor
   */
  const zoomToFloor = useCallback(
    (floorY, floorId) => {
      if (!camera) return;

      // If clicking the same floor that's already focused, reset to overview
      if (focusedFloorId.current === floorId) {
        resetCamera();
        return;
      }

      // Re-enable controls when focusing on floor (not wall)
      if (controls) {
        controls.enabled = true;
      }

      // Position camera to show building on the left side of canvas with perspective
      // Camera positioned to the RIGHT and FORWARD, looking LEFT towards the building
      targetPosition.current.set(8, floorY, 8);

      // Look at the floor slightly to the left of center for left-side framing
      targetLookAt.current.set(-1, floorY, 0);

      // Track the focused floor
      focusedFloorId.current = floorId;
      isWallFocused.current = false;

      // Start animation
      isAnimating.current = true;
      animationProgress.current = 0;
    },
    [camera, resetCamera, controls]
  );

  /**
   * Zoom camera to a specific position (for wall, etc.)
   * @param {Array} position - [x, y, z] position to focus on
   */
  const zoomToPosition = useCallback(
    (position) => {
      if (!camera) return;

      // Wall is at position [15, 0, 0], vertical plane rotated 90° in Y
      const wallX = position[0];
      const wallY = position[1];
      const wallZ = position[2];

      // Position camera very close to fill the screen with HTML content
      const cameraDistance = 6;

      // Camera positioned to the LEFT of the wall (negative X), looking RIGHT towards it
      targetPosition.current.set(
        wallX - cameraDistance, // To the left of the wall (15 - 6 = 9)
        wallY,
        wallZ
      );

      // Look directly at the wall center
      targetLookAt.current.set(wallX, wallY, wallZ);

      console.log('🎯 Wall zoom setup:');
      console.log('  Camera target position:', targetPosition.current);
      console.log('  Camera lookAt target:', targetLookAt.current);
      console.log('  Current camera position:', camera.position);
      console.log('  Current controls target:', controls?.target);

      // Clear focused floor since we're focusing on wall
      focusedFloorId.current = null;
      isWallFocused.current = true;

      // Start animation
      isAnimating.current = true;
      animationProgress.current = 0;
    },
    [camera, controls]
  );

  // Animation frame - smooth lerp to target
  useFrame(() => {
    if (!isAnimating.current || !camera) return;

    // Ease-in-out animation progress
    animationProgress.current += 0.03; // Speed of animation
    const t = Math.min(animationProgress.current, 1);

    // Easing function for smooth acceleration/deceleration
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    // Interpolate camera position
    camera.position.lerp(targetPosition.current, eased * 0.1);

    // Update camera to look at target directly (bypassing OrbitControls)
    camera.lookAt(targetLookAt.current);

    // Also update OrbitControls target if it exists
    if (controls?.target) {
      controls.target.lerp(targetLookAt.current, eased * 0.1);
    }

    // Stop animation when close enough
    const distanceToTarget = camera.position.distanceTo(targetPosition.current);
    const targetDistance = controls?.target?.distanceTo(targetLookAt.current) || 0;

    if (distanceToTarget < 0.01 && targetDistance < 0.01) {
      isAnimating.current = false;
      animationProgress.current = 0;

      // Snap to exact position to avoid floating point drift
      camera.position.copy(targetPosition.current);
      camera.lookAt(targetLookAt.current);
      if (controls?.target) {
        controls.target.copy(targetLookAt.current);
      }

      // If focused on wall, disable OrbitControls to prevent drift
      if (isWallFocused.current && controls) {
        controls.enabled = false;
      }
    }
  });

  return {
    zoomToFloor,
    zoomToPosition,
    resetCamera,
    isAnimating: isAnimating.current
  };
};
