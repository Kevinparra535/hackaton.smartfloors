# SmartFloors AI - Predicciones & IA

## 🔮 Sistema de Predicciones Integrado

### Características Implementadas

#### 1. **Panel de Predicciones Interactivo**
- ✅ Selector de intervalo temporal (10, 20, 30, 40, 50, 60 minutos)
- ✅ Visualización de 4 métricas:
  - 🌡️ Temperatura
  - 💧 Humedad
  - ⚡ Consumo de energía
  - 👥 Ocupación
- ✅ Comparación actual vs predicho
- ✅ Indicadores de tendencia (↑ ↓ →)
- ✅ Nivel de confianza con código de colores

#### 2. **Integración WebSocket**
- ✅ Evento `predictions` suscrito automáticamente
- ✅ Procesamiento de predicciones para 5 pisos
- ✅ Actualización en tiempo real
- ✅ Debugging completo con logs

#### 3. **Visualización de Datos**

```
┌─────────────────────────────────────────┐
│  🔮 Predicciones - Piso 1              │
├─────────────────────────────────────────┤
│ [+10] [+20] [+30] [+40] [+50] [+60]    │
├─────────────────────────────────────────┤
│ 🌡️ Temperatura    91% confianza        │
│ Actual:      23.6°C                     │
│ Predicción:  22.7°C ↓                   │
│ Método:      hybrid                     │
├─────────────────────────────────────────┤
│ 💧 Humedad        91% confianza        │
│ Actual:      45%                        │
│ Predicción:  54% ↑                      │
│ Método:      hybrid                     │
├─────────────────────────────────────────┤
│ ⚡ Consumo        91% confianza         │
│ Actual:      122.7 kW                   │
│ Predicción:  123.84 kW ↑                │
│ Método:      hybrid                     │
├─────────────────────────────────────────┤
│ 👥 Ocupación      91% confianza        │
│ Actual:      51%                        │
│ Predicción:  58% ↑                      │
│ Método:      hybrid                     │
└─────────────────────────────────────────┘
```

## 📊 Estructura de Datos

### Entrada (Backend)
```javascript
{
  "predictions": [
    {
      "floorId": 1,
      "predictions": {
        "temperature": {
          "predictions": [
            { "minutesAhead": 10, "temperature": 22.6, "timestamp": "..." },
            { "minutesAhead": 20, "temperature": 22.7, "timestamp": "..." },
            // ... hasta 60 minutos
          ],
          "method": "hybrid",
          "confidence": 0.91,
          "currentValue": 23.6
        },
        // ... otras métricas
      }
    }
    // ... otros pisos
  ]
}
```

### Estado (Frontend)
```javascript
predictions = {
  1: {  // floorId
    temperature: {
      predictions: [...],
      confidence: 0.91,
      currentValue: 23.6,
      method: "hybrid"
    },
    humidity: { ... },
    powerConsumption: { ... },
    occupancy: { ... }
  },
  2: { ... },
  // ... más pisos
}
```

## 🎨 Código de Colores - Confianza

| Nivel | Color | Rango | Descripción |
|-------|-------|-------|-------------|
| Alta | 🟢 Verde (#00ff88) | ≥ 90% | Predicción muy confiable |
| Media | 🟡 Amarillo (#ffd966) | 70-89% | Predicción moderada |
| Baja | 🔴 Rojo (#ff4d4f) | < 70% | Predicción menos confiable |

## 📈 Indicadores de Tendencia

| Símbolo | Color | Descripción |
|---------|-------|-------------|
| ↑ | 🔴 Rojo | Valor aumentará (puede indicar problema) |
| ↓ | 🟢 Verde | Valor disminuirá (mejora esperada) |
| → | 🟡 Amarillo | Valor estable (sin cambios significativos) |

## 🔧 Métodos de Predicción

- **hybrid**: Combinación de modelos (ARIMA + LSTM)
- **arima**: Análisis de series temporales
- **lstm**: Red neuronal recurrente

## 🚀 Uso en Desarrollo

### Abrir Dashboard
```bash
npm run dev
# Abrir http://localhost:5173
```

### Ver Predicciones
1. **Hover** sobre cualquier piso en la visualización 3D
2. El panel de **Predicciones** se actualiza automáticamente
3. Selecciona un **intervalo temporal** (+10 min, +20 min, etc.)
4. Revisa las **métricas predichas** y tendencias

### Debugging
```javascript
// Consola del navegador
// Verás logs como:
🔮 [Predictions Received] { predictions: [...] }
🔮 Processing predictions: { predictions: [...] }
```

## 📦 Componentes Nuevos

### `PredictionsPanel.jsx`
- **Ubicación**: `src/components/PredictionsPanel.jsx`
- **Props**:
  - `predictions`: Objeto con predicciones del piso
  - `floorName`: Nombre del piso a mostrar
- **Características**:
  - Selector de tiempo interactivo
  - Animaciones con Framer Motion
  - Cálculo automático de tendencias
  - Responsive y scrollable

### Hook Actualizado: `useRealTimeData.js`
- **Nuevo estado**: `predictions`
- **Nueva suscripción**: `subscribeToPredictions`
- **Procesamiento automático** de datos de predicción

### API Actualizada: `socket.js`
- **Nueva función**: `subscribeToPredictions(callback)`
- **Evento escuchado**: `predictions`
- **Logs de debug** incluidos

## 🧪 Testing de Predicciones

### Emitir Predicciones Mock (Consola del Navegador)

```javascript
const socket = window.io('http://localhost:3000');

socket.emit('predictions', {
  predictions: [
    {
      floorId: 1,
      predictions: {
        temperature: {
          predictions: [
            { minutesAhead: 10, temperature: 28.0, timestamp: new Date(Date.now() + 10*60000).toISOString() },
            { minutesAhead: 20, temperature: 29.0, timestamp: new Date(Date.now() + 20*60000).toISOString() },
            { minutesAhead: 30, temperature: 30.0, timestamp: new Date(Date.now() + 30*60000).toISOString() },
            { minutesAhead: 40, temperature: 30.5, timestamp: new Date(Date.now() + 40*60000).toISOString() },
            { minutesAhead: 50, temperature: 31.0, timestamp: new Date(Date.now() + 50*60000).toISOString() },
            { minutesAhead: 60, temperature: 31.5, timestamp: new Date(Date.now() + 60*60000).toISOString() }
          ],
          method: "hybrid",
          confidence: 0.95,
          currentValue: 27.0
        },
        occupancy: {
          predictions: [
            { minutesAhead: 10, occupancy: 75, timestamp: new Date(Date.now() + 10*60000).toISOString() },
            { minutesAhead: 20, occupancy: 80, timestamp: new Date(Date.now() + 20*60000).toISOString() },
            { minutesAhead: 30, occupancy: 82, timestamp: new Date(Date.now() + 30*60000).toISOString() },
            { minutesAhead: 40, occupancy: 83, timestamp: new Date(Date.now() + 40*60000).toISOString() },
            { minutesAhead: 50, occupancy: 84, timestamp: new Date(Date.now() + 50*60000).toISOString() },
            { minutesAhead: 60, occupancy: 85, timestamp: new Date(Date.now() + 60*60000).toISOString() }
          ],
          method: "hybrid",
          confidence: 0.88,
          currentValue: 70
        }
      }
    }
  ],
  timestamp: new Date().toISOString()
});
```

## 🎯 Casos de Uso

### 1. Detección Temprana de Problemas
- Predicción muestra temperatura > 26°C en 30 min
- Sistema puede **alertar proactivamente**
- Permite **acción preventiva**

### 2. Optimización Energética
- Predicción muestra consumo alto próximamente
- Ajustar sistemas **antes** del pico
- Reducir costos operacionales

### 3. Gestión de Ocupación
- Predicción de alta ocupación
- Preparar recursos adicionales
- Mejorar confort de usuarios

## 🔄 Flujo Completo con Predicciones

```
Backend ML Model → Genera Predicciones
       ↓
Socket.IO emit('predictions')
       ↓
Frontend WebSocket recibe
       ↓
useRealTimeData procesa
       ↓
setPredictions actualiza estado
       ↓
PredictionsPanel re-renderiza
       ↓
Usuario ve predicciones
       ↓
Selecciona intervalo temporal
       ↓
Ve tendencias y valores futuros
```

## 📝 Checklist de Integración

- [x] Hook `useRealTimeData` actualizado con predicciones
- [x] API `socket.js` con suscripción a `predictions`
- [x] Componente `PredictionsPanel` creado
- [x] Integración en `App.jsx`
- [x] Debugging en `SocketDebugger`
- [x] Documentación en `DATA_INTEGRATION.md`
- [x] Linting y formateo pasando
- [x] Código de colores para confianza
- [x] Indicadores de tendencia
- [x] Selector de tiempo interactivo
- [x] Animaciones con Framer Motion

## 🎉 Resultado

El dashboard ahora muestra predicciones inteligentes basadas en IA que permiten:

1. **Anticipar problemas** antes de que ocurran
2. **Optimizar recursos** proactivamente
3. **Visualizar tendencias** futuras
4. **Tomar decisiones informadas** con datos predictivos

¡Todo con una interfaz visual moderna e interactiva! 🚀
