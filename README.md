# SmartFloors AI

**Dashboard 3D de monitoreo en tiempo real** para edificios inteligentes con predicciones ML y detección de anomalías.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black)](https://threejs.org/)

---

## �� Descripción

Visualiza **5 pisos** de un edificio en 3D, monitoreando en tiempo real:

- 🌡️ Temperatura
- 💧 Humedad
- ⚡ Consumo Energético
- 👥 Ocupación

Con **predicciones ML**, **alertas inteligentes** y **actualizaciones en vivo** vía WebSocket.

---

## ⚡ Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar aplicación
npm run dev
```

**La app estará disponible en:** <http://localhost:5173>

> **Nota:** Requiere backend en `http://localhost:3000`

---

## ✨ Características

- 🎨 **Visualización 3D interactiva** con colores por estado
- 🔮 **Predicciones ML** de 10 a 60 minutos
- 🚨 **Sistema de alertas** en tiempo real
- 📊 **Paneles informativos** que se actualizan automáticamente
- 🎮 **Controles de cámara** intuitivos
- ⚡ **Heat Layer** con múltiples modos de visualización

---

## 🛠️ Tecnologías

- **React 19** + **Vite 7**
- **React Three Fiber** (3D)
- **Framer Motion** (animaciones)
- **Socket.IO** (WebSocket)
- **Styled Components** (estilos)
- **React Router** (navegación)

---

## 📁 Estructura

```
src/
├── api/                 # REST + WebSocket
├── components/          # Componentes React
├── hooks/              # Hooks personalizados
├── scenes/             # Escenas 3D
├── layout/             # Layout principal
├── pages/              # Páginas (Home, Analytics)
└── styles/             # Tokens de diseño
```

---

## 🔌 Backend

### Endpoints REST

```
GET  /health
GET  /api/v1/floors
GET  /api/v1/floors/:id
GET  /api/v1/floors/:id/predictions
GET  /api/v1/alerts
```

### Eventos WebSocket

- `floor-data` - Actualización de métricas de pisos
- `new-alerts` - Nuevas alertas del sistema
- `predictions` - Predicciones ML actualizadas

### CORS

```javascript
cors({
  origin: 'http://localhost:5173',
  credentials: true
})
```

---

## 🎮 Uso

1. **Click en un piso** → Ver información detallada
2. **Doble click** → Resetear vista
3. **Arrastrar** → Rotar cámara
4. **Scroll** → Zoom
5. **Click en alertas** → Abrir panel lateral

### Paneles

- **Izquierda:** Métricas actuales del piso
- **Derecha:** Predicciones ML con selector de tiempo

Ambos se actualizan en tiempo real.

---

## 🎨 Estados

El sistema calcula automáticamente:

| Estado | Condiciones |
|--------|-------------|
| 🔴 **Peligro** | Temp >26°C o <18°C, Humedad >70% o <30%, Consumo >150kW |
| 🟡 **Advertencia** | Temp >24°C o <20°C, Humedad >60% o <35%, Consumo >135kW |
| 🟢 **Normal** | Resto de valores |

---

## 🔧 Comandos

```bash
npm run dev          # Desarrollo
npm run build        # Producción
npm run preview      # Preview build
npm run lint         # Verificar código
npm run lint:fix     # Corregir errores
npm run format       # Formatear código
```

---

## 🐛 Troubleshooting

### WebSocket no conecta
```bash
curl http://localhost:3000/health
```

### Sin alertas
- Verifica evento `new-alerts` (no `alert`)
- Estructura: `{alerts: [{anomalies: [...]}]}`

### Carga infinita
```bash
curl http://localhost:3000/api/v1/floors
# Debe retornar 5 pisos
```

---

## 🚀 Despliegue

```bash
# Build
npm run build

# Actualizar URLs en:
# - src/api/rest.js
# - src/api/socket.js

# Servir carpeta dist/
```

---

## 📚 Documentación

- [Copilot Instructions](./.github/copilot-instructions.md) - Guía para desarrollo
- [Data Integration](./docs/api/DATA_INTEGRATION.md) - Integración completa
- [Getting Started](./docs/setup/GETTING_STARTED.md) - Setup detallado

---

## ✅ Estado

| Componente | Estado |
|------------|--------|
| REST API | ✅ |
| WebSocket | ✅ |
| 3D Visualization | ✅ |
| ML Predictions | ✅ |
| Alerts System | ✅ |
| Real-time Updates | ✅ |

---

**Versión:** 2.0.0  
**Última actualización:** Noviembre 2025  
**Desarrollado con:** React + Vite + Three.js
