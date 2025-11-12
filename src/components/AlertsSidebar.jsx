import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiFilter, FiSearch, FiDownload } from 'react-icons/fi';
import { fetchAlertsWithFilters, exportAlertsToCSV } from '../api/rest';

// Styled Components
const SidebarOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  backdrop-filter: blur(2px);
`;

const SidebarContainer = styled(motion.aside)`
  position: fixed;
  top: 0;
  right: 0;
  width: 40vw;
  height: 100vh;
  background: rgba(15, 15, 15, 0.98);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(100, 108, 255, 0.3);
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(100, 108, 255, 0.2);
  background: rgba(10, 10, 10, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

const SidebarTitle = styled.h2`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const AlertBadge = styled.span`
  background: ${(props) =>
    props.$count > 0 ? 'linear-gradient(135deg, #ff4d4f, #ff7875)' : '#333'};
  color: #fff;
  padding: 0.25rem 0.65rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  min-width: 28px;
  text-align: center;
  box-shadow: ${(props) => (props.$count > 0 ? '0 2px 8px rgba(255, 77, 79, 0.3)' : 'none')};
`;

const CloseButton = styled.button`
  background: transparent;
  border: 1px solid rgba(100, 108, 255, 0.3);
  color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1.2rem;

  &:hover {
    background: rgba(100, 108, 255, 0.2);
    border-color: #646cff;
    transform: scale(1.05);
  }
`;

const FiltersSection = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(100, 108, 255, 0.2);
  background: rgba(10, 10, 10, 0.5);
  flex-shrink: 0;
  max-height: 50vh;
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(100, 108, 255, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(100, 108, 255, 0.5);
    }
  }
`;

const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const FiltersTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  color: #aaa;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ClearFiltersButton = styled.button`
  background: transparent;
  border: 1px solid rgba(100, 108, 255, 0.3);
  color: #646cff;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(100, 108, 255, 0.1);
    border-color: #646cff;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const ExportButton = styled.button`
  background: linear-gradient(135deg, #00ff88, #00b4d8);
  border: none;
  color: #000;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterChip = styled.button`
  background: ${(props) => (props.$active ? '#646cff' : 'rgba(26, 26, 26, 0.8)')};
  border: 1px solid ${(props) => (props.$active ? '#646cff' : 'rgba(100, 108, 255, 0.2)')};
  color: ${(props) => (props.$active ? '#ffffff' : '#ccc')};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${(props) => (props.$active ? '600' : '400')};

  &:hover {
    background: ${(props) => (props.$active ? '#5a5fcf' : 'rgba(100, 108, 255, 0.15)')};
    border-color: #646cff;
    transform: translateY(-1px);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(100, 108, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #646cff;
    background: rgba(26, 26, 26, 1);
    box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.1);
  }

  &::placeholder {
    color: #666;
  }
`;

const ResultsCount = styled.div`
  padding: 0.75rem 1.5rem;
  font-size: 0.85rem;
  color: #999;
  background: rgba(10, 10, 10, 0.5);
  border-bottom: 1px solid rgba(100, 108, 255, 0.1);
  flex-shrink: 0;
`;

const AlertsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(100, 108, 255, 0.3);
    border-radius: 4px;

    &:hover {
      background: rgba(100, 108, 255, 0.5);
    }
  }
`;

const AlertItem = styled(motion.div)`
  background: ${(props) => {
    if (props.$severity === 'critical') return 'rgba(255, 77, 79, 0.1)';
    if (props.$severity === 'warning') return 'rgba(255, 217, 102, 0.1)';
    return 'rgba(26, 26, 26, 0.6)';
  }};
  border: 1px solid
    ${(props) => {
      if (props.$severity === 'critical') return 'rgba(255, 77, 79, 0.3)';
      if (props.$severity === 'warning') return 'rgba(255, 217, 102, 0.3)';
      return 'rgba(100, 108, 255, 0.2)';
    }};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => {
      if (props.$severity === 'critical') return 'rgba(255, 77, 79, 0.15)';
      if (props.$severity === 'warning') return 'rgba(255, 217, 102, 0.15)';
      return 'rgba(26, 26, 26, 0.8)';
    }};
    transform: translateX(-4px);
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.3);
  }
`;

const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const AlertFloor = styled.span`
  font-weight: 700;
  color: #ffffff;
  font-size: 0.95rem;
`;

const AlertTime = styled.span`
  font-size: 0.75rem;
  color: #888;
`;

const AlertMessage = styled.p`
  margin: 0;
  margin-bottom: 0.3rem;
  font-size: 0.85rem;
  color: #ccc;
  line-height: 1.4;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: #fff;
    text-transform: capitalize;
  }
`;

const EmptyState = styled.div`
  padding: 3rem 1.5rem;
  text-align: center;
  color: #666;
  font-size: 0.95rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  svg {
    font-size: 3rem;
    opacity: 0.3;
  }
`;

const LoadingState = styled.div`
  padding: 3rem 1.5rem;
  text-align: center;
  color: #999;
  font-size: 0.95rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(100, 108, 255, 0.2);
  border-top: 3px solid #646cff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Helper Functions
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * AlertsSidebar - Full-height sidebar panel with alerts and backend filters
 */
export default function AlertsSidebar({ isOpen, onClose, alerts: initialAlerts = [] }) {
  const [filters, setFilters] = useState({
    severity: 'all',
    floor: 'all',
    type: 'all',
    isPredictive: 'all',
    search: ''
  });

  const [filteredAlerts, setFilteredAlerts] = useState(initialAlerts);
  const [isLoading, setIsLoading] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  // Fetch alerts from backend when filters change
  useEffect(() => {
    const fetchFilteredAlerts = async () => {
      const hasBackendFilters =
        filters.severity !== 'all' ||
        filters.floor !== 'all' ||
        filters.type !== 'all' ||
        filters.isPredictive !== 'all';

      if (!hasBackendFilters) {
        let alerts = initialAlerts;

        if (filters.search.trim()) {
          const searchLower = filters.search.toLowerCase();
          alerts = alerts.filter((alert) => {
            const messageMatch =
              alert.message?.toLowerCase().includes(searchLower) ||
              alert.type?.toLowerCase().includes(searchLower);

            const anomalyMatch = alert.anomalies?.some((anomaly) => {
              return (
                anomaly.message?.toLowerCase().includes(searchLower) ||
                anomaly.type?.toLowerCase().includes(searchLower) ||
                anomaly.recommendation?.toLowerCase().includes(searchLower)
              );
            });

            return messageMatch || anomalyMatch;
          });
        }

        setFilteredAlerts(alerts);
        setAlertCount(0);
        return;
      }

      setIsLoading(true);

      try {
        const backendFilters = {};

        if (filters.severity !== 'all') {
          backendFilters.severity = filters.severity;
        }
        if (filters.floor !== 'all') {
          backendFilters.floorId = Number.parseInt(filters.floor);
        }
        if (filters.type !== 'all') {
          backendFilters.type = filters.type;
        }
        if (filters.isPredictive !== 'all') {
          backendFilters.isPredictive = filters.isPredictive === 'true';
        }

        const response = await fetchAlertsWithFilters(backendFilters);
        let alerts = response.alerts || [];

        if (filters.search.trim()) {
          const searchLower = filters.search.toLowerCase();
          alerts = alerts.filter((alert) => {
            const messageMatch =
              alert.message?.toLowerCase().includes(searchLower) ||
              alert.type?.toLowerCase().includes(searchLower);

            const anomalyMatch = alert.anomalies?.some((anomaly) => {
              return (
                anomaly.message?.toLowerCase().includes(searchLower) ||
                anomaly.type?.toLowerCase().includes(searchLower) ||
                anomaly.recommendation?.toLowerCase().includes(searchLower)
              );
            });

            return messageMatch || anomalyMatch;
          });
        }

        setFilteredAlerts(alerts);
        setAlertCount(response.count || 0);
      } catch (error) {
        console.error('Error fetching filtered alerts:', error);
        setFilteredAlerts(initialAlerts);
        setAlertCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredAlerts();
  }, [filters, initialAlerts]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      severity: 'all',
      floor: 'all',
      type: 'all',
      isPredictive: 'all',
      search: ''
    });
  };

  const hasActiveFilters =
    filters.severity !== 'all' ||
    filters.floor !== 'all' ||
    filters.type !== 'all' ||
    filters.isPredictive !== 'all' ||
    filters.search.trim() !== '';

  const handleExportCSV = async () => {
    try {
      console.log('🔄 Iniciando exportación CSV con filtros:', filters);
      
      // Build backend filters
      const backendFilters = {};
      if (filters.severity !== 'all') {
        backendFilters.severity = filters.severity;
      }
      if (filters.floor !== 'all') {
        backendFilters.floorId = parseInt(filters.floor, 10);
      }
      if (filters.type !== 'all') {
        backendFilters.type = filters.type;
      }
      if (filters.isPredictive !== 'all') {
        backendFilters.isPredictive = filters.isPredictive === 'true';
      }

      console.log('📤 Filtros procesados para backend:', backendFilters);

      // Call export function
      const blob = await exportAlertsToCSV(backendFilters);

      console.log('✅ Blob recibido:', blob.size, 'bytes, tipo:', blob.type);

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      link.download = `alertas-smartfloors-${date}.csv`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('✅ Exportación completada exitosamente');
    } catch (error) {
      console.error('❌ Error completo en exportación:', error);
      alert(`Error al exportar alertas: ${error.message}\n\nRevisa la consola para más detalles.`);
    }
  };

  // Extract unique values from alerts for filter options
  const uniqueFloors = [
    ...new Set(
      initialAlerts.flatMap((alert) =>
        alert.anomalies && alert.anomalies.length > 0
          ? alert.anomalies.map(() => alert.floorId || alert.floor)
          : [alert.floorId || alert.floor]
      )
    )
  ].sort((a, b) => a - b);

  const uniqueTypes = [
    ...new Set(
      initialAlerts.flatMap((alert) =>
        alert.anomalies && alert.anomalies.length > 0
          ? alert.anomalies.map((anomaly) => anomaly.type)
          : [alert.type]
      )
    )
  ].sort();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <SidebarOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <SidebarContainer
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <SidebarHeader>
              <SidebarTitle>
                Alertas
                <AlertBadge $count={initialAlerts.length}>{initialAlerts.length}</AlertBadge>
              </SidebarTitle>
              <CloseButton onClick={onClose}>
                <FiX />
              </CloseButton>
            </SidebarHeader>

            {/* Filters */}
            <FiltersSection>
              <FiltersHeader>
                <FiltersTitle>
                  <FiFilter /> Filtros
                </FiltersTitle>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <ExportButton onClick={handleExportCSV} title="Exportar alertas a CSV">
                    <FiDownload /> Exportar CSV
                  </ExportButton>
                  <ClearFiltersButton onClick={clearAllFilters} disabled={!hasActiveFilters}>
                    Limpiar
                  </ClearFiltersButton>
                </div>
              </FiltersHeader>

              {/* Severity Filter */}
              <FilterLabel>Severidad</FilterLabel>
              <FilterGroup>
                <FilterChip
                  $active={filters.severity === 'all'}
                  onClick={() => updateFilter('severity', 'all')}
                >
                  Todas
                </FilterChip>
                <FilterChip
                  $active={filters.severity === 'critical'}
                  onClick={() => updateFilter('severity', 'critical')}
                >
                  Críticas
                </FilterChip>
                <FilterChip
                  $active={filters.severity === 'warning'}
                  onClick={() => updateFilter('severity', 'warning')}
                >
                  Advertencias
                </FilterChip>
              </FilterGroup>

              {/* Floor Filter */}
              {uniqueFloors.length > 0 && (
                <>
                  <FilterLabel>Piso</FilterLabel>
                  <FilterGroup>
                    <FilterChip
                      $active={filters.floor === 'all'}
                      onClick={() => updateFilter('floor', 'all')}
                    >
                      Todos
                    </FilterChip>
                    {uniqueFloors.map((floor) => (
                      <FilterChip
                        key={floor}
                        $active={filters.floor === String(floor)}
                        onClick={() => updateFilter('floor', String(floor))}
                      >
                        Piso {floor}
                      </FilterChip>
                    ))}
                  </FilterGroup>
                </>
              )}

              {/* Type Filter */}
              {uniqueTypes.length > 0 && (
                <>
                  <FilterLabel>Tipo</FilterLabel>
                  <FilterGroup>
                    <FilterChip
                      $active={filters.type === 'all'}
                      onClick={() => updateFilter('type', 'all')}
                    >
                      Todos
                    </FilterChip>
                    {uniqueTypes.map((type) => (
                      <FilterChip
                        key={type}
                        $active={filters.type === type}
                        onClick={() => updateFilter('type', type)}
                      >
                        {type}
                      </FilterChip>
                    ))}
                  </FilterGroup>
                </>
              )}

              {/* Predictive Filter */}
              <FilterLabel>Tipo de Alerta</FilterLabel>
              <FilterGroup>
                <FilterChip
                  $active={filters.isPredictive === 'all'}
                  onClick={() => updateFilter('isPredictive', 'all')}
                >
                  Todas
                </FilterChip>
                <FilterChip
                  $active={filters.isPredictive === 'false'}
                  onClick={() => updateFilter('isPredictive', 'false')}
                >
                  Actuales
                </FilterChip>
                <FilterChip
                  $active={filters.isPredictive === 'true'}
                  onClick={() => updateFilter('isPredictive', 'true')}
                >
                  🔮 Preventivas
                </FilterChip>
              </FilterGroup>

              {/* Search Input */}
              {/* <FilterLabel>
                <FiSearch style={{ display: 'inline', marginRight: '0.3rem' }} />
                Buscar
              </FilterLabel>
              <SearchInput
                type='text'
                placeholder='Buscar en alertas...'
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
              /> */}
            </FiltersSection>

            {/* Results Count */}
            {hasActiveFilters && (
              <ResultsCount>
                {isLoading
                  ? 'Cargando...'
                  : alertCount > 0
                    ? `Mostrando ${filteredAlerts.length} de ${alertCount} alertas (total: ${initialAlerts.length})`
                    : `Mostrando ${filteredAlerts.length} de ${initialAlerts.length} alertas`}
              </ResultsCount>
            )}

            {/* Alerts List */}
            <AlertsList>
              {isLoading ? (
                <LoadingState>
                  <LoadingSpinner />
                  <span>Cargando alertas...</span>
                </LoadingState>
              ) : (
                <AnimatePresence mode='popLayout'>
                  {filteredAlerts.length === 0 ? (
                    <EmptyState>
                      <FiSearch />
                      <div>
                        {hasActiveFilters
                          ? 'No hay alertas que coincidan con los filtros'
                          : 'Sin alertas por el momento. Todos los sistemas normales.'}
                      </div>
                    </EmptyState>
                  ) : (
                    filteredAlerts.map((alert) => {
                      const severityValue = alert.severity || alert.status || 'normal';

                      return (
                        <AlertItem
                          key={alert.id || `${alert.floorId}-${alert.timestamp}`}
                          $severity={severityValue}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                          layout
                        >
                          <AlertHeader>
                            <AlertFloor>
                              {alert.floorName ||
                                alert.name ||
                                `Piso ${alert.floorId || alert.floor}`}
                            </AlertFloor>
                            <AlertTime>{formatTime(alert.timestamp)}</AlertTime>
                          </AlertHeader>

                          {/* Display anomalies */}
                          {alert.anomalies && alert.anomalies.length > 0 ? (
                            alert.anomalies.map((anomaly, idx) => (
                              <AlertMessage key={`anomaly-${idx}`}>
                                {anomaly.isPredictive && '🔮 '}
                                <strong>{anomaly.type}:</strong> {anomaly.message}
                                {anomaly.minutesAhead && ` (en ${anomaly.minutesAhead} min)`}
                              </AlertMessage>
                            ))
                          ) : (
                            <AlertMessage>
                              {alert.message ||
                                `${alert.type || 'Alerta'}: ${
                                  alert.value || 'Anomalía detectada'
                                }`}
                            </AlertMessage>
                          )}
                        </AlertItem>
                      );
                    })
                  )}
                </AnimatePresence>
              )}
            </AlertsList>
          </SidebarContainer>
        </>
      )}
    </AnimatePresence>
  );
}
