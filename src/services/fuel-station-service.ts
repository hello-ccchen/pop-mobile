import apiClient from '@utils/api-client';

export const fetchFuelStations = async () => {
  const response = await apiClient.get('/fuelStations');
  console.log('fetchFuelStations response', response.status);
  return response.data;
};
