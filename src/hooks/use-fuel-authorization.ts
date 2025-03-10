import {useState, useEffect} from 'react';
import {
  FuelStationService,
  FuelPumpAuthorizationRequestPayload,
} from '@services/fuel-station-service';
import {logger} from '@services/logger/logger-service';

const useFuelAuthorization = (payload: FuelPumpAuthorizationRequestPayload) => {
  const [transactionId, setTransactionId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authorizeFuelPump = async () => {
      setLoading(true);
      setError(null);

      try {
        logger.debug('⛽ Authorizing Fuel Pump...');
        const response = await FuelStationService.fuelPumpAuthorization(payload);

        if (!response.mobileTransactionGuid) {
          throw new Error('Missing mobileTransactionGuid from API response');
        }

        logger.debug('✅ Fuel Pump Authorization Successful');
        setTransactionId(response.mobileTransactionGuid);
      } catch (err) {
        logger.error('❌ Fuel Pump Authorization Failed:', err);
        setError('Failed to authorize fuel pump. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    authorizeFuelPump();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {transactionId, loading, error};
};

export default useFuelAuthorization;
