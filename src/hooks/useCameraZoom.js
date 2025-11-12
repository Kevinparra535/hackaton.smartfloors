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

  // Store initial camera state for reset
  const initialPosition = useRef(new THREE.Vector3(10, 6, 10));
  const initialLookAt = useRef(new THREE.Vector3(0, 0, 0));

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

      // Calculate target position - perfectly centered on the selected floor
      // Camera positioned directly in front, at floor height, closer for better focus
      const cameraDistance = 5; // Distance from the floor
      const cameraHeight = 0.3; // Slight elevation above floor center for better view

      targetPosition.current.set(0, floorY + cameraHeight, cameraDistance);

      // Look directly at the center of the selected floor
      targetLookAt.current.set(0, floorY, 0);

      // Track the focused floor
      focusedFloorId.current = floorId;

      // Start animation
      isAnimating.current = true;
      animationProgress.current = 0;
    },
    [camera]
  ); // Removed controls from dependencies

  /**
   * Reset camera to initial overview position
   */
  const resetCamera = useCallback(() => {
    if (!camera) return;

    targetPosition.current.copy(initialPosition.current);
    targetLookAt.current.copy(initialLookAt.current);

    // Clear focused floor
    focusedFloorId.current = null;

    isAnimating.current = true;
    animationProgress.current = 0;
  }, [camera]);

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

    // Interpolate OrbitControls target (what camera looks at) - only if controls exist
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
      if (controls?.target) {
        controls.target.copy(targetLookAt.current);
      }
    }
  });

  return {
    zoomToFloor,
    resetCamera,
    isAnimating: isAnimating.current
  };
};
