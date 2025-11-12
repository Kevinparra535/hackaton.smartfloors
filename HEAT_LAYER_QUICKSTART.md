# 🚀 Quick Start - Heat Layer System

## Ver el Heat Layer en Acción

### 1. Servidor Corriendo
```bash
npm run dev
```
**URL**: http://localhost:5173

### 2. Configuración Actual
Los pisos muestran estos estados:

- **Piso 1**: 🔵 Azul (Optimal)
- **Piso 2**: 🟡 Amarillo (Warning)
- **Piso 3**: 🔴 Rojo PULSANDO (Critical)
- **Piso 4**: 🟣 Morado PULSANDO (Combined Risk)
- **Piso 5**: 🔵 Azul (Optimal)

### 3. Cambiar Estados

**Archivo**: `src/config/heatLayerConfig.js`

**Línea 54-60**: Edita `MANUAL_HEAT_CONFIG`

```javascript
export const MANUAL_HEAT_CONFIG = {
  1: 'optimal',        // Opciones: optimal, warning, critical, combined_risk
  2: 'warning',
  3: 'critical',
  4: 'combined_risk',
  5: 'optimal'
};
```

### 4. Ver Cambios
- Guarda el archivo
- El navegador se actualiza automáticamente (HMR)
- Los pisos cambian de color instantáneamente

## Cheatsheet de Estados

| Estado | Color | Pulsa | Código |
|--------|-------|-------|--------|
| Optimal | 🔵 Azul | No | `'optimal'` |
| Warning | 🟡 Amarillo | No | `'warning'` |
| Critical | 🔴 Rojo | Sí | `'critical'` |
| Combined Risk | 🟣 Morado | Sí | `'combined_risk'` |

## Ejemplos Rápidos

### Todo Óptimo
```javascript
export const MANUAL_HEAT_CONFIG = {
  1: 'optimal',
  2: 'optimal',
  3: 'optimal',
  4: 'optimal',
  5: 'optimal'
};
```

### Crisis Total
```javascript
export const MANUAL_HEAT_CONFIG = {
  1: 'critical',
  2: 'critical',
  3: 'critical',
  4: 'critical',
  5: 'critical'
};
```

### Escalada Gradual
```javascript
export const MANUAL_HEAT_CONFIG = {
  1: 'optimal',
  2: 'optimal',
  3: 'warning',
  4: 'critical',
  5: 'combined_risk'
};
```

## Debug

Abre DevTools (F12) y busca:
```
🌡️ [FloorBlock 1] Heat Layer State: ...
```

## Docs Completas
- **Guía Completa**: `HEAT_LAYER_GUIDE.md`
- **Implementación**: `HEAT_LAYER_IMPLEMENTATION.md`
