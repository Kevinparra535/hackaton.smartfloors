import styled from 'styled-components';
import { motion } from 'framer-motion';
import scssTokens from './scssTokens';

export const Panel = styled.div`
  position: relative;
  background: ${scssTokens.colors.bg_dark};
  border-radius: 12px;
  padding: 20px;
  width: 320px;
  border: 1px solid ${scssTokens.colors.primary};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  max-height: 100dvh;
  overflow-y: auto;

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
  color: ${scssTokens.colors.primary};
  font-size: 1.4rem;
  margin: 0 0 16px 0;
  font-weight: 600;
`;

export const TimeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(100, 108, 255, 0.5);
    border-radius: 2px;
  }
`;

export const TimeButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${scssTokens.colors.primary};
  background: ${({ $active }) =>
    $active ? scssTokens.colors.primary : 'rgba(100, 108, 255, 0.1)'};
  color: ${({ $active, theme }) => ($active ? theme.text.primary : theme.text.secondary)};
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(100, 108, 255, 0.2);
  }
`;

export const MetricCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.primaryLight};
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border.subtle};
  margin-bottom: 12px;
`;

export const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const MetricName = styled.div`
  color: ${({ theme }) => theme.text.primary};
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Confidence = styled.div`
  color: ${({ $value, theme }) => {
    if ($value >= 0.9) return theme.colors.success;
    if ($value >= 0.7) return theme.colors.warning;
    return theme.colors.danger;
  }};
  font-size: 0.75rem;
  font-weight: 600;
`;

export const ValueRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.85rem;
`;

export const Label = styled.span`
  color: ${({ theme }) => theme.text.dimmed};
`;

export const Value = styled.span`
  color: ${({ theme }) => theme.text.primary};
  font-weight: 600;
`;

export const PredictedValue = styled(Value)`
  color: ${({ theme }) => theme.colors.primary};
`;

export const Trend = styled.span`
  color: ${({ $direction, theme }) => {
    if ($direction === 'up') return theme.colors.danger;
    if ($direction === 'down') return theme.colors.success;
    return theme.colors.warning;
  }};
  font-size: 1rem;
`;

export const EmptyState = styled.div`
  color: ${scssTokens.colors.variant};
  text-align: center;
  padding: 40px 20px;
  font-size: 0.9rem;
`;
