# Floor Zoom/Focus Feature Documentation

## Overview
Implemented a click-to-zoom functionality that allows users to click on any floor block in the 3D visualization to focus the camera on that specific floor. The camera smoothly transitions to a focused view of the clicked floor with cinematic easing.

## Implementation Details

### 1. Camera Zoom Hook (`src/hooks/useCameraZoom.js`)
Created a custom React hook that handles smooth camera transitions using React Three Fiber's `useFrame` animation loop.

**Key Features:**
- Smooth lerp-based animation with ease-in-out easing function
- Camera position interpolation to target location
- OrbitControls target interpolation for proper focus
- Reset functionality to return to overview
- Prevents animation jank with distance threshold checks

**API:**
```javascript
const { zoomToFloor, resetCamera, isAnimating } = useCameraZoom();

// Zoom to a specific floor by Y position
zoomToFloor(floorYPosition);

// Reset to overview
resetCamera();
```

**Camera Math:**
- Target Position: `(4, floorY + 2, 4)` - positioned at an angle to see the floor
- Target LookAt: `(0, floorY, 0)` - center of the floor
- Initial Overview: `(10, 6, 10)` looking at `(0, 0, 0)`

### 2. FloorBlock Click Handler (`src/components/FloorBlock.jsx`)
Added click interaction to floor meshes.

**Changes:**
- Added `onClick` prop to component signature
- Created `handleClick` function that passes floor data and Y position
- Wired `onClick={handleClick}` to the main floor mesh
- Maintains existing hover functionality

**Click Data Structure:**
```javascript
{
  floorData: { floorId, name, temperature, humidity, ... },
  floorY: number,  // Y position for camera targeting
  floorId: number
}
```

### 3. BuildingScene Integration (`src/scenes/BuildingScene.jsx`)
Integrated the zoom hook directly in the scene where camera and controls are available.

**Changes:**
- Import `useCameraZoom` hook
- Call hook to get `zoomToFloor` and `resetCamera` functions
- Created `handleClick` that calls both parent callback and zoom function
- Pass `onClick={handleClick}` to all FloorBlock components
- Added `onDoubleClick={resetCamera}` to ground plane for easy reset
- Added ref to OrbitControls for future enhancements

### 4. Dashboard3D Passthrough (`src/components/Dashboard3D.jsx`)
Simple prop forwarding to maintain component hierarchy.

**Changes:**
- Added `onFloorClick` prop
- Pass it through to BuildingScene

### 5. Home Page State (`src/pages/Home.jsx`)
Added focused floor tracking and UI updates.

**Changes:**
- Added `focusedFloor` state to track clicked floor
- Created `handleFloorClick` callback
- Updated display logic to prioritize: hoveredFloor → focusedFloor → default floor
- Passed `onFloorClick={handleFloorClick}` to Dashboard3D

**Display Priority:**
1. **Hovered Floor** (highest) - shows metrics for floor under cursor
2. **Focused Floor** (medium) - shows metrics for clicked/zoomed floor
3. **Default Floor** (fallback) - shows Piso 1 metrics

## User Experience Flow

### Zoom In:
1. User **clicks** on any floor block
2. Camera smoothly animates to focused position (4, floorY+2, 4)
3. OrbitControls target updates to center of floor (0, floorY, 0)
4. UI panels update to show clicked floor's data
5. User can still rotate/zoom with mouse controls around the focused floor

### Zoom Out/Reset:
1. User **double-clicks** on the ground plane (dark floor at bottom)
2. Camera smoothly returns to overview position (10, 6, 10)
3. OrbitControls target resets to building center (0, 0, 0)
4. UI returns to showing default or hovered floor data

## Technical Considerations

### Animation Performance
- Uses `useFrame` for 60fps smooth animation
- Lerp factor: `eased * 0.1` for smooth deceleration
- Animation speed: `0.03` increment per frame (~0.5s duration)
- Stops automatically when within 0.01 units of target (prevents drift)

### Easing Function
```javascript
// Ease-in-out (smooth start and end)
const eased = t < 0.5
  ? 2 * t * t  // ease in
  : 1 - Math.pow(-2 * t + 2, 2) / 2;  // ease out
```

### OrbitControls Integration
- OrbitControls remain enabled during animation
- User can interrupt animation with manual camera control
- Target updates ensure proper rotation pivot point
- Min/Max distance constraints still apply (8-25 units)

## Testing Checklist

- [x] Click any floor → camera zooms to that floor
- [x] Double-click ground plane → camera returns to overview
- [x] UI panels update when floor is clicked
- [x] Hover still works during zoom
- [x] Can rotate around focused floor with mouse
- [x] Animation is smooth with no jank
- [x] Multiple clicks work correctly
- [x] Reset works from any zoom state

## Future Enhancements

### Potential Additions:
1. **Keyboard Shortcuts** - Press 'R' to reset, '1-5' to focus floors
2. **Reset Button** - UI button in corner for explicit reset
3. **Floor Outline** - Highlight focused floor with outline/glow
4. **Zoom Level Indicator** - Show "Focused on Piso X" text
5. **Animation Speed Control** - User preference for fast/slow transitions
6. **Auto-rotate on Focus** - Slowly rotate around focused floor
7. **Zoom Deeper** - Click again to zoom inside floor (interior view)
8. **Floor Comparison Mode** - Click two floors to split-screen view

### Code Improvements:
- Add animation completion callbacks
- Expose animation speed as prop
- Add camera position presets for different angles
- Support for mobile touch gestures (pinch to zoom)

## Files Modified
1. **Created:** `src/hooks/useCameraZoom.js` - Camera animation hook
2. **Modified:** `src/components/FloorBlock.jsx` - Added onClick handler
3. **Modified:** `src/scenes/BuildingScene.jsx` - Integrated zoom hook
4. **Modified:** `src/components/Dashboard3D.jsx` - Prop passthrough
5. **Modified:** `src/pages/Home.jsx` - Focus state management

## Related Documentation
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [drei OrbitControls](https://github.com/pmndrs/drei#controls)
- [Three.js Camera](https://threejs.org/docs/#api/en/cameras/Camera)
