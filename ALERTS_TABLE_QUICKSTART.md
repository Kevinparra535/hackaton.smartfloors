# 🚀 Guía Rápida - AlertsTable

## Acceso Rápido

Visita: `http://localhost:5173/alerts-table` para ver la tabla en acción.

## Uso en 3 Pasos

### 1️⃣ Importar el Componente

```jsx
import AlertsTable from '../components/AlertsTable';
```

### 2️⃣ Obtener Datos

```jsx
import { useRealTimeData } from '../hooks/useRealTimeData';

function MyComponent() {
  const { alerts } = useRealTimeData();
  // ...
}
```

### 3️⃣ Renderizar

```jsx
<AlertsTable alerts={alerts} />
```

## 📋 Ejemplo Completo

```jsx
import { useState, useEffect } from 'react';
import AlertsTable from '../components/AlertsTable';
import { fetchAlertsWithFilters } from '../api/rest';

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const loadAlerts = async () => {
      const response = await fetchAlertsWithFilters();
      setAlerts(response.alerts);
    };
    loadAlerts();
  }, []);

  return <AlertsTable alerts={alerts} />;
}
```

## 🎯 Columnas de la Tabla

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| **Timestamp** | Fecha y hora de la alerta | 12/11/2025, 14:30:45 |
| **Piso** | Número y nombre del piso | 3 - Piso 3 |
| **Variable** | Tipo de métrica afectada | Temperatura / Humedad / Energía |
| **Nivel** | Severidad de la alerta | Crítica / Media / Informativa |
| **Recomendación** | Acción sugerida | "Revisar sistema de climatización" |

## 🎨 Features Incluidas

- ✅ Ordenamiento por cualquier columna (click en headers)
- ✅ Alertas predictivas con badge morado
- ✅ Color coding por tipo de variable
- ✅ Iconos por nivel de severidad
- ✅ Scroll vertical/horizontal automático
- ✅ Contador total de alertas
- ✅ Estado vacío cuando no hay alertas

## 🔧 Filtrar Alertas

```jsx
// Solo alertas críticas
const response = await fetchAlertsWithFilters({ severity: 'critical' });

// Solo del piso 3
const response = await fetchAlertsWithFilters({ floorId: 3 });

// Alertas predictivas
const response = await fetchAlertsWithFilters({ isPredictive: true });

// Combinación de filtros
const response = await fetchAlertsWithFilters({
  severity: 'critical',
  floorId: 3,
  type: 'thermal_overload'
});
```

## 🎨 Códigos de Color

### Variables
- 🔴 **Temperatura** - Rojo
- 🔵 **Humedad** - Cyan
- 🟡 **Energía** - Amarillo
- 🟣 **Ocupación** - Azul
- 🔴 **Riesgo Combinado** - Rojo oscuro

### Niveles
- 🔴 **Crítica** - Rojo con ⚠️
- 🟡 **Media** - Amarillo con ⚠
- 🟢 **Informativa** - Verde con ℹ️

## 📱 Navegación

Agrega un link en tu Header:

```jsx
<NavLink to="/alerts-table">Tabla de Alertas</NavLink>
```

## ⚡ Tips

1. **Ordenar por fecha**: Click en "Timestamp" para ver las más recientes primero
2. **Buscar alertas críticas**: Click en "Nivel" dos veces para ordenar por severidad
3. **Identificar riesgos futuros**: Busca el badge morado 🔮 en alertas predictivas
4. **Filtrar antes de mostrar**: Usa `fetchAlertsWithFilters()` para reducir datos

## 🐛 Troubleshooting

**No aparecen alertas**
- Verifica que el backend esté corriendo en `localhost:3000`
- Revisa la consola del navegador por errores
- Asegúrate de que `alerts` sea un array válido

**Las alertas no se ordenan**
- Click en el header de la columna
- Verifica que los datos tengan los campos correctos (`timestamp`, `severity`, etc.)

**Colores incorrectos**
- Verifica que `severity` sea: `"critical"`, `"warning"` o `"info"` (lowercase)
- Verifica que `type` coincida con los valores esperados

## 📚 Documentación Completa

Ver `ALERTS_TABLE_README.md` para documentación detallada.
