# AlertsTable Component

## 📊 Descripción

Componente de tabla interactiva para visualizar alertas del sistema SmartFloors con las siguientes columnas:

1. **Timestamp** - Fecha y hora de la alerta
2. **Piso** - Número y nombre del piso
3. **Variable** - Tipo de métrica (temperatura, humedad, energía, riesgo combinado)
4. **Nivel** - Severidad (Informativa / Media / Crítica)
5. **Recomendación** - Mensaje de acción sugerida

## ✨ Características

- ✅ **Ordenamiento dinámico** - Click en headers para ordenar por cualquier columna
- ✅ **Alertas predictivas** - Badge especial para alertas basadas en predicciones ML
- ✅ **Color coding** - Cada variable y severidad tiene su propio esquema de color
- ✅ **Responsive** - Scroll horizontal/vertical para grandes volúmenes de datos
- ✅ **Empty state** - Mensaje amigable cuando no hay alertas
- ✅ **Contador** - Footer con total de alertas mostradas

## 🎨 Esquema de Colores

### Variables
- **Temperatura** - Rojo (#ff4d4f)
- **Humedad** - Cyan (#00b4d8)
- **Energía** - Amarillo (#ffd966)
- **Ocupación** - Azul (#646cff)
- **Riesgo Combinado** - Rojo intenso (#ff4d4f)

### Niveles de Severidad
- **Crítica** - Rojo (#ff4d4f) con icono FiAlertTriangle
- **Media** - Amarillo (#ffd966) con icono FiAlertCircle
- **Informativa** - Verde (#00ff88) con icono FiInfo

### Alertas Predictivas
- **Badge morado** - Gradiente morado-azul (#9d4edd → #646cff)
- **Indicador de tiempo** - Muestra minutos hacia el futuro (+30min, +60min, etc.)

## 📦 Uso Básico

```jsx
import AlertsTable from '../components/AlertsTable';

function MyPage() {
  const [alerts, setAlerts] = useState([]);

  return (
    <AlertsTable alerts={alerts} />
  );
}
```

## 📋 Formato de Datos

### Estructura de Alerta Esperada

```javascript
{
  floorId: 3,
  floorName: "Piso 3",
  timestamp: "2025-11-12T14:30:00.000Z",
  severity: "critical", // "critical", "warning", "info"
  anomalies: [
    {
      type: "temperature", // "temperature", "humidity", "power", "occupancy", "thermal_overload"
      severity: "critical",
      message: "Temperatura elevada detectada",
      recommendation: "Revisar sistema de climatización",
      isPredictive: false,
      minutesAhead: null
    },
    {
      type: "thermal_overload",
      severity: "warning",
      message: "Riesgo de sobrecarga térmica",
      recommendation: "Reducir ocupación o aumentar ventilación",
      isPredictive: true,
      minutesAhead: 30
    }
  ]
}
```

### Ejemplo con Múltiples Alertas

```javascript
const alerts = [
  {
    floorId: 1,
    floorName: "Piso 1 - Lobby",
    timestamp: "2025-11-12T14:30:00.000Z",
    severity: "warning",
    anomalies: [
      {
        type: "occupancy",
        severity: "warning",
        message: "Ocupación alta",
        recommendation: "Monitorear afluencia de personas",
        isPredictive: false
      }
    ]
  },
  {
    floorId: 3,
    floorName: "Piso 3 - Oficinas",
    timestamp: "2025-11-12T14:25:00.000Z",
    severity: "critical",
    anomalies: [
      {
        type: "temperature",
        severity: "critical",
        message: "Temperatura crítica: 28°C",
        recommendation: "Activar enfriamiento de emergencia",
        isPredictive: false
      },
      {
        type: "thermal_overload",
        severity: "critical",
        message: "Riesgo de sobrecarga térmica en 30 minutos",
        recommendation: "Reducir carga térmica inmediatamente",
        isPredictive: true,
        minutesAhead: 30
      }
    ]
  }
];

<AlertsTable alerts={alerts} />
```

## 🔧 Ordenamiento

El ordenamiento funciona automáticamente al hacer click en los headers:

- **Timestamp** - Ordena por fecha/hora (más reciente primero por defecto)
- **Piso** - Ordena numéricamente
- **Variable** - Ordena alfabéticamente
- **Nivel** - Ordena por severidad (Crítica > Media > Informativa)

### Indicadores de Ordenamiento
- ⬆️ **Chevron Up** - Orden ascendente
- ⬇️ **Chevron Down** - Orden descendente

## 🎯 Integración con Backend

### Cargar Alertas desde API

```jsx
import { useState, useEffect } from 'react';
import AlertsTable from '../components/AlertsTable';
import { fetchAlertsWithFilters } from '../api/rest';

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const response = await fetchAlertsWithFilters();
        setAlerts(response.alerts);
      } catch (error) {
        console.error('Error loading alerts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAlerts();
  }, []);

  if (isLoading) return <p>Cargando...</p>;

  return <AlertsTable alerts={alerts} />;
}
```

### Con Filtros

```jsx
const loadCriticalAlerts = async () => {
  const response = await fetchAlertsWithFilters({
    severity: 'critical',
    floorId: 3
  });
  setAlerts(response.alerts);
};
```

### Con WebSocket (Tiempo Real)

```jsx
import { useRealTimeData } from '../hooks/useRealTimeData';

function LiveAlertsTable() {
  const { alerts } = useRealTimeData();

  return <AlertsTable alerts={alerts} />;
}
```

## 📱 Responsive Design

La tabla incluye:
- **Scroll horizontal** - Para muchas columnas en pantallas pequeñas
- **Scroll vertical** - Máximo 600px de altura con scrollbar personalizado
- **Sticky header** - Los títulos de columnas permanecen visibles al hacer scroll

## 🎨 Personalización

### Modificar Altura Máxima

```javascript
// En AlertsTable.jsx, línea ~380
const TableWrapper = styled.div`
  max-height: 800px; // Cambiar de 600px a 800px
  overflow-y: auto;
`;
```

### Cambiar Formato de Fecha

```javascript
// En AlertsTable.jsx, método formatTimestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('es-ES', {
    // Personalizar formato aquí
    dateStyle: 'short',
    timeStyle: 'medium'
  });
};
```

### Agregar Nueva Variable

```javascript
// En getVariableLabel
const getVariableLabel = (variable) => {
  const labels = {
    // ... existing labels
    air_quality: 'Calidad del Aire', // Nueva variable
  };
  return labels[variable] || variable;
};

// En VariableBadge styles
case 'air_quality':
  return 'rgba(0, 255, 136, 0.15)'; // Color verde
```

## 🧪 Ejemplo Completo

Ver `src/pages/AlertsTableDemo.jsx` para un ejemplo completo con:
- Loading state
- Error handling
- Integración con API REST
- Layout responsivo

## 🚀 Uso en Producción

```jsx
import AlertsTable from '../components/AlertsTable';

// En tu componente principal
<Container>
  <Header>
    <h1>Dashboard de Alertas</h1>
  </Header>
  
  <AlertsTable alerts={alerts} />
</Container>
```

## 📊 Casos de Uso

### 1. Dashboard Principal
Mostrar las alertas más recientes del sistema

### 2. Vista por Piso
Filtrar alertas de un piso específico

### 3. Análisis Histórico
Mostrar alertas de un período de tiempo específico

### 4. Alertas Predictivas
Filtrar solo alertas basadas en predicciones ML

### 5. Reportes
Exportar datos de la tabla a CSV (usar con ExportButton)

## 🎨 Screenshots

### Tabla Completa
![Tabla con múltiples alertas mostrando todos los niveles de severidad]

### Alerta Predictiva
![Badge morado indicando alerta preventiva en +30min]

### Ordenamiento Activo
![Header con indicador de ordenamiento descendente]

### Empty State
![Mensaje "No hay alertas para mostrar" con icono]

## 📝 Notas

- Las alertas con `anomalies` array se expanden a múltiples filas (una por anomalía)
- El componente usa `useMemo` para optimizar el rendimiento con grandes volúmenes de datos
- El ordenamiento es local (client-side) - para grandes datasets considera paginación server-side
- Los colores están alineados con el sistema de diseño de SmartFloors (scssTokens)

## 🔗 Archivos Relacionados

- `src/components/AlertsTable.jsx` - Componente principal
- `src/pages/AlertsTableDemo.jsx` - Página de ejemplo
- `src/api/rest.js` - Cliente REST API
- `src/hooks/useRealTimeData.js` - Hook para datos en tiempo real
- `src/styles/scssTokens.js` - Tokens de diseño
