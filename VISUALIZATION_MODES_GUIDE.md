# 🎨 Guía Rápida - Modos de Visualización

## 🚀 Cómo Cambiar Entre Estilos

### Archivo de Configuración
**Ubicación**: `src/config/visualizationModes.js`  
**Línea**: 18

### Modos Disponibles

#### 1. 🌈 Heat Layer (Capas de Color)
```javascript
export const ACTIVE_MODE = VISUALIZATION_MODES.HEAT_LAYER;
```
**Características**:
- Pisos con colores sólidos
- Azul (óptimo), Amarillo (alerta), Rojo (crítico), Morado (riesgo combinado)
- Wireframe glow externo
- Esfera indicadora
- Texto de estado

**Ideal para**: Visualización clara de estados actuales

---

#### 2. 💨 Volumetric (Niebla Térmica)
```javascript
export const ACTIVE_MODE = VISUALIZATION_MODES.VOLUMETRIC;
```
**Características**:
- Niebla/humo interno en cada piso
- Densidad variable según estado
- Partículas animadas (humo ascendente)
- Efecto de turbulencia en estados críticos
- Pulsación en crítico y riesgo combinado

**Visual**:
- **Piso Óptimo**: Niebla azul ligera, pocas partículas (50)
- **Piso Alerta**: Niebla amarilla media, 100 partículas
- **Piso Crítico**: Humo rojo denso, 200 partículas + pulsación
- **Riesgo Combinado**: Tormenta morada, 300 partículas + turbulencia

**Ideal para**: Impacto visual en presentaciones/demos

---

#### 3. 🔥 Hybrid (Combinado)
```javascript
export const ACTIVE_MODE = VISUALIZATION_MODES.HYBRID;
```
**Características**:
- Heat Layer + Volumetric simultáneamente
- Pisos con color Y niebla interna
- Doble indicación visual
- Máximo impacto visual

**Ideal para**: Hackathon/demos de innovación

---

## 📊 Comparativa de Estados Volumétricos

| Estado | Color Niebla | Densidad | Partículas | Velocidad | Efectos Especiales |
|--------|--------------|----------|------------|-----------|-------------------|
| **Optimal** | 🔵 Azul | 0.3 (ligera) | 50 | Lenta (0.3x) | Ninguno |
| **Warning** | 🟡 Amarillo | 0.5 (media) | 100 | Media (0.6x) | Ninguno |
| **Critical** | 🔴 Rojo | 0.8 (densa) | 200 | Rápida (1.2x) | **Pulsación** |
| **Combined Risk** | 🟣 Morado | 1.0 (máxima) | 300 | Muy rápida (1.8x) | **Pulsación + Turbulencia** |

---

## 🎬 Efectos Volumétricos

### Animaciones Activas

1. **Ascenso de Humo**
   - Partículas suben continuamente
   - Se regeneran al llegar arriba
   - Velocidad variable por estado

2. **Rotación Volumétrica**
   - Niebla rota lentamente (0.2 rad/s)
   - Efecto de vórtice

3. **Turbulencia** (solo Critical y Combined Risk)
   - Movimiento sinusoidal en X y Z
   - Simula turbulencia térmica

4. **Pulsación** (solo Critical y Combined Risk)
   - Opacidad varía 70%-100%
   - Sincronizado con glow

### Capas Volumétricas

Cada piso con volumetría tiene:
1. **Volumen principal** - Caja semi-transparente con color del estado
2. **Glow exterior** - Capa externa con brillo
3. **Sistema de partículas** - 50-300 partículas animadas
4. **Point light** - Luz volumétrica interna

---

## ⚙️ Configuración Avanzada

### Ajustar Densidad de Niebla

Edita `VOLUMETRIC_CONFIG` en `visualizationModes.js`:

```javascript
optimal: {
  density: 0.3,    // 0.0 - 1.0 (0 = invisible, 1 = opaco)
  opacity: 0.2,    // Transparencia
  // ...
}
```

### Ajustar Cantidad de Partículas

```javascript
optimal: {
  particleCount: 50,     // Número de partículas
  particleSpeed: 0.3,    // Velocidad de ascenso
  // ...
}
```

### Cambiar Tamaño de Volumen

```javascript
export const VOLUMETRIC_SETTINGS = {
  volumeSize: [2.6, 1.2, 2.6],  // [ancho, alto, profundidad]
  // ...
}
```

---

## 🧪 Testing de Modos

### Escenario 1: Demo Hackatón
```javascript
// Máximo impacto visual
export const ACTIVE_MODE = VISUALIZATION_MODES.VOLUMETRIC;

// Configurar pisos para mostrar variedad
// En heatLayerConfig.js:
MANUAL_HEAT_CONFIG = {
  1: 'optimal',        // Azul ligero
  2: 'warning',        // Amarillo medio
  3: 'critical',       // Rojo denso pulsando
  4: 'combined_risk',  // Morado tormenta
  5: 'optimal'         // Azul ligero
}
```

### Escenario 2: Presentación Cliente
```javascript
// Claridad y profesionalismo
export const ACTIVE_MODE = VISUALIZATION_MODES.HEAT_LAYER;
```

### Escenario 3: Demostración Técnica
```javascript
// Mostrar todas las capacidades
export const ACTIVE_MODE = VISUALIZATION_MODES.HYBRID;
```

---

## 🎯 Casos de Uso por Modo

### Heat Layer
- ✅ Monitoreo en tiempo real
- ✅ Dashboard operativo
- ✅ Identificación rápida de problemas
- ✅ Reportes y análisis

### Volumetric
- ✅ Presentaciones impactantes
- ✅ Demos de innovación
- ✅ Hackathons
- ✅ Marketing/ventas
- ✅ Visualización de intensidad térmica

### Hybrid
- ✅ Eventos y ferias
- ✅ Pitch de inversores
- ✅ Demos de producto completo
- ✅ Máxima diferenciación visual

---

## 🔍 Debug

### Verificar Modo Activo

Abre DevTools y busca logs:
```
🌡️ [FloorBlock 1] Heat Layer State: ...
```

Si ves el log, los componentes se están renderizando.

### Cambiar en Tiempo Real

1. Edita `ACTIVE_MODE` en `visualizationModes.js`
2. Guarda el archivo
3. HMR recarga automáticamente
4. Los pisos cambian de apariencia instantáneamente

---

## 📝 Performance

### Recomendaciones

| Modo | Partículas Totales | FPS Esperado | Recomendado para |
|------|-------------------|--------------|------------------|
| Heat Layer | 0 | 60+ | Producción |
| Volumetric (Optimal) | 250 | 45-60 | Demos |
| Volumetric (Mixed) | 650+ | 30-45 | Presentaciones |
| Hybrid | 650+ | 30-45 | Eventos |

**Tip**: En modo Volumetric, los estados "optimal" usan menos partículas para mejor performance.

---

## 🚨 Troubleshooting

### "No veo la niebla"
- Verifica que `ACTIVE_MODE = VISUALIZATION_MODES.VOLUMETRIC`
- Revisa que los pisos tengan estados configurados en `heatLayerConfig.js`

### "Las partículas no se mueven"
- Verifica que el componente `VolumetricFog` esté importado
- Revisa consola por errores

### "Los pisos están muy oscuros en modo Volumetric"
- Esto es normal - en modo volumétrico los pisos son semi-transparentes
- Cambia a `HYBRID` para tener color + niebla

---

**Archivo de Configuración**: `src/config/visualizationModes.js`  
**Componente Principal**: `src/components/FloorBlock.jsx`  
**Componente Volumétrico**: `src/components/VolumetricFog.jsx`
