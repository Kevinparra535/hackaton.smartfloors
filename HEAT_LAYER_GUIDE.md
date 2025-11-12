# 🌡️ Heat Layer Visualization Guide

## Overview
El sistema de Heat Layer proporciona una visualización codificada por colores de los estados térmicos y de energía de cada piso del edificio. Cada piso se renderiza con colores específicos que representan diferentes niveles de riesgo.

## Estados de Heat Layer

### 1. **Optimal (Azul)** 🔵
- **Color Primario**: `#00b4d8` (Azul brillante)
- **Color Secundario**: `#0077b6` (Azul profundo)
- **Significado**: Condiciones óptimas - temperatura, humedad y consumo de energía dentro de rangos ideales
- **Animación**: Ninguna (estático)
- **Opacidad**: 0.7 (semi-transparente)

### 2. **Warning (Amarillo)** 🟡
- **Color Primario**: `#ffd966` (Amarillo brillante)
- **Color Secundario**: `#ffb703` (Amarillo naranja)
- **Significado**: Alerta media - uno o más parámetros están fuera del rango óptimo pero dentro de límites aceptables
- **Animación**: Ninguna (estático)
- **Opacidad**: 0.7 (semi-transparente)

### 3. **Critical (Rojo)** 🔴
- **Color Primario**: `#ff4d4f` (Rojo brillante)
- **Color Secundario**: `#dc2f02` (Rojo profundo)
- **Significado**: Alerta crítica - parámetros significativamente fuera de rango, requiere atención inmediata
- **Animación**: **Pulso activo** (respiración visual)
- **Opacidad**: 0.7 (semi-transparente)

### 4. **Combined Risk (Morado)** 🟣
- **Color Primario**: `#9d4edd` (Morado brillante)
- **Color Secundario**: `#7209b7` (Morado profundo)
- **Significado**: Riesgo combinado - múltiples parámetros en estado crítico simultáneamente
- **Animación**: **Pulso activo** (respiración visual intensa)
- **Opacidad**: 0.7 (semi-transparente)

## Configuración Manual

### Ubicación del Archivo
```
src/config/heatLayerConfig.js
```

### Cambiar Estados Manualmente

Para probar diferentes estados visuales, modifica el objeto `MANUAL_HEAT_CONFIG`:

```javascript
export const MANUAL_HEAT_CONFIG = {
  1: 'optimal',        // Piso 1 → Azul
  2: 'warning',        // Piso 2 → Amarillo
  3: 'critical',       // Piso 3 → Rojo (con pulso)
  4: 'combined_risk',  // Piso 4 → Morado (con pulso)
  5: 'optimal'         // Piso 5 → Azul
};
```

### Ejemplos de Configuración

#### Escenario 1: Todo Óptimo
```javascript
export const MANUAL_HEAT_CONFIG = {
  1: 'optimal',
  2: 'optimal',
  3: 'optimal',
  4: 'optimal',
  5: 'optimal'
};
```

#### Escenario 2: Crisis en Pisos Superiores
```javascript
export const MANUAL_HEAT_CONFIG = {
  1: 'optimal',
  2: 'optimal',
  3: 'warning',
  4: 'critical',
  5: 'combined_risk'
};
```

#### Escenario 3: Alertas Distribuidas
```javascript
export const MANUAL_HEAT_CONFIG = {
  1: 'warning',
  2: 'optimal',
  3: 'critical',
  4: 'optimal',
  5: 'warning'
};
```

## Características Visuales

### Animación de Pulso
Los estados `critical` y `combined_risk` incluyen animación de pulso:
- **Velocidad**: 1.5 (configurable en `HEAT_LAYER_SETTINGS.pulseSpeed`)
- **Efecto**: 
  - Intensidad emissiva varía entre 70% y 100%
  - Escala del piso pulsa sutilmente (±2%)
- **Propósito**: Llamar la atención visual a pisos en estado crítico

### Transparencia
- **Opacidad Principal**: 0.7 (semi-transparente)
- **Permite ver**: Ambiente 3D detrás de los pisos
- **Efecto**: Apariencia de holograma futurista

### Iluminación Dinámica
Cada piso emite luz basada en su estado:
- **Optimal**: Intensidad baja (0.8)
- **Warning**: Intensidad media (1.5)
- **Critical**: Intensidad alta (2.0)
- **Combined Risk**: Intensidad muy alta (2.5)

### Indicador de Estado
Cada piso muestra:
1. **Etiqueta de Nombre**: "Piso N" en la parte frontal
2. **Esfera de Estado**: Indicador circular en la esquina derecha
3. **Texto de Estado**: Nombre del estado en la parte inferior (ej: "OPTIMAL", "CRITICAL")

## Integración con Componentes

### FloorBlock.jsx
El componente `FloorBlock` ahora utiliza automáticamente la configuración de Heat Layer:

```javascript
// Obtiene configuración automáticamente
const heatConfig = getFloorHeatConfig(data.floorId);
const { state, colors, settings, shouldPulse } = heatConfig;
```

### BuildingScene.jsx
No requiere cambios - renderiza 5 FloorBlocks que automáticamente aplican Heat Layer.

## Modo Automático (Futuro)

### Activación
Cambia el modo en `heatLayerConfig.js`:

```javascript
export const USE_MANUAL_CONFIG = false; // Cambiar a false para modo automático
```

### Lógica Automática
El modo automático usará `calculateHeatState(floor)` para determinar el estado basándose en:

1. **Temperatura**:
   - Optimal: 18°C - 24°C
   - Warning: 15°C - 18°C o 24°C - 28°C
   - Critical: <15°C o >28°C

2. **Humedad**:
   - Optimal: 30% - 60%
   - Warning: 20% - 30% o 60% - 70%
   - Critical: <20% o >70%

3. **Consumo de Energía**:
   - Optimal: <800 kWh
   - Warning: 800 - 1000 kWh
   - Critical: >1000 kWh

4. **Riesgo Combinado**:
   - Se activa cuando 2 o más parámetros están en estado crítico

## Personalización Avanzada

### Modificar Colores

Edita `HEAT_LAYER_COLORS` en `heatLayerConfig.js`:

```javascript
export const HEAT_LAYER_COLORS = {
  optimal: {
    primary: '#00b4d8',      // Color principal
    secondary: '#0077b6',    // Color de gradiente
    emissive: '#0096c7'      // Color de luz emitida
  },
  // ... otros estados
};
```

### Ajustar Intensidades

Modifica `HEAT_LAYER_SETTINGS`:

```javascript
export const HEAT_LAYER_SETTINGS = {
  mainOpacity: 0.7,           // Transparencia (0-1)
  pulseSpeed: 1.5,            // Velocidad de pulso
  emissiveIntensity: {
    optimal: 0.3,             // Brillo emissivo por estado
    warning: 0.5,
    critical: 0.8,
    combined_risk: 1.0
  },
  lightIntensity: {
    optimal: 0.8,             // Intensidad de luz por estado
    warning: 1.5,
    critical: 2.0,
    combined_risk: 2.5
  }
};
```

## Debugging

### Console Logs
El sistema incluye logs automáticos:

```
🌡️ [FloorBlock 1] Heat Layer State: {
  floorId: 1,
  state: 'optimal',
  colors: { primary: '#00b4d8', secondary: '#0077b6', emissive: '#0096c7' },
  shouldPulse: false,
  opacity: 0.7
}
```

### Verificar Estado Actual
1. Abre DevTools (F12)
2. Busca logs con emoji 🌡️
3. Verifica que cada piso tenga el estado esperado

## Solución de Problemas

### Problema: Pisos no cambian de color
**Solución**: Verifica que `USE_MANUAL_CONFIG = true` y que `MANUAL_HEAT_CONFIG` contenga configuraciones válidas.

### Problema: Animación de pulso no funciona
**Solución**: Solo estados `critical` y `combined_risk` tienen pulso. Verifica que el piso esté en uno de estos estados.

### Problema: Colores no coinciden con la configuración
**Solución**: Borra caché del navegador (Ctrl+Shift+R) o reinicia el servidor de desarrollo.

## Roadmap

- [ ] Implementar transiciones suaves entre estados
- [ ] Agregar modo de vista de calor (heat map overlay)
- [ ] Integrar predicciones ML para estados futuros
- [ ] Agregar controles UI para cambiar configuración en tiempo real
- [ ] Crear historial de estados por piso
- [ ] Exportar configuraciones como presets

## Referencias

- **Archivo de Configuración**: `src/config/heatLayerConfig.js`
- **Componente Visual**: `src/components/FloorBlock.jsx`
- **Escena 3D**: `src/scenes/BuildingScene.jsx`
