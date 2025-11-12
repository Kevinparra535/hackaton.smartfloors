import styled from 'styled-components';
import { motion } from 'framer-motion';
import scssTokens from './scssTokens';

export const Panel = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  background: ${scssTokens.colors.bg_dark};
  border-radius: 12px;
  padding: 20px;
  width: 320px;
  max-height: 50dvh;
  overflow-y: auto;
  border: 1px solid ${scssTokens.colors.primary};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(100, 108, 255, 0.5);
    border-radius: 3px;
  }
`;

export const Title = styled.h2`
  color: ${scssTokens.colors.white};
  font-size: 1.4rem;
  margin: 0 0 16px 0;
  font-weight: 600;
`;

export const AlertItem = styled(motion.div)`
  background: ${({ $severity, $isPredictive }) => {
    const severity = $severity?.toLowerCase();
    
    // Predictive alerts get a purple/blue tint
    if ($isPredictive) {
      if (severity === 'danger' || severity === 'critical') {
        return 'rgba(157, 78, 221, 0.15)'; // Purple for predictive critical
      }
      if (severity === 'warning') {
        return 'rgba(100, 108, 255, 0.15)'; // Blue for predictive warning
      }
      return 'rgba(0, 180, 216, 0.15)'; // Cyan for predictive normal
    }
    
    // Current alerts - original colors
    if (severity === 'danger' || severity === 'critical') {
      return 'rgba(255, 77, 79, 0.15)';
    }
    if (severity === 'warning') {
      return 'rgba(255, 217, 102, 0.15)';
    }
    return 'rgba(0, 255, 136, 0.15)';
  }};
  border-left: 3px solid
    ${({ $severity, $isPredictive }) => {
      const severity = $severity?.toLowerCase();
      
      // Predictive alerts get a purple/blue border
      if ($isPredictive) {
        if (severity === 'danger' || severity === 'critical') {
          return '#9d4edd'; // Purple for predictive critical
        }
        if (severity === 'warning') {
          return '#646cff'; // Blue for predictive warning
        }
        return '#00b4d8'; // Cyan for predictive normal
      }
      
      // Current alerts - original colors
      if (severity === 'danger' || severity === 'critical') {
        return '#ff4d4f'; // Red
      }
      if (severity === 'warning') {
        return '#ffd966'; // Yellow
      }
      return '#00ff88'; // Green
    }};
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
`;

export const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

export const AlertFloor = styled.span`
  color: ${scssTokens.colors.white};
  font-weight: 600;
  font-size: 0.9rem;
`;

export const AlertTime = styled.span`
  color: #aaaaaa;
  font-size: 0.75rem;
`;

export const AlertMessage = styled.p`
  color: #cccccc;
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
`;

export const EmptyState = styled.div`
  color: #888888;
  text-align: center;
  padding: 40px 20px;
  font-size: 0.9rem;
`;
