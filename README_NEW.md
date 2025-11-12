# SmartFloors AI - Dashboard 3D de Monitoreo en Tiempo Real

**Sistema de monitoreo inteligente para edificios** con visualización 3D, predicciones ML y detección de anomalías en tiempo real.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black)](https://threejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?logo=socket.io)](https://socket.io/)

---

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js 18+** ([Descargar aquí](https://nodejs.org/))
- **Backend corriendo** en `http://localhost:3000`

### Instalación

```bash
# 1. Clonar repositorio
git clone <url-repositorio>
cd hackaton.smartfloors

# 2. Instalar dependencias (~2 minutos)
npm install

# 3. Verificar backend
curl http://localhost:3000/health
# Respuesta esperada: {"status": "ok"}

# 4. Iniciar aplicación
npm run dev
```

✅ **Listo!** Abre tu navegador en: **http://localhost:5173**

---

## 📋 ¿Qué verás?

### Visualización 3D Principal

- **5 pisos** con colores según estado (🟢 Normal, 🟡 Advertencia, 🔴 Peligro)
- **Datos en tiempo real** de temperatura, humedad, energía y ocupación
- **Alertas activas** en panel lateral derecho
- **Fondo inmersivo** con partículas y estrellas

### Interacción

| Acción | Resultado |
|--------|-----------|
| **Click en un piso** | Muestra paneles con métricas detalladas + predicciones ML |
| **Doble click** | Resetea la vista a perspectiva general |
| **Arrastrar** | Rota la cámara 360° |
| **Scroll** | Zoom in/out |
| **Click en pared derecha** | Abre gráficas de tendencias (4 horas) |
| **Click en pared izquierda** | Abre tabla completa de alertas |

---

## ✨ Características Principales

### 🎨 Visualización 3D Interactiva

- **Bloques 3D** por cada piso con animación de respiración
- **Colores dinámicos** según estado calculado automáticamente
- **Efectos visuales**: Bloom, Vignette, Fog volumétrico
- **Partículas flotantes** y fondo de estrellas animado

### 🔮 Predicciones ML

- Predicciones de **10 a 60 minutos** hacia el futuro
- Variables predichas: Temperatura, Humedad, Energía, Ocupación
- **Selector de tiempo** para ajustar horizonte de predicción
- Actualizaciones automáticas vía WebSocket

### 🚨 Sistema de Alertas Inteligente

- **Detección de anomalías** en tiempo real
- **Clasificación automática**: Informativa, Media, Crítica
- **Alertas predictivas**: 🔮 Predicción de anomalías futuras
- **Recomendaciones** específicas por tipo de alerta
- **Tabla interactiva** con filtrado y ordenamiento

### 📊 Gráficas de Tendencias (4 horas)

- **Selector de pisos** individual o vista combinada de todos
- **3 métricas**: Temperatura, Humedad, Consumo Energético
- **Colores únicos** por piso en modo "Todos los Pisos"
- **Actualización dinámica** al cambiar de piso

### ⚡ Heat Layer (Mapa de Calor)

- **Múltiples modos**: Normal, Temperatura, Humedad, Energía, Ocupación
- **Gradientes de color** configurables
- **Selector visual** en esquina superior derecha

---

## 🛠️ Stack Tecnológico

### Frontend Core
- **React 19.2.0** - UI Library
- **Vite 7.2.2** - Build tool con HMR
- **React Router 7** - Navegación SPA

### 3D & Animaciones
- **React Three Fiber** - React renderer para Three.js
- **@react-three/drei** - Helpers 3D
- **@react-three/postprocessing** - Efectos visuales
- **Framer Motion** - Animaciones UI

### Estado & Comunicación
- **Socket.IO Client** - WebSocket real-time
- **React Hooks** - Estado local
- **Context API** - Compartir datos

### Estilos
- **Styled Components 6.1.19** - CSS-in-JS
- **Design Tokens** - Sistema consistente

### Gráficas
- **Recharts** - LineChart responsivas

---

## 📁 Estructura del Proyecto

```
hackaton.smartfloors/
│
├── src/
│   ├── api/
│   │   ├── rest.js              # Cliente REST API
│   │   └── socket.js            # Cliente WebSocket
│   │
│   ├── components/
│   │   ├── FloorBlock.jsx       # Bloque 3D de piso
│   │   ├── AlertsPanel.jsx      # Panel lateral de alertas
│   │   ├── AlertsTable.jsx      # Tabla completa de alertas
│   │   ├── PredictionsPanel.jsx # Panel de predicciones ML
│   │   ├── TrendCharts.jsx      # Gráficas de tendencias
│   │   ├── InteractiveWall.jsx  # Pared derecha (gráficas)
│   │   ├── InteractiveWallLeft.jsx # Pared izquierda (tabla)
│   │   └── ... (más componentes)
│   │
│   ├── scenes/
│   │   └── BuildingScene.jsx    # Escena 3D principal
│   │
│   ├── hooks/
│   │   ├── useRealTimeData.js   # Hook de datos REST + WebSocket
│   │   ├── useCameraZoom.js     # Control de cámara
│   │   └── useVisualizationMode.js
│   │
│   ├── layout/
│   │   ├── Layout.jsx           # Layout principal
│   │   └── Header.jsx           # Header con navegación
│   │
│   ├── pages/
│   │   ├── Home.jsx             # Página principal (3D)
│   │   └── Analytics.jsx        # Analytics
│   │
│   ├── styles/
│   │   ├── theme.js             # Tema de colores
│   │   └── scssTokens.js        # Tokens de diseño
│   │
│   ├── utils/
│   │   ├── webSocket.utils.js   # Cálculo de estado
│   │   └── alertValidation.js   # Normalización
│   │
│   ├── config/
│   │   └── visualizationModes.js
│   │
│   ├── App.jsx                  # Componente raíz
│   ├── main.jsx                 # Entry point
│   └── index.css                # Estilos globales
│
├── docs/                        # Documentación
├── public/                      # Recursos estáticos
│
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

## 🔌 Integración con Backend

### Endpoints REST API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/v1/floors` | Todos los pisos |
| `GET` | `/api/v1/floors/:id` | Piso específico |
| `GET` | `/api/v1/floors/:id/predictions?minutesAhead=60` | Predicciones ML |
| `GET` | `/api/v1/floors/:id/history?limit=60` | Historial |
| `GET` | `/api/v1/alerts` | Alertas activas |
| `GET` | `/api/v1/export/alerts/csv` | Exportar CSV |

### Eventos WebSocket

| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `floor-data` | Servidor → Cliente | Actualización de métricas |
| `new-alerts` | Servidor → Cliente | Nuevas alertas |
| `predictions` | Servidor → Cliente | Predicciones ML |

### Estructura de Datos

**Floor Object:**
```javascript
{
  floorId: 1,
  name: "Piso 1",
  temperature: 22.5,
  humidity: 45.2,
  powerConsumption: 78.3,
  occupancy: 65,
  status: "normal" // Calculado por frontend
}
```

**Alert Object:**
```javascript
{
  floorId: 3,
  floorName: "Piso 3",
  timestamp: "2025-11-12T10:30:00Z",
  anomalies: [
    {
      type: "temperature",
      severity: "warning",
      message: "Temperatura alta",
      value: 28.5,
      recommendation: "Ajustar AC",
      isPredictive: false
    }
  ]
}
```

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

## 📚 Documentación

- [Copilot Instructions](./.github/copilot-instructions.md)
- [Getting Started](./docs/setup/GETTING_STARTED.md)
- [Data Integration](./docs/api/DATA_INTEGRATION.md)
- [Visualization Modes](./VISUALIZATION_MODES_GUIDE.md)
- [System Architecture](./docs/architecture/SYSTEM_ARCHITECTURE.md)

---

## ✅ Funcionalidades

| Feature | Estado |
|---------|--------|
| Visualización 3D | ✅ |
| REST API | ✅ |
| WebSocket | ✅ |
| Predicciones ML | ✅ |
| Alertas | ✅ |
| Alertas Predictivas | ✅ |
| Gráficas Tendencias | ✅ |
| Selector Pisos | ✅ |
| Tabla Alertas | ✅ |
| Heat Layer | ✅ |
| Exportar CSV | ✅ |
| Efectos Visuales | ✅ |

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

## 🎯 Roadmap

- [ ] Dashboard analytics avanzado
- [ ] Exportar reportes PDF
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Múltiples edificios
- [ ] Tests e2e
- [ ] i18n

---

**Desarrollado con ❤️ usando React + Vite + Three.js**

**Versión:** 2.0.0  
**Tiempo de setup:** ⏱️ 5 minutos  
**Última actualización:** Noviembre 2025
