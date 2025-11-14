# 🧩 Componentes — SmartFloors AI

> **Diagrama detallado de componentes, jerarquía, responsabilidades y flujo de datos**

---

## 📊 Jerarquía Completa de Componentes

```
App.jsx (React Router)
│
├── Layout.jsx ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ LayoutContext
│   │                                      │
│   │  Props:                              │ Provider values:
│   │  - (none)                            │ - alerts: Alert[]
│   │                                      │ - floors: Floor[]
│   │  State:                              │ - isConnected: boolean
│   │  - alerts: Alert[]                   │ - setSidebarOpen: Function
│   │  - floors: Floor[]                   │
│   │  - isSidebarOpen: boolean            │
│   │  - isConnected: boolean              │
│   │                                      │
│   ├─ Header.jsx                          │
│   │   │                                  │
│   │   │  Props:                          │
│   │   │  - (none, usa context)           │
│   │   │                                  │
│   │   ├─ Logo                            │
│   │   ├─ Navigation (Link[])            │
│   │   └─ VisualizationSelector.jsx      │
│   │       Props: { mode, onChange }     │
│   │                                      │
│   ├─ AlertsSidebar.jsx                   │
│   │   │                                  │
│   │   │  Props:                          │
│   │   │  - isOpen: boolean               │
│   │   │  - onClose: Function             │
│   │   │  - alerts: Alert[] (context)     │
│   │   │                                  │
│   │   │  State:                          │
│   │   │  - filters: FilterState          │
│   │   │                                  │
│   │   └─ AlertItem.jsx (x N)            │
│   │       Props: { alert: Alert }       │
│   │                                      │
│   └─ <Outlet context={{ setSidebarOpen }} />
│       │
│       ├─ Home.jsx ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Page
│       │   │
│       │   │  Props: (none)
│       │   │
│       │   │  State:
│       │   │  - selectedFloor: number | null
│       │   │  - visualizationMode: Mode
│       │   │  - cameraTarget: Vector3
│       │   │  - isChartWallOpen: boolean
│       │   │  - isTableWallOpen: boolean
│       │   │
│       │   └─ Dashboard3D.jsx
│       │       │
│       │       │  Props:
│       │       │  - floors: Floor[]
│       │       │  - selectedFloor: number | null
│       │       │  - onFloorClick: Function
│       │       │  - visualizationMode: Mode
│       │       │
│       │       └─ Canvas (React Three Fiber)
│       │           │
│       │           ├─ EffectComposer
│       │           │   ├─ Bloom
│       │           │   └─ Vignette
│       │           │
│       │           ├─ BuildingScene.jsx ━━━━━━━━ 3D Scene
│       │           │   │
│       │           │   │  Props:
│       │           │   │  - floors: Floor[]
│       │           │   │  - selectedFloor: number | null
│       │           │   │  - onFloorClick: Function
│       │           │   │  - visualizationMode: Mode
│       │           │   │
│       │           │   ├─ GradientBackground.jsx
│       │           │   │   Props: { mode: Mode }
│       │           │   │
│       │           │   ├─ FloatingParticles.jsx
│       │           │   │   Props: { count: number }
│       │           │   │
│       │           │   ├─ VolumetricFog.jsx
│       │           │   │   Props: { heatState: string }
│       │           │   │
│       │           │   ├─ Lighting
│       │           │   │   ├─ ambientLight
│       │           │   │   ├─ directionalLight
│       │           │   │   └─ pointLight
│       │           │   │
│       │           │   └─ FloorBlock.jsx (x 5) ━━━━━━━━━ Core 3D
│       │           │       │
│       │           │       │  Props:
│       │           │       │  - floor: Floor
│       │           │       │  - index: number
│       │           │       │  - isSelected: boolean
│       │           │       │  - onClick: Function
│       │           │       │  - visualizationMode: Mode
│       │           │       │
│       │           │       │  Refs:
│       │           │       │  - meshRef: Mesh
│       │           │       │
│       │           │       │  State:
│       │           │       │  - hovered: boolean
│       │           │       │
│       │           │       ├─ <mesh> (geometry + material)
│       │           │       │
│       │           │       └─ {isSelected && (
│       │           │            <>
│       │           │              <FloorInfoPanel />
│       │           │              <PredictionsPanel />
│       │           │            </>
│       │           │          )}
│       │           │
│       │           ├─ InteractiveWall.jsx (right wall)
│       │           │   │
│       │           │   │  Props:
│       │           │   │  - isOpen: boolean
│       │           │   │  - onToggle: Function
│       │           │   │
│       │           │   └─ {isOpen && <TrendCharts />}
│       │           │
│       │           ├─ InteractiveWallLeft.jsx (left wall)
│       │           │   │
│       │           │   │  Props:
│       │           │   │  - isOpen: boolean
│       │           │   │  - onToggle: Function
│       │           │   │
│       │           │   └─ {isOpen && <AlertsTable />}
│       │           │
│       │           ├─ ColorLegend.jsx
│       │           │   Props: { mode: Mode }
│       │           │
│       │           └─ OrbitControls
│       │               Props: { minDistance, maxDistance, ... }
│       │
│       ├─ Analytics.jsx ━━━━━━━━━━━━━━━━━━━━━━━━━ Page (future)
│       │
│       └─ AlertsTableDemo.jsx ━━━━━━━━━━━━━━━━━ Page
│           │
│           │  Props: (none)
│           │
│           │  State:
│           │  - alerts: Alert[]
│           │  - sortBy: string
│           │  - filters: FilterState
│           │
│           └─ AlertsTable.jsx
│               Props: { alerts, sortBy, onSort, filters }
```

---

## 🔑 Componentes Clave

### 1. Layout.jsx (Orquestador Global)

**Responsabilidades:**
- ✅ Gestionar estado global (alerts, floors, conexión)
- ✅ Ejecutar `useRealTimeData` hook (REST + WebSocket)
- ✅ Proveer contexto a toda la app
- ✅ Controlar sidebar de alertas

**Props:** Ninguna

**State:**
```typescript
{
  alerts: Alert[],
  floors: Floor[],
  isSidebarOpen: boolean,
  isConnected: boolean
}
```

**Context Provided:**
```typescript
{
  alerts: Alert[],
  floors: Floor[],
  isConnected: boolean,
  setSidebarOpen: (boolean) => void
}
```

**Hooks usados:**
- `useRealTimeData({ onFloorsUpdate, onAlertsUpdate, onConnectionChange })`

---

### 2. FloorBlock.jsx (Componente 3D Core)

**Responsabilidades:**
- ✅ Renderizar geometría 3D del piso (box)
- ✅ Animar pulso de respiración con `useFrame`
- ✅ Cambiar color según estado (normal/warning/danger)
- ✅ Manejar interacciones (click, hover)
- ✅ Mostrar paneles al seleccionar

**Props:**
```typescript
{
  floor: Floor,           // Datos del piso
  index: number,          // Posición vertical (0-4)
  isSelected: boolean,    // Si está seleccionado
  onClick: Function,      // Handler de click
  visualizationMode: Mode // Modo de visualización actual
}
```

**State:**
```typescript
{
  hovered: boolean        // Estado de hover
}
```

**Refs:**
```typescript
{
  meshRef: THREE.Mesh     // Referencia al mesh 3D
}
```

**Hooks usados:**
- `useFrame((state) => { /* animación */ })`
- `useState(false)` para hover
- `useRef<Mesh>(null)` para mesh

**Ejemplo de uso:**
```jsx
<FloorBlock
  floor={floorData}
  index={0}
  isSelected={selectedFloor === 1}
  onClick={(floor) => setSelectedFloor(floor.floorId)}
  visualizationMode="temperature"
/>
```

---

### 3. PredictionsPanel.jsx (Panel ML)

**Responsabilidades:**
- ✅ Fetch predicciones del backend
- ✅ Suscribirse a actualizaciones WebSocket
- ✅ Selector de horizonte temporal (10-60 min)
- ✅ Mostrar predicciones con nivel de confianza

**Props:**
```typescript
{
  floorId: number         // ID del piso
}
```

**State:**
```typescript
{
  predictions: Prediction[],
  minutesAhead: number,    // 10, 20, 30, 40, 50, 60
  loading: boolean,
  error: Error | null
}
```

**API Calls:**
- `GET /floors/:id/predictions?minutesAhead=60`

**WebSocket Events:**
- `predictions` → Actualiza predictions[]

---

### 4. AlertsPanel.jsx (Sidebar Animado)

**Responsabilidades:**
- ✅ Filtrado multi-dimensional de alertas
- ✅ Animaciones de entrada/salida (Framer Motion)
- ✅ Exportación a CSV
- ✅ Scroll virtual para listas largas

**Props:**
```typescript
{
  alerts: Alert[],        // Desde context
  isOpen: boolean,
  onClose: Function
}
```

**State:**
```typescript
{
  filters: {
    severity: 'all' | 'info' | 'warning' | 'critical',
    floorId: 'all' | number,
    type: 'all' | string,
    isPredictive: 'all' | boolean
  }
}
```

**Hooks usados:**
- `useMemo(() => filteredAlerts, [alerts, filters])`
- `useCallback(exportCSV, [filteredAlerts])`

---

### 5. TrendCharts.jsx (Gráficas Históricas)

**Responsabilidades:**
- ✅ Fetch historial de 4 horas
- ✅ Selector de piso (individual / todos)
- ✅ 3 gráficas: Temperatura, Humedad, Energía
- ✅ Color-coding por piso en modo "Todos"

**Props:**
```typescript
{
  floorId: number | 'all'  // Piso inicial
}
```

**State:**
```typescript
{
  history: HistoryEntry[],
  selectedFloor: number | 'all',
  loading: boolean
}
```

**API Calls:**
- `GET /floors/:id/history?limit=48` (1 dato cada 5min = 4h)

**Componentes usados:**
- `LineChart` (Recharts)
- `CartesianGrid`, `XAxis`, `YAxis`, `Tooltip`, `Line`

---

### 6. BuildingScene.jsx (Escena 3D Completa)

**Responsabilidades:**
- ✅ Orquestar todos los elementos 3D
- ✅ Configurar iluminación
- ✅ Renderizar 5 FloorBlocks
- ✅ Efectos ambientales (partículas, niebla, fondo)

**Props:**
```typescript
{
  floors: Floor[],
  selectedFloor: number | null,
  onFloorClick: Function,
  visualizationMode: Mode
}
```

**Componentes hijos:**
- `GradientBackground`
- `FloatingParticles`
- `VolumetricFog`
- `FloorBlock` (x5)
- Lighting (ambient + directional + point)

---

## 🔄 Flujo de Props

### Ejemplo: Click en Piso

```
1️⃣ Usuario hace click en FloorBlock (Piso 3)
   └─ FloorBlock.jsx: onClick(floor)
      └─ BuildingScene.jsx: onFloorClick(floor)
         └─ Home.jsx: setSelectedFloor(floor.floorId)
            └─ Re-render con selectedFloor = 3
               ├─ BuildingScene recibe selectedFloor={3}
               │  └─ FloorBlock recibe isSelected={true} (solo Piso 3)
               │     └─ Renderiza FloorInfoPanel + PredictionsPanel
               │
               └─ useCameraZoom hook
                  └─ zoomToFloor(3)
                     └─ Cámara se anima hacia Piso 3
```

---

## 📡 Flujo de Datos (Props + Context + WebSocket)

```
┌─────────────────────────────────────────────────────┐
│              BACKEND (WebSocket Event)              │
│           Event: floor-data { floors: [...] }       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│         useRealTimeData Hook (Layout.jsx)           │
│                                                     │
│  socket.on('floor-data', (data) => {                │
│    const processed = data.floors.map(f => ({        │
│      ...f,                                          │
│      status: calculateStatus(f),                    │
│      heatState: calculateHeatState(f),              │
│      color: getColorForState(f.status)              │
│    }));                                             │
│    setFloors(processed);                            │
│  });                                                │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              Layout State Updated                   │
│            floors: Floor[] (con status)             │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│            LayoutContext.Provider                   │
│          value={{ floors, alerts, ... }}            │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              Home.jsx (Consumer)                    │
│    const { floors } = useContext(LayoutContext)     │
│    <Dashboard3D floors={floors} />                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│          BuildingScene.jsx (Prop Drilling)          │
│       {floors.map((floor, i) => (                   │
│         <FloorBlock floor={floor} index={i} />      │
│       ))}                                           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│             FloorBlock.jsx (Render)                 │
│                                                     │
│  <mesh>                                             │
│    <meshStandardMaterial color={floor.color} />    │
│  </mesh>                                            │
│                                                     │
│  // Piso cambia de color en pantalla 🟢 → 🔴       │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Componentes de Estilo

### Styled-components Pattern

Cada componente visual tiene su archivo `.styled.js` correspondiente:

**Ejemplo: AlertsPanel.styled.js**

```javascript
import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Sidebar = styled(motion.div)`
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 400px;
  background: ${({ theme }) => theme.colors.surface};
  backdrop-filter: blur(10px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
`;

export const AlertItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  /* Transient prop con $ prefix */
  border-left: 4px solid ${({ $severity }) =>
    $severity === 'critical' ? '#ff4d4f' :
    $severity === 'warning' ? '#ffd966' :
    '#4dabf7'
  };
`;
```

---

## 🧪 Custom Hooks

### useRealTimeData.js (El más importante)

**Responsabilidades:**
- ✅ Carga inicial con REST
- ✅ Conexión WebSocket
- ✅ Suscripción a eventos
- ✅ Procesamiento de datos (status, heatState)
- ✅ Cleanup al desmontar

**API:**
```typescript
function useRealTimeData({
  onFloorsUpdate: (floors: Floor[]) => void,
  onAlertsUpdate: (alerts: Alert[]) => void,
  onConnectionChange: (isConnected: boolean) => void
}): {
  isLoading: boolean,
  error: Error | null
}
```

**Uso:**
```jsx
// Layout.jsx
const { isLoading, error } = useRealTimeData({
  onFloorsUpdate: setFloors,
  onAlertsUpdate: setAlerts,
  onConnectionChange: setIsConnected
});
```

---

### useCameraZoom.js

**Responsabilidades:**
- ✅ Animar cámara hacia un piso específico
- ✅ Reset a vista general
- ✅ Interpolación suave (lerp)

**API:**
```typescript
function useCameraZoom({ controlsRef }): {
  zoomToFloor: (floorIndex: number) => void,
  resetView: () => void
}
```

---

### useVisualizationMode.js

**Responsabilidades:**
- ✅ Gestionar modo de visualización actual
- ✅ Sincronizar con URL params (opcional)
- ✅ Gradientes de colores por modo

**API:**
```typescript
function useVisualizationMode(): {
  mode: Mode,
  setMode: (mode: Mode) => void,
  getColorGradient: (value: number) => string
}
```

---

## 📦 Componentes Utilitarios

### ColorLegend.jsx

**Props:**
```typescript
{
  mode: Mode  // 'normal' | 'temperature' | 'humidity' | 'energy' | 'occupancy'
}
```

**Renderiza:**
```
Temperatura
────────────
  🔵 <20°C
  🟢 20-24°C
  🟡 24-26°C
  🔴 >26°C
```

---

### SocketDebugger.jsx (Dev Tool)

**Responsabilidades:**
- ✅ Mostrar eventos WebSocket en tiempo real
- ✅ Inspeccionar payloads
- ✅ Ver estado de conexión

**Solo en desarrollo:** `import.meta.env.DEV`

---

## 🎯 Resumen de Responsabilidades

| Componente | Responsabilidad Principal | Tipo |
|------------|--------------------------|------|
| **Layout** | Orquestación global + contexto | Container |
| **FloorBlock** | Visualización 3D individual | Presentational |
| **BuildingScene** | Escena 3D completa | Container |
| **AlertsPanel** | Gestión de alertas | Container |
| **PredictionsPanel** | Predicciones ML | Container |
| **TrendCharts** | Gráficas históricas | Presentational |
| **Header** | Navegación + selector | Presentational |
| **useRealTimeData** | Data fetching + WebSocket | Hook |

---

<div align="center">

**Diagrama de componentes y arquitectura**  
SmartFloors AI — Hackathon 2025

[← Volver al README](../README.md) | [Ver Data Flow →](./DATA_FLOW.md)

</div>
