# SmartFloors AI — Frontend

**Frontend visualization for SmartFloors AI** — shows a real-time interactive 3D dashboard of building floors (1-5), detects anomalies through color-coded states, displays live alerts, and forecasts future conditions with ML predictions.

## 🎯 Overview

This is a **React 19 + Vite 7 + React Three Fiber** dashboard that visualizes in real-time the environmental and energy conditions of a smart building with **5 floors**, integrating both **REST API** and **WebSocket** for hybrid data fetching.

## ⚙️ Tech Stack

- **React 19.2** + **Vite 7.2** (Fast Refresh + HMR)
- **React Three Fiber** + **@react-three/drei** (3D visualization)
- **Framer Motion** (Alert animations and transitions)
- **Socket.IO Client** (Real-time WebSocket connection)
- **REST API Client** (HTTP requests for initial data)
- **Styled-components** (Component styling)
- **ESLint 9** + **Prettier** (Code quality)

## 🏗️ Project Structure

```
src/
├── api/
│   ├── socket.js          # WebSocket connection management (Socket.IO)
│   └── rest.js            # REST API client for HTTP requests
├── components/
│   ├── FloorBlock.jsx     # Individual 3D floor visualization
│   ├── AlertsPanel.jsx    # Real-time alerts display
│   ├── PredictionsPanel.jsx # ML predictions visualization
│   ├── SocketDebugger.jsx # WebSocket debugging tool
│   └── Dashboard3D.jsx    # 3D Canvas wrapper
├── hooks/
│   └── useRealTimeData.js # Real-time data state management (REST + WebSocket)
├── scenes/
│   └── BuildingScene.jsx  # Complete 3D building scene (5 floors)
├── App.jsx                # Main application component
├── index.css              # Global styles
└── main.jsx               # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and **npm**
- **Backend server** running on `http://localhost:3000`
  - REST API: `http://localhost:3000/api/v1`
  - WebSocket: Socket.IO on port 3000

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

App runs on **http://localhost:5173**

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

## 🧩 Features

### 1. Real-time 3D Visualization
- **3D building** with **5 interactive floor blocks** (Floor 1–5)
- **Color-coded status indicators**:
  - 🟢 Normal: `#00ff88`
  - 🟡 Warning: `#ffd966`
  - 🔴 Danger: `#ff4d4f`
- **Breathing animations** on warning/danger states (pulsing + scale)
- **Interactive hover** to view detailed metrics per floor
- **OrbitControls** for 360° camera navigation

### 2. Live Data Dashboard
- **Real-time metrics** display:
  - 🌡️ Temperature (°C)
  - 💧 Humidity (%)
  - ⚡ Power Consumption (kW)
  - � Occupancy (%)
  - �📊 Status (Normal/Warning/Danger)
- **Automatic status calculation** based on thresholds
- **Connection status indicator**
- **Hover interaction** to inspect individual floors

### 3. ML Predictions Panel
- **Forecasting** for temperature, humidity, power, and occupancy
- **Time selector**: 10, 20, 30, 40, 50, 60 minutes ahead
- **Trend indicators**: ↑ (increase), ↓ (decrease), → (stable)
- **Confidence levels** with color coding:
  - 🟢 High (≥90%)
  - 🟡 Medium (70-89%)
  - 🔴 Low (<70%)
- **Current vs Predicted** value comparison
- **Prediction method** display (hybrid, ARIMA, LSTM)

### 4. Alerts Panel
- **Animated alert list** (Framer Motion)
- **Last 10 alerts** displayed
- **Color-coded** by severity
- **Timestamp** for each alert
- **Spanish labels** for alert types

### 5. Hybrid Data Architecture
- **REST API** for initial data load:
  - `GET /api/v1/floors` → Load all floors on mount
  - `GET /api/v1/alerts` → Load initial alerts
  - `GET /api/v1/floors/:id/predictions` → On-demand predictions
  - `GET /api/v1/floors/:id/history` → Historical data
- **WebSocket (Socket.IO)** for real-time updates:
  - Event `floorData` → Floor metrics updates
  - Event `alert` → New alerts
  - Event `predictions` → ML prediction updates
- **Loading state** with spinner while fetching initial data

### 6. Debugging Tools
- **SocketDebugger component** (visual debugging panel)
- **Console logs** with emoji indicators:
  - 📡 Socket events
  - 📊 Floor data processing
  - 🚨 Alerts
  - 🔮 Predictions
- **Connection monitoring** (transport type, socket ID)

## 🎨 Styling Approach

- **Styled-components** for component-scoped styles
- **Transient props** (`$connected`, `$severity`) to avoid DOM warnings
- **Global CSS** (`index.css`) for base elements and utilities
- **Dark theme** by default (`#0a0a0a` background)
- **Glassmorphism** effects with `backdrop-filter: blur(10px)`
- **No CSS frameworks** (custom implementation)
- **Responsive grid layouts** for metrics

## 🧠 Architecture Notes

### Data Flow
1. **Initial Load (REST API)**:
   - App mounts → `useRealTimeData` hook executes
   - Fetches `/api/v1/floors` → Initializes floor state
   - Fetches `/api/v1/alerts` → Initializes alerts
   - Shows loading spinner during fetch
   - Sets `isLoading = false` when complete

2. **Real-time Updates (WebSocket)**:
   - Connects to Socket.IO server
   - Subscribes to `floorData`, `alert`, `predictions` events
   - Updates React state on each event
   - Re-renders 3D scene and panels

3. **Status Calculation** (Frontend):
   - Automatic status calculation based on thresholds
   - Danger: `temp > 26°C || temp < 18°C || humidity > 70% || humidity < 30% || power > 150kW`
   - Warning: `temp > 24°C || temp < 20°C || humidity > 60% || humidity < 35% || power > 135kW`
   - Normal: Everything else

### State Management
- **React hooks** only (`useState`, `useEffect`, `useCallback`)
- Custom hook `useRealTimeData` for hybrid REST + WebSocket data
- **No global state library** (Redux/Zustand not needed)
- **Optimistic updates** for better UX

### 3D Rendering
- **React Three Fiber** declarative 3D (JSX for Three.js)
- **@react-three/drei** helpers (OrbitControls, Text, Environment)
- **Orbit controls** for camera navigation with constraints
- **PerspectiveCamera** at `[8, 4, 8]` with FOV 50
- **useFrame** hook for animations (breathing effect)
- **Dynamic rendering**: `Object.values(floorData).map()` for 5 floors
- **Vertical spacing**: Each floor positioned at `(floorId - 3) * 1.2`

### Component Patterns
- **Functional components** only
- **Default exports** for all components
- **Props destructuring** in function signatures
- **Styled-components** with transient props (`$connected`, `$severity`)

## 🔧 Configuration Files

- **`vite.config.js`** — Vite configuration
- **`eslint.config.js`** — ESLint flat config (9.x)
- **`.prettierrc`** — Prettier formatting rules
- **`package.json`** — Dependencies and scripts

## 📦 Dependencies

### Production
- `react` + `react-dom` (19.2.0)
- `three` (0.172.0) + `@react-three/fiber` (9.0.0) + `@react-three/drei` (9.122.0)
- `framer-motion` (11.15.0)
- `socket.io-client` (4.8.1)
- `styled-components` (6.1.14)

### Development
- `vite` (7.2.2)
- `eslint` (9.20.0) + plugins (react, react-hooks, react-refresh)
- `eslint-config-prettier` (9.1.0)
- `prettier` (3.6.2)
- `@vitejs/plugin-react` (4.3.4)

## 🐛 Troubleshooting

### WebSocket Connection Issues
- Ensure backend is running on `localhost:3000`
- Check browser console for connection errors
- Verify CORS settings on backend (`http://localhost:5173` allowed)
- Use `SocketDebugger` component to monitor connection
- Check that Socket.IO server is emitting events correctly

### REST API Issues
- Verify backend REST API is running: `curl http://localhost:3000/health`
- Check network tab in DevTools for failed requests
- Ensure CORS is configured for `http://localhost:5173`
- Review console logs for API errors (marked with ❌)

### 3D Scene Not Rendering
- Check browser WebGL support: `chrome://gpu`
- Verify Three.js installation: `npm list three`
- Check console for shader errors
- Ensure GPU acceleration is enabled
- Try different browser (Chrome/Firefox recommended)

### HMR Not Working
- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart dev server: `npm run dev`
- Check for syntax errors in JSX files
- Disable browser extensions that might interfere

### Loading Screen Stuck
- Check if backend is responding: `curl http://localhost:3000/api/v1/floors`
- Open browser console to see error details
- Verify backend is running and accessible
- Check network connectivity

## 📝 Development Notes

- **No TypeScript** — Pure JavaScript project
- **StrictMode enabled** in development
- **Fast Refresh** for instant updates
- **ESLint 9.x flat config** (`eslint.config.js`, not `.eslintrc`)
- **Prettier integration** with ESLint
- **Three.js props whitelisted** in ESLint config
- **Socket.IO** uses HTTP upgrade, not `ws://` protocol
- **Hybrid architecture**: REST for initial load, WebSocket for updates

## 📚 Documentation

- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Complete REST API + WebSocket guide
- **[DATA_INTEGRATION.md](./DATA_INTEGRATION.md)** - Data structures and processing
- **[PREDICTIONS.md](./PREDICTIONS.md)** - ML predictions system documentation
- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** - AI coding agent guidelines

## 🤝 Contributing

This is a hackathon project. Follow existing code conventions:
- Use Prettier for formatting
- Run ESLint before committing
- Keep components functional and concise
- Document complex logic with comments

## 📄 License

Private hackathon project.

---

Built with React + Vite + Three.js 🚀
