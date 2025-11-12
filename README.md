# SmartFloors AI — Dashboard 3D# SmartFloors AI — Frontend



**Monitoreo en tiempo real de edificios inteligentes** con visualización 3D, predicciones ML y detección de anomalías.**Real-time 3D building monitoring dashboard** with ML-powered predictions and anomaly detection for smart buildings.



[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)

[![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?logo=vite)](https://vitejs.dev/)[![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?logo=vite)](https://vitejs.dev/)

[![Three.js](https://img.shields.io/badge/Three.js-React_Three_Fiber-000000)](https://threejs.org/)[![Three.js](https://img.shields.io/badge/Three.js-0.181.1-000000?logo=three.js)](https://threejs.org/)

[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?logo=socket.io)](https://socket.io/)

---

---

## 🎯 Descripción

## 🎯 Overview

Dashboard 3D que visualiza **5 pisos** de un edificio en tiempo real, monitoreando:

SmartFloors AI visualizes **5 building floors** in real-time 3D, monitoring:

- 🌡️ **Temperatura** (°C)

- 💧 **Humedad** (%)- 🌡️ Temperature

- ⚡ **Consumo Energético** (kW)- 💧 Humidity

- 👥 **Ocupación** (%)- ⚡ Power Consumption

- 👥 Occupancy

Incluye **predicciones ML**, **alertas inteligentes** y arquitectura **híbrida REST + WebSocket**.

Features **ML predictions**, **intelligent alerts**, and **hybrid REST + WebSocket** architecture for optimal performance.

---

---

## ⚡ Inicio Rápido

## ⚡ Quick Start

```bash

# Instalar dependencias```bash

npm install# Install dependencies

npm install

# Iniciar servidor de desarrollo

npm run dev# Start development server

```npm run dev

```

**Aplicación disponible en:** <http://localhost:5173>

**App runs at <http://localhost:5173>**

### Backend Requerido

> **First time?** Check **[Getting Started Guide](./docs/setup/GETTING_STARTED.md)** for detailed setup instructions.

Asegúrate de que el backend esté corriendo en `http://localhost:3000`

---

---

## 🚨 Recent Updates (v1.1 - Nov 2025)

## ✨ Características Principales

### WebSocket Fixes ✅

### 🎨 Visualización 3D

- **5 pisos interactivos** con colores por estado- **Alert Event Name Corrected**: Backend emits `new-alerts`, not `alert`

- **Animaciones en tiempo real** según anomalías- **Alert Data Structure**: Properly processes `{alerts: [{anomalies: [...]}]}` format

- **Controles de cámara** para navegación 360°- **Subscription Cleanup**: Memory leak fixed - all WebSocket subscriptions now properly cleanup on unmount

- **Heat Layer** con modos de visualización- **Multi-format Support**: `handleFloorData` now supports multiple backend response formats



### 🔮 Predicciones ML### Documentation Reorganization 📚

- **Predicciones 10-60 minutos** para todas las métricas

- **91% de confianza** con modelos híbridosAll documentation moved to `docs/` folder with clear categories:

- **Indicadores de tendencia** (↑↓→)

- **Selector de intervalo temporal**- **Setup** - Installation and getting started

- **API** - REST and WebSocket integration

### 🚨 Sistema de Alertas- **Architecture** - System design and components

- **Alertas en tiempo real** con niveles de severidad- **Testing** - Endpoint and WebSocket testing

- **Recomendaciones de acción** automáticas

- **Últimas 10 alertas** visiblesSee **[Documentation](#-documentation)** section below for navigation.

- **Animaciones fluidas** con Framer Motion

---

### 📊 Arquitectura Híbrida

- **REST API** para carga inicial## ✨ Features

- **WebSocket** para actualizaciones en vivo

- **Cálculo automático de estados**### 🎨 Real-time 3D Visualization

- **Sincronización de datos** en paneles activos

- **5 interactive floor blocks** with hover details

---- **Color-coded status** (🟢 Normal, 🟡 Warning, 🔴 Danger)

- **Breathing animations** on anomalies

## 🏗️ Tecnologías- **OrbitControls** for 360° navigation



| Categoría | Tecnología | Versión |### 🔮 ML Predictions

|-----------|------------|---------|

| **Framework** | React | 19.2.0 |- **10-60 minute forecasts** for all metrics

| **Build** | Vite | 7.2.2 |- **91% confidence** hybrid ML models

| **3D** | React Three Fiber + Drei | Latest |- **Trend indicators** (↑↓→)

| **Animaciones** | Framer Motion | 12.x |- **Interactive time selector**

| **WebSocket** | Socket.IO Client | 4.8.1 |

| **Routing** | React Router DOM | 7.9.5 |### 🚨 Intelligent Alerts

| **Estilos** | Styled-components | 6.1.19 |

- **Last 10 alerts** with severity levels

---- **Action recommendations** in Spanish

- **Animated transitions** with Framer Motion

## 📁 Estructura del Proyecto- **Real-time updates** via WebSocket



```### 📊 Hybrid Data Architecture

src/

├── api/- **REST API** for initial load (fast, reliable)

│   ├── rest.js              # Cliente REST API- **WebSocket** for live updates (real-time)

│   └── socket.js            # Cliente WebSocket- **Automatic status calculation** (danger/warning/normal)

├── hooks/- **Optimized loading states**

│   ├── useRealTimeData.js   # Gestión de datos (REST + WS)

│   ├── useCameraZoom.js     # Control de cámara---

│   └── useVisualizationMode.js  # Modos de visualización

├── components/## 🏗️ Tech Stack

│   ├── FloorBlock.jsx       # Piso 3D individual

│   ├── AlertsSidebar.jsx    # Panel de alertas| Category         | Technology          | Version  |

│   ├── PredictionsPanel.jsx # Panel de predicciones| ---------------- | ------------------- | -------- |

│   └── FloorInfoPanel.jsx   # Info del piso seleccionado| **Framework**    | React               | 19.2.0   |

├── scenes/| **Build Tool**   | Vite                | 7.2.2    |

│   └── BuildingScene.jsx    # Escena 3D completa| **3D Engine**    | React Three Fiber   | 9.4.0    |

├── layout/| **3D Helpers**   | @react-three/drei   | 10.7.6   |

│   ├── Layout.jsx           # Contenedor principal| **Animations**   | Framer Motion       | 12.23.24 |

│   └── Header.jsx           # Navegación| **WebSocket**    | Socket.IO Client    | 4.8.1    |

├── pages/| **Routing**      | React Router DOM    | 7.9.5    |

│   ├── Home.jsx             # Vista dashboard 3D| **Styling**      | Styled-components   | 6.1.19   |

│   └── Analytics.jsx        # Vista de análisis| **Code Quality** | ESLint 9 + Prettier | Latest   |

└── styles/

    └── scssTokens.js        # Tokens de diseño centralizados---

```

## 📁 Project Structure

---

```

## 🔧 Comandos Disponiblessrc/

├── api/

| Comando | Descripción |│   ├── rest.js              # REST API client

|---------|-------------|│   └── socket.js            # WebSocket client (Socket.IO)

| `npm run dev` | Servidor de desarrollo |│

| `npm run build` | Build de producción |├── hooks/

| `npm run preview` | Preview del build |│   └── useRealTimeData.js   # Central data management (REST + WebSocket)

| `npm run lint` | Revisar errores |│

| `npm run lint:fix` | Corregir errores automáticamente |├── components/

| `npm run format` | Formatear código con Prettier |│   ├── FloorBlock.jsx       # 3D floor visualization

│   ├── AlertsPanel.jsx      # Live alerts display

---│   ├── PredictionsPanel.jsx # ML predictions panel

│   └── SocketDebugger.jsx   # WebSocket debugging tool

## 🔌 Integración con Backend│

├── scenes/

### Endpoints REST Necesarios│   └── BuildingScene.jsx    # Complete 3D scene (5 floors + lighting)

│

```├── layout/

GET  /health                                        # Health check│   ├── Layout.jsx           # Main container

GET  /api/v1/floors                                 # Todos los pisos│   ├── Header.jsx           # Navigation

GET  /api/v1/floors/:id                             # Piso individual│   └── Sidebar.jsx          # Info + Predictions + Alerts

GET  /api/v1/floors/:id/predictions?minutesAhead=60 # Predicciones ML│

GET  /api/v1/alerts                                 # Alertas activas└── pages/

```    ├── Home.jsx             # 3D dashboard view

    └── Analytics.jsx        # Data analysis view

### Eventos WebSocket (Socket.IO)```



| Evento | Dirección | Descripción |---

|--------|-----------|-------------|

| `floorData` | Backend → Frontend | Actualización de métricas |## 🔧 Available Commands

| `new-alerts` | Backend → Frontend | Nuevas alertas |

| `predictions` | Backend → Frontend | Predicciones actualizadas || Command                | Description                       |

| ---------------------- | --------------------------------- |

### Configuración CORS| `npm run dev`          | Start dev server (localhost:5173) |

| `npm run build`        | Production build to `dist/`       |

El backend debe permitir el origen del frontend:| `npm run preview`      | Preview production build          |

| `npm run lint`         | Check code errors                 |

```javascript| `npm run lint:fix`     | Auto-fix code errors              |

cors({| `npm run format`       | Format with Prettier              |

  origin: 'http://localhost:5173',| `npm run format:check` | Check formatting only             |

  credentials: true

})---

```

## 📚 Documentation

---

### 🚀 Getting Started

## 🎨 Cálculo de Estados

- **[Getting Started Guide](./docs/setup/GETTING_STARTED.md)** - Installation, setup, and troubleshooting

El frontend calcula automáticamente el estado de cada piso:

### 🔌 API Integration

### 🔴 Peligro (Danger)

```javascript- **[API Integration](./docs/api/API_INTEGRATION.md)** - REST endpoints and WebSocket events

temperatura > 26°C || temperatura < 18°C- **[Data Integration](./docs/api/DATA_INTEGRATION.md)** - Data structures and processing logic

humedad > 70% || humedad < 30%

consumo > 150 kW### 🏗️ Architecture

```

- **[System Architecture](./docs/architecture/SYSTEM_ARCHITECTURE.md)** - Complete system design and data flow

### 🟡 Advertencia (Warning)- **[Predictions System](./docs/architecture/PREDICTIONS.md)** - ML predictions documentation

```javascript- **[Routing](./docs/architecture/ROUTING.md)** - React Router setup

temperatura > 24°C || temperatura < 20°C

humedad > 60% || humedad < 35%### 🧪 Testing

consumo > 135 kW

```- **[Endpoint Tests](./docs/testing/ENDPOINT_TESTS.md)** - Verified REST API tests

- **[WebSocket Testing](./docs/testing/WEBSOCKET_TESTING.md)** - WebSocket event testing guide

### 🟢 Normal

Cualquier valor fuera de los rangos anteriores### 🤖 Development



---- **[Copilot Instructions](./.github/copilot-instructions.md)** - AI coding agent guidelines



## 🎮 Uso de la Aplicación---



### Interacciones Básicas## 🔌 Backend Integration



1. **Click en un piso** → Zoom y muestra paneles de información### Required Endpoints

2. **Doble click en el mismo piso** → Resetea la vista

3. **Arrastrar** → Rotar cámara (OrbitControls)```

4. **Scroll** → Zoom in/outGET  /health                                     # Health check

5. **Click en alertas (header)** → Abre panel lateral de alertasGET  /api/v1/floors                              # All floors (initial load)

GET  /api/v1/floors/:id                          # Single floor

### Paneles de InformaciónGET  /api/v1/floors/stats                        # Statistics

GET  /api/v1/floors/:id/history?limit=60         # Historical data

Cuando seleccionas un piso:GET  /api/v1/floors/:id/predictions?minutesAhead=60  # ML predictions

GET  /api/v1/alerts                              # All alerts

- **Panel Izquierdo (FloorInfoPanel)**: Métricas actuales```

- **Panel Derecho (PredictionsPanel)**: Predicciones ML con selector de tiempo

### WebSocket Events (Socket.IO)

Ambos paneles se **actualizan en tiempo real** mientras están visibles.

| Event         | Direction          | Description                      |

---| ------------- | ------------------ | -------------------------------- |

| `floorData`   | Backend → Frontend | Floor metrics updates (5 floors) |

## 🐛 Solución de Problemas| `new-alerts`  | Backend → Frontend | New alert notifications ⚠️       |

| `predictions` | Backend → Frontend | ML predictions updates           |

### WebSocket no conecta

> **Important:** Alert event is named `new-alerts`, not `alert`. See [WebSocket Testing Guide](./docs/testing/WEBSOCKET_TESTING.md) for details.

```bash

# Verificar que el backend esté corriendo### CORS Configuration

curl http://localhost:3000/health

```Backend must allow frontend origin:



### Alertas no aparecen```javascript

app.use(

- ✅ Verifica que el evento sea `new-alerts` (no `alert`)  cors({

- ✅ Revisa estructura: `{alerts: [{anomalies: [...]}]}`    origin: 'http://localhost:5173',

    credentials: true

### Carga infinita  })

);

```bash```

# Probar endpoint REST

curl http://localhost:3000/api/v1/floors---

# Debe retornar JSON con 5 pisos

```## 🎨 Status Calculation



### Datos de paneles no actualizanFrontend automatically calculates floor status based on thresholds:



- ✅ Verifica que `useEffect` esté escuchando cambios de `floorData` y `predictions`### 🔴 Danger

- ✅ Revisa logs en consola (🔄 y 🔮)

```javascript

---temperature > 26°C || temperature < 18°C

humidity > 70% || humidity < 30%

## 🚀 DesplieguepowerConsumption > 150 kW

```

### Build de Producción

### 🟡 Warning

```bash

npm run build```javascript

```temperature > 24°C || temperature < 20°C

humidity > 60% || humidity < 35%

### Actualizar URLs del BackendpowerConsumption > 135 kW

```

**`src/api/rest.js`:**

```javascript### 🟢 Normal

const BASE_URL = 'https://tu-backend.com/api/v1';

```All other values



**`src/api/socket.js`:**---

```javascript

const SOCKET_URL = 'https://tu-backend.com';## 🐛 Troubleshooting

```

### WebSocket Not Connecting

### Servir Archivos

```bash

Sirve la carpeta `dist/` con cualquier servidor estático:# Verify backend is running

- Vercelcurl http://localhost:3000/health

- Netlify

- Nginx# Check CORS configuration

- Node.js + `serve`# Ensure Socket.IO server is initialized

```

---

### Alerts Not Displaying

## 📋 Convenciones de Código

- ✅ Verify event name is `new-alerts` (not `alert`)

### Seguir las reglas del proyecto:- ✅ Check alert structure: `{alerts: [{anomalies: [...]}]}`

- ✅ See [WebSocket Testing Guide](./docs/testing/WEBSOCKET_TESTING.md)

- ✅ **ESLint 9** con flat config

- ✅ **Prettier** para formateo### Loading Infinitely

- ✅ **Styled-components** para estilos

- ✅ **Props transientes** con prefijo `$` (ej: `$active`, `$severity`)```bash

- ✅ **Comentarios en español** para lógica de negocio# Test REST endpoint

- ✅ **JSDoc en inglés** para documentación de funcionescurl http://localhost:3000/api/v1/floors

- ✅ **Hooks personalizados** para lógica reutilizable

# Should return JSON with 5 floors

### Antes de commitear:```



```bash**More solutions:** See [Getting Started - Troubleshooting](./docs/setup/GETTING_STARTED.md#-troubleshooting)

npm run format

npm run lint---

```

## 🚀 Deployment

---

### Build for Production

## 📄 Documentación Adicional

```bash

- **[Copilot Instructions](./.github/copilot-instructions.md)** - Guía para IA de desarrollonpm run build

- **[API Integration](./docs/api/DATA_INTEGRATION.md)** - Detalles de integración completa```

- **[Getting Started](./docs/setup/GETTING_STARTED.md)** - Guía detallada de configuración

### Update Backend URLs

---

**`src/api/rest.js`:**

## ✅ Estado del Proyecto

```javascript

| Componente | Estado |const BASE_URL = 'https://your-backend.com/api/v1';

|------------|--------|```

| REST API | ✅ Funcionando |

| WebSocket | ✅ Funcionando |**`src/api/socket.js`:**

| Visualización 3D | ✅ Funcionando |

| Predicciones ML | ✅ Funcionando |```javascript

| Sistema de Alertas | ✅ Funcionando |const SOCKET_URL = 'https://your-backend.com';

| Paneles de Info | ✅ Funcionando |```

| Actualización en Tiempo Real | ✅ Funcionando |

### Deploy Files

---

Serve `dist/` folder with:

**Desarrollado con React + Vite + Three.js** 🚀  

**Versión:** 2.0.0 (Hackathon Ready)  - Node.js + `serve`

**Última Actualización:** Noviembre 2025- Nginx

- Vercel / Netlify
- Any static hosting

---

## 🤝 Contributing

This is a hackathon project. To contribute:

1. Follow existing code conventions
2. Run `npm run format` before commits
3. Ensure `npm run lint` passes
4. Document complex logic
5. Test WebSocket events thoroughly

---

## 📄 License

Private hackathon project.

---

## 🎓 Learning Resources

### New to the Project?

1. **[Getting Started](./docs/setup/GETTING_STARTED.md)** - Setup and first steps
2. **[System Architecture](./docs/architecture/SYSTEM_ARCHITECTURE.md)** - Understand how it works
3. **[API Integration](./docs/api/API_INTEGRATION.md)** - Learn the backend integration

### Debugging Issues?

1. **[WebSocket Testing](./docs/testing/WEBSOCKET_TESTING.md)** - Debug real-time connections
2. **[Endpoint Tests](./docs/testing/ENDPOINT_TESTS.md)** - Verify data structures
3. **DevTools Console** - Check for emoji-marked logs (📡, 📊, 🚨, 🔮)

---

## ✅ Status

| Component                | Status                                                |
| ------------------------ | ----------------------------------------------------- |
| **REST API Integration** | ✅ Working                                            |
| **WebSocket Events**     | ✅ Working (`floorData`, `new-alerts`, `predictions`) |
| **3D Visualization**     | ✅ Working                                            |
| **ML Predictions**       | ✅ Working                                            |
| **Alerts System**        | ✅ Working                                            |
| **Documentation**        | ✅ Complete                                           |
| **Code Quality**         | ✅ 0 ESLint errors                                    |

---

**Built with React + Vite + Three.js** 🚀  
**Last Updated:** November 2025  
**Version:** 1.1.0
