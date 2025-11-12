# 🚀 SmartFloors AI - Quick Start Guide

## 📋 Requisitos Previos

- **Node.js 18+** instalado
- **Backend corriendo** en `http://localhost:3000`
- **Terminal** (macOS/Linux) o PowerShell (Windows)

---

## ⚡ Inicio Rápido (3 pasos)

### 1️⃣ Instalar Dependencias

```bash
npm install
```

### 2️⃣ Iniciar el Frontend

```bash
npm run dev
```

El dashboard se abrirá en **http://localhost:5173**

### 3️⃣ Verificar Conexión

Abre **DevTools Console** (F12) y busca estos mensajes:

```
✅ Connected to SmartFloors backend
✅ Initial floor data loaded: 5 floors
✅ Initial alerts loaded: X alerts
```

**¡Listo!** 🎉 El dashboard está funcionando.

---

## 🎨 ¿Qué Verás?

### Dashboard Principal
- **Vista 3D** con 5 pisos del edificio
- **Colores dinámicos**:
  - 🟢 Verde = Normal
  - 🟡 Amarillo = Advertencia
  - 🔴 Rojo = Peligro
- **Animaciones** de "respiración" en pisos con problemas

### Panel de Métricas (Hover sobre piso)
- 🌡️ Temperatura (°C)
- 💧 Humedad (%)
- ⚡ Consumo de energía (kW)
- 👥 Ocupación (%)
- 📊 Estado actual

### Panel de Predicciones ML
- 🔮 Predicciones 10-60 minutos
- 📈 Tendencias (↑ subida, ↓ bajada, → estable)
- 🎯 Nivel de confianza (91%)
- ⏱️ Selector de tiempo interactivo

### Panel de Alertas
- 🚨 Últimas 10 alertas
- ⚠️ Severidad (crítico, advertencia)
- 💡 Recomendaciones de acción
- 🕐 Timestamps en tiempo real

---

## 🔧 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo (localhost:5173) |
| `npm run build` | Crea build de producción |
| `npm run preview` | Preview del build de producción |
| `npm run lint` | Verifica errores de código |
| `npm run lint:fix` | Corrige errores automáticamente |
| `npm run format` | Formatea código con Prettier |
| `npm run format:check` | Verifica formateo sin modificar |

---

## 🐛 Solución de Problemas

### ❌ "Failed to fetch" o "Network Error"

**Causa:** Backend no está corriendo o URL incorrecta

**Solución:**
```bash
# Verifica que el backend esté corriendo
curl http://localhost:3000/health

# Debería responder:
# {"status":"OK","timestamp":"..."}
```

### ❌ Loading infinito

**Causa:** Backend no responde a `/api/v1/floors`

**Solución:**
```bash
# Prueba el endpoint
curl http://localhost:3000/api/v1/floors

# Debería devolver JSON con 5 pisos
```

### ❌ "WebSocket connection failed"

**Causa:** Socket.IO no configurado en backend

**Solución:**
- Verifica que Socket.IO esté inicializado en el backend
- Comprueba que CORS permita `http://localhost:5173`
- Revisa que el puerto 3000 esté libre

### ❌ Pantalla en blanco

**Causa:** Error de JavaScript

**Solución:**
```bash
# Abre DevTools Console (F12)
# Busca errores en rojo
# Intenta:
npm run lint
npm run dev
```

### ⚠️ Advertencia de CORS

**Backend debe incluir:**
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

## 📊 Endpoints del Backend (Referencia)

| Método | Endpoint | Uso |
|--------|----------|-----|
| GET | `/health` | Health check |
| GET | `/api/v1/floors` | Todos los pisos (carga inicial) |
| GET | `/api/v1/floors/:id` | Piso específico |
| GET | `/api/v1/floors/stats` | Estadísticas generales |
| GET | `/api/v1/floors/:id/history?limit=60` | Historial |
| GET | `/api/v1/floors/:id/predictions?minutesAhead=60` | Predicciones ML |
| GET | `/api/v1/alerts` | Todas las alertas |

**WebSocket (Socket.IO):**
- Evento: `floorData` - Actualización de métricas
- Evento: `alert` - Nuevas alertas
- Evento: `predictions` - Nuevas predicciones

---

## 📁 Estructura del Proyecto

```
src/
├── api/
│   ├── rest.js            # Cliente REST API
│   └── socket.js          # Cliente WebSocket
├── components/
│   ├── FloorBlock.jsx     # Piso 3D individual
│   ├── AlertsPanel.jsx    # Panel de alertas
│   ├── PredictionsPanel.jsx # Panel de predicciones
│   └── Dashboard3D.jsx    # Escena 3D principal
├── hooks/
│   └── useRealTimeData.js # Hook de datos (REST + WebSocket)
├── scenes/
│   └── BuildingScene.jsx  # Escena completa con 5 pisos
├── App.jsx                # Componente principal
└── main.jsx               # Punto de entrada

Documentación/
├── README.md              # Documentación completa
├── API_INTEGRATION.md     # Guía de API detallada
├── DATA_INTEGRATION.md    # Estructuras de datos
├── PREDICTIONS.md         # Sistema de predicciones
├── ENDPOINT_TESTS.md      # Resultados de pruebas
└── INTEGRATION_STATUS.md  # Estado de integración
```

---

## 🎯 Interacción con el Dashboard

### Navegación 3D
- **Click + Arrastrar**: Rotar cámara
- **Scroll**: Zoom in/out
- **Click derecho + Arrastrar**: Mover vista

### Ver Detalles de Piso
1. Pasa el cursor sobre un piso (cubo 3D)
2. El panel lateral muestra métricas en tiempo real
3. Panel de predicciones se actualiza automáticamente

### Selector de Predicciones
1. Haz hover sobre un piso
2. En el panel de predicciones, haz click en:
   - **+10 min** - Predicción a 10 minutos
   - **+20 min** - Predicción a 20 minutos
   - ... hasta **+60 min**
3. Las métricas se actualizan mostrando valores futuros

### Ver Alertas
- El panel de alertas se actualiza automáticamente
- Últimas 10 alertas visibles
- Código de colores por severidad
- Scroll para ver más detalles

---

## 🔍 Debugging

### Logs en Console
El frontend emite logs descriptivos con emojis:

```
📡 [Socket Event] - Eventos WebSocket
📊 [Floor Data] - Datos de pisos recibidos
🚨 [Alert] - Alertas nuevas
🔮 [Predictions] - Predicciones recibidas
✅ [Success] - Operaciones exitosas
❌ [Error] - Errores encontrados
```

### Panel de Debug (Opcional)
Si necesitas debugging visual, descomenta en `App.jsx`:

```jsx
import SocketDebugger from './components/SocketDebugger';

// Agregar en el render:
<SocketDebugger />
```

Muestra:
- Estado de conexión WebSocket
- ID del socket
- Tipo de transporte
- Últimos 20 eventos recibidos

---

## 🚀 Deploy a Producción

### 1. Build

```bash
npm run build
```

Genera carpeta `dist/` con archivos optimizados.

### 2. Configurar URLs

**Edita `src/api/rest.js`:**
```javascript
const BASE_URL = 'https://tu-backend.com/api/v1';
```

**Edita `src/api/socket.js`:**
```javascript
const SOCKET_URL = 'https://tu-backend.com';
```

### 3. Servir Archivos

Opción A - Servidor Node.js:
```bash
npm install -g serve
serve -s dist -p 80
```

Opción B - Nginx:
```nginx
server {
  listen 80;
  root /path/to/dist;
  index index.html;
  
  location / {
    try_files $uri /index.html;
  }
}
```

### 4. CORS en Backend

Actualiza backend para permitir dominio de producción:
```javascript
app.use(cors({
  origin: 'https://tu-dominio.com',
  credentials: true
}));
```

---

## 📚 Documentación Adicional

- **[README.md](./README.md)** - Documentación técnica completa
- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Guía detallada de endpoints
- **[ENDPOINT_TESTS.md](./ENDPOINT_TESTS.md)** - Resultados de pruebas verificadas
- **[PREDICTIONS.md](./PREDICTIONS.md)** - Sistema de predicciones ML
- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** - Guía para desarrolladores

---

## 💡 Tips

1. **Mantén DevTools abierto** durante desarrollo para ver logs
2. **Usa `npm run format`** antes de commits
3. **Verifica conexión backend** antes de reportar bugs
4. **Revisa ENDPOINT_TESTS.md** para ver estructuras reales de datos
5. **Consulta API_INTEGRATION.md** para ejemplos de respuestas

---

## ✨ Features Destacadas

- ✅ **Visualización 3D en tiempo real**
- ✅ **Predicciones ML con 91% de confianza**
- ✅ **Alertas inteligentes con recomendaciones**
- ✅ **Animaciones suaves y responsivas**
- ✅ **Cálculo automático de estados**
- ✅ **Arquitectura híbrida REST + WebSocket**
- ✅ **Loading states optimizados**
- ✅ **Error handling robusto**
- ✅ **Código limpio y documentado**
- ✅ **0 errores de ESLint**

---

## 📞 Soporte

¿Problemas no resueltos?

1. Revisa **DevTools Console** para errores
2. Verifica que backend esté corriendo: `curl http://localhost:3000/health`
3. Consulta **[ENDPOINT_TESTS.md](./ENDPOINT_TESTS.md)** para verificar estructuras
4. Revisa **[API_INTEGRATION.md](./API_INTEGRATION.md)** para ejemplos

---

**¡Disfruta construyendo con SmartFloors AI!** 🏢✨
