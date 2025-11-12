import styled from 'styled-components';

export const DebugPanel = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  padding: 16px;
  max-width: 400px;
  max-height: 400px;
  overflow-y: auto;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  z-index: 9999;
  box-shadow: 0 4px 16px rgba(100, 108, 255, 0.3);
`;

export const Title = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 12px 0;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Status = styled.div`
  color: ${({ $connected, theme }) => ($connected ? theme.colors.success : theme.colors.danger)};
  font-weight: bold;
  margin-bottom: 12px;

  &::before {
    content: '●';
    margin-right: 6px;
  }
`;

export const Info = styled.div`
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 8px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

export const Label = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
`;

export const EventLog = styled.div`
  margin-top: 12px;
  max-height: 200px;
  overflow-y: auto;
  border-top: 1px solid ${({ theme }) => theme.border.subtle};
  padding-top: 8px;
`;

export const Event = styled.div`
  color: ${({ theme }) => theme.colors.success};
  margin-bottom: 4px;
  font-size: 11px;
  padding: 4px;
  background: ${({ theme }) => theme.colors.successLight || 'rgba(0, 255, 136, 0.05)'};
  border-radius: 3px;
  word-wrap: break-word;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.danger};
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;

  &:hover {
    background: ${({ theme }) => theme.colors.dangerLight || 'rgba(255, 77, 79, 0.1)'};
  }
`;

export const ClearButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  margin-top: 8px;
  width: 100%;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;
