import styled from "styled-components";

export const Header = styled.header`
  background: rgba(26, 26, 26, 0.95);
  padding: 16px 24px;
  border-bottom: 1px solid rgba(100, 108, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
`;

export const Title = styled.h1`
  color: #ffffff;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: '🏢';
    font-size: 2rem;
  }
`;

export const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${(props) => (props.$connected ? '#00ff88' : '#ff4d4f')};
  font-size: 0.9rem;
  font-weight: 500;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 8px currentColor;
  }
`;
