import Dashboard3D from '../components/Dashboard3D';
import ColorLegend from '../components/ColorLegend';

import { CanvasWrapper, MainContent } from '../styles/AppContainer.styled';
import { useOutletContext } from 'react-router-dom';

const Home = () => {
  const { floorData, predictions, currentMode } = useOutletContext();

  const handleFloorClick = (clickData) => {
    // Floor click handled in BuildingScene - could add additional logic here
    console.log('Floor clicked:', clickData?.floorData?.name);
  };

  return (
    <MainContent>
      <CanvasWrapper>
        <Dashboard3D floorData={floorData} predictions={predictions} onFloorClick={handleFloorClick} />
      </CanvasWrapper>

      {/* Color Legend - Leyenda de estados */}
      <ColorLegend currentMode={currentMode} />
    </MainContent>
  );
};

export default Home;
