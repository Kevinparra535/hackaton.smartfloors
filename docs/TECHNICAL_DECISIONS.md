# 🤔 Decisiones Técnicas — SmartFloors AI

> **Justificación de decisiones arquitectónicas clave del proyecto**

---

## 📋 Decisiones Principales

### 1. React Three Fiber sobre Three.js Vanilla

**Decisión:** Usar React Three Fiber en lugar de Three.js puro

#### ✅ Justificación

| Aspecto | Three.js Vanilla | React Three Fiber | Ganador |
|---------|------------------|-------------------|---------|
| **Paradigma** | Imperativo (`scene.add(mesh)`) | Declarativo (`<mesh />`) | R3F ✅ |
| **Estado** | Manual (refs, variables) | React hooks | R3F ✅ |
| **Mantenibilidad** | Código verboso | Componentes reutilizables | R3F ✅ |
| **Integración** | Acoplamiento manual | Nativo con React | R3F ✅ |
| **Ecosistema** | Limitado | drei, postprocessing, a11y | R3F ✅ |

#### Código Comparativo

**Three.js Vanilla (imperativo):**
```javascript
const geometry = new THREE.BoxGeometry(10, 2, 10);
const material = new THREE.MeshStandardMaterial({ color: '#00ff88' });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, index * 3, 0);
scene.add(mesh);

// Animación
function animate() {
  mesh.scale.y = 1 + Math.sin(Date.now() * 0.001) * 0.05;
  requestAnimationFrame(animate);
}
```

**React Three Fiber (declarativo):**
```jsx
<mesh position={[0, index * 3, 0]}>
  <boxGeometry args={[10, 2, 10]} />
  <meshStandardMaterial color="#00ff88" />
</mesh>

// Animación
useFrame((state) => {
  meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime) * 0.05;
});
```

**Resultado:**
- 60% menos código
- Estado reactivo automático
- Componentes reutilizables

---

### 2. Socket.IO sobre WebSocket Nativo

**Decisión:** Usar Socket.IO Client en lugar de WebSocket API

#### ✅ Justificación

| Característica | WebSocket Nativo | Socket.IO | Ganador |
|---------------|------------------|-----------|---------|
| **Auto-reconexión** | Manual | Automática (5 intentos) | Socket.IO ✅ |
| **Eventos nombrados** | No (solo `message`) | Sí (`floor-data`, `alerts`) | Socket.IO ✅ |
| **Fallback** | No | Long-polling si WS falla | Socket.IO ✅ |
| **Rooms/Namespaces** | No | Sí (escalabilidad futura) | Socket.IO ✅ |
| **Bi-dirección** | Manual | Built-in (`emit`/`on`) | Socket.IO ✅ |

#### Código Comparativo

**WebSocket Nativo:**
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  // ❌ Necesitas parsear y enrutar manualmente
  if (data.type === 'floor-data') {
    handleFloorData(data.payload);
  } else if (data.type === 'alerts') {
    handleAlerts(data.payload);
  }
};

ws.onerror = () => {
  // ❌ Reconexión manual
  setTimeout(() => {
    ws = new WebSocket('ws://localhost:3000');
  }, 1000);
};
```

**Socket.IO:**
```javascript
const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

// ✅ Eventos tipados y auto-reconexión
socket.on('floor-data', handleFloorData);
socket.on('new-alerts', handleAlerts);
socket.on('predictions', handlePredictions);
```

**Ventaja clave:**
Preparado para **acciones bi-direccionales futuras** (ej: `socket.emit('control-ac', { floorId: 2, temp: 22 })`).

---

### 3. Híbrido REST + WebSocket sobre Solo WebSocket

**Decisión:** Carga inicial con REST, actualizaciones con WebSocket

#### ✅ Justificación

**Problema:** ¿Cómo obtener datos iniciales antes de que lleguen eventos WebSocket?

| Enfoque | Ventajas | Desventajas | Elegido |
|---------|----------|-------------|---------|
| **Solo REST** | Simple, cacheable | No real-time | ❌ |
| **Solo WebSocket** | Real-time puro | Espera evento inicial (UX mala) | ❌ |
| **Híbrido REST+WS** | Carga rápida + real-time | Algo más complejo | ✅ |

#### Flujo Implementado

```javascript
// useRealTimeData.js
useEffect(() => {
  // 1️⃣ Carga inicial optimista (REST)
  Promise.all([
    apiFetch('/floors'),
    apiFetch('/alerts')
  ]).then(([floorsData, alertsData]) => {
    setFloors(floorsData.floors);
    setAlerts(alertsData.alerts);
    setIsLoading(false); // ✅ Usuario ve datos inmediatamente
  });

  // 2️⃣ Suscripción WebSocket (actualizaciones)
  const socket = getSocket();
  socket.on('floor-data', setFloors); // Sobrescribe con datos frescos
  socket.on('new-alerts', setAlerts);
}, []);
```

**Ventajas:**
- ✅ **TTI (Time To Interactive) < 1s** — Datos iniciales cargados rápido
- ✅ **Actualizaciones en tiempo real** — WebSocket mantiene sincronía
- ✅ **Fallback resiliente** — Si WS falla, datos REST siguen disponibles

---

### 4. Styled-components sobre CSS Modules

**Decisión:** CSS-in-JS con styled-components

#### ✅ Justificación

| Aspecto | CSS Modules | Styled-components | Ganador |
|---------|-------------|-------------------|---------|
| **Scoping** | Automático (hash) | Automático (hash) | Empate |
| **Dynamic Styles** | `className={styles[status]}` | Props directas | SC ✅ |
| **Theming** | Variables CSS (manual) | ThemeProvider (built-in) | SC ✅ |
| **Type Safety** | No | Sí (con TS) | SC ✅ |
| **Colocation** | Archivos `.module.css` separados | En mismo archivo JSX | SC ✅ |

#### Ejemplo: Estilos Dinámicos

**CSS Modules:**
```jsx
// Alert.module.css
.alert { border: 1px solid; }
.alert--info { border-color: blue; }
.alert--warning { border-color: yellow; }
.alert--critical { border-color: red; }

// Alert.jsx
<div className={`${styles.alert} ${styles[`alert--${severity}`]}`}>
```

**Styled-components:**
```jsx
const Alert = styled.div`
  border: 1px solid;
  border-color: ${({ $severity }) => {
    if ($severity === 'info') return '#4dabf7';
    if ($severity === 'warning') return '#ffd966';
    return '#ff4d4f';
  }};
`;

<Alert $severity={severity}>
```

**Ventaja clave:**
Props con **prefijo `$`** (transient props) no contaminan el DOM.

---

### 5. React Hooks sobre Redux

**Decisión:** Estado local con hooks + Context API

#### ✅ Justificación

**Análisis de necesidades:**

| Requisito | Redux | React Hooks | Elegido |
|-----------|-------|-------------|---------|
| **Estado global** | ✅ | ✅ Context API | Hooks ✅ |
| **Time-travel debugging** | ✅ | ❌ | No requerido |
| **Middleware** | ✅ | ❌ | No requerido |
| **Complejidad setup** | Alta | Baja | Hooks ✅ |
| **Bundle size** | +10KB | 0KB | Hooks ✅ |

**Escenario SmartFloors:**
- Estado global limitado: `alerts[]`, `floors[]`, `isConnected`
- No necesita time-travel (no es app colaborativa)
- Actualizaciones vienen de WebSocket (no actions manuales)

**Implementación:**
```jsx
// Layout.jsx
const [alerts, setAlerts] = useState([]);
const [floors, setFloors] = useState([]);

useRealTimeData({
  onFloorsUpdate: setFloors,
  onAlertsUpdate: setAlerts
});

<LayoutContext.Provider value={{ alerts, floors }}>
  <Outlet />
</LayoutContext.Provider>

// Cualquier componente hijo
const { alerts } = useContext(LayoutContext);
```

**Resultado:**
- ✅ 0 KB overhead
- ✅ Setup en 5 líneas
- ✅ Suficiente para escala actual (5 pisos, <100 alertas)

---

### 6. Vite sobre Create React App

**Decisión:** Vite como build tool

#### ✅ Justificación

| Métrica | Create React App | Vite | Diferencia |
|---------|------------------|------|-----------|
| **Dev server start** | ~15s | ~1s | **15x más rápido** |
| **HMR** | ~2s | ~50ms | **40x más rápido** |
| **Build time** | ~60s | ~20s | **3x más rápido** |
| **Bundle size** | 450 KB | 420 KB | Menor |

**Características clave de Vite:**
- ✅ **ES Modules nativos** — No bundling en desarrollo
- ✅ **esbuild** — Parser en Go (muy rápido)
- ✅ **HMR granular** — Solo recarga componente editado
- ✅ **Tree-shaking agresivo** — Build más pequeño

**Experiencia de desarrollo:**
```bash
# CRA
npm start
# Esperando... (15s)
# Editas componente
# Esperando... (2s)

# Vite
npm run dev
# ✅ Listo en 1s
# Editas componente
# ✅ Actualizado instantáneamente (50ms)
```

---

### 7. ESLint 9.x Flat Config sobre .eslintrc

**Decisión:** Adoptar flat config format tempranamente

#### ✅ Justificación

**ESLint migró a flat config en v9.x.** Adoptarlo ahora evita migración futura.

**Formato anterior (.eslintrc.json):**
```json
{
  "extends": ["react-app"],
  "rules": {
    "no-unused-vars": "warn"
  }
}
```

**Formato nuevo (eslint.config.js):**
```javascript
export default [
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }]
    }
  }
];
```

**Ventajas:**
- ✅ **Programático** — JavaScript puro (más flexible)
- ✅ **TypeScript-friendly** — Mejor para configs complejas
- ✅ **Futuro-proof** — Estándar oficial de ESLint

---

### 8. Framer Motion sobre React Spring

**Decisión:** Framer Motion para animaciones UI

#### ✅ Justificación

| Aspecto | React Spring | Framer Motion | Ganador |
|---------|--------------|---------------|---------|
| **API** | Hooks complejos | Declarativa (`<motion.div>`) | FM ✅ |
| **Documentación** | Buena | Excelente | FM ✅ |
| **Variants** | No | Sí (reutilizables) | FM ✅ |
| **Exit animations** | Manual | `<AnimatePresence>` | FM ✅ |
| **Gestures** | Manual | `whileHover`, `whileTap` | FM ✅ |

**Ejemplo: Animación de entrada de sidebar**

**React Spring:**
```jsx
const props = useSpring({
  transform: isOpen ? 'translateX(0)' : 'translateX(400px)'
});

<animated.div style={props}>
```

**Framer Motion:**
```jsx
<motion.div
  initial={{ x: 400 }}
  animate={{ x: isOpen ? 0 : 400 }}
  exit={{ x: 400 }}
  transition={{ type: 'spring', damping: 20 }}
>
```

**Ventaja clave:**
Exit animations con `<AnimatePresence>` (crucial para sidebar).

---

## 🎯 Resumen de Trade-offs

| Decisión | Ganancia Principal | Trade-off |
|----------|-------------------|-----------|
| **R3F** | Declarativo, componentes reutilizables | Curva de aprendizaje |
| **Socket.IO** | Auto-reconexión, eventos tipados | +40KB bundle |
| **Híbrido REST+WS** | Carga rápida + real-time | Algo más complejo |
| **Styled-components** | Dynamic styling, theming | Runtime CSS |
| **React Hooks** | Simplicidad, 0KB overhead | No time-travel debugging |
| **Vite** | HMR instantáneo, build rápido | Ecosystem menos maduro que Webpack |
| **Flat Config** | Futuro-proof, programático | Requiere ESLint 9+ |
| **Framer Motion** | Exit animations, gestures | +50KB bundle |

---

## 🔮 Decisiones Futuras (v2.x)

### En Consideración

1. **TypeScript Migration**
   - **Ventajas:** Type safety, mejor DX
   - **Trade-off:** Migración de ~25 componentes

2. **React Query (TanStack Query)**
   - **Ventajas:** Cache, refetch automático, invalidación
   - **Trade-off:** Overlap con WebSocket (necesario evaluar)

3. **Zustand sobre Context API**
   - **Ventajas:** Menos re-renders, devtools
   - **Trade-off:** +3KB, cambio de paradigma

4. **Vitest + Playwright**
   - **Ventajas:** Tests automatizados
   - **Trade-off:** Setup inicial, tiempo de desarrollo

---

<div align="center">

**Decisiones arquitectónicas justificadas**  
SmartFloors AI — Hackathon 2025

[← Volver al README](../README.md) | [Ver Arquitectura →](./ARCHITECTURE.md)

</div>
