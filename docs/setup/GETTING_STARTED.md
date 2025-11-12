# 🚀 SmartFloors AI - Getting Started

## 📋 Prerequisites

- **Node.js 18+** installed
- **Backend running** on `http://localhost:3000`
- **Terminal** (macOS/Linux) or PowerShell (Windows)

---

## ⚡ Quick Start (3 Steps)

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Start the Frontend

```bash
npm run dev
```

The dashboard opens at **http://localhost:5173**

### 3️⃣ Verify Connection

Open **DevTools Console** (F12) and look for:

```
✅ Connected to SmartFloors backend
✅ Initial floor data loaded: 5 floors
✅ Initial alerts loaded: X alerts
📡 [Socket Event] floorData received
```

**¡Listo!** 🎉 The dashboard is working.

---

## 🎨 What You'll See

### 3D Building Dashboard
- **5 interactive floors** in 3D visualization
- **Dynamic status colors**:
  - 🟢 Normal (`#00ff88`)
  - 🟡 Warning (`#ffd966`)
  - 🔴 Danger (`#ff4d4f`)
- **Breathing animations** on floors with issues
- **OrbitControls** for 360° navigation

### Real-time Metrics Panel
- 🌡️ Temperature (°C)
- 💧 Humidity (%)
- ⚡ Power Consumption (kW)
- 👥 Occupancy (%)
- 📊 Current Status

### ML Predictions Panel
- 🔮 Predictions for 10-60 minutes ahead
- 📈 Trend indicators (↑ up, ↓ down, → stable)
- 🎯 Confidence levels (91%)
- ⏱️ Interactive time selector

### Live Alerts Panel
- 🚨 Last 10 alerts
- ⚠️ Severity levels (critical, warning)
- 💡 Action recommendations
- 🕐 Real-time timestamps

---

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code errors |
| `npm run lint:fix` | Auto-fix code errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |

---

## 🐛 Troubleshooting

### ❌ "Failed to fetch" or "Network Error"

**Cause:** Backend not running or incorrect URL

**Solution:**
```bash
# Verify backend is running
curl http://localhost:3000/health

# Should respond:
# {"status":"OK","timestamp":"..."}
```

### ❌ Infinite Loading

**Cause:** Backend not responding to `/api/v1/floors`

**Solution:**
```bash
# Test endpoint
curl http://localhost:3000/api/v1/floors

# Should return JSON with 5 floors
```

### ❌ "WebSocket connection failed"

**Cause:** Socket.IO not configured on backend

**Solution:**
- Verify Socket.IO is initialized on backend
- Check CORS allows `http://localhost:5173`
- Ensure port 3000 is available

### ❌ Blank Screen

**Cause:** JavaScript error

**Solution:**
```bash
# Open DevTools Console (F12)
# Look for red errors
# Try:
npm run lint
npm run dev
```

### ⚠️ CORS Warning

**Backend must include:**
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

## 📊 Backend Endpoints Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| GET | `/api/v1/floors` | All floors (initial load) |
| GET | `/api/v1/floors/:id` | Specific floor |
| GET | `/api/v1/floors/stats` | General statistics |
| GET | `/api/v1/floors/:id/history?limit=60` | Historical data |
| GET | `/api/v1/floors/:id/predictions?minutesAhead=60` | ML predictions |
| GET | `/api/v1/alerts` | All alerts |

**WebSocket Events (Socket.IO):**
- `floorData` - Floor metrics updates
- `new-alerts` - New alert notifications (⚠️ Note: event name is `new-alerts`, not `alert`)
- `predictions` - New ML predictions

---

## 🎯 Dashboard Interaction

### 3D Navigation
- **Click + Drag**: Rotate camera
- **Scroll**: Zoom in/out
- **Right Click + Drag**: Pan view

### View Floor Details
1. Hover over a floor (3D cube)
2. Side panel shows real-time metrics
3. Predictions panel updates automatically

### Predictions Selector
1. Hover over a floor
2. In predictions panel, click:
   - **+10 min** - 10 minutes ahead
   - **+20 min** - 20 minutes ahead
   - ... up to **+60 min**
3. Metrics update showing future values

### View Alerts
- Alerts panel auto-updates
- Last 10 alerts visible
- Color-coded by severity
- Scroll for more details

---

## 🔍 Debugging

### Console Logs
The frontend emits descriptive logs with emojis:

```
📡 [Socket Event] - WebSocket events
📊 [Floor Data] - Floor data received
🚨 [Alert] - New alerts
🔮 [Predictions] - Predictions received
✅ [Success] - Successful operations
❌ [Error] - Errors found
```

### Debug Panel (Optional)
To enable visual debugging, uncomment in `App.jsx`:

```jsx
import SocketDebugger from './components/SocketDebugger';

// Add in render:
<SocketDebugger />
```

Shows:
- WebSocket connection status
- Socket ID
- Transport type
- Last 20 events received

---

## 🚀 Deploy to Production

### 1. Build

```bash
npm run build
```

Creates `dist/` folder with optimized files.

### 2. Configure URLs

**Edit `src/api/rest.js`:**
```javascript
const BASE_URL = 'https://your-backend.com/api/v1';
```

**Edit `src/api/socket.js`:**
```javascript
const SOCKET_URL = 'https://your-backend.com';
```

### 3. Serve Files

Option A - Node.js server:
```bash
npm install -g serve
serve -s dist -p 80
```

Option B - Nginx:
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

### 4. Backend CORS

Update backend to allow production domain:
```javascript
app.use(cors({
  origin: 'https://your-domain.com',
  credentials: true
}));
```

---

## 💡 Tips

1. **Keep DevTools open** during development to see logs
2. **Use `npm run format`** before commits
3. **Verify backend connection** before reporting bugs
4. **Check testing docs** for real data structures
5. **Review API docs** for response examples

---

## ✨ Key Features

- ✅ **Real-time 3D visualization**
- ✅ **ML predictions with 91% confidence**
- ✅ **Intelligent alerts with recommendations**
- ✅ **Smooth responsive animations**
- ✅ **Automatic status calculation**
- ✅ **Hybrid REST + WebSocket architecture**
- ✅ **Optimized loading states**
- ✅ **Robust error handling**
- ✅ **Clean documented code**
- ✅ **0 ESLint errors**

---

## 📞 Support

Issues not resolved?

1. Check **DevTools Console** for errors
2. Verify backend is running: `curl http://localhost:3000/health`
3. Review **testing documentation** for data structures
4. Check **API documentation** for examples

---

## 🔗 Next Steps

- **[API Integration Guide](../api/API_INTEGRATION.md)** - Complete REST + WebSocket documentation
- **[Testing Guide](../testing/ENDPOINT_TESTS.md)** - Verified endpoint tests
- **[Architecture Overview](../architecture/SYSTEM_ARCHITECTURE.md)** - System design and components

**¡Happy building with SmartFloors AI!** 🏢✨
