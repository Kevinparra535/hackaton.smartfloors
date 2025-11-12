# SmartFloors AI — Frontend

**Real-time 3D building monitoring dashboard** with ML-powered predictions and anomaly detection for smart buildings.

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.181.1-000000?logo=three.js)](https://threejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?logo=socket.io)](https://socket.io/)

---

## 🎯 Overview

SmartFloors AI visualizes **5 building floors** in real-time 3D, monitoring:

- 🌡️ Temperature
- 💧 Humidity
- ⚡ Power Consumption
- 👥 Occupancy

Features **ML predictions**, **intelligent alerts**, and **hybrid REST + WebSocket** architecture for optimal performance.

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**App runs at <http://localhost:5173>**

> **First time?** Check **[Getting Started Guide](./docs/setup/GETTING_STARTED.md)** for detailed setup instructions.

---

## 🚨 Recent Updates (v1.1 - Nov 2025)

### WebSocket Fixes ✅

- **Alert Event Name Corrected**: Backend emits `new-alerts`, not `alert`
- **Alert Data Structure**: Properly processes `{alerts: [{anomalies: [...]}]}` format
- **Subscription Cleanup**: Memory leak fixed - all WebSocket subscriptions now properly cleanup on unmount
- **Multi-format Support**: `handleFloorData` now supports multiple backend response formats

### Documentation Reorganization 📚

All documentation moved to `docs/` folder with clear categories:

- **Setup** - Installation and getting started
- **API** - REST and WebSocket integration
- **Architecture** - System design and components
- **Testing** - Endpoint and WebSocket testing

See **[Documentation](#-documentation)** section below for navigation.

---

## ✨ Features

### 🎨 Real-time 3D Visualization

- **5 interactive floor blocks** with hover details
- **Color-coded status** (🟢 Normal, 🟡 Warning, 🔴 Danger)
- **Breathing animations** on anomalies
- **OrbitControls** for 360° navigation

### 🔮 ML Predictions

- **10-60 minute forecasts** for all metrics
- **91% confidence** hybrid ML models
- **Trend indicators** (↑↓→)
- **Interactive time selector**

### 🚨 Intelligent Alerts

- **Last 10 alerts** with severity levels
- **Action recommendations** in Spanish
- **Animated transitions** with Framer Motion
- **Real-time updates** via WebSocket

### 📊 Hybrid Data Architecture

- **REST API** for initial load (fast, reliable)
- **WebSocket** for live updates (real-time)
- **Automatic status calculation** (danger/warning/normal)
- **Optimized loading states**

---

## 🏗️ Tech Stack

| Category         | Technology          | Version  |
| ---------------- | ------------------- | -------- |
| **Framework**    | React               | 19.2.0   |
| **Build Tool**   | Vite                | 7.2.2    |
| **3D Engine**    | React Three Fiber   | 9.4.0    |
| **3D Helpers**   | @react-three/drei   | 10.7.6   |
| **Animations**   | Framer Motion       | 12.23.24 |
| **WebSocket**    | Socket.IO Client    | 4.8.1    |
| **Routing**      | React Router DOM    | 7.9.5    |
| **Styling**      | Styled-components   | 6.1.19   |
| **Code Quality** | ESLint 9 + Prettier | Latest   |

---

## 📁 Project Structure

```
src/
├── api/
│   ├── rest.js              # REST API client
│   └── socket.js            # WebSocket client (Socket.IO)
│
├── hooks/
│   └── useRealTimeData.js   # Central data management (REST + WebSocket)
│
├── components/
│   ├── FloorBlock.jsx       # 3D floor visualization
│   ├── AlertsPanel.jsx      # Live alerts display
│   ├── PredictionsPanel.jsx # ML predictions panel
│   └── SocketDebugger.jsx   # WebSocket debugging tool
│
├── scenes/
│   └── BuildingScene.jsx    # Complete 3D scene (5 floors + lighting)
│
├── layout/
│   ├── Layout.jsx           # Main container
│   ├── Header.jsx           # Navigation
│   └── Sidebar.jsx          # Info + Predictions + Alerts
│
└── pages/
    ├── Home.jsx             # 3D dashboard view
    └── Analytics.jsx        # Data analysis view
```

---

## 🔧 Available Commands

| Command                | Description                       |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start dev server (localhost:5173) |
| `npm run build`        | Production build to `dist/`       |
| `npm run preview`      | Preview production build          |
| `npm run lint`         | Check code errors                 |
| `npm run lint:fix`     | Auto-fix code errors              |
| `npm run format`       | Format with Prettier              |
| `npm run format:check` | Check formatting only             |

---

## 📚 Documentation

### 🚀 Getting Started

- **[Getting Started Guide](./docs/setup/GETTING_STARTED.md)** - Installation, setup, and troubleshooting

### 🔌 API Integration

- **[API Integration](./docs/api/API_INTEGRATION.md)** - REST endpoints and WebSocket events
- **[Data Integration](./docs/api/DATA_INTEGRATION.md)** - Data structures and processing logic

### 🏗️ Architecture

- **[System Architecture](./docs/architecture/SYSTEM_ARCHITECTURE.md)** - Complete system design and data flow
- **[Predictions System](./docs/architecture/PREDICTIONS.md)** - ML predictions documentation
- **[Routing](./docs/architecture/ROUTING.md)** - React Router setup

### 🧪 Testing

- **[Endpoint Tests](./docs/testing/ENDPOINT_TESTS.md)** - Verified REST API tests
- **[WebSocket Testing](./docs/testing/WEBSOCKET_TESTING.md)** - WebSocket event testing guide

### 🤖 Development

- **[Copilot Instructions](./.github/copilot-instructions.md)** - AI coding agent guidelines

---

## 🔌 Backend Integration

### Required Endpoints

```
GET  /health                                     # Health check
GET  /api/v1/floors                              # All floors (initial load)
GET  /api/v1/floors/:id                          # Single floor
GET  /api/v1/floors/stats                        # Statistics
GET  /api/v1/floors/:id/history?limit=60         # Historical data
GET  /api/v1/floors/:id/predictions?minutesAhead=60  # ML predictions
GET  /api/v1/alerts                              # All alerts
```

### WebSocket Events (Socket.IO)

| Event         | Direction          | Description                      |
| ------------- | ------------------ | -------------------------------- |
| `floorData`   | Backend → Frontend | Floor metrics updates (5 floors) |
| `new-alerts`  | Backend → Frontend | New alert notifications ⚠️       |
| `predictions` | Backend → Frontend | ML predictions updates           |

> **Important:** Alert event is named `new-alerts`, not `alert`. See [WebSocket Testing Guide](./docs/testing/WEBSOCKET_TESTING.md) for details.

### CORS Configuration

Backend must allow frontend origin:

```javascript
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);
```

---

## 🎨 Status Calculation

Frontend automatically calculates floor status based on thresholds:

### 🔴 Danger

```javascript
temperature > 26°C || temperature < 18°C
humidity > 70% || humidity < 30%
powerConsumption > 150 kW
```

### 🟡 Warning

```javascript
temperature > 24°C || temperature < 20°C
humidity > 60% || humidity < 35%
powerConsumption > 135 kW
```

### 🟢 Normal

All other values

---

## 🐛 Troubleshooting

### WebSocket Not Connecting

```bash
# Verify backend is running
curl http://localhost:3000/health

# Check CORS configuration
# Ensure Socket.IO server is initialized
```

### Alerts Not Displaying

- ✅ Verify event name is `new-alerts` (not `alert`)
- ✅ Check alert structure: `{alerts: [{anomalies: [...]}]}`
- ✅ See [WebSocket Testing Guide](./docs/testing/WEBSOCKET_TESTING.md)

### Loading Infinitely

```bash
# Test REST endpoint
curl http://localhost:3000/api/v1/floors

# Should return JSON with 5 floors
```

**More solutions:** See [Getting Started - Troubleshooting](./docs/setup/GETTING_STARTED.md#-troubleshooting)

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Update Backend URLs

**`src/api/rest.js`:**

```javascript
const BASE_URL = 'https://your-backend.com/api/v1';
```

**`src/api/socket.js`:**

```javascript
const SOCKET_URL = 'https://your-backend.com';
```

### Deploy Files

Serve `dist/` folder with:

- Node.js + `serve`
- Nginx
- Vercel / Netlify
- Any static hosting

---

## 🤝 Contributing

This is a hackathon project. To contribute:

1. Follow existing code conventions
2. Run `npm run format` before commits
3. Ensure `npm run lint` passes
4. Document complex logic
5. Test WebSocket events thoroughly

---

## 📄 License

Private hackathon project.

---

## 🎓 Learning Resources

### New to the Project?

1. **[Getting Started](./docs/setup/GETTING_STARTED.md)** - Setup and first steps
2. **[System Architecture](./docs/architecture/SYSTEM_ARCHITECTURE.md)** - Understand how it works
3. **[API Integration](./docs/api/API_INTEGRATION.md)** - Learn the backend integration

### Debugging Issues?

1. **[WebSocket Testing](./docs/testing/WEBSOCKET_TESTING.md)** - Debug real-time connections
2. **[Endpoint Tests](./docs/testing/ENDPOINT_TESTS.md)** - Verify data structures
3. **DevTools Console** - Check for emoji-marked logs (📡, 📊, 🚨, 🔮)

---

## ✅ Status

| Component                | Status                                                |
| ------------------------ | ----------------------------------------------------- |
| **REST API Integration** | ✅ Working                                            |
| **WebSocket Events**     | ✅ Working (`floorData`, `new-alerts`, `predictions`) |
| **3D Visualization**     | ✅ Working                                            |
| **ML Predictions**       | ✅ Working                                            |
| **Alerts System**        | ✅ Working                                            |
| **Documentation**        | ✅ Complete                                           |
| **Code Quality**         | ✅ 0 ESLint errors                                    |

---

**Built with React + Vite + Three.js** 🚀  
**Last Updated:** November 2025  
**Version:** 1.1.0
