# SmartFloors API - Integración REST + WebSocket

## 📡 Base URL

```
http://localhost:3000
```

## 🔌 Arquitectura Híbrida

### WebSocket (Socket.IO) - Tiempo Real
- **Propósito**: Actualizaciones en vivo de datos de pisos, alertas y predicciones
- **Eventos**: `floorData`, `new-alerts`, `predictions`
- **Puerto**: 3000

> ⚠️ **Important:** The alert event is named `new-alerts`, not `alert`

### REST API - Consultas On-Demand
- **Propósito**: Consultas históricas, estadísticas, predicciones específicas
- **Versión**: v1
- **Base Path**: `/api/v1`

---

## 🏢 Endpoints de Pisos

### 1. Obtener Todos los Pisos

```http
GET /api/v1/floors
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "data": [
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
    // ... 4 pisos más
  ],
  "count": 5,
  "timestamp": "2025-11-11T23:10:33.577Z"
}
```

**Uso en Frontend:**
```javascript
// Cargar datos iniciales al montar la app
fetch('http://localhost:3000/api/v1/floors')
  .then(res => res.json())
  .then(data => {
    // Inicializar estado con datos reales
    initializeFloorData(data.data);
  });
```

---

### 2. Obtener Piso Específico

```http
GET /api/v1/floors/:id
```

**Parámetros:**
- `id` (path) - Floor ID (1-100)

**Ejemplo:**
```http
GET /api/v1/floors/1
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "data": {
    "buildingId": 1,
    "buildingName": "Edificio Principal",
    "floorId": 1,
    "name": "Piso 1",
    "occupancy": 73,
    "temperature": 22.1,
    "humidity": 38,
    "powerConsumption": 130.7,
    "timestamp": "2025-11-11T23:09:40.991Z"
  }
}
```

**Validaciones:**
- ❌ `400` - ID no numérico
- ❌ `400` - ID < 1
- ❌ `400` - ID > 100
- ❌ `404` - Piso no encontrado

---

### 3. Estadísticas Generales

```http
GET /api/v1/floors/stats
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalFloors": 5,
    "totalOccupancy": 314,
    "averageOccupancy": 62.8,
    "averageTemperature": 22.5,
    "averageHumidity": 42.6,
    "totalPowerConsumption": 625.3,
    "floorsInDanger": 0,
    "floorsInWarning": 1,
    "floorsNormal": 4
  },
  "timestamp": "2025-11-11T23:20:00.000Z"
}
```

**Uso en Frontend:**
```javascript
// Mostrar en dashboard principal
const fetchStats = async () => {
  const response = await fetch('http://localhost:3000/api/v1/floors/stats');
  const { data } = await response.json();
  
  return {
    totalOccupancy: data.totalOccupancy,
    avgTemp: data.averageTemperature,
    totalPower: data.totalPowerConsumption
  };
};
```

---

### 4. Historial de Piso

```http
GET /api/v1/floors/:id/history?limit={limit}
```

**Parámetros:**
- `id` (path) - Floor ID
- `limit` (query) - Número de registros (1-1440, default: 60)

**Ejemplo:**
```http
GET /api/v1/floors/1/history?limit=120
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "data": {
    "floorId": 1,
    "floorName": "Piso 1",
    "history": [
      {
        "occupancy": 73,
        "temperature": 22.1,
        "humidity": 38,
        "powerConsumption": 130.7,
        "timestamp": "2025-11-11T23:09:40.991Z"
      },
      {
        "occupancy": 72,
        "temperature": 22.0,
        "humidity": 39,
        "powerConsumption": 129.5,
        "timestamp": "2025-11-11T23:08:40.991Z"
      }
      // ... más registros históricos
    ],
    "count": 120,
    "period": {
      "start": "2025-11-11T21:09:40.991Z",
      "end": "2025-11-11T23:09:40.991Z"
    }
  }
}
```

**Validaciones:**
- ❌ `400` - limit > 1440 (24 horas de minutos)
- ❌ `400` - limit < 1

**Uso en Frontend:**
```javascript
// Para gráficos de tendencias
const fetchHistory = async (floorId, minutes = 60) => {
  const url = `http://localhost:3000/api/v1/floors/${floorId}/history?limit=${minutes}`;
  const response = await fetch(url);
  const { data } = await response.json();
  
  // Formatear para Chart.js
  return data.history.map(record => ({
    x: new Date(record.timestamp),
    y: record.temperature
  }));
};
```

---

### 5. Predicciones de Piso

```http
GET /api/v1/floors/:id/predictions?minutesAhead={minutes}
```

**Parámetros:**
- `id` (path) - Floor ID
- `minutesAhead` (query) - Minutos a predecir (10-180, default: 60)

**Ejemplo:**
```http
GET /api/v1/floors/1/predictions?minutesAhead=60
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "data": {
    "floorId": 1,
    "floorName": "Piso 1",
    "predictions": {
      "occupancy": {
        "predictions": [
          { "minutesAhead": 10, "occupancy": 62, "timestamp": "2025-11-11T23:25:00.000Z" },
          { "minutesAhead": 20, "occupancy": 61, "timestamp": "2025-11-11T23:35:00.000Z" },
          { "minutesAhead": 30, "occupancy": 60, "timestamp": "2025-11-11T23:45:00.000Z" },
          { "minutesAhead": 40, "occupancy": 59, "timestamp": "2025-11-11T23:55:00.000Z" },
          { "minutesAhead": 50, "occupancy": 58, "timestamp": "2025-11-12T00:05:00.000Z" },
          { "minutesAhead": 60, "occupancy": 57, "timestamp": "2025-11-12T00:15:00.000Z" }
        ],
        "method": "hybrid",
        "confidence": 0.91,
        "currentValue": 51,
        "predictedValue": 57,
        "trend": "up"
      },
      "temperature": {
        "predictions": [
          { "minutesAhead": 10, "temperature": 22.6, "timestamp": "2025-11-11T23:25:00.000Z" },
          { "minutesAhead": 20, "temperature": 22.7, "timestamp": "2025-11-11T23:35:00.000Z" },
          { "minutesAhead": 30, "temperature": 22.7, "timestamp": "2025-11-11T23:45:00.000Z" },
          { "minutesAhead": 40, "temperature": 22.7, "timestamp": "2025-11-11T23:55:00.000Z" },
          { "minutesAhead": 50, "temperature": 22.7, "timestamp": "2025-11-12T00:05:00.000Z" },
          { "minutesAhead": 60, "temperature": 22.7, "timestamp": "2025-11-12T00:15:00.000Z" }
        ],
        "method": "hybrid",
        "confidence": 0.91,
        "currentValue": 23.6,
        "predictedValue": 22.7,
        "trend": "down"
      },
      "humidity": {
        "predictions": [
          { "minutesAhead": 10, "humidity": 46, "timestamp": "2025-11-11T23:25:00.000Z" },
          { "minutesAhead": 20, "humidity": 47, "timestamp": "2025-11-11T23:35:00.000Z" },
          { "minutesAhead": 30, "humidity": 49, "timestamp": "2025-11-11T23:45:00.000Z" },
          { "minutesAhead": 40, "humidity": 51, "timestamp": "2025-11-11T23:55:00.000Z" },
          { "minutesAhead": 50, "humidity": 53, "timestamp": "2025-11-12T00:05:00.000Z" },
          { "minutesAhead": 60, "humidity": 54, "timestamp": "2025-11-12T00:15:00.000Z" }
        ],
        "method": "hybrid",
        "confidence": 0.91,
        "currentValue": 45,
        "predictedValue": 54,
        "trend": "up"
      },
      "powerConsumption": {
        "predictions": [
          { "minutesAhead": 10, "powerConsumption": 123.25, "timestamp": "2025-11-11T23:25:00.000Z" },
          { "minutesAhead": 20, "powerConsumption": 123.46, "timestamp": "2025-11-11T23:35:00.000Z" },
          { "minutesAhead": 30, "powerConsumption": 123.63, "timestamp": "2025-11-11T23:45:00.000Z" },
          { "minutesAhead": 40, "powerConsumption": 123.75, "timestamp": "2025-11-11T23:55:00.000Z" },
          { "minutesAhead": 50, "powerConsumption": 123.81, "timestamp": "2025-11-12T00:05:00.000Z" },
          { "minutesAhead": 60, "powerConsumption": 123.84, "timestamp": "2025-11-12T00:15:00.000Z" }
        ],
        "method": "hybrid",
        "confidence": 0.91,
        "currentValue": 122.7,
        "predictedValue": 123.84,
        "trend": "up"
      }
    },
    "generatedAt": "2025-11-11T23:15:41.000Z"
  }
}
```

**Validaciones:**
- ❌ `400` - minutesAhead < 10
- ❌ `400` - minutesAhead > 180

**Campos de Predicción:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `predictions` | array | Array con 6 predicciones (10, 20, 30, 40, 50, 60 min) |
| `method` | string | Método ML usado: "hybrid", "arima", "lstm" |
| `confidence` | number | Nivel de confianza (0-1) |
| `currentValue` | number | Valor actual de la métrica |
| `predictedValue` | number | Valor predicho (60 min) |
| `trend` | string | Tendencia: "up", "down", "stable" |

---

## 🚨 Endpoints de Alertas

### 6. Obtener Todas las Alertas

```http
GET /api/v1/alerts
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "alert_1731366540991",
        "floorId": 3,
        "floorName": "Piso 3",
        "type": "temperature",
        "severity": "warning",
        "message": "Temperatura elevada detectada",
        "value": 25.2,
        "threshold": 24.0,
        "timestamp": "2025-11-11T23:15:40.991Z",
        "acknowledged": false
      },
      {
        "id": "alert_1731366420500",
        "floorId": 5,
        "floorName": "Piso 5",
        "type": "powerConsumption",
        "severity": "danger",
        "message": "Consumo de energía crítico",
        "value": 152.3,
        "threshold": 150.0,
        "timestamp": "2025-11-11T23:13:40.500Z",
        "acknowledged": false
      }
    ],
    "count": 2,
    "activeAlerts": 2,
    "acknowledgedAlerts": 0
  }
}
```

**Tipos de Alertas:**
- `temperature` - Temperatura fuera de rango
- `humidity` - Humedad fuera de rango
- `powerConsumption` - Consumo alto
- `occupancy` - Ocupación alta
- `anomaly` - Anomalía detectada por ML

**Severidad:**
- `normal` - Información
- `warning` - Advertencia (requiere atención)
- `danger` - Crítico (requiere acción inmediata)

---

## ✅ Health Check

### 7. Verificar Estado del Servidor

```http
GET /health
```

**Respuesta (200 OK):**
```json
{
  "status": "OK",
  "timestamp": "2025-11-11T23:30:00.000Z",
  "uptime": 3600,
  "services": {
    "database": "connected",
    "socketio": "active",
    "mlService": "ready"
  }
}
```

---

## 🧪 Testing con Postman

### Importar Colección

1. Abrir Postman
2. Click en **Import**
3. Arrastrar `SmartFloors.postman_collection.json`
4. La colección incluye:
   - ✅ Tests automatizados
   - 📝 Documentación de cada endpoint
   - 🔧 Variables de entorno (`base_url`, `api_version`)

### Ejecutar Tests

```bash
# Instalar Newman (Postman CLI)
npm install -g newman

# Ejecutar colección
newman run SmartFloors.postman_collection.json
```

---

## 🔄 Estrategia de Integración Frontend

### Cargar Datos Iniciales (REST API)

```javascript
// src/api/rest.js
const BASE_URL = 'http://localhost:3000/api/v1';

export const fetchAllFloors = async () => {
  const response = await fetch(`${BASE_URL}/floors`);
  const { data } = await response.json();
  return data;
};

export const fetchFloorHistory = async (floorId, limit = 60) => {
  const response = await fetch(`${BASE_URL}/floors/${floorId}/history?limit=${limit}`);
  const { data } = await response.json();
  return data.history;
};

export const fetchFloorPredictions = async (floorId, minutesAhead = 60) => {
  const response = await fetch(`${BASE_URL}/floors/${floorId}/predictions?minutesAhead=${minutesAhead}`);
  const { data } = await response.json();
  return data.predictions;
};

export const fetchStats = async () => {
  const response = await fetch(`${BASE_URL}/floors/stats`);
  const { data } = await response.json();
  return data;
};

export const fetchAlerts = async () => {
  const response = await fetch(`${BASE_URL}/alerts`);
  const { data } = await response.json();
  return data.alerts;
};
```

### Actualizaciones en Tiempo Real (WebSocket)

```javascript
// src/hooks/useRealTimeData.js

// Cargar datos iniciales con REST
useEffect(() => {
  const loadInitialData = async () => {
    try {
      const floors = await fetchAllFloors();
      const alerts = await fetchAlerts();
      
      // Inicializar estado con datos reales
      setFloorData(processFloors(floors));
      setAlerts(alerts);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };
  
  loadInitialData();
}, []);

// Actualizar con WebSocket
useEffect(() => {
  subscribeToFloorData(handleFloorData);
  subscribeToAlerts(handleAlert);
  subscribeToPredictions(handlePredictions);
  
  return () => disconnectSocket();
}, []);
```

---

## 📊 Casos de Uso

### 1. Dashboard Principal

**Cargar al Inicio:**
```javascript
// GET /api/v1/floors → Cargar 5 pisos
// GET /api/v1/floors/stats → Mostrar estadísticas
// GET /api/v1/alerts → Cargar alertas activas
// WebSocket: Escuchar actualizaciones en vivo
```

### 2. Vista de Piso Individual

**On Hover/Click:**
```javascript
// GET /api/v1/floors/:id → Datos actuales
// GET /api/v1/floors/:id/predictions?minutesAhead=60 → Predicciones
// Mostrar en PredictionsPanel
```

### 3. Análisis Histórico

**Gráfico de Temperatura:**
```javascript
// GET /api/v1/floors/1/history?limit=120 → Últimas 2 horas
// Renderizar con Chart.js o Recharts
```

### 4. Predicciones Detalladas

**Seleccionar Intervalo:**
```javascript
// Usuario selecciona "+30 min"
// Mostrar prediction con minutesAhead: 30
// Del array de predictions ya cargado
```

---

## ⚠️ Manejo de Errores

### Códigos de Estado

| Código | Descripción | Acción Frontend |
|--------|-------------|-----------------|
| `200` | Éxito | Procesar datos |
| `400` | Validación fallida | Mostrar mensaje de error |
| `404` | No encontrado | Mostrar "Piso no encontrado" |
| `500` | Error del servidor | Reintentar después de 5s |

### Ejemplo de Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El ID del piso debe ser un número mayor a 0 y menor a 100",
    "details": {
      "field": "floorId",
      "value": "abc",
      "constraint": "must be a number"
    }
  }
}
```

### Manejo en Frontend

```javascript
const fetchFloor = async (floorId) => {
  try {
    const response = await fetch(`${BASE_URL}/floors/${floorId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }
    
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching floor:', error.message);
    // Mostrar notificación al usuario
    showErrorToast(error.message);
  }
};
```

---

## 🔐 CORS Configuration

El backend debe permitir:

```javascript
// Backend: server.js
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
```

---

## 📝 Checklist de Integración

- [ ] Crear `src/api/rest.js` con funciones REST
- [ ] Actualizar `useRealTimeData` para cargar datos iniciales con REST
- [ ] Agregar manejo de errores con try/catch
- [ ] Mostrar loading state mientras carga datos iniciales
- [ ] Implementar fallback si WebSocket falla (usar polling REST)
- [ ] Agregar botón "Recargar" para forzar refresh con REST API
- [ ] Implementar caché de predicciones (evitar llamadas duplicadas)
- [ ] Agregar gráficos históricos con `/history` endpoint
- [ ] Implementar sistema de notificaciones para alertas
- [ ] Testing con Postman collection

---

## 🚀 Próximos Pasos

1. **Crear cliente REST** (`src/api/rest.js`)
2. **Actualizar useRealTimeData** para híbrido REST + WebSocket
3. **Agregar componente HistoryChart** usando `/history`
4. **Implementar AlertsManager** usando `/alerts`
5. **Testing completo** con Postman + Frontend
