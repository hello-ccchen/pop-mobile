import apiClient, {handleAxiosError, logError} from '@services/api-client';
import {logger} from '@services/logger-service';
import {FuelStation} from '@store/index';

export const fetchFuelStations = async () => {
  try {
    const response = await apiClient.get('/station');
    logger.info('fetchFuelStations request with status:', response.status);
    return response.data.map(
      (station: any): FuelStation => ({
        id: station.stationGuid,
        coordinate: {
          latitude: parseFloat(station.latitude),
          longitude: parseFloat(station.longitude),
        },
        stationName: station.stationName,
        stationAddress: [
          station.address1,
          station.address2,
          station.address3,
          station.postCode,
          station.state,
          station.country,
        ]
          .filter(part => part) // Remove empty or undefined values
          .join(', '),
        totalPump: station.totalPump,
        distance: 0,
        formattedDistance: '',
      }),
    );
  } catch (error) {
    logError('fetchFuelStations', error);
    throw new Error(handleAxiosError(error));
  }
};
