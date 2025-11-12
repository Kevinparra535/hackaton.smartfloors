# SmartFloors AI - Documentation Index

Welcome to the SmartFloors AI documentation! This guide will help you navigate all available documentation.

## 📚 Documentation Structure

```
docs/
├── setup/              # Getting started and installation
├── api/                # REST and WebSocket integration
├── architecture/       # System design and components
└── testing/            # Testing guides and procedures
```

---

## 🚀 Setup & Installation

### [Getting Started Guide](./setup/GETTING_STARTED.md)
**Start here if you're new!**

- ⚡ Quick 3-step setup
- 🔧 Available commands
- 🐛 Troubleshooting common issues
- 🚀 Deployment guide
- 💡 Development tips

---

## 🔌 API Integration

### [API Integration Guide](./api/API_INTEGRATION.md)
Complete REST API and WebSocket reference

- 📡 All REST endpoints documented
- 🔌 WebSocket event specifications
- ✅ Request/response examples
- ⚠️ Error handling patterns
- 🔐 CORS configuration

**Key Information:**
- Base URL: `http://localhost:3000/api/v1`
- WebSocket URL: `http://localhost:3000`
- Alert event: `new-alerts` (NOT `alert`)

### [Data Integration Guide](./api/DATA_INTEGRATION.md)
Data structures and processing logic

- 📊 Floor data structure
- 🚨 Alert data structure (anomalies array)
- 🔮 Predictions data structure
- 🔄 Data flow diagrams
- 🧪 Mock data examples

**Key Information:**
- Alerts come as: `{alerts: [{anomalies: [...]}]}`
- Frontend flattens anomalies for display
- Status calculated client-side

---

## 🏗️ Architecture

### [System Architecture](./architecture/SYSTEM_ARCHITECTURE.md)
Complete system design and technical overview

- 🎯 Architecture patterns
- 📦 Component breakdown
- 🔄 Data flow diagrams
- 🎨 3D visualization setup
- 📊 State management
- ⚡ Performance optimizations
- 🔐 Security considerations

**Covers:**
- Hybrid REST + WebSocket architecture
- React Three Fiber 3D setup
- useRealTimeData hook design
- Alert processing logic
- Status calculation algorithms

### [ML Predictions System](./architecture/PREDICTIONS.md)
Machine learning predictions documentation

- 🔮 Prediction panel features
- 📊 Data structures
- 🎨 Color coding (confidence levels)
- 📈 Trend indicators
- 🧪 Testing predictions

**Key Features:**
- 10-60 minute forecasts
- 91% confidence hybrid models
- 4 metrics per floor
- Real-time updates

### [Routing System](./architecture/ROUTING.md)
React Router configuration and navigation

- 🔀 Route definitions
- 📁 Component structure
- 🎨 Navigation styling
- 📊 Data passing with Outlet

**Routes:**
- `/` - 3D Dashboard view
- `/analytics` - Data analysis view

---

## 🧪 Testing

### [Endpoint Tests](./testing/ENDPOINT_TESTS.md)
Verified REST API endpoint tests

- ✅ All 7 endpoints tested
- 📊 Real response examples
- ⚠️ Known differences from docs
- 🔧 Frontend adjustments made
- 💯 100% compatibility achieved

**Endpoints Tested:**
- `GET /health`
- `GET /api/v1/floors`
- `GET /api/v1/floors/:id`
- `GET /api/v1/floors/stats`
- `GET /api/v1/floors/:id/history`
- `GET /api/v1/floors/:id/predictions`
- `GET /api/v1/alerts`

### [WebSocket Testing Guide](./testing/WEBSOCKET_TESTING.md)
Complete WebSocket testing documentation

- 🔌 Connection testing methods
- 📡 Event verification
- 🐛 Common issues & solutions
- 🧪 Testing tools and techniques
- ✅ Comprehensive testing checklist

**Critical Information:**
- Alert event: `new-alerts` (verified)
- Event listeners: `floorData`, `new-alerts`, `predictions`
- Data structure validation
- Browser DevTools debugging
- SocketDebugger component usage

---

## 🤖 Development

### [Copilot Instructions](../.github/copilot-instructions.md)
AI coding agent guidelines

- 📝 Project overview
- 🔧 Tech stack details
- 📁 File structure
- 💡 Code conventions
- ⚠️ Common pitfalls to avoid

---

## 🎓 Learning Paths

### Path 1: New Developer
1. **[Getting Started](./setup/GETTING_STARTED.md)** - Setup your environment
2. **[System Architecture](./architecture/SYSTEM_ARCHITECTURE.md)** - Understand the system
3. **[API Integration](./api/API_INTEGRATION.md)** - Learn backend integration
4. **[WebSocket Testing](./testing/WEBSOCKET_TESTING.md)** - Test real-time features

### Path 2: Backend Integration
1. **[API Integration](./api/API_INTEGRATION.md)** - Understand required endpoints
2. **[Data Integration](./api/DATA_INTEGRATION.md)** - Learn data structures
3. **[Endpoint Tests](./testing/ENDPOINT_TESTS.md)** - Verify your implementation
4. **[WebSocket Testing](./testing/WEBSOCKET_TESTING.md)** - Test events

### Path 3: Debugging Issues
1. **[WebSocket Testing](./testing/WEBSOCKET_TESTING.md)** - Debug connections
2. **[Endpoint Tests](./testing/ENDPOINT_TESTS.md)** - Verify data structures
3. **[Getting Started - Troubleshooting](./setup/GETTING_STARTED.md#-troubleshooting)** - Common fixes
4. **DevTools Console** - Check emoji logs (📡, 📊, 🚨, 🔮)

### Path 4: Understanding Architecture
1. **[System Architecture](./architecture/SYSTEM_ARCHITECTURE.md)** - High-level overview
2. **[Data Integration](./api/DATA_INTEGRATION.md)** - Data flow
3. **[Predictions System](./architecture/PREDICTIONS.md)** - ML features
4. **[Routing](./architecture/ROUTING.md)** - Navigation

---

## 🔍 Quick Reference

### WebSocket Events
| Event | Description |
|-------|-------------|
| `floorData` | Floor metrics updates (5 floors) |
| `new-alerts` | Alert notifications ⚠️ |
| `predictions` | ML prediction updates |

### Status Thresholds
| Status | Temperature | Humidity | Power |
|--------|------------|----------|-------|
| 🔴 Danger | > 26°C or < 18°C | > 70% or < 30% | > 150 kW |
| 🟡 Warning | > 24°C or < 20°C | > 60% or < 35% | > 135 kW |
| 🟢 Normal | 18-24°C | 30-60% | < 135 kW |

### Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Check errors
npm run format       # Format code
```

---

## 📞 Need Help?

1. **Check documentation** - Most answers are here
2. **DevTools Console** - Look for emoji logs (📡, 📊, 🚨, 🔮)
3. **WebSocket Testing** - Verify events with SocketDebugger
4. **Backend Health** - `curl http://localhost:3000/health`

---

## ✨ Recent Updates

### November 2025 (v1.1)

**WebSocket Fixes:**
- ✅ Alert event name corrected to `new-alerts`
- ✅ Alert structure processing fixed (anomalies array)
- ✅ Memory leaks fixed (subscription cleanup)
- ✅ Multi-format floor data support

**Documentation:**
- ✅ Reorganized into `docs/` folder
- ✅ Added WebSocket testing guide
- ✅ Added system architecture doc
- ✅ Updated all docs with verified data

---

**Last Updated:** November 2025  
**Version:** 1.1.0  
**Status:** ✅ All documentation up-to-date
