import {useState} from 'react';
import {
  FuelStationService,
  FuelPumpAuthorizationRequestPayload,
} from '@services/fuel-station-service';

export const useFuelAuthorization = () => {
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authorizeFuelPump = async (payload: FuelPumpAuthorizationRequestPayload) => {
    setLoading(true);
    setError(null);

    try {
      console.log('⛽ Authorizing Fuel Pump...');
      const response = await FuelStationService.fuelPumpAuthorization(payload);

      if (!response.mobileTransactionGuid) {
        throw new Error('Missing mobileTransactionGuid from API response');
      }

      console.log('✅ Fuel Pump Authorization Successful');
      setTransactionId(response.mobileTransactionGuid);
    } catch (err) {
      console.error('❌ Fuel Pump Authorization Failed:', err);
      setError('Failed to authorize fuel pump. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {authorizeFuelPump, transactionId, loading, error};
};
