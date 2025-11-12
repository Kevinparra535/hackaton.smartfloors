import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Panel = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 12px;
  padding: 20px;
  width: 320px;
  max-height: 50dvh;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.border.subtle};
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
  color: ${({ theme }) => theme.text.primary};
  font-size: 1.4rem;
  margin: 0 0 16px 0;
  font-weight: 600;
`;

export const AlertItem = styled(motion.div)`
  background: ${({ $severity, theme }) => {
    // Map 'critical' from backend to 'danger' color
    if ($severity === 'danger' || $severity === 'critical') {
      return theme.colors.dangerLight || 'rgba(255, 77, 79, 0.15)';
    }
    if ($severity === 'warning') {
      return theme.colors.warningLight || 'rgba(255, 217, 102, 0.15)';
    }
    return theme.colors.successLight || 'rgba(0, 255, 136, 0.15)';
  }};
  border-left: 3px solid
    ${({ $severity, theme }) => {
      // Map 'critical' from backend to 'danger' color
      if ($severity === 'danger' || $severity === 'critical') {
        return theme.colors.danger;
      }
      if ($severity === 'warning') {
        return theme.colors.warning;
      }
      return theme.colors.success;
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
  color: ${({ theme }) => theme.text.primary};
  font-weight: 600;
  font-size: 0.9rem;
`;

export const AlertTime = styled.span`
  color: ${({ theme }) => theme.text.dimmed};
  font-size: 0.75rem;
`;

export const AlertMessage = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
`;

export const EmptyState = styled.div`
  color: ${({ theme }) => theme.text.dimmed};
  text-align: center;
  padding: 40px 20px;
  font-size: 0.9rem;
`;
