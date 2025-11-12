import styled from 'styled-components';

/**
 * VisualizationSelector - Selector de modo de visualización
 */
export const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
  margin-right: 1rem;
`;

export const SelectorLabel = styled.label`
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '🎨';
    font-size: 1.2rem;
  }
`;

export const Select = styled.select`
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(100, 108, 255, 0.3);
  border-radius: 8px;
  color: #ffffff;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;

  &:hover {
    border-color: rgba(100, 108, 255, 0.6);
    background-color: rgba(100, 108, 255, 0.1);
  }

  &:focus {
    outline: none;
    border-color: #646cff;
    box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.2);
  }

  option {
    background: #1a1a1a;
    color: #ffffff;
    padding: 0.5rem;
  }
`;

/**
 * ColorLegend - Leyenda de colores/estados
 */
export const LegendContainer = styled.div`
  position: fixed;
  bottom: 10px;
  left: 10px;
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid rgba(100, 108, 255, 0.2);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  backdrop-filter: blur(10px);
  z-index: 90;
  min-width: 280px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

export const LegendTitle = styled.h3`
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LegendItems = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.6rem;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #e0e0e0;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    transform: translateX(4px);
  }
`;

export const ColorIndicator = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: ${(props) => props.$color || '#646cff'};
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 0 8px ${(props) => props.$color || '#646cff'},
    inset 0 0 8px rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  transition: all 0.3s ease;

  ${LegendItem}:hover & {
    transform: scale(1.15);
    box-shadow:
      0 0 16px ${(props) => props.$color || '#646cff'},
      inset 0 0 8px rgba(255, 255, 255, 0.2);
  }
`;

export const LegendText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

export const LegendLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.$color || '#ffffff'};
`;

export const LegendDescription = styled.span`
  font-size: 0.75rem;
  color: #999;
  font-weight: 400;
`;

export const ModeDescription = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(100, 108, 255, 0.2);
  font-size: 0.8rem;
  color: #999;
  line-height: 1.4;

  strong {
    color: #646cff;
    font-weight: 600;
  }
`;
