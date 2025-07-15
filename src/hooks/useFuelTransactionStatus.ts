import {useEffect, useState} from 'react';
import fuelTransactionStatusService from '@services/fuelTransactionStatusService';
import {logger} from '@services/logger/loggerService';
import {FuelProgressStatus} from 'src/types';

const useFuelTransactionStatus = (transactionId: string | undefined) => {
  const [status, setStatus] = useState<FuelProgressStatus>('processing');
  const [productInfo, setProductInfo] = useState<string | null>(null);
  const [showPostActionBox, setShowPostActionBox] = useState(false);

  useEffect(() => {
    if (transactionId) {
      const connectToStreamFuelTransactionStatus = async () => {
        try {
          setStatus('connecting');
          await fuelTransactionStatusService.startConnection();

          // Invoke the server-side method after connected to signal R
          await fuelTransactionStatusService.invokeMethod(
            'RegisterForTransactionUpdates',
            transactionId,
          );
          setStatus('ready');

          // Set up the event listener
          fuelTransactionStatusService.addEventListener(
            'TransactionStatus',
            (transactionGuid: string, transactionDataJSONString: string) => {
              const transactionData = JSON.parse(transactionDataJSONString);
              setProductInfo(transactionData.ProductInfo);
              logger.debug(
                `Transaction ${transactionGuid} status ${transactionData.TransactionStatusCode}`,
              );
              // Handle the message received from the server
              if (
                transactionData.TransactionStatusCode === 'FUE' ||
                transactionData.TransactionStatusCode === 'CHR'
              ) {
                setStatus('fueling');
              } else if (
                transactionData.TransactionStatusCode === 'FUC' ||
                transactionData.TransactionStatusCode === 'CHC'
              ) {
                setStatus('completed');
                setShowPostActionBox(true);
              } else {
                setStatus('error');
              }
            },
          );
        } catch (err) {
          logger.error('Having error with connectToStreamFuelTransactionStatus:', err);
          setStatus('error');
        }
      };

      connectToStreamFuelTransactionStatus();

      return () => {
        fuelTransactionStatusService.stopConnection();
      };
    }
  }, [transactionId]);

  return {status, productInfo, showPostActionBox};
};

export default useFuelTransactionStatus;
