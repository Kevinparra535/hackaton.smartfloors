# WebSocket Testing Guide - SmartFloors AI

## 🎯 Overview

This guide covers testing the WebSocket (Socket.IO) integration for SmartFloors AI, including event verification, data structure validation, and debugging real-time connections.

## ⚠️ Important: Correct Event Names

### Event Name Reference

| Event Name | Direction | Description | Status |
|------------|-----------|-------------|--------|
| `floorData` | Backend → Frontend | Floor metrics updates | ✅ Verified |
| `new-alerts` | Backend → Frontend | New alert notifications | ✅ Verified (NOT `alert`) |
| `predictions` | Backend → Frontend | ML predictions | ✅ Verified |

> **Critical:** The alert event is named `new-alerts`, not `alert`. This was verified through console debugging and backend event inspection.

## 🧪 Testing Methods

### Method 1: Browser DevTools Console

#### Connect and Listen

```javascript
// Open DevTools Console (F12)
// Connect to Socket.IO server
const socket = io('http://localhost:3000');

// Listen to all events
socket.onAny((eventName, ...args) => {
  console.log(`📡 Event: ${eventName}`, args);
});

// Specific event listeners
socket.on('floorData', (data) => {
  console.log('📊 Floor Data:', data);
});

socket.on('new-alerts', (alertData) => {
  console.log('🚨 Alert:', alertData);
});

socket.on('predictions', (predData) => {
  console.log('🔮 Predictions:', predData);
});
```

#### Verify Connection

```javascript
socket.on('connect', () => {
  console.log('✅ Connected:', socket.id);
  console.log('🚀 Transport:', socket.io.engine.transport.name);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('🔥 Connection Error:', error);
});
```

### Method 2: Using SocketDebugger Component

Enable the debugging component in your app:

```jsx
// src/App.jsx

import SocketDebugger from './components/SocketDebugger';

function App() {
  return (
    <>
      <SocketDebugger />
      {/* ... rest of app */}
    </>
  );
}
```

The debugger shows:
- ✅ Connection status (Connected/Disconnected)
- 📡 Socket ID
- 🚀 Transport type (websocket/polling)
- 📊 Last 20 events received with timestamps
- 🔍 Event data preview

### Method 3: HTML Test Page

Create `test-websocket.html` in project root:

```html
<!DOCTYPE html>
<html>
<head>
  <title>SmartFloors WebSocket Test</title>
  <script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>
</head>
<body>
  <h1>SmartFloors WebSocket Tester</h1>
  <div id="status">Connecting...</div>
  <div id="events"></div>
  
  <script>
    const socket = io('http://localhost:3000');
    const statusDiv = document.getElementById('status');
    const eventsDiv = document.getElementById('events');
    
    socket.on('connect', () => {
      statusDiv.innerHTML = '✅ Connected: ' + socket.id;
    });
    
    socket.on('disconnect', () => {
      statusDiv.innerHTML = '❌ Disconnected';
    });
    
    // Log all events
    socket.onAny((eventName, ...args) => {
      const eventLog = document.createElement('div');
      eventLog.innerHTML = `<strong>${new Date().toLocaleTimeString()}</strong> - ${eventName}: <pre>${JSON.stringify(args, null, 2)}</pre>`;
      eventsDiv.insertBefore(eventLog, eventsDiv.firstChild);
    });
  </script>
</body>
</html>
```

Open in browser: `file:///path/to/test-websocket.html`

## 📊 Expected Data Structures

### floorData Event

```json
{
  "floors": [
    {
      "buildingId": 1,
      "buildingName": "Edificio Principal",
      "floorId": 1,
      "name": "Piso 1",
      "occupancy": 73,
      "temperature": 22.1,
      "humidity": 38,
      "powerConsumption": 130.7,
      "timestamp": "2025-11-11T23:09:40.991Z"
    }
    // ... 4 more floors
  ],
  "timestamp": "2025-11-11T23:10:33.577Z"
}
```

**Validation Checks:**
- ✅ `floors` is an array
- ✅ Array contains 5 items
- ✅ Each floor has all required fields
- ✅ `floorId` is 1-5
- ✅ Timestamp is ISO 8601 format

### new-alerts Event

```json
{
  "alerts": [
    {
      "floorId": 4,
      "floorName": "Piso 4",
      "anomalies": [
        {
          "type": "humidity",
          "severity": "critical",
          "metric": "Humedad",
          "value": 70,
          "message": "Humedad muy alta: 70%",
          "recommendation": "Activar deshumidificadores...",
          "timestamp": "2025-11-11T22:56:41.009Z"
        }
      ],
      "timestamp": "2025-11-11T22:56:41.009Z",
      "severity": "critical"
    }
  ],
  "timestamp": "2025-11-11T22:56:41.010Z"
}
```

**Validation Checks:**
- ✅ `alerts` is an array (can contain multiple alert groups)
- ✅ Each alert has `floorId`, `floorName`, `anomalies`
- ✅ `anomalies` is an array
- ✅ Each anomaly has `type`, `severity`, `message`, `recommendation`
- ✅ Severity is `critical` or `warning`

### predictions Event

```json
{
  "predictions": [
    {
      "floorId": 1,
      "predictions": {
        "temperature": {
          "predictions": [
            { "minutesAhead": 10, "temperature": 22.6, "timestamp": "..." },
            { "minutesAhead": 20, "temperature": 22.7, "timestamp": "..." }
            // ... up to 60 minutes
          ],
          "method": "hybrid",
          "confidence": 0.91,
          "currentValue": 23.6,
          "predictedValue": 22.7
        },
        "humidity": { /* same structure */ },
        "powerConsumption": { /* same structure */ },
        "occupancy": { /* same structure */ }
      }
    }
    // ... more floors
  ],
  "timestamp": "2025-11-11T23:15:41.002Z"
}
```

**Validation Checks:**
- ✅ `predictions` is an array
- ✅ Each item has `floorId` and `predictions` object
- ✅ Predictions object has 4 metrics
- ✅ Each metric has `predictions` array with 6 items
- ✅ `confidence` is between 0 and 1
- ✅ `method` is `hybrid`, `arima`, or `lstm`

## 🔍 Common Issues & Solutions

### Issue 1: "Connection failed"

**Symptoms:**
- No connection status in console
- No events received
- SocketDebugger shows "Disconnected"

**Debugging:**
```javascript
socket.on('connect_error', (error) => {
  console.error('Connection Error:', error.message);
  console.error('Error Type:', error.type);
  console.error('Error Description:', error.description);
});
```

**Solutions:**
1. Verify backend is running: `curl http://localhost:3000/health`
2. Check CORS configuration on backend
3. Ensure Socket.IO server is initialized
4. Check firewall/network settings

### Issue 2: "Events not received"

**Symptoms:**
- Connection successful
- But no `floorData`, `new-alerts`, or `predictions` events

**Debugging:**
```javascript
// Listen to ALL events
socket.onAny((eventName, ...args) => {
  console.log(`Event: ${eventName}`, args);
});
```

**Solutions:**
1. Verify backend is emitting events (check backend logs)
2. Ensure event names match exactly (case-sensitive)
3. Check if backend requires authentication/handshake
4. Verify data is being generated on backend

### Issue 3: "Alerts not displaying"

**Symptoms:**
- `new-alerts` event received
- But AlertsPanel not updating

**Debugging:**
```javascript
socket.on('new-alerts', (data) => {
  console.log('Alert structure:', JSON.stringify(data, null, 2));
  console.log('Has alerts array?', Array.isArray(data.alerts));
  console.log('First alert:', data.alerts?.[0]);
  console.log('Has anomalies?', Array.isArray(data.alerts?.[0]?.anomalies));
});
```

**Solution:**
Ensure frontend processes `alerts` array with nested `anomalies`:

```javascript
handleAlert(alertData) {
  if (alertData.alerts && Array.isArray(alertData.alerts)) {
    alertData.alerts.forEach(alertGroup => {
      alertGroup.anomalies.forEach(anomaly => {
        // Process each anomaly as individual alert
      });
    });
  }
}
```

### Issue 4: "Wrong event name"

**Symptoms:**
- Backend emits `alert` but frontend listens to `new-alerts`
- Or vice versa

**Debugging:**
```javascript
// In browser console, listen to ALL events
socket.onAny((eventName, ...args) => {
  if (eventName.includes('alert')) {
    console.log(`🚨 ALERT EVENT: "${eventName}"`, args);
  }
});
```

**Solution:**
Match event names exactly between backend and frontend. Current verified names:
- ✅ `floorData`
- ✅ `new-alerts` (NOT `alert`)
- ✅ `predictions`

## 🧩 Frontend Integration Testing

### Test useRealTimeData Hook

```javascript
// Create test component
function TestUseRealTimeData() {
  const { floorData, alerts, predictions, isConnected } = useRealTimeData();
  
  useEffect(() => {
    console.log('Floor Data:', Object.keys(floorData).length, 'floors');
    console.log('Alerts:', alerts.length, 'alerts');
    console.log('Predictions:', Object.keys(predictions).length, 'floors');
    console.log('Connected:', isConnected);
  }, [floorData, alerts, predictions, isConnected]);
  
  return null;
}
```

### Verify Subscription Cleanup

```javascript
// Mount/unmount test
const TestCleanup = () => {
  const [mounted, setMounted] = useState(true);
  
  return (
    <>
      <button onClick={() => setMounted(!mounted)}>
        Toggle Component
      </button>
      {mounted && <ComponentWithWebSocket />}
    </>
  );
};

// Check console for:
// ✅ "Subscribed to..." on mount
// ✅ "Unsubscribed from..." on unmount
```

## 📈 Performance Testing

### Measure Event Frequency

```javascript
let eventCount = 0;
let startTime = Date.now();

socket.on('floorData', () => {
  eventCount++;
  const elapsed = (Date.now() - startTime) / 1000;
  const rate = eventCount / elapsed;
  console.log(`Floor Data Events: ${eventCount} (${rate.toFixed(2)}/sec)`);
});
```

### Memory Leak Detection

```javascript
// Monitor memory usage
setInterval(() => {
  if (performance.memory) {
    console.log('Used JS Heap:', 
      (performance.memory.usedJSHeapSize / 1048576).toFixed(2), 'MB');
  }
}, 5000);

// Look for continuously increasing memory
// If memory keeps growing, check for:
// - Event listeners not being removed
// - Infinite state updates
// - Large data accumulation
```

## ✅ Testing Checklist

### Connection Tests
- [ ] Socket connects successfully
- [ ] Socket ID is generated
- [ ] Transport is `websocket` (not `polling`)
- [ ] Connection persists (no frequent disconnects)
- [ ] Reconnection works after manual disconnect

### Event Tests
- [ ] `floorData` event received
- [ ] `new-alerts` event received (NOT `alert`)
- [ ] `predictions` event received
- [ ] Events contain expected data structure
- [ ] Events trigger UI updates

### Data Validation Tests
- [ ] Floor data has 5 floors
- [ ] All floor fields present and correct types
- [ ] Alerts have `anomalies` array
- [ ] Predictions have 4 metrics per floor
- [ ] Timestamps are valid ISO 8601

### Integration Tests
- [ ] FloorBlock colors update on status change
- [ ] AlertsPanel displays new alerts
- [ ] PredictionsPanel shows correct predictions
- [ ] Loading state works correctly
- [ ] Error handling works (disconnect backend)

### Performance Tests
- [ ] No memory leaks over 5 minutes
- [ ] Event processing under 50ms
- [ ] UI remains responsive
- [ ] No dropped events

## 🛠️ Debugging Tools

### Chrome DevTools

1. **Network Tab**
   - Filter: WS (WebSocket)
   - View frames sent/received
   - Check handshake headers

2. **Console**
   - View all logs
   - Test socket commands
   - Inspect event data

3. **Performance Monitor**
   - CPU usage
   - Memory usage
   - DOM nodes

### SocketDebugger Component Features

- Real-time connection status
- Event log with timestamps
- Data preview (first 100 chars)
- Copy event data to clipboard
- Filter events by type

## 📚 Additional Resources

- [Socket.IO Client API](https://socket.io/docs/v4/client-api/)
- [Socket.IO Debugging](https://socket.io/docs/v4/troubleshooting-connection-issues/)
- [Chrome DevTools WebSocket](https://developer.chrome.com/docs/devtools/network/reference/#ws)

## 🔗 Related Documentation

- **[API Integration](../api/API_INTEGRATION.md)** - Complete API reference
- **[Data Integration](../api/DATA_INTEGRATION.md)** - Data structures
- **[Endpoint Tests](./ENDPOINT_TESTS.md)** - REST API testing
- **[System Architecture](../architecture/SYSTEM_ARCHITECTURE.md)** - Overall architecture

---

**Last Updated:** 2025-11-12  
**Event Names Verified:** ✅ `floorData`, `new-alerts`, `predictions`  
**Status:** ✅ All WebSocket events working correctly
