<div align="center">

# 🏢 SmartFloors AI

### _Transformando edificios en organismos vivos inteligentes_

**Dashboard 3D de monitoreo en tiempo real con predicciones ML y detección de anomalías**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black)](https://threejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?logo=socket.io)](https://socket.io/)
![Winner](https://img.shields.io/badge/🏆_Hackathon_Winner-1st_Place-blue?style=for-the-badge)

[🚀 Live Demo](https://hackathon-smarfloors.web.app) • [📚 Documentación](./docs) • [🎨 Visión Creativa](./docs/CREATIVE_VISION.md) • [🏗️ Arquitectura](./docs/ARCHITECTURE.md)

![Hero](docs/HERO.gif)

</div>

---

## 🌟 Visión del Proyecto

> **"Cada piso es un organismo vivo que respira, reacciona y se comunica."**

SmartFloors no es solo un dashboard de monitoreo tradicional. Es una **experiencia narrativa** que reimagina el edificio como un **sistema vivo capaz de anticipar problemas, comunicarse y sugerir acciones** antes de que ocurran.

### 🎯 ¿Qué hace único a SmartFloors?

**No solo muestra datos — los interpreta, predice y narra.**

- Cada piso **cambia de color y pulsa** según su nivel de estrés térmico y energético
- **Predice el futuro** con machine learning (temperatura, humedad, energía a +60min)
- **Detecta anomalías** antes de que se conviertan en problemas críticos
- **Sugiere acciones** específicas con recomendaciones contextuales
- **Experiencia inmersiva** con efectos visuales, partículas y narrativa visual

### 🧬 El Edificio como Organismo Vivo

| Concepto Visual             | Significado Técnico                            |
| --------------------------- | ---------------------------------------------- |
| 🫁 **Respiración (pulso)**  | Actividad del sistema en tiempo real           |
| 🎨 **Color**                | Estado de salud (normal, advertencia, peligro) |
| 🌫️ **Niebla volumétrica**   | Nivel de estrés térmico/energético             |
| ⚡ **Intensidad de brillo** | Consumo energético actual                      |
| 🔮 **Alertas predictivas**  | Anomalías futuras detectadas por ML            |

📖 **Lee más sobre la visión creativa:** [CREATIVE_VISION.md](./docs/CREATIVE_VISION.md)

---

## ⚡ Inicio Rápido

### Prerrequisitos

```bash
Node.js 18+  |  Backend en http://localhost:3000
```

### Instalación en 3 pasos

```bash
# 1️⃣ Clonar e instalar
git clone <url-repositorio>
cd hackaton.smartfloors
npm install

# 2️⃣ Verificar backend
curl http://localhost:3000/health
# ✅ {"status": "ok"}

# 3️⃣ Iniciar frontend
npm run dev
```

**🎉 Listo!** Abre: **http://localhost:5173**

> 📘 **Guía completa de setup:** [docs/setup/GETTING_STARTED.md](./docs/setup/GETTING_STARTED.md)

---

## 🎬 Experiencia del Usuario

### Primera Impresión

Al abrir SmartFloors, verás:

1. **🏢 5 pisos apilados en 3D** — Cada uno respira y cambia de color según su estado
2. **🌌 Fondo espacial inmersivo** — Partículas flotantes y estrellas en movimiento
3. **⚠️ Panel de alertas en tiempo real** — Notificaciones vivas con animaciones
4. **🎛️ Selector de visualización** — Cambia entre modos: Normal, Temperatura, Humedad, Energía, Ocupación

### Interacción Intuitiva

| Acción                       | Resultado                                             |
| ---------------------------- | ----------------------------------------------------- |
| **🖱️ Click en un piso**      | Zoom + paneles flotantes (métricas + predicciones ML) |
| **🔄 Doble click**           | Resetea vista a perspectiva general                   |
| **↔️ Arrastrar**             | Rotación orbital 360°                                 |
| **🔍 Scroll**                | Zoom dinámico                                         |
| **📊 Click pared derecha**   | Abre gráficas de tendencias (4 horas)                 |
| **📋 Click pared izquierda** | Abre tabla completa de alertas                        |

> 🎮 **Guía interactiva completa:** Ver sección "Guía de Uso" más abajo

---

## ✨ Características Principales

### 🎨 Visualización 3D Inmersiva (React Three Fiber)

- **5 bloques 3D animados** — Cada piso respira con efecto de pulso orgánico
- **Sistema de colores dinámicos** — Cambio automático basado en estado de salud
- **Efectos visuales avanzados** — Bloom, Vignette, Fog volumétrico, God rays
- **Fondo espacial vivo** — 200+ partículas flotantes con movimiento Perlin noise
- **Interacción orbital** — Cámara con controles intuitivos y animaciones suaves

### 🔮 Predicciones Machine Learning

- **Horizonte temporal:** 10 a 60 minutos hacia el futuro
- **Variables predichas:** Temperatura, Humedad, Consumo Energético, Ocupación
- **Selector interactivo** para ajustar minutesAhead
- **Modelo híbrido:** Promedio móvil + Regresión lineal
- **Nivel de confianza** normalizado por variable
- **Actualizaciones vía WebSocket** cada 60 segundos

### 🚨 Sistema de Alertas Inteligente

| Tipo de Alerta         | Descripción                             |
| ---------------------- | --------------------------------------- |
| **🔴 Actuales**        | Anomalías detectadas en tiempo real     |
| **🔮 Predictivas**     | Anomalías futuras anticipadas por ML    |
| **⚠️ Recomendaciones** | Acciones específicas sugeridas por tipo |

- **Clasificación automática:** Informativa, Media, Crítica
- **Detección multi-dimensional:** Temp, Humedad, Energía, Sobrecarga térmica, Cambios bruscos
- **Panel lateral animado** con Framer Motion
- **Tabla completa** con filtrado, ordenamiento y exportación CSV

### 📊 Gráficas de Tendencias Históricas

- **4 horas de datos** en tiempo real
- **3 métricas visualizadas:** Temperatura (°C), Humedad (%), Energía (kW)
- **Selector de pisos:** Individual o vista combinada de todos
- **Color-coding por piso** en modo "Todos los Pisos"
- **Tooltips interactivos** con Recharts
- **Actualización dinámica** al cambiar selección

### 🗺️ Heat Layer (Mapa de Calor)

- **5 modos de visualización:**
  - Normal (vista base)
  - Temperatura
  - Humedad
  - Energía
  - Ocupación
- **Gradientes personalizados** por modo
- **Selector visual** en header superior
- **Transiciones suaves** entre modos

📖 **Detalles técnicos:** [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | [COMPONENTS.md](./docs/COMPONENTS.md)

---

## 🛠️ Stack Tecnológico

<div align="center">

| Categoría           | Tecnologías                                                         |
| ------------------- | ------------------------------------------------------------------- |
| **⚛️ Core**         | React 19.2 • Vite 7.2 • React Router 7                              |
| **🎨 3D**           | React Three Fiber • @react-three/drei • @react-three/postprocessing |
| **✨ Animaciones**  | Framer Motion • GSAP concepts                                       |
| **🔌 Comunicación** | Socket.IO Client • REST API (fetch)                                 |
| **🎭 Estilos**      | Styled-components 6.1 • Design Tokens • CSS-in-JS                   |
| **📊 Data Viz**     | Recharts • Custom 3D visualizations                                 |
| **🧪 Calidad**      | ESLint 9.x (flat config) • Prettier • React StrictMode              |

</div>

### 🏗️ Decisiones Arquitectónicas

#### ¿Por qué React Three Fiber?

- **Declarativo sobre imperativo** — JSX para Three.js, más mantenible
- **Reconciliador de React** — Estado + props = 3D reactivo
- **Hooks nativos** — `useFrame`, `useThree` para lógica 3D
- **Ecosistema maduro** — drei, postprocessing, a11y

#### ¿Por qué Socket.IO?

- **Bi-direccional** — Preparado para acciones futuras (ej: controlar AC)
- **Auto-reconexión** — Resiliente a caídas de red
- **Rooms/Namespaces** — Escalable a múltiples edificios
- **Broadcast** — Servidor puede notificar a todos los clientes

#### ¿Por qué Styled-components?

- **CSS-in-JS** — Scoping automático, sin conflictos de clases
- **Theming** — Sistema de diseño centralizado
- **Dynamic styling** — Props → estilos reactivos
- **Transient props** — No contaminan el DOM

📖 **Análisis completo de decisiones:** [TECHNICAL_DECISIONS.md](./docs/TECHNICAL_DECISIONS.md)

---

## 📁 Estructura del Proyecto

```
hackaton.smartfloors/
│
├── src/
│   ├── api/
│   │   ├── rest.js              # 🔌 Cliente REST API
│   │   └── socket.js            # 🔌 Cliente WebSocket (singleton)
│   │
│   ├── components/              # 🧩 Componentes React
│   │   ├── FloorBlock.jsx       # 🏢 Bloque 3D individual (respiración, color, pulso)
│   │   ├── AlertsPanel.jsx      # ⚠️ Panel lateral con alertas animadas
│   │   ├── AlertsTable.jsx      # 📋 Tabla completa (filtros, export CSV)
│   │   ├── PredictionsPanel.jsx # 🔮 Panel de predicciones ML
│   │   ├── TrendCharts.jsx      # 📊 3 gráficas Recharts (4h historial)
│   │   ├── InteractiveWall.jsx  # 🧱 Pared derecha (abre gráficas)
│   │   ├── InteractiveWallLeft.jsx # 🧱 Pared izquierda (abre tabla)
│   │   ├── VisualizationSelector.jsx # 🎛️ Selector de modos
│   │   ├── ColorLegend.jsx      # 🎨 Leyenda de colores por modo
│   │   ├── FloatingParticles.jsx # ✨ 200 partículas con Perlin noise
│   │   ├── GradientBackground.jsx # 🌌 Fondo espacial degradado
│   │   └── VolumetricFog.jsx    # 🌫️ Niebla volumétrica por estado
│   │
│   ├── scenes/
│   │   └── BuildingScene.jsx    # 🎬 Escena 3D completa (5 pisos + lighting)
│   │
│   ├── hooks/                   # 🪝 Custom React Hooks
│   │   ├── useRealTimeData.js   # 📡 Híbrido REST + WebSocket
│   │   ├── useCameraZoom.js     # 📷 Control de cámara (zoom, reset)
│   │   └── useVisualizationMode.js # 🗺️ Manejo de modos de visualización
│   │
│   ├── layout/
│   │   ├── Layout.jsx           # 🏗️ Layout principal (Outlet + contexto)
│   │   └── Header.jsx           # 🎯 Header con navegación + selector
│   │
│   ├── pages/
│   │   ├── Home.jsx             # 🏠 Página principal (Dashboard 3D)
│   │   ├── Analytics.jsx        # 📈 Analytics (futuro)
│   │   └── AlertsTableDemo.jsx  # 📋 Demo de tabla standalone
│   │
│   ├── styles/                  # 🎨 Sistema de diseño
│   │   ├── theme.js             # 🎨 Tema de colores + breakpoints
│   │   ├── scssTokens.js        # 📐 Tokens de diseño (spacing, fonts)
│   │   ├── mixins.js            # 🧬 Mixins reutilizables (flex, grid)
│   │   └── *.styled.js          # 💅 Styled-components por módulo
│   │
│   ├── utils/
│   │   ├── webSocket.utils.js   # 🧮 Cálculo de estado (heat state)
│   │   └── alertValidation.js   # ✅ Normalización de severidad
│   │
│   ├── config/
│   │   ├── visualizationModes.js # 🗺️ Configuración de modos
│   │   ├── heatLayerConfig.js   # 🔥 Gradientes por modo
│   │   └── energyBarsConfig.js  # ⚡ Config de barras de energía
│   │
│   ├── App.jsx                  # 🚀 Componente raíz con Router
│   ├── main.jsx                 # 🎯 Entry point (StrictMode)
│   └── index.css                # 🌍 Estilos globales (reset, fonts)
│
├── docs/                        # 📚 Documentación profesional
│   ├── ARCHITECTURE.md          # 🏗️ Arquitectura técnica
│   ├── CREATIVE_VISION.md       # 🎨 Visión narrativa
│   ├── TECHNICAL_DECISIONS.md   # 🤔 Decisiones justificadas
│   ├── HACKATHON_PITCH.md       # 🎤 Documento para jurado
│   ├── COMPONENTS.md            # 🧩 Diagrama de componentes
│   └── DATA_FLOW.md             # 📊 Pipeline de datos
│
├── public/                      # 📦 Assets estáticos
│
├── package.json                 # 📋 Dependencias
├── vite.config.js              # ⚡ Config de Vite
├── eslint.config.js            # 🧹 ESLint 9.x flat config
└── README.md                    # 📖 Este archivo
```

📖 **Diagrama de componentes detallado:** [COMPONENTS.md](./docs/COMPONENTS.md)

---

## 🔌 Integración con Backend

### 📡 Flujo de Datos Híbrido

SmartFloors usa un enfoque **REST para carga inicial + WebSocket para actualizaciones en tiempo real**:

```
1️⃣ Carga inicial (REST)
   └─→ GET /api/v1/floors (5 pisos)
   └─→ GET /api/v1/alerts (alertas activas)

2️⃣ Conexión WebSocket
   └─→ Socket.IO en http://localhost:3000

3️⃣ Suscripciones tiempo real
   ├─→ floor-data (cada 60s)
   ├─→ new-alerts (cuando hay anomalías)
   └─→ predictions (actualizaciones ML)

4️⃣ Actualizaciones React State
   └─→ useRealTimeData hook
```

### 🔗 Endpoints REST API

| Método | Endpoint                                         | Descripción         | Uso                      |
| ------ | ------------------------------------------------ | ------------------- | ------------------------ |
| `GET`  | `/health`                                        | Health check        | Verificar backend activo |
| `GET`  | `/api/v1/floors`                                 | Todos los pisos (5) | Carga inicial            |
| `GET`  | `/api/v1/floors/:id`                             | Piso específico     | Detalles individuales    |
| `GET`  | `/api/v1/floors/:id/predictions?minutesAhead=60` | Predicciones ML     | Panel de predicciones    |
| `GET`  | `/api/v1/floors/:id/history?limit=60`            | Historial 4h        | Gráficas de tendencias   |
| `GET`  | `/api/v1/alerts`                                 | Alertas activas     | Panel de alertas         |
| `GET`  | `/api/v1/export/alerts/csv`                      | Exportar CSV        | Descarga de alertas      |

### 📨 Eventos WebSocket (Socket.IO)

| Evento        | Dirección       | Frecuencia | Payload                         | Uso                            |
| ------------- | --------------- | ---------- | ------------------------------- | ------------------------------ |
| `floor-data`  | Server → Client | Cada 60s   | `{floors: [...]}`               | Actualizar métricas en vivo    |
| `new-alerts`  | Server → Client | On anomaly | `{alerts: [...]}`               | Notificación de nuevas alertas |
| `predictions` | Server → Client | Cada 60s   | `{floorId, predictions: [...]}` | Actualizar predicciones ML     |

### 📦 Estructura de Datos

**Floor Object (del backend):**

```javascript
{
  floorId: 1,
  name: "Piso 1",
  temperature: 22.5,        // °C
  humidity: 45.2,           // %
  powerConsumption: 78.3,   // kW
  occupancy: 65,            // personas
  timestamp: "2025-11-13T10:30:00Z"
}
```

**Floor Object (procesado en frontend):**

```javascript
{
  ...backendData,
  status: "normal",         // 🟢 normal | 🟡 warning | 🔴 danger
  heatState: "normal",      // Estado térmico calculado
  color: "#00ff88",         // Color para visualización 3D
  pulseIntensity: 0.5      // Intensidad de pulso (0-1)
}
```

**Alert Object:**

```javascript
{
  floorId: 3,
  floorName: "Piso 3",
  timestamp: "2025-11-13T10:30:00Z",
  anomalies: [
    {
      type: "temperature",           // temperature | humidity | energy | thermal_overload | sudden_change
      severity: "warning",           // info | warning | critical
      message: "Temperatura alta detectada",
      value: 28.5,
      threshold: 26.0,
      recommendation: "Aumentar ventilación o ajustar aire acondicionado",
      isPredictive: false           // true si es predicción ML
    }
  ]
}
```

**Prediction Object:**

```javascript
{
  floorId: 2,
  predictions: [
    {
      minutesAhead: 10,
      temperature: 23.2,
      humidity: 47.5,
      powerConsumption: 82.1,
      occupancy: 68,
      confidence: 0.92           // 0-1 (nivel de confianza del modelo)
    },
    // ... hasta minutesAhead: 60
  ]
}
```

📖 **Pipeline completo de datos:** [DATA_FLOW.md](./docs/DATA_FLOW.md)

---

## 🎮 Guía de Uso

### Navegación Principal

1. **Vista General**: Observa los 5 pisos apilados
2. **Identifica estados** por color (🟢 🟡 🔴)
3. **Revisa alertas** en panel lateral
4. **Cambia modo** con selector superior derecho

### Paneles de Información

**Click en un piso**:

- Panel izquierdo: Métricas actuales
- Panel derecho: Predicciones ML
- Botones: Ver Gráficas / Ver Alertas

### Gráficas de Tendencias

1. Click en pared derecha
2. Selecciona piso o "Todos"
3. Visualiza 3 gráficas (4 horas)
4. Click "✕ Cerrar"

### Tabla de Alertas

1. Click en pared izquierda
2. Ordena por columnas
3. Identifica alertas predictivas (🔮)

---

## 🎨 Cálculo de Estados

### Temperatura

- < 18°C → 🔴 Peligro
- 18-20°C → 🟡 Advertencia
- 20-24°C → 🟢 Normal
- 24-26°C → 🟡 Advertencia
- > 26°C → 🔴 Peligro

### Humedad

- < 30% → 🔴 Peligro
- 30-35% → 🟡 Advertencia
- 35-60% → 🟢 Normal
- 60-70% → 🟡 Advertencia
- > 70% → 🔴 Peligro

### Consumo

- 0-135 kW → 🟢 Normal
- 135-150 kW → 🟡 Advertencia
- > 150 kW → 🔴 Peligro

**Estado final**: El peor de los 3

---

## 🔧 Scripts

```bash
# Desarrollo
npm run dev              # http://localhost:5173

# Build
npm run build            # → dist/
npm run preview          # Preview build

# Calidad
npm run lint             # Verificar
npm run lint:fix         # Auto-fix
npm run format           # Formatear
npm run format:check     # Solo verificar
```

---

## 🐛 Troubleshooting

### WebSocket no conecta

```bash
# Verificar backend
curl http://localhost:3000/health

# Revisar consola: "✅ WebSocket connected"
```

### Carga infinita

```bash
# Verificar endpoint
curl http://localhost:3000/api/v1/floors

# Debe retornar 5 pisos
```

### Sin alertas

```bash
# Verificar endpoint
curl http://localhost:3000/api/v1/alerts

# Estructura:
# {alerts: [{floorId, timestamp, anomalies: [...]}]}
```

### Gráficas vacías

```bash
# Verificar historial
curl "http://localhost:3000/api/v1/floors/1/history?limit=48"
```

---

## 🚀 Despliegue

### 1. Build

```bash
npm run build
# → dist/
```

### 2. Configurar URLs

**src/api/rest.js:**

```javascript
const BASE_URL = 'https://tu-backend.com/api/v1';
```

**src/api/socket.js:**

```javascript
const socket = io('https://tu-backend.com', { ... });
```

### 3. Deploy

**Vercel:**

```bash
npm i -g vercel
vercel
```

**Netlify:**

- Build: `npm run build`
- Publish: `dist`
- Redirects: `public/_redirects`

**Nginx:**

```nginx
server {
    root /var/www/smartfloors/dist;
    try_files $uri $uri/ /index.html;
}
```

---

## 📚 Navegación de Documentación

### 🎯 Para el Jurado / Evaluadores

- **[🎤 HACKATHON_PITCH.md](./docs/HACKATHON_PITCH.md)** — Documento ejecutivo con justificación técnica y creativa
- **[🎨 CREATIVE_VISION.md](./docs/CREATIVE_VISION.md)** — Narrativa del edificio como organismo vivo
- **[🏗️ ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — Arquitectura técnica completa

### 🔧 Para Desarrolladores

- **[🧩 COMPONENTS.md](./docs/COMPONENTS.md)** — Diagrama y jerarquía de componentes
- **[📊 DATA_FLOW.md](./docs/DATA_FLOW.md)** — Pipeline de datos REST + WebSocket
- **[🤔 TECHNICAL_DECISIONS.md](./docs/TECHNICAL_DECISIONS.md)** — Decisiones arquitectónicas justificadas
- **[🚀 GETTING_STARTED.md](./docs/setup/GETTING_STARTED.md)** — Guía completa de setup

### 📖 Documentación Existente

- [Data Integration](./docs/api/DATA_INTEGRATION.md) — Integración con backend
- [WebSocket Testing](./docs/testing/WEBSOCKET_TESTING.md) — Guía de testing
- [Visualization Modes](./VISUALIZATION_SELECTOR.md) — Modos de visualización
- [Copilot Instructions](./.github/copilot-instructions.md) — Convenciones del proyecto

---

## ✅ Funcionalidades

| Feature             | Estado |
| ------------------- | ------ |
| Visualización 3D    | ✅     |
| REST API            | ✅     |
| WebSocket           | ✅     |
| Predicciones ML     | ✅     |
| Alertas             | ✅     |
| Alertas Predictivas | ✅     |
| Gráficas Tendencias | ✅     |
| Selector Pisos      | ✅     |
| Tabla Alertas       | ✅     |
| Heat Layer          | ✅     |
| Exportar CSV        | ✅     |
| Efectos Visuales    | ✅     |

---

## 📊 Métricas

- **Componentes**: 25+
- **Hooks**: 3 personalizados
- **Rutas**: 2
- **Eventos WS**: 3
- **Endpoints REST**: 7
- **Build Size**: ~800KB (gzipped)

---

## 🤝 Contribución

### Convenciones

1. Componentes: PascalCase, export default
2. Props: camelCase, prefijo `$` para transient
3. Hooks: Prefijo `use`, camelCase
4. Constants: UPPER_SNAKE_CASE

### Workflow

```bash
git checkout -b feature/nueva-funcionalidad
# desarrollar...
npm run lint
npm run format
git commit -m "feat: descripción"
git push
# PR
```

---

## 📞 Soporte

### Recursos

- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- Vite: https://vitejs.dev/
- Socket.IO: https://socket.io/docs/

---

## 🎯 Roadmap & Visión Futura

### ✅ Implementado (v2.0)

- [x] Visualización 3D inmersiva con React Three Fiber
- [x] Sistema de alertas en tiempo real con clasificación
- [x] Predicciones ML a +60 minutos
- [x] Alertas predictivas (🔮)
- [x] Gráficas de tendencias históricas (4h)
- [x] Múltiples modos de visualización (Heat Layer)
- [x] WebSocket + REST híbrido
- [x] Exportación CSV de alertas
- [x] Sistema de recomendaciones contextuales

### 🚀 Próximas Iteraciones

**v2.1 — Expansión de Inteligencia**

- [ ] Dashboard analytics avanzado con métricas agregadas
- [ ] Reportes PDF automatizados (diarios/semanales)
- [ ] Comparativas entre pisos
- [ ] Detección de patrones de uso

**v2.2 — Escalabilidad**

- [ ] Soporte para múltiples edificios
- [ ] Vista de campus completo
- [ ] Filtros avanzados por edificio/piso
- [ ] Modo offline con Service Workers

**v2.3 — Experiencia de Usuario**

- [ ] Notificaciones push (Web Push API)
- [ ] i18n (Español, Inglés)
- [ ] Modo oscuro/claro toggle
- [ ] Tours guiados (onboarding)

**v2.4 — Testing & Calidad**

- [ ] Tests e2e con Playwright
- [ ] Tests unitarios con Vitest
- [ ] Storybook para componentes
- [ ] Performance budgets

---

<div align="center">

## 🏆 SmartFloors AI

**Transformando datos en experiencias narrativas**

Desarrollado con ❤️ usando **React 19 + Vite + React Three Fiber + Socket.IO**

---

**Versión:** 2.0.0  
**Tiempo de setup:** ⏱️ 5 minutos  
**Última actualización:** Noviembre 2025

---

[🚀 Live Demo](https://hackathon-smarfloors.web.app) • [📚 Documentación](./docs) • [🎤 Pitch para Jurado](./docs/HACKATHON_PITCH.md)

---

_"Cada piso respira, reacciona y se comunica. SmartFloors no solo muestra lo que pasa — interpreta, predice y narra lo que el edificio necesita."_

</div>
