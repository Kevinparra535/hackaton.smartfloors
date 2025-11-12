# 🎨 Control de Visualización - Guía Rápida

## ✅ Implementación Completada

Se han agregado dos componentes nuevos al dashboard:

### 1. Selector de Visualización (Header)
**Ubicación**: Header superior derecho  
**Función**: Cambiar entre modos de visualización en tiempo real

**Modos Disponibles**:
- 🌈 **Capas de Color** - Pisos con colores sólidos
- 💨 **Niebla Térmica** - Humo/niebla volumétrica interna
- 🔥 **Híbrido** - Ambos efectos combinados

**Uso**: 
1. Click en el selector desplegable
2. Selecciona el modo deseado
3. Los pisos cambian instantáneamente

### 2. Leyenda de Estados (Dashboard)
**Ubicación**: Esquina superior derecha del dashboard  
**Función**: Explicar qué significa cada color/estado

**Estados Mostrados**:
- ✅ **Óptimo** (Azul #00b4d8) - Condiciones ideales
- ⚠️ **Alerta Media** (Amarillo #ffd966) - Requiere atención
- 🔴 **Crítico** (Rojo #ff4d4f) - Acción inmediata
- ⚡ **Riesgo Combinado** (Morado #9d4edd) - Múltiples problemas

**Descripción Dinámica**: La leyenda muestra una descripción del modo actual activo

---

## 📁 Archivos Creados/Modificados

### Nuevos Componentes
1. **`src/components/VisualizationSelector.jsx`** - Selector desplegable de modos
2. **`src/components/ColorLegend.jsx`** - Leyenda explicativa de estados
3. **`src/styles/VisualizationControls.styled.js`** - Estilos para ambos componentes
4. **`src/hooks/useVisualizationMode.js`** - Hook para gestionar el modo actual

### Archivos Modificados
1. **`src/layout/Header.jsx`** - Integra el selector de visualización
2. **`src/layout/Layout.jsx`** - Gestiona el estado del modo
3. **`src/pages/Home.jsx`** - Muestra la leyenda de colores
4. **`src/components/FloorBlock.jsx`** - Reacciona a cambios de modo en tiempo real
5. **`src/config/visualizationModes.js`** - Lee modo desde localStorage

---

## 🔧 Funcionalidad Técnica

### Persistencia
- El modo seleccionado se guarda en `localStorage`
- Al recargar la página, mantiene el último modo usado
- Key: `smartfloors-viz-mode`

### Comunicación Entre Componentes
- Usa **Custom Events** para notificar cambios
- Evento: `visualizationModeChange`
- Todos los FloorBlocks escuchan y reaccionan automáticamente

### Estados Reactivos
```javascript
// Hook personalizado
const { currentMode, setVisualizationMode } = useVisualizationMode();

// Cambiar modo
setVisualizationMode(VISUALIZATION_MODES.VOLUMETRIC);
```

---

## 🎨 Estilos Aplicados

### Selector de Visualización
- Diseño coherente con el header
- Hover effect con border azul
- Dropdown estilizado con flecha SVG
- Focus ring para accesibilidad

### Leyenda de Estados
- Panel flotante semi-transparente
- Backdrop blur para efecto glassmorphism
- Hover effect en cada estado
- Indicadores de color con glow effect
- Descripción dinámica del modo actual

---

## 🧪 Testing

### Verificar Selector
1. Abrir http://localhost:5173
2. Mirar header superior derecho
3. Click en selector "🎨 Visualización"
4. Cambiar entre modos
5. Ver cambios instantáneos en los pisos

### Verificar Leyenda
1. En el dashboard, mirar esquina superior derecha
2. Verificar que muestre 4 estados:
   - Óptimo (azul)
   - Alerta Media (amarillo)
   - Crítico (rojo)
   - Riesgo Combinado (morado)
3. Leer descripción del modo actual
4. Hacer hover sobre estados (efecto de highlight)

### Verificar Persistencia
1. Seleccionar "Niebla Térmica"
2. Recargar página (F5)
3. Verificar que mantiene "Niebla Térmica"

---

## 💡 Experiencia de Usuario

### Flujo Típico
1. Usuario abre dashboard → Ve modo Volumétrico (default)
2. Lee leyenda → Entiende qué significa cada color
3. Cambia a "Capas de Color" → Visualización más clara
4. Cambia a "Híbrido" → Ve ambos efectos
5. Cierra y reabre → Mantiene último modo

### Casos de Uso

**Para Monitores**:
- Usar "Capas de Color" para identificación rápida
- Leyenda ayuda a entrenar nuevos operadores

**Para Presentaciones**:
- Usar "Niebla Térmica" para impacto visual
- Cambiar a "Híbrido" para mostrar capacidades

**Para Demos**:
- Alternar entre modos en vivo
- Explicar cada estado con la leyenda

---

## 🎯 Mejoras UX Implementadas

### Accesibilidad
- ✅ Labels descriptivos en selector
- ✅ Focus states en dropdown
- ✅ Contraste suficiente en texto
- ✅ Emojis para identificación visual

### Usabilidad
- ✅ Selector siempre visible en header
- ✅ Leyenda no obstruye vista 3D
- ✅ Cambios instantáneos sin reload
- ✅ Persistencia entre sesiones

### Feedback Visual
- ✅ Hover effects en todos los elementos
- ✅ Indicadores de color con glow
- ✅ Descripción dinámica del modo
- ✅ Transiciones suaves

---

## 📊 Estructura de Datos

### localStorage
```javascript
{
  "smartfloors-viz-mode": "volumetric" // heat_layer | volumetric | hybrid
}
```

### Custom Event
```javascript
window.dispatchEvent(new CustomEvent('visualizationModeChange', { 
  detail: { mode: 'volumetric' } 
}));
```

---

## 🐛 Troubleshooting

### "No veo el selector"
- Verifica que el Header esté renderizando
- Revisa que `VisualizationSelector` esté importado

### "Los pisos no cambian"
- Abre DevTools → Console
- Busca logs: `🎨 [useVisualizationMode] Cambiando modo`
- Busca logs: `🔄 [FloorBlock X] Modo cambiado a`

### "La leyenda no aparece"
- Verifica que estés en la página Home
- Revisa que `ColorLegend` esté importado

### "El modo no persiste"
- Verifica que localStorage funcione
- Abre DevTools → Application → Local Storage
- Busca key: `smartfloors-viz-mode`

---

## 🚀 Próximas Mejoras Sugeridas

- [ ] Botón de toggle en lugar de dropdown
- [ ] Animación de transición entre modos
- [ ] Preview tooltip al hover en selector
- [ ] Shortcuts de teclado (1, 2, 3 para cada modo)
- [ ] Leyenda colapsable
- [ ] Exportar configuración actual

---

**Implementado**: 2025-11-12  
**Componentes**: VisualizationSelector, ColorLegend  
**Estado**: ✅ Funcional y testeado
