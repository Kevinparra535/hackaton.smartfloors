# VisualizationSelector - Sistema de Cambio de Visualización

## 🎨 Descripción

El `VisualizationSelector` es un componente que permite cambiar entre diferentes modos de visualización del edificio 3D en tiempo real.

## 📍 Ubicación

- **Componente:** `src/components/VisualizationSelector.jsx`
- **Hook:** `src/hooks/useVisualizationMode.js`
- **Estilos:** `src/styles/VisualizationControls.styled.js`
- **Configuración:** `src/config/visualizationModes.js`
- **Integración:** Header principal (`src/layout/Header.jsx`)

## 🎯 Modos de Visualización

### 1. **Capas de Color** (`heat_layer`)

- Los pisos se colorean según su estado térmico
- Colores directos en la superficie del piso
- Visual limpio y directo
- Ideal para diagnóstico rápido

### 2. **Niebla Térmica** (`volumetric`)

- Niebla/humo interno que muestra intensidad térmica
- Efectos de partículas volumétricas
- Visualización inmersiva
- Ideal para presentaciones impactantes

## 🔧 Implementación

### Uso en Header

```jsx
import { useVisualizationMode } from '../hooks/useVisualizationMode';
import VisualizationSelector from '../components/VisualizationSelector';

const Header = () => {
  const { currentMode, setVisualizationMode } = useVisualizationMode();

  return (
    <header>
      <VisualizationSelector currentMode={currentMode} onModeChange={setVisualizationMode} />
    </header>
  );
};
```

### Hook de Visualización

```javascript
const { currentMode, setVisualizationMode } = useVisualizationMode();

// Cambiar modo
setVisualizationMode('volumetric');
setVisualizationMode('heat_layer');
```

### Persistencia

El modo seleccionado se guarda automáticamente en `localStorage`:

- **Clave:** `smartfloors-viz-mode`
- **Valor:** `'heat_layer'` o `'volumetric'`
- **Default:** `'volumetric'`

## 🎨 Estados y Colores

### Estados del Sistema

| Estado               | Color                | Descripción         |
| -------------------- | -------------------- | ------------------- |
| **Óptimo**           | `#00b4d8` (Azul)     | Condiciones ideales |
| **Alerta Media**     | `#ffd966` (Amarillo) | Requiere atención   |
| **Crítico**          | `#ff4d4f` (Rojo)     | Acción inmediata    |
| **Riesgo Combinado** | `#9d4edd` (Morado)   | Múltiples problemas |

### Configuración Volumétrica

Cada estado tiene configuración específica de niebla:

```javascript
VOLUMETRIC_CONFIG = {
  optimal: {
    color: '#00b4d8',
    density: 0.3,
    opacity: 0.2,
    particleCount: 50,
    particleSpeed: 0.3
  },
  critical: {
    color: '#ff4d4f',
    density: 0.8,
    opacity: 0.5,
    particleCount: 200,
    particleSpeed: 1.2,
    pulsate: true
  }
  // ... otros estados
};
```

## 📡 Eventos

El hook dispara un evento personalizado cuando cambia el modo:

```javascript
window.addEventListener('visualizationModeChange', (event) => {
  console.log('Nuevo modo:', event.detail.mode);
});
```

## 🎯 Integración con Layout

El modo actual se pasa a través del contexto de Outlet:

```jsx
// Layout.jsx
const { currentMode } = useVisualizationMode();

<Outlet
  context={{
    floorData,
    predictions,
    alerts,
    isLoading,
    currentMode
  }}
/>;
```

Las páginas pueden acceder al modo:

```jsx
// Home.jsx
const { currentMode } = useOutletContext();

<ColorLegend currentMode={currentMode} />;
```

## 🎨 Estilos del Selector

### Container

- Alineado a la derecha en el header
- Margen automático (`margin-left: auto`)
- Gap de 0.75rem

### Select

- Fondo semi-transparente oscuro
- Borde azul con glow en hover
- Padding: `0.6rem 2.5rem 0.6rem 1rem`
- Ancho mínimo: 180px
- Transición suave en hover (translateY -2px)
- Icono dropdown personalizado SVG

### Opciones

- Fondo oscuro `#1a1a1a`
- Texto blanco
- Padding: 0.75rem
- Incluyen emojis para identificación visual:
  - 🎨 Capas de Color
  - 💨 Niebla Térmica

## 📊 Flujo de Datos

```
Usuario selecciona modo
    ↓
VisualizationSelector.onChange()
    ↓
useVisualizationMode.setVisualizationMode()
    ↓
localStorage.setItem('smartfloors-viz-mode', mode)
    ↓
window.dispatchEvent('visualizationModeChange')
    ↓
FloorBlock detecta cambio (via localStorage)
    ↓
Re-render con nuevo modo visual
```

## 🔍 Debugging

Para verificar el modo actual:

```javascript
// En la consola del navegador
localStorage.getItem('smartfloors-viz-mode');

// O escuchar cambios
window.addEventListener('visualizationModeChange', (e) => {
  console.log('🎨 Modo cambiado a:', e.detail.mode);
});
```

## 📝 Validación

El hook valida automáticamente los modos:

```javascript
const validModes = Object.values(VISUALIZATION_MODES);
if (!validModes.includes(newMode)) {
  console.warn(`⚠️ Modo inválido: ${newMode}`);
  newMode = VISUALIZATION_MODES.VOLUMETRIC; // Fallback
}
```

## ✨ Características

✅ **Cambio en tiempo real** - Sin recargar la página  
✅ **Persistencia** - Se mantiene entre sesiones  
✅ **Validación automática** - Previene modos inválidos  
✅ **Eventos personalizados** - Para integración con otros componentes  
✅ **Accesibilidad** - aria-label y title descriptivos  
✅ **Visual atractivo** - Hover effects y transiciones suaves  
✅ **Responsive** - Se adapta al tamaño del header

## 🚀 Próximas Mejoras Sugeridas

- [ ] Agregar modo "Híbrido" (combinación de capas + niebla)
- [ ] Modo "Barras de Energía" para visualizar consumo eléctrico
- [ ] Animación de transición entre modos
- [ ] Tooltip explicativo al hacer hover
- [ ] Keyboard shortcuts (Ctrl+1, Ctrl+2, etc.)
- [ ] Previsualización del modo antes de aplicar

## 📚 Referencias

- **Configuración completa:** `src/config/visualizationModes.js`
- **Estados de calor:** `src/config/heatLayerConfig.js`
- **Implementación 3D:** `src/components/FloorBlock.jsx`
- **Componente de niebla:** `src/components/VolumetricFog.jsx`
