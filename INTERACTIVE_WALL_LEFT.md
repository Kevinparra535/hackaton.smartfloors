# 🧱 InteractiveWallLeft - Pared Izquierda con Tabla de Alertas

## 📍 Ubicación

Nueva pared interactiva posicionada en el **lado izquierdo** de la escena 3D (opuesta a la pared de gráficas).

## 🎯 Características

- **Posición**: `x = -15` (lado izquierdo, opuesto a la pared de gráficas en `x = 15`)
- **Contenido**: Tabla interactiva de alertas con las 5 columnas solicitadas
- **Interacción**: Click para acercar cámara y ver la tabla completa
- **Color tema**: Rojo (#ff4d4f) para diferenciar de la pared de gráficas (azul)

## 🎨 Diseño Visual

### Vista Inicial (Sin Acercar)
- Icono grande de alerta ⚠️
- Mensaje: "Haz click para ver la tabla de alertas detallada"
- Subtitle: "Timestamp • Piso • Variable • Nivel • Recomendación"
- Border rojo con efecto hover verde

### Vista Acercada (Después del Click)
- Tabla completa de alertas con scroll
- Botón de cerrar "✕ Cerrar Tabla"
- Background oscuro semi-transparente
- Headers ordenables

## 🎥 Comportamiento de Cámara

### Al hacer click en la pared:
```javascript
Camera position: [-11, 0, 0]  // 4 unidades hacia la izquierda desde la pared
Look at: [-15, 0, 0]           // Centro de la pared
Smooth transition: ✅
```

### Al cerrar (botón ✕):
```javascript
Camera position: [0, 0, 5]     // Vista por defecto
Look at: [0, 0, 0]             // Centro de la escena
Smooth transition: ✅
```

## 📋 Integración

### Archivos Modificados

1. **`src/components/InteractiveWallLeft.jsx`** - Nuevo componente
2. **`src/scenes/BuildingScene.jsx`** - Agregado import y render
3. **`src/components/Dashboard3D.jsx`** - Prop `alerts` agregada
4. **`src/pages/Home.jsx`** - Prop `alerts` pasada desde contexto

### Flujo de Datos

```
Layout.jsx (useRealTimeData)
  ↓ alerts via Outlet context
Home.jsx
  ↓ props
Dashboard3D.jsx
  ↓ props
BuildingScene.jsx
  ↓ props
InteractiveWallLeft.jsx
  ↓ render
AlertsTable.jsx
```

## 🎮 Uso en la Escena 3D

La pared se renderiza automáticamente en `BuildingScene.jsx`:

```jsx
<InteractiveWallLeft 
  cameraControlsRef={cameraControlsRef} 
  alerts={alerts} 
/>
```

### Props:
- **`cameraControlsRef`**: Referencia para controlar la cámara
- **`alerts`**: Array de alertas desde useRealTimeData

## 🔧 Configuración

### Posición de la Pared
Cambiar en `InteractiveWallLeft.jsx`:

```jsx
<group position={[-15, 0, 0]}>  // X negativo = lado izquierdo
```

### Rotación de la Pared
```jsx
<mesh rotation={[0, -Math.PI / 2, 0]}>  // -90° para mirar hacia la derecha
```

### HTML Rotation
```jsx
rotation={[0, Math.PI / 2, 0]}  // +90° para compensar rotación de pared
```

## 📊 Tabla de Alertas Incluida

La pared muestra `AlertsTable` con:

1. ✅ **Timestamp** - Fecha y hora formateada
2. ✅ **Piso** - Número y nombre del piso
3. ✅ **Variable** - Temperatura, Humedad, Energía, etc.
4. ✅ **Nivel** - Crítica, Media, Informativa
5. ✅ **Recomendación** - Mensaje de acción sugerida

## 🎨 Diferencias con la Pared Derecha

| Aspecto | Pared Derecha (Gráficas) | Pared Izquierda (Alertas) |
|---------|---------------------------|---------------------------|
| **Posición X** | +15 | -15 |
| **Color tema** | Azul (#646cff) | Rojo (#ff4d4f) |
| **Contenido** | TrendCharts (gráficos) | AlertsTable (tabla) |
| **Rotación mesh** | +90° | -90° |
| **Rotación HTML** | -90° | +90° |
| **Título** | "SmartFloors Analytics" | "Tabla de Alertas" |
| **Icono preview** | Texto simple | ⚠️ Icono de alerta |

## 🎥 Vista en Escena

```
          [Edificio 5 pisos]
                 ▢
                 ▢
                 ▢
                 ▢
                 ▢

Pared Alertas                    Pared Gráficas
    ║                                  ║
    ║ ⚠️                              ║ 📊
    ║ Tabla                            ║ Charts
    ║                                  ║
  x=-15                              x=+15
```

## 🚀 Cómo Probar

1. **Ejecuta el proyecto**: `npm run dev`
2. **Navega a**: `http://localhost:5173`
3. **En la vista 3D**:
   - Gira la cámara hacia la izquierda (arrastra con mouse)
   - Verás una pared oscura con icono de alerta ⚠️
   - Click en la pared para acercarte
   - Verás la tabla completa de alertas
   - Usa scroll para ver todas las filas
   - Click en "✕ Cerrar Tabla" para volver a la vista normal

## 🐛 Troubleshooting

**No veo la pared izquierda**
- Asegúrate de girar la cámara hacia la izquierda
- Verifica que el backend esté corriendo (las alertas vienen de ahí)
- Revisa la consola por errores

**La tabla está vacía**
- Verifica que `alerts` tenga datos (revisa React DevTools)
- Asegúrate que el backend esté en `localhost:3000`
- Revisa `useRealTimeData` hook

**La cámara no se mueve al hacer click**
- Verifica que `cameraControlsRef` esté correctamente pasado
- Revisa la consola por errores de CameraControls
- Asegúrate que OrbitControls no esté activo

**El scroll no funciona**
- Verifica que `isFocused` sea `true` después del click
- Revisa que `controls.enabled = false` se ejecute
- Asegúrate de estar en modo acercado (después del click)

## 📝 Notas Técnicas

- Usa el mismo sistema de deshabilitación de controles que la pared derecha
- El HTML está integrado en el espacio 3D con `transform` mode
- El `distanceFactor` está en 2.5 para mantener el tamaño consistente
- La pared usa `THREE.DoubleSide` para ser visible desde ambos lados
- El componente maneja su propio estado de focus (`isFocused`)

## 🔗 Componentes Relacionados

- `src/components/InteractiveWallLeft.jsx` - Componente de pared
- `src/components/AlertsTable.jsx` - Tabla de alertas
- `src/components/InteractiveWall.jsx` - Pared derecha (referencia)
- `src/scenes/BuildingScene.jsx` - Escena principal
- `src/hooks/useRealTimeData.js` - Fuente de datos de alertas
