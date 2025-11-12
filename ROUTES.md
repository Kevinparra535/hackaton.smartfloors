# Sistema de Rutas - SmartFloors AI

## 🎯 Rutas Implementadas

### Dashboard Principal

- **Ruta:** `/`
- **Componente:** `Dashboard3D`
- **Descripción:** Vista 3D interactiva del edificio con 5 pisos, métricas en tiempo real, alertas y predicciones

### Análisis y Estadísticas

- **Ruta:** `/analytics`
- **Componente:** `Analytics`
- **Descripción:** Vista de análisis con:
  - Métricas agregadas (total pisos, ocupación promedio, temperatura promedio, consumo total)
  - Tabla detallada por piso con todas las métricas
  - Visualización clara de datos en tiempo real

## 🔧 Arquitectura

### Estructura de Componentes

```
App (BrowserRouter)
└── Layout (Outlet container)
    ├── Header (Navigation tabs)
    ├── Dashboard3D (ruta: /)
    └── Analytics (ruta: /analytics)
```

### Flujo de Datos

1. **Layout** (`src/layout/Layout.js`)
   - Contiene el hook `useRealTimeData()`
   - Maneja estado de carga global
   - Pasa datos a través de `Outlet context`

2. **Páginas** reciben datos via `useOutletContext()`

   ```javascript
   const { floorData, predictions, alerts, isLoading } = useOutletContext();
   ```

3. **Header** contiene tabs de navegación con `NavLink`
   - Clase `.active` automática en tab activo
   - Estilos hover y transiciones suaves

## 📁 Archivos Modificados/Creados

### Creados

- `src/pages/Dashboard3D.jsx` - Wrapper del dashboard 3D
- `src/pages/Analytics.jsx` - Vista de análisis y estadísticas
- `ROUTES.md` - Esta documentación

### Modificados

- `src/App.jsx` - Configuración de rutas con React Router
- `src/layout/Layout.js` - Container principal con Outlet
- `src/layout/Header.js` - Tabs de navegación con NavLink
- `src/styles/Header.styled.js` - Ajustes de layout para tabs

## 🎨 Estilos de Navegación

Los tabs en el header tienen:

- ✅ Estado activo visual (`.active`)
- ✅ Efectos hover con transición
- ✅ Animación de elevación
- ✅ Iconos con emojis
- ✅ Bordes y sombras responsivas

## 🚀 Uso

```bash
# Iniciar aplicación
npm run dev

# Navegar a diferentes vistas
http://localhost:5173/           # Dashboard 3D
http://localhost:5173/analytics  # Análisis
```

## 📊 Características de Analytics

La página de análisis muestra:

- 📈 **Total de Pisos** - Cantidad de pisos monitoreados
- 👥 **Ocupación Promedio** - Promedio de ocupación en tiempo real
- 🌡️ **Temperatura Promedio** - Temperatura promedio del edificio
- ⚡ **Consumo Total** - Suma de consumo energético

Tabla detallada con:

- Nombre del piso
- Ocupación (%)
- Temperatura (°C)
- Humedad (%)
- Consumo (kW)

## 🔄 Datos en Tiempo Real

Ambas vistas reciben datos actualizados en tiempo real a través de:

- REST API (carga inicial)
- WebSocket (actualizaciones continuas)

No hay duplicación de lógica - todo centralizado en Layout.
