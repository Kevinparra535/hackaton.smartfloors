import styled from "styled-components";

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InfoPanel = styled.div`
  background: rgba(26, 26, 26, 0.95);
  border-radius: 12px;
  padding: 20px;
  width: 320px;
  border: 1px solid rgba(100, 108, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

export const InfoTitle = styled.h3`
  color: #ffffff;
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

export const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

export const MetricCard = styled.div`
  background: rgba(100, 108, 255, 0.1);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(100, 108, 255, 0.2);
`;

export const MetricLabel = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const MetricValue = styled.div`
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 700;
`;

export const EmptyInfo = styled.div`
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  padding: 20px;
  font-size: 0.9rem;
`;