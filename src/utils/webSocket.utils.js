/**
 * Determine floor status based on environmental conditions
 * @param {Object} floor - Floor data
 * @returns {string} Status: 'normal', 'warning', or 'danger'
 */
export const getFloorStatus = (floor) => {
  const { temperature, humidity, powerConsumption } = floor;

  if (temperature > 26 || temperature < 18) return 'danger';
  if (humidity > 70 || humidity < 30) return 'danger';
  if (powerConsumption > 150) return 'danger';

  if (temperature > 24 || temperature < 20) return 'warning';
  if (humidity > 60 || humidity < 35) return 'warning';
  if (powerConsumption > 135) return 'warning';

  return 'normal';
};
