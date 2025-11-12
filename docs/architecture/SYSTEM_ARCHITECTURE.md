# SmartFloors AI - System Architecture

## 🏗️ Overview

SmartFloors AI is a **hybrid real-time 3D dashboard** that combines REST API and WebSocket connections to visualize building environmental and energy data across 5 floors with ML-powered predictions and anomaly detection.

## 🎯 Architecture Patterns

### Hybrid Data Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React 19)                    │
│                  http://localhost:5173                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐   ┌──────────────┐  │
│  │    3D Scene  │    │   Metrics    │   │  Predictions │  │
│  │ (5 Floors)   │───▶│    Panel     │◀──│    Panel     │  │
│  └──────────────┘    └──────────────┘   └──────────────┘  │
│         │                    │                   │         │
│         └────────────────────┼───────────────────┘         │
│                              │                             │
│                   ┌──────────▼──────────┐                  │
│                   │  useRealTimeData()  │                  │
│                   │   (Custom Hook)     │                  │
│                   └──────────┬──────────┘                  │
│                              │                             │
│                 ┌────────────┴────────────┐                │
│                 │                         │                │
│        ┌────────▼─────────┐     ┌────────▼─────────┐      │
│        │   REST Client    │     │  WebSocket Client│      │
│        │  (rest.js)       │     │   (socket.js)    │      │
│        └────────┬─────────┘     └────────┬─────────┘      │
│                 │                         │                │
└─────────────────┼─────────────────────────┼────────────────┘
                  │                         │
                  │  HTTP                   │  Socket.IO
                  │                         │
┌─────────────────▼─────────────────────────▼────────────────┐
│                Backend Server (Node.js)                     │
│                http://localhost:3000                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  REST API (/api/v1)          WebSocket (Socket.IO)         │
│  ├─ GET /floors              ├─ Event: floorData           │
│  ├─ GET /floors/:id          ├─ Event: new-alerts          │
│  ├─ GET /alerts              └─ Event: predictions         │
│  ├─ GET /predictions                                        │
│  └─ GET /history                                            │
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │
│  │   Database   │   │  ML Service  │   │  Anomaly     │   │
│  │              │───│  (Hybrid)    │───│  Detector    │   │
│  └──────────────┘   └──────────────┘   └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Component Architecture

### Frontend Structure

```
src/
├── api/
│   ├── rest.js                  # REST API client
│   │   ├── fetchAllFloors()     # Initial floor load
│   │   ├── fetchFloorHistory()  # Historical data
│   │   ├── fetchPredictions()   # ML predictions
│   │   └── fetchAlerts()        # Active alerts
│   │
│   └── socket.js                # WebSocket client
│       ├── getSocket()          # Singleton instance
│       ├── subscribeToFloorData()
│       ├── subscribeToAlerts()  # ⚠️ Listens to 'new-alerts' event
│       └── subscribeToPredictions()
│
├── hooks/
│   └── useRealTimeData.js       # Central data management
│       ├── Initial REST load
│       ├── WebSocket subscriptions
│       ├── handleFloorData()    # Process floor updates
│       ├── handleAlert()        # Process alerts with anomalies array
│       ├── handlePredictions()  # Process ML predictions
│       └── getFloorStatus()     # Calculate danger/warning/normal
│
├── components/
│   ├── FloorBlock.jsx           # Individual 3D floor
│   │   ├── Status-based coloring
│   │   ├── Breathing animation (warning/danger)
│   │   └── Hover state management
│   │
│   ├── AlertsPanel.jsx          # Animated alerts list
│   │   ├── Framer Motion animations
│   │   ├── Severity color coding
│   │   └── Last 10 alerts display
│   │
│   ├── PredictionsPanel.jsx     # ML predictions display
│   │   ├── Time selector (10-60 min)
│   │   ├── Trend indicators (↑↓→)
│   │   ├── Confidence levels
│   │   └── 4 metrics visualization
│   │
│   └── SocketDebugger.jsx       # Development debugging tool
│
├── scenes/
│   └── BuildingScene.jsx        # Complete 3D scene
│       ├── 5 floor blocks
│       ├── Camera setup
│       ├── Lighting (ambient + directional + point)
│       └── OrbitControls
│
├── layout/
│   ├── Layout.jsx               # Main container with Outlet
│   ├── Header.jsx               # Navigation tabs
│   └── Sidebar.jsx              # Info + Predictions + Alerts panels
│
└── pages/
    ├── Home.jsx                 # Dashboard 3D view
    └── Analytics.jsx            # Data analysis view
```

## 🔄 Data Flow

### 1. Initial Load (REST API)

```javascript
// useRealTimeData.js - on mount

useEffect(() => {
  async function loadInitialData() {
    setIsLoading(true);
    
    // 1. Fetch all floor data
    const floors = await fetchAllFloors(); // GET /api/v1/floors
    
    // 2. Process and calculate status
    const processedFloors = floors.reduce((acc, floor) => {
      acc[floor.floorId] = {
        ...floor,
        status: getFloorStatus(floor) // danger/warning/normal
      };
      return acc;
    }, {});
    
    // 3. Fetch initial alerts
    const alertsData = await fetchAlerts(); // GET /api/v1/alerts
    
    // 4. Process alerts (convert anomalies array to flat structure)
    const alerts = processAlerts(alertsData);
    
    // 5. Update state
    setFloorData(processedFloors);
    setAlerts(alerts);
    setIsLoading(false);
  }
  
  loadInitialData();
}, []);
```

### 2. Real-time Updates (WebSocket)

```javascript
// useRealTimeData.js - WebSocket subscriptions

useEffect(() => {
  // Subscribe to floor data updates
  const unsubFloorData = subscribeToFloorData(handleFloorData);
  
  // Subscribe to new alerts (⚠️ event name is 'new-alerts')
  const unsubAlerts = subscribeToAlerts(handleAlert);
  
  // Subscribe to predictions
  const unsubPredictions = subscribeToPredictions(handlePredictions);
  
  // Cleanup on unmount
  return () => {
    unsubFloorData();
    unsubAlerts();
    unsubPredictions();
    disconnectSocket();
  };
}, [handleFloorData, handleAlert, handlePredictions]);
```

### 3. Status Calculation Logic

```javascript
function getFloorStatus(floor) {
  const { temperature, humidity, powerConsumption } = floor;
  
  // DANGER conditions
  if (temperature > 26 || temperature < 18) return 'danger';
  if (humidity > 70 || humidity < 30) return 'danger';
  if (powerConsumption > 150) return 'danger';
  
  // WARNING conditions
  if (temperature > 24 || temperature < 20) return 'warning';
  if (humidity > 60 || humidity < 35) return 'warning';
  if (powerConsumption > 135) return 'warning';
  
  // NORMAL (default)
  return 'normal';
}
```

### 4. Alert Processing (Anomalies Array)

```javascript
// Backend sends alerts with structure:
// {
//   alerts: [
//     {
//       floorId: 4,
//       floorName: "Piso 4",
//       anomalies: [
//         { type: "humidity", severity: "critical", message: "...", ... }
//       ]
//     }
//   ]
// }

function handleAlert(alertData) {
  // Process nested structure
  if (alertData.alerts && Array.isArray(alertData.alerts)) {
    const newAlerts = [];
    
    alertData.alerts.forEach(alertGroup => {
      alertGroup.anomalies.forEach((anomaly, index) => {
        newAlerts.push({
          id: `${alertGroup.floorId}_${alertGroup.timestamp}_${index}`,
          floorId: alertGroup.floorId,
          floorName: alertGroup.floorName,
          type: anomaly.type,
          severity: anomaly.severity,
          message: anomaly.message,
          recommendation: anomaly.recommendation,
          timestamp: anomaly.timestamp || alertGroup.timestamp
        });
      });
    });
    
    // Update state (keep last 10)
    setAlerts(prev => [...newAlerts, ...prev].slice(0, 10));
  }
}
```

## 🎨 3D Visualization Architecture

### React Three Fiber Setup

```javascript
// BuildingScene.jsx

<Canvas>
  <PerspectiveCamera makeDefault position={[8, 4, 8]} fov={50} />
  
  <ambientLight intensity={0.3} />
  <directionalLight position={[5, 10, 5]} intensity={0.8} />
  <pointLight position={[0, 8, 0]} intensity={1} />
  
  <OrbitControls
    minDistance={5}
    maxDistance={20}
    minPolarAngle={0}
    maxPolarAngle={Math.PI / 2.1}
  />
  
  {Object.values(floorData).map(floor => (
    <FloorBlock
      key={floor.floorId}
      data={floor}
      position={[0, (floor.floorId - 3) * 1.2, 0]}
      onHover={setSelectedFloor}
    />
  ))}
</Canvas>
```

### FloorBlock Animation

```javascript
// FloorBlock.jsx - breathing animation for warning/danger

useFrame((state) => {
  if (status === 'warning' || status === 'danger') {
    const intensity = status === 'danger' ? 1.5 : 1.0;
    const speed = status === 'danger' ? 3 : 2;
    
    // Pulsing emissive
    meshRef.current.material.emissiveIntensity =
      0.4 + Math.sin(state.clock.elapsedTime * speed) * intensity;
    
    // Scale breathing
    const scale = 1 + Math.sin(state.clock.elapsedTime * speed) * 0.02;
    meshRef.current.scale.set(scale, scale, scale);
  }
});
```

## 🔐 Security & Error Handling

### CORS Configuration

```javascript
// Backend must allow frontend origin
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));

io.on('connection', (socket) => {
  // Socket.IO connection
});
```

### Error Boundaries

```javascript
// All REST calls wrapped in try/catch

async function fetchAllFloors() {
  try {
    const response = await fetch(`${BASE_URL}/floors`);
    if (!response.ok) throw new Error('Failed to fetch floors');
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('❌ [REST API] Error fetching floors:', error);
    return []; // Fallback to empty array
  }
}
```

### WebSocket Reconnection

```javascript
// socket.js - auto-reconnect configuration

const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000
});

socket.on('disconnect', () => {
  console.log('🔌 [Socket] Disconnected from backend');
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`🔄 [Socket] Reconnected after ${attemptNumber} attempts`);
});
```

## 📊 State Management

### Single Source of Truth

```javascript
// useRealTimeData hook manages all state

const [floorData, setFloorData] = useState({});        // { 1: {...}, 2: {...}, ... }
const [alerts, setAlerts] = useState([]);              // Last 10 alerts
const [predictions, setPredictions] = useState({});    // { 1: {...}, 2: {...}, ... }
const [isLoading, setIsLoading] = useState(true);
const [isConnected, setIsConnected] = useState(false);
```

### State Flow

```
REST API (initial load)
    ↓
setFloorData / setAlerts
    ↓
Components re-render
    ↓
WebSocket events arrive
    ↓
State updates (setFloorData / setAlerts / setPredictions)
    ↓
Components re-render with new data
```

## 🎯 Performance Optimizations

### 1. useCallback for Event Handlers

```javascript
const handleFloorData = useCallback((data) => {
  // Process floor data
}, []);

const handleAlert = useCallback((alertData) => {
  // Process alerts
}, []);
```

### 2. React.memo for Static Components

```javascript
const FloorBlock = React.memo(({ data, position, onHover }) => {
  // Component logic
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if data changed
  return prevProps.data.status === nextProps.data.status &&
         prevProps.data.temperature === nextProps.data.temperature;
});
```

### 3. Debounced Updates

```javascript
// Only update predictions when selected time changes
const [selectedTime, setSelectedTime] = useState(60);

useEffect(() => {
  // Fetch predictions only when time changes, not on every render
  if (selectedFloor) {
    fetchPredictions(selectedFloor, selectedTime);
  }
}, [selectedFloor, selectedTime]);
```

## 🧪 Testing Strategy

### Unit Tests
- Test status calculation logic (`getFloorStatus`)
- Test alert processing (`handleAlert`)
- Test data transformations

### Integration Tests
- Test REST API responses
- Test WebSocket event handling
- Test component rendering with data

### E2E Tests
- Test full user flow (load → interact → view updates)
- Test real-time data updates
- Test navigation between views

## 📝 Key Design Decisions

### 1. Hybrid Architecture (REST + WebSocket)
**Why:** Initial load with REST is faster and more reliable than waiting for WebSocket events. WebSocket provides real-time updates after initial load.

### 2. Status Calculation on Frontend
**Why:** Reduces backend load and allows immediate visual feedback without waiting for backend processing.

### 3. Single Custom Hook (useRealTimeData)
**Why:** Centralizes all data logic, prevents duplicate WebSocket connections, ensures single source of truth.

### 4. Alert Processing (Anomalies Array → Flat)
**Why:** Backend optimizes by batching anomalies per floor. Frontend flattens for easier display in UI.

### 5. Styled-components over CSS
**Why:** Component scoping, dynamic styling based on props, no naming conflicts, better TypeScript support (if migrated).

## 🔗 Related Documentation

- **[API Integration](../api/API_INTEGRATION.md)** - REST endpoints and WebSocket events
- **[Data Integration](../api/DATA_INTEGRATION.md)** - Data structures and processing
- **[Predictions](./PREDICTIONS.md)** - ML predictions system
- **[Routing](./ROUTING.md)** - React Router setup and navigation
- **[Testing Guide](../testing/ENDPOINT_TESTS.md)** - Verified endpoint tests

---

**Last Updated:** 2025-11-12  
**Architecture Version:** 1.0  
**Status:** ✅ Production Ready
