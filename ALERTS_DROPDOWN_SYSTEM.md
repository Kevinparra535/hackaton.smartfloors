# Sistema de Alertas con Dropdown y Filtros

## 📋 Resumen

Se ha implementado un **sistema completo de alertas** con dropdown interactivo y múltiples filtros para facilitar la gestión y visualización de alertas en SmartFloors AI.

---

## 🎯 Características Implementadas

### 1. **Dropdown de Alertas**
- ✅ Botón en el header con badge que muestra el número total de alertas
- ✅ Panel dropdown que se abre/cierra al hacer click
- ✅ Cierre automático al hacer click fuera del panel
- ✅ Animaciones suaves de apertura/cierre con Framer Motion
- ✅ Diseño responsivo con scroll interno

### 2. **Sistema de Filtros**

#### **Filtro por Severidad**
- `Todas` - Muestra todas las alertas
- `Crítico` - Solo alertas críticas
- `Advertencia` - Solo advertencias
- `Normal` - Solo alertas normales

#### **Filtro por Piso**
- `Todos` - Todas las plantas
- `Piso 1, 2, 3, 4, 5` - Filtrado por piso específico
- **Dinámico**: Solo muestra los pisos que tienen alertas

#### **Filtro por Tipo**
- `Todos` - Todos los tipos
- Tipos dinámicos basados en las alertas existentes (e.g., `temperature`, `humidity`, `power`)
- **Dinámico**: Solo muestra tipos presentes en las alertas

#### **Búsqueda por Texto**
- Input de búsqueda en tiempo real
- Busca en: mensaje, nombre del piso, tipo de alerta
- Actualización instantánea de resultados

### 3. **Gestión de Filtros**
- ✅ Botón "Limpiar" para resetear todos los filtros
- ✅ El botón se deshabilita cuando no hay filtros activos
- ✅ Contador de resultados: "Mostrando X de Y alertas"
- ✅ Mensaje específico cuando no hay coincidencias

---

## 📁 Archivos Creados/Modificados

### Nuevo Componente
**`src/components/AlertsDropdown.jsx`**
- Componente principal del dropdown de alertas
- Gestión de estado de filtros
- Lógica de filtrado múltiple
- UI completa con styled-components

### Modificaciones

#### `src/layout/Header.jsx`
**Cambios:**
- ❌ Removido: `AlertsButton` (styled component)
- ❌ Removido: Importaciones de `HiOutlineBell` y `VisualizationSelector`
- ✅ Agregado: Importación de `AlertsDropdown`
- ✅ Actualizado: Props del componente - ahora recibe `alerts`
- ✅ Reemplazado: Botón simple por `<AlertsDropdown alerts={alerts} />`

#### `src/layout/Layout.jsx`
**Cambios:**
- ✅ Actualizado: Props pasadas a `<Header />` - ahora incluye `alerts`
- ✅ Removido: `currentMode` y `onModeChange` del Header (ya no se usan)
- ✅ Limpieza: Removida variable `setVisualizationMode` no utilizada

---

## 🎨 Diseño Visual

### Botón de Alertas
```
┌─────────────────┐
│ 🔔 Alertas  [5] │  ← Badge rojo con contador
└─────────────────┘
```

### Panel Dropdown
```
┌─────────────────────────────────────┐
│ 🚨 Alertas Recientes           [X]  │ ← Header con botón cerrar
├─────────────────────────────────────┤
│ 🔍 Filtros              [Limpiar]   │ ← Sección de filtros
│                                     │
│ Severidad                           │
│ [Todas] [Crítico] [Advertencia]...  │
│                                     │
│ Piso                                │
│ [Todos] [Piso 1] [Piso 2]...        │
│                                     │
│ Tipo                                │
│ [Todos] [temperature] [humidity]... │
│                                     │
│ Buscar                              │
│ [________________]                  │
├─────────────────────────────────────┤
│ Mostrando 3 de 15 alertas           │ ← Contador (solo si hay filtros)
├─────────────────────────────────────┤
│ ┌─────────────────────────────┐    │
│ │ Piso 3          14:32       │    │
│ │ Temperatura alta: 28.5°C    │    │
│ └─────────────────────────────┘    │ ← Lista scrolleable
│ ┌─────────────────────────────┐    │
│ │ Piso 1          14:28       │    │
│ │ Humedad baja: 25%           │    │
│ └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

---

## 🔧 Uso del Componente

### Integración Básica
```jsx
import AlertsDropdown from '../components/AlertsDropdown';

<AlertsDropdown alerts={alerts} />
```

### Formato de Datos de Alertas
```javascript
const alerts = [
  {
    id: 'unique-id',
    floorId: 3,
    floorName: 'Piso 3',
    severity: 'critical',  // 'critical', 'warning', 'normal'
    type: 'temperature',   // Tipo de alerta
    message: 'Temperatura alta: 28.5°C',
    timestamp: '2025-11-12T14:32:00Z'
  },
  // ...más alertas
];
```

---

## 🎯 Lógica de Filtrado

### Filtro Múltiple (AND Logic)
El sistema aplica **todos los filtros activos simultáneamente**:

```javascript
// Ejemplo: Filtros activos
{
  severity: 'critical',
  floor: '3',
  type: 'temperature',
  search: 'alta'
}

// Resultado: Solo alertas que cumplan TODAS las condiciones:
// - Severidad = critical
// - Piso = 3
// - Tipo = temperature
// - Mensaje contenga "alta"
```

### Orden de Aplicación
1. **Severidad** → Filtra por nivel de severidad
2. **Piso** → Filtra por piso específico
3. **Tipo** → Filtra por tipo de alerta
4. **Búsqueda** → Busca texto en mensaje, piso, tipo

---

## 🎨 Colores de Severidad

### Critical (Crítico)
- **Background**: `rgba(255, 77, 79, 0.1)`
- **Border**: `rgba(255, 77, 79, 0.3)`
- **Hover**: `rgba(255, 77, 79, 0.15)`

### Warning (Advertencia)
- **Background**: `rgba(255, 193, 7, 0.1)`
- **Border**: `rgba(255, 193, 7, 0.3)`
- **Hover**: `rgba(255, 193, 7, 0.15)`

### Normal
- **Background**: `rgba(255, 255, 255, 0.03)`
- **Border**: `rgba(100, 108, 255, 0.2)`
- **Hover**: `rgba(255, 255, 255, 0.05)`

---

## 🔄 Estados del Componente

### Estado Inicial
```javascript
{
  severity: 'all',
  floor: 'all',
  type: 'all',
  search: ''
}
```

### Con Filtros Activos
```javascript
{
  severity: 'critical',
  floor: '3',
  type: 'temperature',
  search: 'alta temperatura'
}
```

---

## 📊 Interacciones de Usuario

### Abrir/Cerrar Dropdown
- **Click en botón**: Abre/cierra el dropdown
- **Click fuera**: Cierra automáticamente
- **Botón X**: Cierra el dropdown

### Aplicar Filtros
- **Click en chip de filtro**: Activa/desactiva el filtro
- **Escribir en búsqueda**: Filtra en tiempo real
- **Click en "Limpiar"**: Resetea todos los filtros

### Visualizar Alertas
- **Hover en alerta**: Efecto de highlight
- **Scroll**: Lista scrolleable hasta 350px de altura
- **Animaciones**: Enter/exit suaves con Framer Motion

---

## 🎭 Animaciones

### Entrada/Salida del Dropdown
```javascript
initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -10 }}
transition={{ duration: 0.2 }}
```

### Entrada/Salida de Alertas
```javascript
initial={{ opacity: 0, x: -10 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: 10 }}
transition={{ duration: 0.2 }}
```

---

## 📱 Responsive Design

### Desktop
- **Ancho**: 450px
- **Altura máxima**: 600px
- **Posición**: Top-right del botón

### Scroll
- **Lista de alertas**: Máximo 350px con scroll
- **Scrollbar personalizado**: Azul (#646cff)

---

## 🚀 Mejoras Futuras Posibles

### Funcionalidades
- [ ] Ordenar alertas (fecha, severidad, piso)
- [ ] Marcar alertas como leídas
- [ ] Eliminar alertas individuales
- [ ] Exportar alertas filtradas (CSV, JSON)
- [ ] Notificaciones push para alertas críticas
- [ ] Historial de alertas resueltas

### UI/UX
- [ ] Tooltips explicativos en filtros
- [ ] Accesos rápidos (e.g., "Ver solo críticas")
- [ ] Indicadores visuales de tendencias
- [ ] Modo compacto/expandido
- [ ] Temas de color personalizables

### Performance
- [ ] Virtualización de lista para 100+ alertas
- [ ] Lazy loading de alertas antiguas
- [ ] Caché de filtros en localStorage

---

## 🐛 Debugging

### Ver Alertas Filtradas
```javascript
console.log('Filtros activos:', filters);
console.log('Alertas filtradas:', filteredAlerts);
console.log('Total alertas:', alerts.length);
```

### Verificar Datos
```javascript
// En el componente
useEffect(() => {
  console.log('Alertas recibidas:', alerts);
}, [alerts]);
```

---

## ✅ Checklist de Implementación

- [x] Crear componente `AlertsDropdown.jsx`
- [x] Integrar en `Header.jsx`
- [x] Pasar `alerts` desde `Layout.jsx`
- [x] Implementar filtros de severidad
- [x] Implementar filtros de piso
- [x] Implementar filtros de tipo
- [x] Implementar búsqueda por texto
- [x] Botón "Limpiar filtros"
- [x] Contador de resultados
- [x] Animaciones con Framer Motion
- [x] Badge con contador en botón
- [x] Cierre automático al click fuera
- [x] Styled components para UI completa
- [x] Estados vacío personalizados
- [x] Scroll customizado
- [x] Colores por severidad

---

## 📝 Notas Técnicas

### Performance
- Los filtros dinámicos (piso, tipo) solo muestran opciones disponibles
- El filtrado se ejecuta en el cliente (no requiere backend)
- Uso de `useMemo` recomendado para listas muy grandes (100+ alertas)

### Accesibilidad
- Todos los botones son accesibles por teclado
- Los filtros tienen labels descriptivos
- Contraste de colores cumple WCAG AA

### Compatibilidad
- React 19.2.0 compatible
- Framer Motion 11.x
- Styled Components 6.x
- React Icons (HiOutlineFilter, HiOutlineBell, HiX)

---

## 🎉 Resultado Final

Un sistema de alertas completamente funcional con:
- ✅ Dropdown interactivo y elegante
- ✅ 4 tipos de filtros simultáneos
- ✅ Búsqueda en tiempo real
- ✅ Animaciones suaves
- ✅ Diseño coherente con SmartFloors AI
- ✅ Código limpio y mantenible
