import { useState, useMemo } from 'react';
import styled from 'styled-components';
import {
  FiAlertTriangle,
  FiAlertCircle,
  FiInfo,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { colors } from '../styles/scssTokens';

/**
 * AlertsTable Component
 * Displays alerts in a sortable table format with columns:
 * - Timestamp
 * - Piso (Floor)
 * - Variable (temperature, humidity, power, thermal_overload)
 * - Nivel (Severity: Informativa, Media, Crítica)
 * - Recomendación
 */
const AlertsTable = ({ alerts = [] }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

  // Transform alerts data for table display
  const tableData = useMemo(() => {
    const rows = [];

    alerts.forEach((alert, alertIndex) => {
      if (alert.anomalies && alert.anomalies.length > 0) {
        alert.anomalies.forEach((anomaly, anomalyIndex) => {
          rows.push({
            id: `alert_${alertIndex}_anomaly_${anomalyIndex}_${alert.floorId}_${anomaly.type}`,
            timestamp: alert.timestamp || new Date().toISOString(),
            piso: alert.floorId,
            pisoNombre: alert.floorName || `Piso ${alert.floorId}`,
            variable: anomaly.type,
            nivel: anomaly.severity || alert.severity || 'warning',
            recomendacion: anomaly.recommendation || anomaly.message || 'Sin recomendación',
            isPredictive: anomaly.isPredictive || false,
            minutesAhead: anomaly.minutesAhead || null
          });
        });
      } else {
        // Fallback for alerts without anomalies
        rows.push({
          id: `alert_${alertIndex}_${alert.floorId}_${alert.type || 'unknown'}`,
          timestamp: alert.timestamp || new Date().toISOString(),
          piso: alert.floorId,
          pisoNombre: alert.floorName || `Piso ${alert.floorId}`,
          variable: alert.type || 'unknown',
          nivel: alert.severity || 'warning',
          recomendacion: alert.message || 'Sin recomendación',
          isPredictive: alert.isPredictive || false,
          minutesAhead: alert.minutesAhead || null
        });
      }
    });

    return rows;
  }, [alerts]);

  // Sort table data
  const sortedData = useMemo(() => {
    const sorted = [...tableData];

    sorted.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle timestamp sorting
      if (sortConfig.key === 'timestamp') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      // Handle severity sorting (critical > warning > info)
      else if (sortConfig.key === 'nivel') {
        const severityOrder = { critical: 3, warning: 2, info: 1 };
        aValue = severityOrder[aValue] || 0;
        bValue = severityOrder[bValue] || 0;
      }
      // Handle number sorting for piso
      else if (sortConfig.key === 'piso') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      // Handle string sorting for variable
      else if (sortConfig.key === 'variable') {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      // Compare values
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [tableData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getVariableLabel = (variable) => {
    const labels = {
      temperature: 'Temperatura',
      humidity: 'Humedad',
      power: 'Energía',
      powerConsumption: 'Energía',
      occupancy: 'Ocupación',
      thermal_overload: 'Riesgo Combinado',
      sudden_change: 'Cambio Súbito'
    };
    return labels[variable] || variable;
  };

  const getNivelLabel = (nivel) => {
    const labels = {
      critical: 'Crítica',
      warning: 'Media',
      info: 'Informativa'
    };
    return labels[nivel] || nivel;
  };

  const getSeverityIcon = (nivel) => {
    switch (nivel) {
      case 'critical':
        return <FiAlertTriangle />;
      case 'warning':
        return <FiAlertCircle />;
      case 'info':
        return <FiInfo />;
      default:
        return <FiInfo />;
    }
  };

  if (sortedData.length === 0) {
    return (
      <TableContainer>
        <EmptyState>
          <FiInfo size={48} />
          <p>No hay alertas para mostrar</p>
        </EmptyState>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <TableHeader onClick={() => handleSort('timestamp')} $sortable>
                Timestamp
                {sortConfig.key === 'timestamp' &&
                  (sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
              </TableHeader>
              <TableHeader onClick={() => handleSort('piso')} $sortable>
                Piso
                {sortConfig.key === 'piso' &&
                  (sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
              </TableHeader>
              <TableHeader onClick={() => handleSort('variable')} $sortable>
                Variable
                {sortConfig.key === 'variable' &&
                  (sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
              </TableHeader>
              <TableHeader onClick={() => handleSort('nivel')} $sortable>
                Nivel
                {sortConfig.key === 'nivel' &&
                  (sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />)}
              </TableHeader>
              <TableHeader>Recomendación</TableHeader>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => (
              <TableRow key={row.id} $isPredictive={row.isPredictive}>
                <TableCell>
                  {formatTimestamp(row.timestamp)}
                  {row.isPredictive && (
                    <PredictiveBadge>🔮 +{row.minutesAhead}min</PredictiveBadge>
                  )}
                </TableCell>
                <TableCell>
                  <strong>{row.piso}</strong>
                  <FloorName>{row.pisoNombre}</FloorName>
                </TableCell>
                <TableCell>
                  <VariableBadge $variable={row.variable}>
                    {getVariableLabel(row.variable)}
                  </VariableBadge>
                </TableCell>
                <TableCell>
                  <SeverityBadge $severity={row.nivel}>
                    {getSeverityIcon(row.nivel)}
                    <span>{getNivelLabel(row.nivel)}</span>
                  </SeverityBadge>
                </TableCell>
                <TableCell>
                  <Recommendation>{row.recomendacion}</Recommendation>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
      <TableFooter>
        <span>
          Total de alertas: <strong>{sortedData.length}</strong>
        </span>
      </TableFooter>
    </TableContainer>
  );
};

// Styled Components
const TableContainer = styled.div`
  padding: 0;
  background: rgba(26, 26, 26, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(100, 108, 255, 0.2);
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  max-height: 600px;
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(10, 10, 10, 0.5);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(100, 108, 255, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 108, 255, 0.5);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

const TableHeader = styled.th`
  background: rgba(10, 10, 10, 0.8);
  color: #fff;
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 2px solid rgba(100, 108, 255, 0.3);
  cursor: ${(props) => (props.$sortable ? 'pointer' : 'default')};
  user-select: none;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${(props) =>
      props.$sortable ? 'rgba(100, 108, 255, 0.1)' : 'rgba(10, 10, 10, 0.8)'};
  }

  svg {
    opacity: 0.7;
    vertical-align: middle;
    margin-left: 0.5rem;
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(100, 108, 255, 0.1);
  transition: all 0.2s ease;
  background: ${(props) => (props.$isPredictive ? 'rgba(157, 78, 221, 0.05)' : 'transparent')};

  &:hover {
    background: ${(props) =>
      props.$isPredictive ? 'rgba(157, 78, 221, 0.15)' : 'rgba(100, 108, 255, 0.05)'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #ccc;
  vertical-align: top;

  strong {
    color: #fff;
  }
`;

const FloorName = styled.div`
  font-size: 0.75rem;
  color: #888;
  margin-top: 0.25rem;
`;

const PredictiveBadge = styled.div`
  display: inline-block;
  margin-top: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: linear-gradient(135deg, #9d4edd, #646cff);
  color: #fff;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const VariableBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${(props) => {
    switch (props.$variable) {
      case 'temperature':
        return 'rgba(255, 77, 79, 0.15)';
      case 'humidity':
        return 'rgba(0, 180, 216, 0.15)';
      case 'power':
      case 'powerConsumption':
        return 'rgba(255, 217, 102, 0.15)';
      case 'occupancy':
        return 'rgba(100, 108, 255, 0.15)';
      case 'thermal_overload':
        return 'rgba(255, 77, 79, 0.2)';
      default:
        return 'rgba(100, 108, 255, 0.15)';
    }
  }};
  color: ${(props) => {
    switch (props.$variable) {
      case 'temperature':
        return '#ff4d4f';
      case 'humidity':
        return '#00b4d8';
      case 'power':
      case 'powerConsumption':
        return '#ffd966';
      case 'occupancy':
        return '#646cff';
      case 'thermal_overload':
        return '#ff4d4f';
      default:
        return '#646cff';
    }
  }};
  border: 1px solid
    ${(props) => {
      switch (props.$variable) {
        case 'temperature':
          return 'rgba(255, 77, 79, 0.3)';
        case 'humidity':
          return 'rgba(0, 180, 216, 0.3)';
        case 'power':
        case 'powerConsumption':
          return 'rgba(255, 217, 102, 0.3)';
        case 'occupancy':
          return 'rgba(100, 108, 255, 0.3)';
        case 'thermal_overload':
          return 'rgba(255, 77, 79, 0.4)';
        default:
          return 'rgba(100, 108, 255, 0.3)';
      }
    }};
`;

const SeverityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${(props) => {
    switch (props.$severity) {
      case 'critical':
        return colors.danger;
      case 'warning':
        return colors.warning;
      case 'info':
        return colors.success;
      default:
        return colors.warning;
    }
  }};
  color: #000;

  svg {
    font-size: 1rem;
  }
`;

const Recommendation = styled.div`
  color: #aaa;
  line-height: 1.5;
  max-width: 400px;
`;

const TableFooter = styled.div`
  padding: 1rem 1.5rem;
  background: rgba(10, 10, 10, 0.5);
  border-top: 1px solid rgba(100, 108, 255, 0.2);
  color: #888;
  font-size: 0.85rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  strong {
    color: #fff;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #666;

  svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  p {
    font-size: 1rem;
    margin: 0;
  }
`;

export default AlertsTable;
