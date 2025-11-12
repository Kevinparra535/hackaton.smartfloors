import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineBell, HiOutlineFilter, HiX } from 'react-icons/hi';

// Styled Components
const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid rgba(100, 108, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: rgba(100, 108, 255, 0.1);
    border-color: rgba(100, 108, 255, 0.5);
    transform: translateY(-2px);
  }

  ${({ $isOpen }) =>
    $isOpen &&
    `
    background: rgba(100, 108, 255, 0.2);
    border-color: rgba(100, 108, 255, 0.6);
  `}
`;

const Badge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4d4f;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.4);
`;

const DropdownPanel = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 450px;
  max-height: 600px;
  background: rgba(26, 26, 26, 0.98);
  border: 1px solid rgba(100, 108, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  overflow: hidden;
  z-index: 1000;
`;

const PanelHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(100, 108, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(100, 108, 255, 0.05);
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const FiltersSection = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(100, 108, 255, 0.2);
  background: rgba(10, 10, 10, 0.5);
`;

const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
`;

const FiltersTitle = styled.h4`
  margin: 0;
  font-size: 0.9rem;
  color: #aaa;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const ClearFiltersButton = styled.button`
  background: transparent;
  border: 1px solid rgba(100, 108, 255, 0.3);
  color: #646cff;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  font-size: 0.75rem;
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

const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.8rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.label`
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 0.3rem;
  display: block;
`;

const FilterChip = styled.button`
  padding: 0.4rem 0.8rem;
  background: ${({ $active }) =>
    $active ? 'rgba(100, 108, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${({ $active }) => ($active ? '#646cff' : 'rgba(100, 108, 255, 0.2)')};
  border-radius: 20px;
  color: ${({ $active }) => ($active ? '#646cff' : '#ccc')};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(100, 108, 255, 0.2);
    border-color: #646cff;
    color: #646cff;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(100, 108, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.85rem;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #666;
  }

  &:focus {
    border-color: #646cff;
    background: rgba(100, 108, 255, 0.05);
  }
`;

const AlertsList = styled.div`
  max-height: 350px;
  overflow-y: auto;
  padding: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(100, 108, 255, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(100, 108, 255, 0.5);
    }
  }
`;

const AlertItem = styled(motion.div)`
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  background: ${({ $severity }) => {
    switch ($severity?.toLowerCase()) {
      case 'critical':
      case 'critico':
        return 'rgba(255, 77, 79, 0.1)';
      case 'warning':
      case 'advertencia':
        return 'rgba(255, 193, 7, 0.1)';
      default:
        return 'rgba(255, 255, 255, 0.03)';
    }
  }};
  border: 1px solid
    ${({ $severity }) => {
      switch ($severity?.toLowerCase()) {
        case 'critical':
        case 'critico':
          return 'rgba(255, 77, 79, 0.3)';
        case 'warning':
        case 'advertencia':
          return 'rgba(255, 193, 7, 0.3)';
        default:
          return 'rgba(100, 108, 255, 0.2)';
      }
    }};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $severity }) => {
      switch ($severity?.toLowerCase()) {
        case 'critical':
        case 'critico':
          return 'rgba(255, 77, 79, 0.15)';
        case 'warning':
        case 'advertencia':
          return 'rgba(255, 193, 7, 0.15)';
        default:
          return 'rgba(255, 255, 255, 0.05)';
      }
    }};
    transform: translateX(4px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
`;

const AlertFloor = styled.span`
  font-weight: 600;
  color: #ffffff;
  font-size: 0.9rem;
`;

const AlertTime = styled.span`
  font-size: 0.75rem;
  color: #999;
`;

const AlertMessage = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #ccc;
  line-height: 1.4;
`;

const EmptyState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
`;

const ResultsCount = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  color: #999;
  text-align: center;
  border-bottom: 1px solid rgba(100, 108, 255, 0.1);
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
 * AlertsDropdown - Dropdown panel with alerts and filters
 */
export default function AlertsDropdown({ alerts = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    severity: 'all',
    floor: 'all',
    type: 'all',
    search: ''
  });

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter alerts based on active filters
  const filteredAlerts = alerts.filter((alert) => {
    // Severity filter
    if (filters.severity !== 'all') {
      const alertSeverity = (alert.severity || alert.status || 'normal').toLowerCase();
      if (alertSeverity !== filters.severity.toLowerCase()) {
        return false;
      }
    }

    // Floor filter
    if (filters.floor !== 'all') {
      const floorId = String(alert.floorId || alert.floor);
      if (floorId !== filters.floor) {
        return false;
      }
    }

    // Type filter
    if (filters.type !== 'all') {
      const alertType = (alert.type || '').toLowerCase();
      if (!alertType.includes(filters.type.toLowerCase())) {
        return false;
      }
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const message = (alert.message || '').toLowerCase();
      const floorName = (alert.floorName || '').toLowerCase();
      const type = (alert.type || '').toLowerCase();

      if (
        !message.includes(searchTerm) &&
        !floorName.includes(searchTerm) &&
        !type.includes(searchTerm)
      ) {
        return false;
      }
    }

    return true;
  });

  // Get unique floors from alerts
  const uniqueFloors = [...new Set(alerts.map((a) => String(a.floorId || a.floor)))].sort(
    (a, b) => Number(a) - Number(b)
  );

  // Get unique types from alerts
  const uniqueTypes = [...new Set(alerts.map((a) => a.type).filter(Boolean))];

  // Check if any filters are active
  const hasActiveFilters =
    filters.severity !== 'all' ||
    filters.floor !== 'all' ||
    filters.type !== 'all' ||
    filters.search !== '';

  const clearAllFilters = () => {
    setFilters({
      severity: 'all',
      floor: 'all',
      type: 'all',
      search: ''
    });
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        <HiOutlineBell />
        Alertas
        {alerts.length > 0 && <Badge>{alerts.length}</Badge>}
      </DropdownButton>

      <AnimatePresence>
        {isOpen && (
          <DropdownPanel
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <PanelHeader>
              <PanelTitle>🚨 Alertas Recientes</PanelTitle>
              <CloseButton onClick={() => setIsOpen(false)}>
                <HiX size={20} />
              </CloseButton>
            </PanelHeader>

            {/* Filters Section */}
            <FiltersSection>
              <FiltersHeader>
                <FiltersTitle>
                  <HiOutlineFilter />
                  Filtros
                </FiltersTitle>
                <ClearFiltersButton onClick={clearAllFilters} disabled={!hasActiveFilters}>
                  Limpiar
                </ClearFiltersButton>
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
                  Crítico
                </FilterChip>
                <FilterChip
                  $active={filters.severity === 'warning'}
                  onClick={() => updateFilter('severity', 'warning')}
                >
                  Advertencia
                </FilterChip>
                <FilterChip
                  $active={filters.severity === 'normal'}
                  onClick={() => updateFilter('severity', 'normal')}
                >
                  Normal
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
                        $active={filters.floor === floor}
                        onClick={() => updateFilter('floor', floor)}
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

              {/* Search Input */}
              <FilterLabel>Buscar</FilterLabel>
              <SearchInput
                type='text'
                placeholder='Buscar en alertas...'
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
            </FiltersSection>

            {/* Results Count */}
            {hasActiveFilters && (
              <ResultsCount>
                Mostrando {filteredAlerts.length} de {alerts.length} alertas
              </ResultsCount>
            )}

            {/* Alerts List */}
            <AlertsList>
              <AnimatePresence mode='popLayout'>
                {filteredAlerts.length === 0 ? (
                  <EmptyState>
                    {hasActiveFilters
                      ? 'No hay alertas que coincidan con los filtros'
                      : 'Sin alertas por el momento. Todos los sistemas normales.'}
                  </EmptyState>
                ) : (
                  filteredAlerts.map((alert) => {
                    const severityValue = alert.severity || alert.status || 'normal';

                    return (
                      <AlertItem
                        key={alert.id}
                        $severity={severityValue}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <AlertHeader>
                          <AlertFloor>
                            {alert.floorName ||
                              alert.name ||
                              `Piso ${alert.floorId || alert.floor}`}
                          </AlertFloor>
                          <AlertTime>{formatTime(alert.timestamp)}</AlertTime>
                        </AlertHeader>
                        <AlertMessage>
                          {alert.message ||
                            `${alert.type || 'Alerta'}: ${alert.value || 'Anomalía detectada'}`}
                        </AlertMessage>
                      </AlertItem>
                    );
                  })
                )}
              </AnimatePresence>
            </AlertsList>
          </DropdownPanel>
        )}
      </AnimatePresence>
    </DropdownContainer>
  );
}
