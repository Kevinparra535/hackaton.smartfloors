# ⚡ SmartFloors AI - Inicio Rápido (5 minutos)

Guía paso a paso para ejecutar SmartFloors AI en menos de 5 minutos.

---

## 📋 Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

✅ **Node.js 18 o superior** → [Descargar aquí](https://nodejs.org/)  
✅ **Backend de SmartFloors corriendo** en `http://localhost:3000`

Para verificar Node.js:
```bash
node --version
# Debe mostrar: v18.x.x o superior
```

---

## 🚀 Paso 1: Clonar el Repositorio

```bash
# Clona el proyecto
git clone <url-del-repositorio>

# Entra a la carpeta
cd hackaton.smartfloors
```

⏱️ **Tiempo:** 30 segundos

---

## 📦 Paso 2: Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- React 19.2.0
- Vite 7.2.2
- React Three Fiber
- Socket.IO Client
- Styled Components
- Y más...

⏱️ **Tiempo:** 1-2 minutos (depende de tu conexión)

---

## 🔌 Paso 3: Verificar Backend

Antes de iniciar el frontend, verifica que el backend esté corriendo:

```bash
# En una terminal SEPARADA, verifica:
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{"status": "ok"}
```

Si no obtienes esta respuesta:
1. Inicia el servidor backend
2. Asegúrate de que esté en el puerto 3000
3. Verifica que no haya errores en los logs

⏱️ **Tiempo:** 30 segundos

---

## ▶️ Paso 4: Iniciar la Aplicación

```bash
npm run dev
```

**Verás algo como:**
```
  VITE v7.2.2  ready in 324 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

⏱️ **Tiempo:** 10 segundos

---

## 🌐 Paso 5: Abrir en el Navegador

1. Abre tu navegador favorito (Chrome, Firefox, Edge)
2. Navega a: **http://localhost:5173**
3. Espera a que cargue la visualización 3D

⏱️ **Tiempo:** 10 segundos

---

## ✅ ¡Listo! - ¿Qué deberías ver?

### En la pantalla principal:

✨ **Visualización 3D:**
- 5 bloques apilados verticalmente (representan los pisos)
- Colores dinámicos:
  - 🟢 Verde = Estado normal
  - 🟡 Amarillo = Advertencia
  - 🔴 Rojo = Peligro
- Fondo con estrellas y partículas flotantes

📊 **Panel lateral derecho:**
- Lista de alertas activas
- Clasificadas por severidad
- Actualizaciones en tiempo real

🎮 **Controles de cámara:**
- **Arrastra** con el mouse para rotar
- **Scroll** para hacer zoom
- **Click** en un piso para ver detalles

---

## 🎯 Primeros Pasos

### 1. Interactuar con un Piso

**Haz click en cualquier piso** (bloque 3D)

Verás dos paneles:
- **Izquierda:** Métricas actuales (temperatura, humedad, energía, ocupación)
- **Derecha:** Predicciones ML (10-60 minutos)

### 2. Ver Gráficas de Tendencias

**Haz click en la pared derecha** (plano vertical a la derecha)

Verás:
- Selector de pisos (1, 2, 3, 4, 5 o "Todos")
- 3 gráficas con datos de las últimas 4 horas:
  - Temperatura
  - Humedad
  - Consumo energético

### 3. Ver Tabla de Alertas

**Haz click en la pared izquierda** (plano vertical a la izquierda)

Verás:
- Tabla completa de alertas
- Columnas: Timestamp, Piso, Variable, Nivel, Recomendación
- Ordenable por cualquier columna
- Alertas predictivas marcadas con 🔮

### 4. Cambiar Modo de Visualización

**Haz click en el selector** (esquina superior derecha)

Opciones:
- Normal (color por estado)
- Temperatura (rojo = caliente, azul = frío)
- Humedad (azul = húmedo, amarillo = seco)
- Energía (verde = bajo, rojo = alto)
- Ocupación (azul = vacío, morado = lleno)

---

## 🐛 Solución de Problemas

### ❌ Error: "Cannot connect to localhost:3000"

**Causa:** El backend no está corriendo

**Solución:**
```bash
# En otra terminal, inicia el backend
cd ../backend-folder
npm start
```

### ❌ Error: "npm: command not found"

**Causa:** Node.js no está instalado

**Solución:**
1. Descarga Node.js: https://nodejs.org/
2. Instala la versión LTS (recomendada)
3. Reinicia la terminal
4. Verifica: `node --version`

### ❌ Error: "Port 5173 is already in use"

**Causa:** Otra aplicación está usando el puerto

**Solución:**
```bash
# Opción 1: Usar otro puerto
npm run dev -- --port 3001

# Opción 2: Matar el proceso en 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Opción 2: Matar el proceso en 5173 (Mac/Linux)
lsof -ti:5173 | xargs kill
```

### ❌ Pantalla en blanco

**Causa:** Problema con el backend o datos

**Solución:**
```bash
# 1. Verifica que el backend devuelva datos
curl http://localhost:3000/api/v1/floors

# Debe retornar un array con 5 objetos:
# [{floorId: 1, ...}, {floorId: 2, ...}, ...]

# 2. Revisa la consola del navegador (F12)
# Busca errores en rojo
```

### ❌ WebSocket no conecta

**Causa:** Backend no soporta WebSocket o CORS mal configurado

**Solución:**
1. Verifica que el backend tenga Socket.IO instalado
2. Verifica CORS en backend:
```javascript
// Debe incluir:
cors({
  origin: 'http://localhost:5173',
  credentials: true
})
```

### ❌ No se ven alertas

**Causa:** Backend no envía alertas o formato incorrecto

**Solución:**
```bash
# Verifica endpoint de alertas
curl http://localhost:3000/api/v1/alerts

# Formato esperado:
# [
#   {
#     floorId: 1,
#     timestamp: "...",
#     anomalies: [
#       {type: "temperature", severity: "warning", message: "..."}
#     ]
#   }
# ]
```

---

## 📚 Siguientes Pasos

### Explora las funcionalidades:

1. ✅ **Documentación completa** → Ver `README_NEW.md`
2. ✅ **Guía de desarrollo** → Ver `.github/copilot-instructions.md`
3. ✅ **Integración de datos** → Ver `docs/api/DATA_INTEGRATION.md`
4. ✅ **Arquitectura** → Ver `docs/architecture/SYSTEM_ARCHITECTURE.md`

### Personaliza la aplicación:

- **Cambiar colores:** Edita `src/styles/theme.js`
- **Ajustar umbrales:** Edita `src/utils/webSocket.utils.js`
- **Modificar API:** Edita `src/api/rest.js` y `src/api/socket.js`

---

## 🎓 Referencia Rápida

### Comandos Útiles

```bash
# Desarrollo
npm run dev              # Inicia servidor dev

# Build
npm run build            # Compila para producción
npm run preview          # Preview del build

# Calidad
npm run lint             # Verifica código
npm run lint:fix         # Corrige errores
npm run format           # Formatea código
```

### Estructura de Carpetas Clave

```
src/
├── api/                 # REST + WebSocket
├── components/          # Componentes React
│   ├── FloorBlock.jsx
│   ├── AlertsTable.jsx
│   ├── TrendCharts.jsx
│   └── ...
├── scenes/
│   └── BuildingScene.jsx
├── hooks/
│   └── useRealTimeData.js
└── pages/
    ├── Home.jsx
    └── Analytics.jsx
```

### Endpoints del Backend

```
GET  /health                              # Health check
GET  /api/v1/floors                       # Todos los pisos
GET  /api/v1/floors/:id                   # Un piso
GET  /api/v1/floors/:id/predictions       # Predicciones
GET  /api/v1/floors/:id/history           # Historial
GET  /api/v1/alerts                       # Alertas
GET  /api/v1/export/alerts/csv            # Exportar CSV
```

### Eventos WebSocket

```
floor-data    → Actualización de métricas
new-alerts    → Nuevas alertas
predictions   → Predicciones actualizadas
```

---

## ⏱️ Resumen de Tiempos

| Paso | Tiempo | Acumulado |
|------|--------|-----------|
| 1. Clonar repo | 30s | 0:30 |
| 2. Instalar deps | 1-2 min | 2:30 |
| 3. Verificar backend | 30s | 3:00 |
| 4. Iniciar app | 10s | 3:10 |
| 5. Abrir navegador | 10s | 3:20 |
| **TOTAL** | **~3-4 min** | ✅ |

> 💡 **Tiempo extra:** Incluye buffer para resolver problemas comunes

---

## 🆘 ¿Necesitas Ayuda?

1. **Revisa troubleshooting** arriba
2. **Consulta logs** de backend y frontend (consola F12)
3. **Verifica requisitos** (Node.js 18+, backend corriendo)
4. **Lee documentación** detallada en `README_NEW.md`

---

**¡Disfruta monitoreando tu edificio inteligente en 3D! 🎉**

**Desarrollado con ❤️ usando React + Vite + Three.js**
