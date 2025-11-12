import styled from 'styled-components';

export const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
  overflow: hidden;
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const CanvasWrapper = styled.div`
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;
