/**
 * Alert Validation Utilities
 * Validates concordance between alerts and floor status
 */

/**
 * Map backend severity to frontend status
 * @param {string} severity - Backend severity (critical, warning)
 * @returns {string} Frontend status (danger, warning, normal)
 */
export const mapSeverityToStatus = (severity) => {
  const mapping = {
    critical: 'danger',
    warning: 'warning',
    normal: 'normal'
  };
  return mapping[severity] || 'normal';
};

/**
 * Map frontend status to backend severity
 * @param {string} status - Frontend status (danger, warning, normal)
 * @returns {string} Backend severity (critical, warning, normal)
 */
export const mapStatusToSeverity = (status) => {
  const mapping = {
    danger: 'critical',
    warning: 'warning',
    normal: 'normal'
  };
  return mapping[status] || 'normal';
};

/**
 * Validate if alert severity matches floor metrics
 * @param {Object} floor - Floor data with metrics
 * @param {string} alertSeverity - Alert severity from backend
 * @param {string} alertType - Type of anomaly (temperature, humidity, powerConsumption)
 * @returns {Object} Validation result
 */
export const validateAlertConcordance = (floor, alertSeverity, alertType) => {
  const { temperature, humidity, powerConsumption } = floor;
  
  let expectedSeverity = 'normal';
  let reason = '';

  // Check critical conditions
  if (alertType === 'temperature') {
    if (temperature > 26 || temperature < 18) {
      expectedSeverity = 'critical';
      reason = `Temperature ${temperature}°C is ${temperature > 26 ? 'above 26°C' : 'below 18°C'}`;
    } else if (temperature > 24 || temperature < 20) {
      expectedSeverity = 'warning';
      reason = `Temperature ${temperature}°C is ${temperature > 24 ? 'above 24°C' : 'below 20°C'}`;
    }
  }

  if (alertType === 'humidity') {
    if (humidity > 70 || humidity < 30) {
      expectedSeverity = 'critical';
      reason = `Humidity ${humidity}% is ${humidity > 70 ? 'above 70%' : 'below 30%'}`;
    } else if (humidity > 60 || humidity < 35) {
      expectedSeverity = 'warning';
      reason = `Humidity ${humidity}% is ${humidity > 60 ? 'above 60%' : 'below 35%'}`;
    }
  }

  if (alertType === 'powerConsumption') {
    if (powerConsumption > 150) {
      expectedSeverity = 'critical';
      reason = `Power consumption ${powerConsumption}kW is above 150kW`;
    } else if (powerConsumption > 135) {
      expectedSeverity = 'warning';
      reason = `Power consumption ${powerConsumption}kW is above 135kW`;
    }
  }

  const isValid = expectedSeverity === alertSeverity;

  return {
    isValid,
    expectedSeverity,
    actualSeverity: alertSeverity,
    reason,
    message: isValid 
      ? `✅ Alert severity matches metrics` 
      : `⚠️ Mismatch: Expected ${expectedSeverity}, got ${alertSeverity}. ${reason}`
  };
};

/**
 * Get color for severity/status
 * @param {string} severity - Severity or status value
 * @returns {string} Hex color
 */
export const getSeverityColor = (severity) => {
  const normalized = severity?.toLowerCase();
  
  if (normalized === 'danger' || normalized === 'critical') {
    return '#ff4d4f'; // Red
  }
  if (normalized === 'warning') {
    return '#ffd966'; // Yellow
  }
  return '#00ff88'; // Green
};

/**
 * Get severity label in Spanish
 * @param {string} severity - Severity value
 * @returns {string} Spanish label
 */
export const getSeverityLabel = (severity) => {
  const labels = {
    critical: '🚨 Crítico',
    danger: '🚨 Peligro',
    warning: '⚠️ Advertencia',
    normal: '✅ Normal'
  };
  return labels[severity?.toLowerCase()] || '❓ Desconocido';
};
