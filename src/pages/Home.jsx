import Dashboard3D from '../components/Dashboard3D';
import ColorLegend from '../components/ColorLegend';

import { CanvasWrapper, MainContent } from '../styles/AppContainer.styled';
import { useOutletContext } from 'react-router-dom';

const Home = () => {
  const { floorData, predictions, alerts, currentMode } = useOutletContext();

  return (
    <MainContent>
      <CanvasWrapper>
        <Dashboard3D floorData={floorData} predictions={predictions} alerts={alerts} />
      </CanvasWrapper>

      {/* Color Legend - Leyenda de estados */}
      <ColorLegend currentMode={currentMode} />
    </MainContent>
  );
};

export default Home;
