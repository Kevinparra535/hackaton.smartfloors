# 🏗️ Arquitectura Técnica — SmartFloors AI

> **Documento técnico completo de la arquitectura frontend del sistema de monitoreo inteligente 3D**

---

## 📋 Tabla de Contenidos

- [Visión General](#-visión-general)
- [Stack Tecnológico Detallado](#-stack-tecnológico-detallado)
- [Arquitectura de Componentes](#-arquitectura-de-componentes)
- [Gestión de Estado](#-gestión-de-estado)
- [Pipeline de Datos](#-pipeline-de-datos)
- [Sistema de Visualización 3D](#-sistema-de-visualización-3d)
- [Integración Backend](#-integración-backend)
- [Sistema de Estilos](#-sistema-de-estilos)
- [Performance & Optimizaciones](#-performance--optimizaciones)

---

## 🎯 Visión General

SmartFloors AI es una **aplicación React moderna** construida con las siguientes premisas arquitectónicas:

```
┌─────────────────────────────────────────────────────────────┐
│                    SMARTFLOORS FRONTEND                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           React 19 + Vite (Core Layer)              │  │
│  │  StrictMode | HMR | Fast Refresh | ES Modules      │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Data Layer (REST + WebSocket Hybrid)         │  │
│  │  useRealTimeData hook | Socket.IO | Fetch API      │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         State Management (React Hooks)              │  │
│  │  useState | useEffect | useCallback | Context API  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     Presentation Layer (Components + 3D Scene)      │  │
│  │  React Three Fiber | Styled-components | Recharts  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Principios Arquitectónicos

1. **📦 Component-Based** — Todo es un componente React reutilizable
2. **🔄 Declarative** — UI como función del estado (`UI = f(state)`)
3. **⚡ Real-time First** — WebSocket como ciudadano de primera clase
4. **🎨 Visual Narrative** — 3D no es ornamento, es la interfaz principal
5. **🧩 Separation of Concerns** — Lógica, presentación y datos separados

---

## 🛠️ Stack Tecnológico Detallado

### Core Libraries

| Librería | Versión | Propósito | Justificación |
|----------|---------|-----------|---------------|
| **React** | 19.2.0 | UI Library | Última versión con mejoras de rendimiento y `createRoot` |
| **Vite** | 7.2.2 | Build Tool | HMR instantáneo, ES modules nativos, build rápido |
| **React Router** | 7.x | Routing | SPA con navegación declarativa |

### 3D Visualization Stack

| Librería | Versión | Propósito |
|----------|---------|-----------|
| **React Three Fiber** | Latest | Renderer React para Three.js |
| **@react-three/drei** | Latest | Helpers y primitivas 3D |
| **@react-three/postprocessing** | Latest | Efectos visuales (Bloom, Vignette, etc.) |
| **Three.js** | R3F compatible | Motor 3D subyacente |

**Ejemplo de uso:**

```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

<Canvas camera={{ position: [0, 10, 20], fov: 50 }}>
  <ambientLight intensity={0.5} />
  <BuildingScene />
  <OrbitControls />
</Canvas>
```

### Styling & UI

| Librería | Versión | Propósito |
|----------|---------|-----------|
| **Styled-components** | 6.1.19 | CSS-in-JS |
| **Framer Motion** | Latest | Animaciones UI |
| **Recharts** | Latest | Gráficas de líneas |

### Communication Layer

| Librería | Versión | Propósito |
|----------|---------|-----------|
| **Socket.IO Client** | 4.x | WebSocket real-time |
| **Fetch API** | Native | REST API calls |

---

## 🧩 Arquitectura de Componentes

### Jerarquía de Componentes

```
App (Router)
│
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── VisualizationSelector
│   │
│   ├── AlertsSidebar (context-driven)
│   │   ├── AlertItem (x N)
│   │   └── ExportButton
│   │
│   └── <Outlet /> (Route content)
│
└── Pages
    │
    ├── Home
    │   ├── Dashboard3D
    │   │   └── Canvas (R3F)
    │   │       ├── BuildingScene
    │   │       │   ├── FloorBlock (x5)
    │   │       │   │   ├── Mesh (geometry + material)
    │   │       │   │   ├── FloorInfoPanel (HTML overlay)
    │   │       │   │   └── PredictionsPanel (HTML overlay)
    │   │       │   │
    │   │       │   ├── Lighting (ambient + directional + point)
    │   │       │   ├── FloatingParticles (200+)
    │   │       │   ├── GradientBackground
    │   │       │   └── VolumetricFog
    │   │       │
    │   │       ├── InteractiveWall (right - charts)
    │   │       ├── InteractiveWallLeft (left - alerts table)
    │   │       ├── ColorLegend
    │   │       └── OrbitControls
    │   │
    │   ├── TrendCharts (inside InteractiveWall)
    │   └── AlertsTable (inside InteractiveWallLeft)
    │
    ├── Analytics (future)
    └── AlertsTableDemo (standalone)
```

### Responsabilidades de Componentes

#### 🏠 **Layout.jsx**

**Propósito:** Estructura global de la aplicación

```jsx
export default function Layout() {
  const [alerts, setAlerts] = useState([]);
  const [floors, setFloors] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // useRealTimeData hook maneja REST + WebSocket
  useRealTimeData({
    onFloorsUpdate: setFloors,
    onAlertsUpdate: setAlerts,
    onConnectionChange: setIsConnected
  });

  return (
    <LayoutContext.Provider value={{ alerts, floors, isConnected }}>
      <Header />
      <AlertsSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Outlet context={{ setSidebarOpen }} />
    </LayoutContext.Provider>
  );
}
```

**Responsabilidades:**
- ✅ Gestionar estado global (alerts, floors, conexión)
- ✅ Proveer contexto a hijos
- ✅ Orquestar sidebar de alertas
- ✅ Renderizar Header + contenido de rutas

---

#### 🏢 **FloorBlock.jsx**

**Propósito:** Bloque 3D individual que representa un piso

```jsx
export default function FloorBlock({ floor, index, onClick, selectedFloor }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Animación de respiración con useFrame
  useFrame((state) => {
    if (meshRef.current) {
      const breathing = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.y = 1 + breathing;
    }
  });

  // Calcular estado y color basado en métricas
  const heatState = calculateHeatState(floor);
  const color = STATUS_COLORS[heatState];

  return (
    <mesh
      ref={meshRef}
      position={[0, index * 3, 0]}
      onClick={() => onClick(floor)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[10, 2, 10]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      
      {selectedFloor === floor.floorId && (
        <>
          <FloorInfoPanel floor={floor} />
          <PredictionsPanel floorId={floor.floorId} />
        </>
      )}
    </mesh>
  );
}
```

**Responsabilidades:**
- ✅ Renderizar geometría 3D del piso
- ✅ Animar pulso de respiración
- ✅ Cambiar color según estado
- ✅ Mostrar paneles al hacer click
- ✅ Estados hover interactivos

**Props:**
```typescript
{
  floor: Floor,           // Datos del piso (temp, humidity, etc.)
  index: number,          // Posición vertical en la escena
  onClick: Function,      // Handler de click
  selectedFloor: number?  // ID del piso seleccionado
}
```

---

#### 🔮 **PredictionsPanel.jsx**

**Propósito:** Panel HTML flotante con predicciones ML

```jsx
export default function PredictionsPanel({ floorId }) {
  const [predictions, setPredictions] = useState([]);
  const [minutesAhead, setMinutesAhead] = useState(30);
  const [loading, setLoading] = useState(true);

  // Fetch inicial + suscripción WebSocket
  useEffect(() => {
    fetchPredictions(floorId, minutesAhead)
      .then(setPredictions)
      .finally(() => setLoading(false));

    const unsubscribe = subscribeToPredictions((data) => {
      if (data.floorId === floorId) {
        setPredictions(data.predictions);
      }
    });

    return unsubscribe;
  }, [floorId, minutesAhead]);

  const prediction = predictions.find(p => p.minutesAhead === minutesAhead);

  return (
    <Html position={[6, 0, 0]}>
      <Panel>
        <Title>🔮 Predicciones ML</Title>
        <TimeSelector value={minutesAhead} onChange={setMinutesAhead} />
        
        {loading ? <Spinner /> : (
          <>
            <Metric label="Temperatura" value={prediction.temperature} unit="°C" />
            <Metric label="Humedad" value={prediction.humidity} unit="%" />
            <Metric label="Energía" value={prediction.powerConsumption} unit="kW" />
            <Confidence level={prediction.confidence} />
          </>
        )}
      </Panel>
    </Html>
  );
}
```

**Responsabilidades:**
- ✅ Fetch predicciones del backend
- ✅ Escuchar actualizaciones WebSocket
- ✅ Selector de horizonte temporal (10-60 min)
- ✅ Mostrar nivel de confianza
- ✅ Estados de loading/error

---

#### ⚠️ **AlertsPanel.jsx**

**Propósito:** Panel lateral animado con alertas en tiempo real

```jsx
export default function AlertsPanel({ alerts, isOpen, onClose }) {
  const [filters, setFilters] = useState({
    severity: 'all',
    floorId: 'all',
    type: 'all',
    isPredictive: 'all'
  });

  const filteredAlerts = alerts.filter(alert => {
    // Aplicar filtros...
    return matchesFilters(alert, filters);
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <Sidebar
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <Header>
            <Title>⚠️ Alertas Activas ({filteredAlerts.length})</Title>
            <CloseButton onClick={onClose}>✕</CloseButton>
          </Header>

          <Filters filters={filters} onChange={setFilters} />

          <AlertsList>
            {filteredAlerts.map(alert => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </AlertsList>

          <ExportButton onClick={() => exportCSV(filteredAlerts)} />
        </Sidebar>
      )}
    </AnimatePresence>
  );
}
```

**Responsabilidades:**
- ✅ Filtrado multi-dimensional
- ✅ Animaciones de entrada/salida (Framer Motion)
- ✅ Exportación a CSV
- ✅ Scroll virtual para listas largas
- ✅ Clasificación por severidad

---

#### 📊 **TrendCharts.jsx**

**Propósito:** 3 gráficas de tendencias históricas con Recharts

```jsx
export default function TrendCharts({ floorId }) {
  const [history, setHistory] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(floorId || 'all');

  useEffect(() => {
    if (selectedFloor === 'all') {
      // Fetch todos los pisos
      fetchAllFloorsHistory().then(setHistory);
    } else {
      fetchFloorHistory(selectedFloor, 48).then(setHistory);
    }
  }, [selectedFloor]);

  return (
    <ChartsContainer>
      <FloorSelector value={selectedFloor} onChange={setSelectedFloor} />

      <ChartWrapper>
        <ChartTitle>🌡️ Temperatura (4 horas)</ChartTitle>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis domain={[15, 30]} />
            <Tooltip />
            <Line type="monotone" dataKey="temperature" stroke="#ff6b6b" />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Repetir para humedad y energía */}
    </ChartsContainer>
  );
}
```

**Responsabilidades:**
- ✅ Fetch historial 4 horas
- ✅ Selector de piso (individual / todos)
- ✅ Color-coding en modo "Todos"
- ✅ Tooltips interactivos
- ✅ Actualización dinámica

---

## 🔄 Gestión de Estado

### Estado por Niveles

SmartFloors usa **React Hooks** para gestión de estado, sin Redux ni Zustand:

```
┌─────────────────────────────────────────────────────┐
│           NIVELES DE ESTADO                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1️⃣ Global State (Context API)                     │
│     └─ Layout.jsx                                   │
│        ├─ alerts: Alert[]                           │
│        ├─ floors: Floor[]                           │
│        ├─ isConnected: boolean                      │
│        └─ predictions: Prediction[]                 │
│                                                     │
│  2️⃣ Route State (Outlet Context)                   │
│     └─ Home.jsx                                     │
│        ├─ selectedFloor: number | null              │
│        ├─ visualizationMode: Mode                   │
│        └─ cameraPosition: Vector3                   │
│                                                     │
│  3️⃣ Component State (useState)                     │
│     └─ FloorBlock.jsx                               │
│        ├─ hovered: boolean                          │
│        └─ expanded: boolean                         │
│                                                     │
│  4️⃣ Form State (controlled components)             │
│     └─ Filters.jsx                                  │
│        └─ filters: FilterState                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Custom Hooks

#### **useRealTimeData.js** (El hook más importante)

```javascript
export function useRealTimeData({ onFloorsUpdate, onAlertsUpdate, onConnectionChange }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1️⃣ Carga inicial REST
    Promise.all([
      apiFetch('/floors'),
      apiFetch('/alerts')
    ])
      .then(([floorsData, alertsData]) => {
        onFloorsUpdate(floorsData.floors);
        onAlertsUpdate(alertsData.alerts);
      })
      .catch(setError)
      .finally(() => setIsLoading(false));

    // 2️⃣ Conectar WebSocket
    const socket = getSocket();

    socket.on('connect', () => onConnectionChange(true));
    socket.on('disconnect', () => onConnectionChange(false));

    // 3️⃣ Suscripciones
    socket.on('floor-data', (data) => {
      const processedFloors = data.floors.map(f => ({
        ...f,
        status: calculateStatus(f),
        heatState: calculateHeatState(f)
      }));
      onFloorsUpdate(processedFloors);
    });

    socket.on('new-alerts', (data) => {
      const normalizedAlerts = normalizeAlerts(data.alerts);
      onAlertsUpdate(normalizedAlerts);
    });

    socket.on('predictions', (data) => {
      // Actualizar predicciones por piso
    });

    // 4️⃣ Cleanup
    return () => {
      socket.off('floor-data');
      socket.off('new-alerts');
      socket.off('predictions');
    };
  }, []);

  return { isLoading, error };
}
```

**Características:**
- ✅ Híbrido REST + WebSocket
- ✅ Carga inicial optimista
- ✅ Auto-reconexión
- ✅ Cleanup automático
- ✅ Procesamiento de datos (cálculo de estados)

---

#### **useCameraZoom.js**

```javascript
export function useCameraZoom({ controlsRef }) {
  const [targetPosition, setTargetPosition] = useState(null);

  const zoomToFloor = useCallback((floorIndex) => {
    const position = new THREE.Vector3(15, floorIndex * 3, 15);
    setTargetPosition(position);
  }, []);

  const resetView = useCallback(() => {
    setTargetPosition(new THREE.Vector3(0, 10, 20));
  }, []);

  useFrame(() => {
    if (targetPosition && controlsRef.current) {
      controlsRef.current.target.lerp(targetPosition, 0.1);
    }
  });

  return { zoomToFloor, resetView };
}
```

---

## 📊 Pipeline de Datos

### Flujo Completo

```
┌────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER                          │
│              (http://localhost:3000)                       │
└────────────────────────────────────────────────────────────┘
                     │                    │
          REST API   │                    │  WebSocket
                     ↓                    ↓
┌─────────────────────────────┐  ┌──────────────────────────┐
│   Initial Load (REST)       │  │  Real-time Updates (WS)  │
│                             │  │                          │
│  GET /api/v1/floors         │  │  Event: floor-data       │
│  GET /api/v1/alerts         │  │  Event: new-alerts       │
│                             │  │  Event: predictions      │
└─────────────────────────────┘  └──────────────────────────┘
                     ↓                    ↓
              ┌──────────────────────────────────┐
              │   useRealTimeData Hook           │
              │                                  │
              │  • Normaliza severidad           │
              │  • Calcula estados (heat state)  │
              │  • Procesa anomalías             │
              └──────────────────────────────────┘
                             ↓
                  ┌──────────────────┐
                  │  React State     │
                  │                  │
                  │  • floors[]      │
                  │  • alerts[]      │
                  │  • predictions[] │
                  └──────────────────┘
                             ↓
              ┌──────────────────────────────────┐
              │     React Components             │
              │                                  │
              │  • FloorBlock (visualización)    │
              │  • AlertsPanel (notificaciones)  │
              │  • PredictionsPanel (ML)         │
              └──────────────────────────────────┘
```

### Transformación de Datos

**Ejemplo: Floor Data**

```javascript
// 1️⃣ Del backend
{
  floorId: 2,
  temperature: 27.5,
  humidity: 48,
  powerConsumption: 142,
  occupancy: 78
}

// 2️⃣ Procesado en useRealTimeData
import { calculateStatus, calculateHeatState } from './utils/webSocket.utils';

const processedFloor = {
  ...backendData,
  status: calculateStatus(backendData),        // 🔴 "danger"
  heatState: calculateHeatState(backendData),  // "high"
  color: getColorForState("danger"),           // "#ff4d4f"
  pulseIntensity: 0.8                          // Intensidad de pulso
}

// 3️⃣ Usado en FloorBlock
<meshStandardMaterial
  color={floor.color}
  emissive={floor.color}
  emissiveIntensity={floor.pulseIntensity}
/>
```

---

## 🎨 Sistema de Visualización 3D

### Canvas Principal

```jsx
<Canvas
  camera={{ position: [0, 10, 20], fov: 50 }}
  gl={{ antialias: true, alpha: true }}
  style={{ background: 'transparent' }}
>
  {/* Efectos post-procesamiento */}
  <EffectComposer>
    <Bloom intensity={1.5} luminanceThreshold={0.4} />
    <Vignette opacity={0.5} />
  </EffectComposer>

  {/* Escena principal */}
  <BuildingScene floors={floors} />

  {/* Controles */}
  <OrbitControls
    enablePan={false}
    minDistance={15}
    maxDistance={50}
    minPolarAngle={Math.PI / 6}
    maxPolarAngle={Math.PI / 2}
  />
</Canvas>
```

### Lighting Setup

```jsx
// BuildingScene.jsx
<ambientLight intensity={0.4} />
<directionalLight position={[10, 10, 5]} intensity={1} />
<pointLight position={[0, 20, 0]} intensity={0.5} color="#646cff" />
```

### Sistema de Partículas

```jsx
export function FloatingParticles({ count = 200 }) {
  const particlesRef = useRef();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = Math.random() * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
}
```

---

## 🔌 Integración Backend

### Cliente REST

```javascript
// src/api/rest.js
const BASE_URL = 'http://localhost:3000/api/v1';

export async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const fetchFloors = () => apiFetch('/floors');
export const fetchFloor = (id) => apiFetch(`/floors/${id}`);
export const fetchPredictions = (id, minutes = 60) =>
  apiFetch(`/floors/${id}/predictions?minutesAhead=${minutes}`);
```

### Cliente WebSocket

```javascript
// src/api/socket.js
import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io('http://localhost:3000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
  }
  return socket;
}

export function subscribeToFloorData(callback) {
  const socket = getSocket();
  socket.on('floor-data', callback);
  return () => socket.off('floor-data', callback);
}
```

---

## 🎨 Sistema de Estilos

### Tema Global

```javascript
// src/styles/theme.js
export const theme = {
  colors: {
    primary: '#646cff',
    background: '#0a0a0a',
    surface: 'rgba(26, 26, 26, 0.95)',
    
    status: {
      normal: '#00ff88',
      warning: '#ffd966',
      danger: '#ff4d4f'
    },
    
    severity: {
      info: '#4dabf7',
      warning: '#ffd966',
      critical: '#ff4d4f'
    }
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  }
};
```

### Styled-components Pattern

```javascript
import styled from 'styled-components';

export const Panel = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.lg};
  
  /* Transient props con $ prefix */
  ${({ $severity }) => $severity === 'critical' && `
    border-color: #ff4d4f;
    box-shadow: 0 0 20px rgba(255, 77, 79, 0.3);
  `}
`;
```

---

## ⚡ Performance & Optimizaciones

### Estrategias Implementadas

1. **React.memo** para componentes puros
```jsx
export default React.memo(FloorBlock, (prev, next) => {
  return prev.floor.floorId === next.floor.floorId &&
         prev.floor.temperature === next.floor.temperature;
});
```

2. **useCallback** para handlers
```jsx
const handleFloorClick = useCallback((floor) => {
  setSelectedFloor(floor.floorId);
}, []);
```

3. **useMemo** para cálculos costosos
```jsx
const filteredAlerts = useMemo(() => {
  return alerts.filter(matchesFilters);
}, [alerts, filters]);
```

4. **Lazy loading** de rutas
```jsx
const Analytics = lazy(() => import('./pages/Analytics'));
```

5. **Debounce** en filtros
```jsx
const debouncedFilter = useDebounce(filterValue, 300);
```

### Métricas de Build

```bash
npm run build

# Output esperado:
dist/index.html                   0.65 kB
dist/assets/index-abc123.css     12.34 kB
dist/assets/index-def456.js     425.67 kB  (gzipped: ~120 kB)
```

---

## 🧪 Testing Strategy

### ESLint + Prettier

```bash
npm run lint       # Verificar código
npm run lint:fix   # Auto-fix
npm run format     # Formatear con Prettier
```

### React StrictMode

```jsx
// main.jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## 📖 Siguientes Pasos

- Ver [COMPONENTS.md](./COMPONENTS.md) para diagrama detallado de componentes
- Ver [DATA_FLOW.md](./DATA_FLOW.md) para flujo completo de datos
- Ver [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) para decisiones arquitectónicas

---

<div align="center">

**Documentación generada para SmartFloors AI — Hackathon 2025**

[← Volver al README](../README.md) | [Ver Visión Creativa →](./CREATIVE_VISION.md)

</div>
