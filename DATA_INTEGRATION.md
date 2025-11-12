# Integración de Datos - SmartFloors AI

## 📡 Arquitectura de Datos

### Flujo Híbrido: REST + WebSocket

```
Inicio de App
    ↓
REST API: GET /api/v1/floors (carga inicial)
REST API: GET /api/v1/alerts (alertas iniciales)
    ↓
Renderiza Dashboard con datos reales
    ↓
WebSocket: Conecta a http://localhost:3000
    ↓
Escucha eventos en tiempo real:
  - floorData (actualización de métricas)
  - alert (nuevas alertas)
  - predictions (nuevas predicciones ML)
```

## 📡 Estructura de Datos del Backend

### REST: `GET /api/v1/floors`

Respuesta del backend:
Respuesta del backend:
```json
{
  "success": true,
  "data": [
    {
      "buildingId": 1,
      "buildingName": "Edificio Principal",
      "floorId": 1,
      "name": "Piso 1",
      "occupancy": 64,
      "temperature": 23.5,
      "humidity": 34,
      "powerConsumption": 129,
      "timestamp": "2025-11-11T23:38:41.008Z"
    }
    // ... 4 pisos más (total: 5)
  ],
  "timestamp": "2025-11-11T23:39:31.957Z"
}
```

### WebSocket: Evento `floorData`

Estructura en tiempo real (igual formato):
```json
{
  "floors": [
    {
      "buildingId": 1,
      "buildingName": "Edificio Principal",
      "floorId": 1,
      "name": "Piso 1",
      "occupancy": 73,
      "temperature": 22.1,
      "humidity": 38,
      "powerConsumption": 130.7,
      "timestamp": "2025-11-11T23:09:40.991Z"
    },
    {
      "buildingId": 1,
      "buildingName": "Edificio Principal",
      "floorId": 2,
      "name": "Piso 2",
      "occupancy": 57,
      "temperature": 22.6,
      "humidity": 43,
      "powerConsumption": 123.7,
      "timestamp": "2025-11-11T23:09:40.991Z"
    }
    // ... hasta floorId: 5
  ],
  "timestamp": "2025-11-11T23:10:33.577Z"
}
```

### Campos por Piso

| Campo              | Tipo   | Descripción             | Unidad    |
| ------------------ | ------ | ----------------------- | --------- |
| `buildingId`       | number | ID del edificio         | -         |
| `buildingName`     | string | Nombre del edificio     | -         |
| `floorId`          | number | ID único del piso (1-5) | -         |
| `name`             | string | Nombre del piso         | -         |
| `occupancy`        | number | Nivel de ocupación      | % (0-100) |
| `temperature`      | number | Temperatura ambiente    | °C        |
| `humidity`         | number | Nivel de humedad        | % (0-100) |
| `powerConsumption` | number | Consumo de energía      | kW        |
| `timestamp`        | string | Timestamp ISO 8601      | -         |

## 🎨 Lógica de Estados

El frontend calcula automáticamente el estado de cada piso basado en las métricas:

### Estado: `danger` (🔴 Rojo - #ff4d4f)

```javascript
temperature > 26°C || temperature < 18°C
humidity > 70% || humidity < 30%
powerConsumption > 150 kW
```

### Estado: `warning` (🟡 Amarillo - #ffd966)

```javascript
temperature > 24°C || temperature < 20°C
humidity > 60% || humidity < 35%
powerConsumption > 135 kW
```

### Estado: `normal` (🟢 Verde - #00ff88)

Cualquier valor que no cumpla las condiciones anteriores.

## 🔄 Procesamiento de Datos

### Hook: `useRealTimeData.js`

```javascript
// Recibe datos del backend
handleFloorData({
  floors: [...],
  timestamp: "..."
});

// Procesa y calcula estados
floors.forEach((floor) => {
  const status = getFloorStatus(floor);
  updatedFloors[floor.floorId] = {
    ...floor,
    status // ← Estado calculado
  };
});

// Actualiza estado React
setFloorData(updatedFloors);
```

### Estructura Interna

```javascript
// Estado interno de floorData
{
  1: { floorId: 1, name: "Piso 1", temperature: 22.1, ..., status: "normal" },
  2: { floorId: 2, name: "Piso 2", temperature: 22.6, ..., status: "normal" },
  3: { floorId: 3, name: "Piso 3", temperature: 24.0, ..., status: "warning" },
  4: { floorId: 4, name: "Piso 4", temperature: 23.5, ..., status: "normal" },
  5: { floorId: 5, name: "Piso 5", temperature: 23.2, ..., status: "normal" }
}
```

## 🚨 Alertas

### REST: `GET /api/v1/alerts`

**Estructura Real del Backend:**

```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "floorId": 4,
        "floorName": "Piso 4",
        "anomalies": [
          {
            "type": "humidity",
            "severity": "critical",
            "metric": "Humedad",
            "value": 70,
            "message": "Humedad muy alta: 70%",
            "recommendation": "Activar deshumidificadores en Piso 4 de inmediato...",
            "timestamp": "2025-11-11T22:56:41.009Z"
          }
        ],
        "timestamp": "2025-11-11T22:56:41.009Z",
        "severity": "critical"
      }
    ],
    "count": 28
  }
}
```

### WebSocket: Evento `alert`

**Estructura en Tiempo Real:**

```json
{
  "floorId": 3,
  "floorName": "Piso 3",
  "anomalies": [
    {
      "type": "temperature",
      "severity": "warning",
      "metric": "Temperatura",
      "value": 25.2,
      "message": "Temperatura elevada: 25.2°C",
      "recommendation": "Ajustar sistema de climatización...",
      "timestamp": "2025-11-11T23:15:00.000Z"
    }
  ],
  "timestamp": "2025-11-11T23:15:00.000Z",
  "severity": "warning"
}
```

**Nota Importante:** El backend envía alertas con array `anomalies`. El frontend procesa cada anomalía como una alerta individual.

### Procesamiento de Alertas en Frontend

```javascript
// En useRealTimeData.js
const handleAlert = useCallback((alertData) => {
  // Procesar array de anomalies
  if (alertData.anomalies && Array.isArray(alertData.anomalies)) {
    const newAlerts = alertData.anomalies.map((anomaly, index) => ({
      id: `${alertData.floorId}_${alertData.timestamp}_${index}`,
      floorId: alertData.floorId,
      floorName: alertData.floorName,
      type: anomaly.type,
      severity: anomaly.severity,
      message: anomaly.message,
      value: anomaly.value,
      recommendation: anomaly.recommendation,
      timestamp: anomaly.timestamp || alertData.timestamp
    }));

    setAlerts((prev) => [...newAlerts, ...prev].slice(0, 10));
  }
}, []);
```

### Campos de Anomalía

| Campo            | Tipo   | Descripción                                       |
| ---------------- | ------ | ------------------------------------------------- |
| `type`           | string | Tipo de anomalía (humidity, temperature, power)   |
| `severity`       | string | Severidad (critical, warning)                     |
| `metric`         | string | Nombre del métrico en español                     |
| `value`          | number | Valor que generó la anomalía                      |
| `message`        | string | Mensaje descriptivo                               |
| `recommendation` | string | Recomendación de acción (español)                 |
| `timestamp`      | string | Timestamp ISO 8601                                |

## 🔌 Configuración WebSocket

### Frontend (Socket.IO Client)

```javascript
// src/api/socket.js
const SOCKET_URL = 'http://localhost:3000';
const socket = io(SOCKET_URL);

// Suscribirse a eventos
socket.on('floorData', (data) => {
  // Procesar { floors: [...], timestamp: "..." }
});

socket.on('alert', (alert) => {
  // Procesar alerta individual
});
```

### Backend Esperado (Socket.IO Server)

```javascript
// Ejemplo de emisión desde el backend
io.emit('floorData', {
  floors: [
    /* array de 5 pisos */
  ],
  timestamp: new Date().toISOString()
});

// Emitir alerta individual
io.emit('alert', {
  floorId: 3,
  message: 'Temperatura alta',
  severity: 'warning',
  timestamp: new Date().toISOString()
});
```

## 📊 Visualización 3D

### Configuración de Pisos

```javascript
// src/scenes/BuildingScene.jsx

// 5 pisos apilados verticalmente
const getFloorPosition = (floorNumber) => {
  return (floorNumber - 3) * 1.2; // Centrado verticalmente
};

// Renderizado dinámico
Object.values(floorData).map((floor) => (
  <FloorBlock key={floor.floorId} data={floor} position={getFloorPosition(floor.floorId)} />
));
```

### Animaciones

- **Estado Normal**: Emissive intensity estática (0.2)
- **Estado Warning/Danger**: Animación de "respiración"
  - Pulsación de intensidad (0.4 - 1.0)
  - Escalado sutil (0.98 - 1.02)

## 🧪 Testing con Datos Mock

Para probar sin backend, puedes emitir eventos manualmente desde la consola del navegador:

```javascript
// Abrir DevTools > Console
const { getSocket } = await import('/src/api/socket.js');
const socket = getSocket();

// Emitir datos de prueba
socket.emit('floorData', {
  floors: [
    {
      floorId: 1,
      name: 'Piso 1',
      temperature: 28, // ← Danger!
      humidity: 45,
      powerConsumption: 125,
      occupancy: 70
    }
    // ... más pisos
  ],
  timestamp: new Date().toISOString()
});
```

## 🐛 Debugging

Usa el componente `<SocketDebugger />` para ver:

- ✅ Estado de conexión
- 📡 Todos los eventos entrantes
- 📊 Datos de cada evento
- ⏰ Timestamps

Ver logs detallados en consola del navegador con emojis para fácil identificación.

## 📝 Notas Importantes

1. **Timestamps**: Todos los timestamps deben estar en formato ISO 8601
2. **IDs**: Los `floorId` deben ser únicos (1-5)
3. **Unidades**: Respetar unidades (°C, %, kW)
4. **Estados**: Se calculan automáticamente en el frontend
5. **CORS**: Asegurarse de configurar CORS en el backend para `http://localhost:5173`

## 🔮 Predicciones (Nuevo)

### Evento: `predictions`

El backend envía predicciones de todas las métricas para todos los pisos:

```json
{
  "predictions": [
    {
      "floorId": 1,
      "predictions": {
        "occupancy": {
          "predictions": [
            { "minutesAhead": 10, "occupancy": 62, "timestamp": "..." },
            { "minutesAhead": 20, "occupancy": 61, "timestamp": "..." },
            // ... hasta 60 minutos
          ],
          "method": "hybrid",
          "confidence": 0.91,
          "currentValue": 51,
          "predictedValue": 57
        },
        "temperature": { /* mismo formato */ },
        "humidity": { /* mismo formato */ },
        "powerConsumption": { /* mismo formato */ },
        "timestamp": "2025-11-11T23:15:41.000Z"
      }
    }
    // ... más pisos
  ],
  "timestamp": "2025-11-11T23:15:41.002Z"
}
```

### Campos de Predicción

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `floorId` | number | ID del piso (1-5) |
| `predictions.{metric}.predictions` | array | Array de predicciones temporales |
| `minutesAhead` | number | Minutos en el futuro (10, 20, 30, 40, 50, 60) |
| `method` | string | Método de predicción ("hybrid", "arima", "lstm") |
| `confidence` | number | Nivel de confianza (0-1) |
| `currentValue` | number | Valor actual de la métrica |
| `predictedValue` | number | Valor predicho (60 min) |

### Métricas Predecidas

- `occupancy`: Nivel de ocupación (%)
- `temperature`: Temperatura (°C)
- `humidity`: Humedad (%)
- `powerConsumption`: Consumo de energía (kW)

### Procesamiento en Frontend

```javascript
// src/hooks/useRealTimeData.js
handlePredictions({
  predictions: [...]
});

// Estructura interna
{
  1: { // floorId
    occupancy: { predictions: [...], confidence: 0.91, ... },
    temperature: { predictions: [...], confidence: 0.91, ... },
    humidity: { predictions: [...], confidence: 0.91, ... },
    powerConsumption: { predictions: [...], confidence: 0.91, ... }
  },
  2: { /* mismo formato */ }
  // ... más pisos
}
```

### Componente: `PredictionsPanel`

Muestra predicciones del piso seleccionado con:

- ✅ Selector de intervalo temporal (10-60 min)
- 📊 Valor actual vs predicho
- 📈 Tendencia (↑ subida, ↓ bajada, → estable)
- 🎯 Nivel de confianza con código de colores:
  - Verde (≥90%): Alta confianza
  - Amarillo (70-89%): Confianza media
  - Rojo (<70%): Baja confianza
- 🔧 Método de predicción usado

## 🔄 Flujo Completo

```
Backend → Socket.IO → Frontend
   ↓
Emite 'floorData'
   ↓
useRealTimeData hook
   ↓
Calcula estados (normal/warning/danger)
   ↓
Actualiza React state
   ↓
Re-renderiza componentes 3D
   ↓
Animaciones según estado
```
