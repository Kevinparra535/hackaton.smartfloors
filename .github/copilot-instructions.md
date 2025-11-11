# Copilot Instructions for SmartFloors AI

## Project Overview
SmartFloors AI is a real-time 3D building monitoring dashboard built with React 19 + Vite + React Three Fiber. It visualizes environmental and energy conditions for 3 floors, detecting anomalies through color-coded 3D visualizations and live alerts for temperature, humidity, and energy consumption.

## Tech Stack & Architecture
- **React 19.2.0** with React DOM (latest features including `createRoot`)
- **Vite 7.2.2** for dev server and bundling (not Create React App)
- **React Three Fiber + @react-three/drei** for 3D visualization
- **Framer Motion** for alert animations
- **Socket.IO Client** for WebSocket real-time data
- **Styled-components** for component styling
- **ESLint 9.x** with flat config format (`eslint.config.js`, not `.eslintrc`)
- **No TypeScript** - pure JavaScript with JSX files
- **No routing library** - single-page 3D dashboard
- **No global state management** - using React hooks only

## Development Workflow

### Essential Commands
- `npm run dev` - Start Vite dev server with HMR (default: http://localhost:5173)
- `npm run build` - Production build to `dist/` folder
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint across the project
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without modifying files

### File Structure
```
src/
  api/
    socket.js         # WebSocket connection to backend (Socket.IO)
  components/
    FloorBlock.jsx    # 3D floor visualization with status colors
    AlertsPanel.jsx   # Animated alerts list (Framer Motion)
    Dashboard3D.jsx   # Canvas wrapper for 3D scene
  hooks/
    useRealTimeData.js # Custom hook for floor data + alerts
  scenes/
    BuildingScene.jsx  # Complete 3D scene with floors + lighting
  ui/
    App.jsx           # Main app component with layout
  index.css           # Global styles (dark theme)
  main.jsx            # Entry point with StrictMode
  assets/             # Static assets (images, SVGs)
```

## Code Conventions

### ESLint & Prettier
- **ESLint 9.x flat config** - array export format, not legacy `.eslintrc`
- **Prettier integration** - `eslint-config-prettier` disables conflicting rules
- **Custom rules**:
  - `no-unused-vars` allows uppercase variables (`^[A-Z_]` pattern for constants)
  - `react/prop-types` disabled (no TypeScript, runtime validation not enforced)
  - `react-refresh/only-export-components` warns on non-component exports
  - `react/no-unknown-property` configured to allow Three.js props (`position`, `rotation`, `args`, etc.)
- **React version**: Explicitly set to `19.2` in ESLint settings
- **Security**: `react/jsx-no-target-blank` enforces `rel="noreferrer"` on external links
- **Prettier config** (`.prettierrc`):
  - Single quotes for JS, JSX single quotes enabled
  - 2 spaces indentation, 99 char line width
  - No trailing commas, semicolons enabled

### React Patterns
- **StrictMode enabled** - all components wrapped in `<StrictMode>` (see `main.jsx`)
- **Functional components only** - no class components
- **React 19 APIs** - using `createRoot` from `react-dom/client`
- **Hook-based state** - `useState`, `useEffect`, `useCallback` for state management
- **Custom hooks pattern** - `useRealTimeData` encapsulates WebSocket logic

### 3D Visualization Patterns (React Three Fiber)
- **Declarative 3D** - use JSX for Three.js objects (`<mesh>`, `<boxGeometry>`, etc.)
- **useFrame hook** - for animations (breathing effect, pulsing)
- **useRef** - to reference Three.js objects for imperative updates
- **Status colors** - mapped in `FloorBlock.jsx`:
  ```js
  const STATUS_COLORS = {
    normal: '#00ff88',
    warning: '#ffd966',
    danger: '#ff4d4f'
  };
  ```
- **OrbitControls** - camera navigation with constraints (min/max distance, polar angle)
- **Lighting setup** - ambient + directional + point lights in `BuildingScene.jsx`

### WebSocket Integration
- **Socket.IO Client** - connects to `ws://localhost:3000/realtime`
- **Event listeners**:
  - `floorData` - receives floor updates `{ floor, temperature, humidity, energy, status }`
  - `alert` - receives alert notifications
- **Auto-reconnection** - 5 attempts with 1s delay
- **Connection singleton** - `getSocket()` ensures single instance
- **Cleanup pattern** - disconnect on component unmount

### Styling Approach
- **Styled-components** - primary styling method for components
- **Transient props** - use `$` prefix (e.g., `$connected`, `$severity`) to avoid DOM warnings
- **Global styles** in `index.css` - dark theme, scrollbar styling, utility classes
- **Component-scoped styles** - each styled component in same file as React component
- **No CSS Modules** - styled-components handles scoping
- **Dark theme** - `#0a0a0a` background, `rgba(26, 26, 26, 0.95)` panels
- **Color scheme**:
  - Primary accent: `#646cff` (blue)
  - Success/Normal: `#00ff88` (green)
  - Warning: `#ffd966` (yellow)
  - Danger: `#ff4d4f` (red)
  - Transparent panels with `backdrop-filter: blur(10px)`

### Import Conventions
- **Static assets from `public/`** - referenced with leading slash (e.g., `/vite.svg`)
- **Assets from `src/assets/`** - relative imports (e.g., `./assets/react.svg`)
- **React imports** - named imports from 'react' (e.g., `import { useState } from 'react'`)
- **Three.js imports** - import `* as THREE from 'three'` when needed
- **Component imports** - use relative paths (`../components/FloorBlock`)
- **Styled-components** - import as `import styled from 'styled-components'`

## When Adding Features

### New 3D Components
- Create `.jsx` files in `src/components/` or `src/scenes/`
- Use React Three Fiber JSX syntax (`<mesh>`, `<boxGeometry>`, etc.)
- Add `useFrame` for animations, `useRef` for object references
- Export as default: `export default ComponentName`
- Props allowed: `position`, `rotation`, `scale`, `args`, `intensity`, etc. (configured in ESLint)

### New UI Components
- Use styled-components for styling
- Follow existing pattern: import styled, define components, use transient props
- Export as default
- Animations: use Framer Motion (`motion` components, `AnimatePresence`)

### State Management
- Use React hooks (`useState`, `useEffect`, `useCallback`) directly
- Create custom hooks in `src/hooks/` for reusable logic
- WebSocket data flows through `useRealTimeData` hook
- No Redux/Zustand - hooks sufficient for current scope

### WebSocket Events
- Add new event listeners in `src/api/socket.js`
- Create subscription functions (e.g., `subscribeToNewEvent`)
- Handle events in `useRealTimeData` hook
- Update component state with callbacks

### Environment & Build
- Vite handles HMR automatically - save JSX files to see instant updates
- Assets in `public/` served at root, assets in `src/` bundled by Vite
- Build outputs to `dist/` - this folder is ignored by ESLint and git

## Common Patterns to Follow
1. **File naming**: lowercase with dots (e.g., `FloorBlock.jsx`, `useRealTimeData.js`)
2. **Component structure**: Import dependencies → Styled components → Main component → Export default
3. **Event handlers**: Use `useCallback` for handlers passed as props
4. **3D animations**: Use `useFrame` for continuous animations, update refs imperatively
5. **Accessibility**: Add `alt` attributes to images, semantic HTML elements
6. **External links**: Always include `rel="noreferrer"` with `target="_blank"`
7. **Code formatting**: Run `npm run format` before commits to ensure consistent style
8. **WebSocket cleanup**: Always disconnect socket in cleanup function
9. **Framer Motion**: Use `AnimatePresence` for exit animations, `motion` for animated elements
10. **Status mapping**: Use object literals for status → color/text mapping

## What NOT to Do
- Don't add TypeScript without discussing migration strategy
- Don't use `.eslintrc.*` files - config is in `eslint.config.js`
- Don't bypass StrictMode - keep it enabled for development
- Don't add CSS files - use styled-components instead
- Don't commit `dist/` folder - it's build output
- Don't use class components - only functional components
- Don't bypass WebSocket singleton - always use `getSocket()`
- Don't forget to add Three.js props to ESLint ignore list if needed
- Don't use inline styles - use styled-components
- Don't forget cleanup functions for WebSocket/animations
