import {FuelPump, FuelPumpAuthorizationRequestPayload, FuelStation} from 'src/types';

import apiClient, {handleAxiosError, logError} from '@services/apiClient';
import {logger} from '@services/logger/loggerService';

export const FuelStationService = {
  fetchFuelStations: async () => {
    try {
      const response = await apiClient.get('/station');
      logger.debug(`fetchFuelStations request with status: ${response.status}`);
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
          merchantGuid: station.merchantGuid,
          pumpTypeCode: station.pumpTypeCode,
        }),
      );
    } catch (error) {
      logError('fetchFuelStations', error);
      throw new Error(handleAxiosError(error));
    }
  },

  fetchFuelStationPumps: async (stationId: string): Promise<FuelPump[]> => {
    try {
      const response = await apiClient.get(`/station/pump/${stationId}`);
      logger.debug(`fetchFuelStationPumps request with status: ${response.status}`);
      // Sort the pumps by pumpNumber in ascending order
      const sortedPumps = response.data.sort(
        (a: FuelPump, b: FuelPump) => a.pumpNumber - b.pumpNumber,
      );

      return sortedPumps;
    } catch (error) {
      logError('fetchFuelStationPumps', error);
      throw new Error(handleAxiosError(error));
    }
  },

  fuelPumpAuthorization: async (payload: FuelPumpAuthorizationRequestPayload) => {
    try {
      const response = await apiClient.post('/pumpAuthorization', payload);
      logger.debug(`fuelPumpAuthorization request with status: ${response.status}`);
      return response.data;
    } catch (error) {
      logError('fuelPumpAuthorization', error);
      throw new Error(handleAxiosError(error));
    }
  },

  reserveEVChager: async (payload: FuelPumpAuthorizationRequestPayload) => {
    try {
      const response = await apiClient.post('/pumpAuthorization/reserve', payload);
      logger.debug(`reserveEVChager request with status: ${response.status}`);
      return response.data;
    } catch (error) {
      logError('reserveEVChager', error);
      throw new Error(handleAxiosError(error));
    }
  },

  unlockEVCharger: async (mobileTransactionGuid: string) => {
    try {
      const response = await apiClient.post('/pumpAuthorization/unlock', {
        mobileTransactionGuid: mobileTransactionGuid,
      });
      logger.debug(`unlockEVCharger request with status: ${response.status}`);
      return response.data;
    } catch (error) {
      logError('unlockEVCharger', error);
      throw new Error(handleAxiosError(error));
    }
  },
};
