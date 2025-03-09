import apiClient, {handleAxiosError, logError} from '@services/api-client';
import {logger} from '@services/logger/logger-service';
import {LatLng} from 'react-native-maps';

export interface FuelStation {
  id: string;
  coordinate: LatLng;
  stationName: string;
  stationAddress: string;
  totalPump: number;
  distance: number;
  formattedDistance: string;
  merchantGuid: string;
}

export interface FuelPump {
  pumpGuid: string; // Unique identifier for the pump
  pumpNumber: number; // Pump number at the station
  pumpStatusCode: string; // Status code (e.g., "IDL")
  pumpStatusDesc: string; // Human-readable status (e.g., "Idle")
  pumpTypeCode: string; // Fuel type code (e.g., "GAS")
  pumpTypeDesc: string; // Fuel type description (e.g., "Gasoline")
  stationGuid: string;
}

export interface FuelPumpAuthorizationRequestPayload {
  cardGuid: string;
  loyaltyGuid?: string;
  pumpGuid: string;
  transactionAmount: number;
  passcode: string;
}

export const FuelStationService = {
  fetchFuelStations: async () => {
    try {
      const response = await apiClient.get('/station');
      logger.info(`fetchFuelStations request with status: ${response.status}`);
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
      logger.info(`fetchFuelStationPumps request with status: ${response.status}`);
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
      logger.info(`fuelPumpAuthorization request with status: ${response.status}`);
      return response.data;
    } catch (error) {
      logError('fuelPumpAuthorization', error);
      throw new Error(handleAxiosError(error));
    }
  },
};
