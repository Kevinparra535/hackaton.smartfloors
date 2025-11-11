# SmartFloors AI — Frontend

**Frontend visualization for SmartFloors AI** — shows a real-time interactive 3D dashboard of building floors, detects anomalies through color-coded states, and displays live alerts for temperature, humidity, and energy consumption.

## 🎯 Overview

This is a **React + Vite + React Three Fiber** dashboard that visualizes in real-time the environmental and energy conditions per floor (1–3) of a smart building.

## ⚙️ Tech Stack

- **React 19** + **Vite 7** (Fast Refresh + HMR)
- **React Three Fiber** + **@react-three/drei** (3D visualization)
- **Framer Motion** (Alert animations and transitions)
- **Socket.IO Client** (Real-time WebSocket connection)
- **Styled-components** (Component styling)
- **ESLint 9** + **Prettier** (Code quality)

## 🏗️ Project Structure

```
src/
├── api/
│   └── socket.js          # WebSocket connection management
├── components/
│   ├── FloorBlock.jsx     # Individual 3D floor visualization
│   ├── AlertsPanel.jsx    # Real-time alerts display
│   └── Dashboard3D.jsx    # 3D Canvas wrapper
├── hooks/
│   └── useRealTimeData.js # Real-time data state management
├── scenes/
│   └── BuildingScene.jsx  # Complete 3D building scene
├── ui/
│   └── App.jsx           # Main application component
├── index.css             # Global styles
└── main.jsx              # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 16+** and **npm**
- Backend WebSocket server running on `ws://localhost:3000/realtime`

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
- **3D building** with 3 interactive floor blocks (Floor 1–3)
- **Color-coded status indicators**:
  - 🟢 Normal: `#00ff88`
  - 🟡 Warning: `#ffd966`
  - 🔴 Danger: `#ff4d4f`
- **Breathing animations** on warning/danger states
- **Interactive hover** to view detailed metrics

### 2. Live Data Dashboard
- **Real-time metrics** display:
  - 🌡️ Temperature (°C)
  - 💧 Humidity (%)
  - ⚡ Energy consumption (kW)
  - 📊 Status
- **Connection status indicator**
- **Hover interaction** to inspect individual floors

### 3. Alerts Panel
- **Animated alert list** (Framer Motion)
- **Last 10 alerts** displayed
- **Color-coded** by severity
- **Timestamp** for each alert

### 4. WebSocket Integration
- Connects to `ws://localhost:3000/realtime`
- Listens for `floorData` events:
  ```js
  {
    floor: 2,
    temperature: 31,
    humidity: 62,
    energy: 3.7,
    status: "warning"
  }
  ```
- Listens for `alert` events
- **Auto-reconnection** with retry logic

## 🎨 Styling Approach

- **Styled-components** for component-scoped styles
- **Global CSS** for base elements and utilities
- **Dark theme** by default
- **No CSS frameworks** (custom implementation)

## 🧠 Architecture Notes

### State Management
- **React hooks** only (`useState`, `useEffect`)
- Custom hook `useRealTimeData` for WebSocket data
- No Redux/Zustand needed for this scope

### 3D Rendering
- **React Three Fiber** declarative 3D
- **@react-three/drei** helpers (OrbitControls, Text, Environment)
- **Orbit controls** for camera navigation
- **PerspectiveCamera** at `[6, 3, 6]`

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
- `three` + `@react-three/fiber` + `@react-three/drei`
- `framer-motion`
- `socket.io-client`
- `styled-components`

### Development
- `vite` (7.2.2)
- `eslint` (9.x) + plugins
- `prettier`
- `@vitejs/plugin-react`

## 🐛 Troubleshooting

### WebSocket Connection Issues
- Ensure backend is running on `localhost:3000`
- Check browser console for connection errors
- Verify CORS settings on backend

### 3D Scene Not Rendering
- Check browser WebGL support
- Verify Three.js installation
- Check console for shader errors

### HMR Not Working
- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart dev server

## 📝 Development Notes

- **No TypeScript** — Pure JavaScript project
- **StrictMode enabled** in development
- **Fast Refresh** for instant updates
- **ESLint + Prettier** integration for code quality

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
