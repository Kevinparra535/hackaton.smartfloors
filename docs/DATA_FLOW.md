# 📊 Data Flow — SmartFloors AI

> **Pipeline completo de datos: Backend → Frontend → Visualización 3D**

---

## 🎯 Visión General del Pipeline

SmartFloors implementa un **flujo de datos híbrido** que combina:
- **REST API** para carga inicial rápida
- **WebSocket (Socket.IO)** para actualizaciones en tiempo real
- **React State** para gestión local
- **Context API** para estado global

```
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER                           │
│              (http://localhost:3000)                        │
│                                                             │
│  ┌─────────────────┐         ┌──────────────────┐          │
│  │ FloorSimulator  │ ━━━━━> │ PredictionService│          │
│  │                 │         │                  │          │
│  │ • Genera datos  │         │ • Promedio móvil │          │
│  │   cada 60s      │         │ • Regresión lin. │          │
│  │ • Temperatura   │         │ • Nivel confianza│          │
│  │ • Humedad       │         └──────────────────┘          │
│  │ • Energía       │                  ↓                    │
│  │ • Ocupación     │         ┌──────────────────┐          │
│  └─────────────────┘         │  AlertService    │          │
│           ↓                  │                  │          │
│  ┌─────────────────┐         │ • Detecta        │          │
│  │  REST Endpoints │         │   anomalías      │          │
│  │                 │         │ • Genera alertas │          │
│  │ GET /floors     │         │ • Recomendaciones│          │
│  │ GET /alerts     │         └──────────────────┘          │
│  │ GET /predictions│                                       │
│  │ GET /history    │                                       │
│  └─────────────────┘                                       │
│           ↓                                                 │
│  ┌─────────────────┐                                       │
│  │  Socket.IO      │                                       │
│  │                 │                                       │
│  │ Emit: floor-data│                                       │
│  │ Emit: new-alerts│                                       │
│  │ Emit: predictions│                                      │
│  └─────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
           ↓                              ↓
    REST (inicial)                  WebSocket (updates)
           ↓                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│                                                             │
│  ┌──────────────────────────────────────┐                  │
│  │    useRealTimeData Hook              │                  │
│  │                                      │                  │
│  │  1️⃣ Carga inicial (REST)            │                  │
│  │     └─ Promise.all([                │                  │
│  │          apiFetch('/floors'),       │                  │
│  │          apiFetch('/alerts')        │                  │
│  │        ])                            │                  │
│  │                                      │                  │
│  │  2️⃣ Conexión WebSocket              │                  │
│  │     └─ const socket = getSocket()   │                  │
│  │                                      │                  │
│  │  3️⃣ Suscripciones                   │                  │
│  │     ├─ socket.on('floor-data', ...) │                  │
│  │     ├─ socket.on('new-alerts', ...) │                  │
│  │     └─ socket.on('predictions', ...)│                  │
│  │                                      │                  │
│  │  4️⃣ Procesamiento                   │                  │
│  │     ├─ calculateStatus()            │                  │
│  │     ├─ calculateHeatState()         │                  │
│  │     └─ normalizeAlerts()            │                  │
│  └──────────────────────────────────────┘                  │
│                     ↓                                       │
│  ┌──────────────────────────────────────┐                  │
│  │      React State (Layout.jsx)        │                  │
│  │                                      │                  │
│  │  • floors: Floor[]                   │                  │
│  │  • alerts: Alert[]                   │                  │
│  │  • predictions: Prediction[]         │                  │
│  │  • isConnected: boolean              │                  │
│  └──────────────────────────────────────┘                  │
│                     ↓                                       │
│  ┌──────────────────────────────────────┐                  │
│  │     LayoutContext.Provider           │                  │
│  │   value={{ floors, alerts, ... }}    │                  │
│  └──────────────────────────────────────┘                  │
│                     ↓                                       │
│  ┌──────────────────────────────────────┐                  │
│  │      React Components                │                  │
│  │                                      │                  │
│  │  • FloorBlock (visualización 3D)     │                  │
│  │  • AlertsPanel (notificaciones)      │                  │
│  │  • PredictionsPanel (ML)             │                  │
│  │  • TrendCharts (gráficas)            │                  │
│  └──────────────────────────────────────┘                  │
│                     ↓                                       │
│           🖥️ USER INTERFACE                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo Detallado por Tipo de Dato

### 1. Floor Data (Métricas en Tiempo Real)

#### Backend → Frontend

**Backend (FloorSimulator):**
```javascript
// Genera datos cada 60 segundos
const floorData = {
  floorId: 2,
  name: "Piso 2",
  temperature: 23.5,      // °C
  humidity: 47.2,         // %
  powerConsumption: 82.1, // kW
  occupancy: 68,          // personas
  timestamp: "2025-11-13T10:30:00Z"
};

// Emite vía WebSocket
io.emit('floor-data', { floors: [floorData, ...] });
```

**Frontend (useRealTimeData):**
```javascript
socket.on('floor-data', (data) => {
  // 1️⃣ Procesar datos
  const processedFloors = data.floors.map(floor => {
    // Calcular estado basado en umbrales
    const status = calculateStatus(floor);
    // Calcular estado térmico
    const heatState = calculateHeatState(floor);
    // Asignar color según estado
    const color = STATUS_COLORS[status];
    
    return {
      ...floor,
      status,      // 'normal' | 'warning' | 'danger'
      heatState,   // 'low' | 'normal' | 'high' | 'critical'
      color        // '#00ff88' | '#ffd966' | '#ff4d4f'
    };
  });

  // 2️⃣ Actualizar estado React
  onFloorsUpdate(processedFloors);
});
```

**Visualización (FloorBlock):**
```jsx
// Componente recibe floor procesado
<mesh>
  <meshStandardMaterial
    color={floor.color}           // Color dinámico
    emissive={floor.color}
    emissiveIntensity={floor.powerConsumption / 200} // Brillo por energía
  />
</mesh>

// Animación de respiración
useFrame((state) => {
  const breathing = Math.sin(state.clock.elapsedTime * 2) * 0.05;
  meshRef.current.scale.y = 1 + breathing;
});
```

---

### 2. Alerts (Notificaciones de Anomalías)

#### Backend → Frontend

**Backend (AlertService):**
```javascript
// Detecta anomalía
const alert = {
  floorId: 3,
  floorName: "Piso 3",
  timestamp: "2025-11-13T10:35:00Z",
  anomalies: [
    {
      type: "temperature",
      severity: "warning",
      message: "Temperatura alta detectada",
      value: 28.5,
      threshold: 26.0,
      recommendation: "Aumentar ventilación o ajustar aire acondicionado",
      isPredictive: false
    }
  ]
};

// Emite vía WebSocket
io.emit('new-alerts', { alerts: [alert] });
```

**Frontend (useRealTimeData):**
```javascript
socket.on('new-alerts', (data) => {
  // 1️⃣ Normalizar severidad
  const normalizedAlerts = data.alerts.map(alert => ({
    ...alert,
    anomalies: alert.anomalies.map(anomaly => ({
      ...anomaly,
      // Normalizar valores posibles de severidad
      severity: normalizeSeverity(anomaly.severity)
    }))
  }));

  // 2️⃣ Actualizar estado React
  onAlertsUpdate(normalizedAlerts);
});
```

**Visualización (AlertsPanel):**
```jsx
// Renderiza alerta con color por severidad
<AlertItem $severity={anomaly.severity}>
  <SeverityIcon severity={anomaly.severity} />
  <Message>{anomaly.message}</Message>
  <Recommendation>{anomaly.recommendation}</Recommendation>
  {anomaly.isPredictive && <PredictiveBadge>🔮 Predicción</PredictiveBadge>}
</AlertItem>
```

---

### 3. Predictions (Machine Learning)

#### Backend → Frontend

**Backend (PredictionService):**
```javascript
// Genera predicciones cada 60s
const predictions = {
  floorId: 2,
  predictions: [
    {
      minutesAhead: 10,
      temperature: 23.8,
      humidity: 47.5,
      powerConsumption: 83.2,
      occupancy: 70,
      confidence: 0.95
    },
    {
      minutesAhead: 20,
      temperature: 24.1,
      humidity: 48.0,
      powerConsumption: 84.5,
      occupancy: 72,
      confidence: 0.92
    },
    // ... hasta minutesAhead: 60
  ]
};

// Emite vía WebSocket
io.emit('predictions', predictions);
```

**Frontend (PredictionsPanel):**
```jsx
const [predictions, setPredictions] = useState([]);
const [minutesAhead, setMinutesAhead] = useState(30);

// Suscripción WebSocket
useEffect(() => {
  const unsubscribe = subscribeToPredictions((data) => {
    if (data.floorId === floorId) {
      setPredictions(data.predictions);
    }
  });
  return unsubscribe;
}, [floorId]);

// Renderiza predicción seleccionada
const prediction = predictions.find(p => p.minutesAhead === minutesAhead);

return (
  <Panel>
    <TimeSelector value={minutesAhead} onChange={setMinutesAhead} />
    <Metric label="Temperatura" value={prediction.temperature} />
    <Confidence level={prediction.confidence} />
  </Panel>
);
```

---

### 4. History (Datos Históricos para Gráficas)

#### Backend → Frontend (Solo REST, no WebSocket)

**Backend:**
```javascript
// GET /api/v1/floors/:id/history?limit=48
// Retorna últimas 4 horas (1 dato cada 5min)
{
  history: [
    {
      timestamp: "2025-11-13T06:30:00Z",
      temperature: 22.1,
      humidity: 45.0,
      powerConsumption: 75.2
    },
    // ... 48 entradas
  ]
}
```

**Frontend (TrendCharts):**
```jsx
const [history, setHistory] = useState([]);

useEffect(() => {
  fetchFloorHistory(floorId, 48)
    .then(data => setHistory(data.history));
}, [floorId]);

return (
  <LineChart data={history}>
    <Line dataKey="temperature" stroke="#ff6b6b" />
    <Line dataKey="humidity" stroke="#4dabf7" />
    <Line dataKey="powerConsumption" stroke="#ffd966" />
  </LineChart>
);
```

---

## 🔢 Procesamiento de Datos

### Cálculo de Estado (calculateStatus)

**Ubicación:** `src/utils/webSocket.utils.js`

```javascript
export function calculateStatus(floor) {
  const { temperature, humidity, powerConsumption } = floor;

  // Umbrales de temperatura
  const tempStatus =
    temperature < 18 || temperature > 26 ? 'danger' :
    temperature < 20 || temperature > 24 ? 'warning' :
    'normal';

  // Umbrales de humedad
  const humidityStatus =
    humidity < 30 || humidity > 70 ? 'danger' :
    humidity < 35 || humidity > 60 ? 'warning' :
    'normal';

  // Umbrales de consumo
  const powerStatus =
    powerConsumption > 150 ? 'danger' :
    powerConsumption > 135 ? 'warning' :
    'normal';

  // Estado final = el peor de los 3
  if (tempStatus === 'danger' || humidityStatus === 'danger' || powerStatus === 'danger') {
    return 'danger';
  }
  if (tempStatus === 'warning' || humidityStatus === 'warning' || powerStatus === 'warning') {
    return 'warning';
  }
  return 'normal';
}
```

---

### Cálculo de Heat State (calculateHeatState)

```javascript
export function calculateHeatState(floor) {
  const { temperature, powerConsumption } = floor;

  // Estrés térmico = combinación de temp + energía
  const thermalStress = (temperature / 30) + (powerConsumption / 200);

  if (thermalStress > 1.5) return 'critical';
  if (thermalStress > 1.2) return 'high';
  if (thermalStress > 0.8) return 'normal';
  return 'low';
}
```

**Uso en visualización:**
```jsx
// VolumetricFog.jsx
const fogDensity = {
  low: 0.01,
  normal: 0.02,
  high: 0.04,
  critical: 0.07
}[floor.heatState];

<fog attach="fog" density={fogDensity} />
```

---

### Normalización de Severidad (normalizeAlerts)

```javascript
export function normalizeSeverity(severity) {
  const normalized = severity.toLowerCase();
  
  // Mapear variantes a valores estándar
  if (['info', 'informative', 'low'].includes(normalized)) {
    return 'info';
  }
  if (['warning', 'medium', 'warn'].includes(normalized)) {
    return 'warning';
  }
  if (['critical', 'high', 'danger', 'error'].includes(normalized)) {
    return 'critical';
  }
  
  return 'info'; // Fallback
}
```

---

## ⚡ Timeline de Ejecución

### Carga Inicial (0-1 segundo)

```
T=0ms    | Usuario abre http://localhost:5173
         ↓
T=50ms   | React renderiza Layout.jsx
         | useRealTimeData hook ejecuta
         ↓
T=100ms  | Inicia carga REST (parallel)
         | ├─ GET /api/v1/floors
         | └─ GET /api/v1/alerts
         ↓
T=400ms  | Respuestas REST llegan
         | ├─ setFloors(data.floors)
         | └─ setAlerts(data.alerts)
         ↓
T=450ms  | React re-renderiza con datos
         | Usuario ve 5 pisos en 3D 🟢🟢🟡🔴🟢
         ↓
T=500ms  | Conexión WebSocket establecida
         | socket.on('connect') → setIsConnected(true)
         ↓
T=1000ms | ✅ APLICACIÓN LISTA (TTI < 1s)
```

---

### Actualización en Tiempo Real (cada 60s)

```
T=60s    | Backend emite 'floor-data'
         ↓
T=60.05s | Frontend recibe evento
         | socket.on('floor-data', callback)
         ↓
         | Procesamiento:
         | ├─ calculateStatus() para cada piso
         | ├─ calculateHeatState() para cada piso
         | └─ Asignar colores
         ↓
T=60.10s | setFloors(processedData)
         ↓
T=60.15s | React re-renderiza FloorBlocks
         | Piso 3 cambia de 🟡 a 🔴 (transición animada)
         ↓
T=60.20s | ✅ Usuario ve cambio en pantalla
```

---

## 🔒 Manejo de Errores

### Estrategias Implementadas

#### 1. REST API Errors

```javascript
// src/api/rest.js
export async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    
    // Fallback: retornar datos vacíos
    return { floors: [], alerts: [] };
  }
}
```

---

#### 2. WebSocket Disconnection

```javascript
// src/api/socket.js
const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

socket.on('disconnect', () => {
  console.warn('⚠️ WebSocket disconnected');
  onConnectionChange(false);
});

socket.on('reconnect', () => {
  console.log('✅ WebSocket reconnected');
  onConnectionChange(true);
});
```

**UI Feedback:**
```jsx
// Header.jsx
{!isConnected && (
  <ConnectionStatus $connected={false}>
    ⚠️ Desconectado - Reconectando...
  </ConnectionStatus>
)}
```

---

#### 3. Data Validation

```javascript
// Validar estructura de floor antes de usar
function validateFloorData(floor) {
  return (
    typeof floor.floorId === 'number' &&
    typeof floor.temperature === 'number' &&
    typeof floor.humidity === 'number' &&
    typeof floor.powerConsumption === 'number'
  );
}

// En useRealTimeData
const processedFloors = data.floors
  .filter(validateFloorData) // Filtrar datos inválidos
  .map(floor => ({ ...floor, status: calculateStatus(floor) }));
```

---

## 🎯 Optimizaciones de Performance

### 1. Debouncing de Actualizaciones

```javascript
// Evitar re-renders excesivos
import { debounce } from 'lodash';

const debouncedUpdate = debounce((floors) => {
  setFloors(floors);
}, 100);

socket.on('floor-data', (data) => {
  debouncedUpdate(data.floors);
});
```

---

### 2. Memoización de Cálculos Costosos

```javascript
// AlertsPanel.jsx
const filteredAlerts = useMemo(() => {
  return alerts.filter(alert => {
    // Lógica de filtrado compleja
    return matchesFilters(alert, filters);
  });
}, [alerts, filters]); // Solo recalcula si alerts o filters cambian
```

---

### 3. Lazy Loading de Datos Históricos

```javascript
// TrendCharts.jsx — Solo fetch cuando se abre la pared
const [history, setHistory] = useState([]);

useEffect(() => {
  if (isOpen) { // Solo si pared está abierta
    fetchFloorHistory(floorId, 48).then(setHistory);
  }
}, [isOpen, floorId]);
```

---

## 📈 Diagrama de Secuencia Completo

```
Usuario          Frontend           REST API        WebSocket        Backend
  │                 │                  │                │              │
  │─── Abre app ───>│                  │                │              │
  │                 │                  │                │              │
  │                 │─── GET /floors ─>│                │              │
  │                 │─── GET /alerts ─>│                │              │
  │                 │                  │                │              │
  │                 │<─── floors[] ────│                │              │
  │                 │<─── alerts[] ────│                │              │
  │                 │                  │                │              │
  │<─── Muestra UI ─│                  │                │              │
  │    (5 pisos)    │                  │                │              │
  │                 │                  │                │              │
  │                 │─────── Conecta WebSocket ────────>│              │
  │                 │                  │                │              │
  │                 │<────── Connected ─────────────────│              │
  │                 │                  │                │              │
  │                 │                  │                │    [Cada 60s]
  │                 │                  │                │              │
  │                 │                  │                │<─ Simula ────│
  │                 │                  │                │   datos      │
  │                 │                  │                │              │
  │                 │<─── 'floor-data' event ───────────│              │
  │                 │    { floors: [...] }              │              │
  │                 │                  │                │              │
  │                 │─ Procesa datos ─>│                │              │
  │                 │  calculateStatus │                │              │
  │                 │  calculateHeatState               │              │
  │                 │                  │                │              │
  │<─ Actualiza 3D ─│                  │                │              │
  │   (color cambia)│                  │                │              │
  │                 │                  │                │              │
  │─ Click Piso 3 ─>│                  │                │              │
  │                 │                  │                │              │
  │                 │─ GET /floors/3/predictions ──────>│              │
  │                 │                  │                │              │
  │                 │<─ predictions[] ──────────────────│              │
  │                 │                  │                │              │
  │<─ Muestra panel ─│                  │                │              │
  │   predicciones  │                  │                │              │
```

---

<div align="center">

**Pipeline completo de datos en tiempo real**  
SmartFloors AI — Hackathon 2025

[← Volver al README](../README.md) | [Ver Componentes →](./COMPONENTS.md)

</div>
