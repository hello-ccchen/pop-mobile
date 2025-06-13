import apiClient, {handleAxiosError, logError} from './api-client';
import {logger} from './logger/logger-service';

export interface Transaction {
  cardType: string;
  creditCardNumber: string;
  customerGuid: string;
  customerTransactionGuid: string;
  endTime: string | null;
  loyaltyCardInfo: string | null;
  loyaltyPoint: number | null;
  masterMerchantName: string;
  merchantName: string;
  preAuthAmount: number;
  productInfo: string | null;
  startTime: string;
  stationName: string;
  transactionFinalAmount: number | null;
  transactionStatus: string;
  transactionStatusCode: string;
}

export const TransactionService = {
  fetchTransactions: async () => {
    try {
      const response = await apiClient.get('/customerTransaction');
      logger.debug(`fetchTransactions request with status: ${response.status}`);
      return response.data
        .filter(
          (txn: Transaction) =>
            txn.transactionStatusCode === 'FUC' ||
            txn.transactionStatusCode === 'RSE' ||
            txn.transactionStatusCode === 'CHC',
        )
        .sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
        );
    } catch (error) {
      logError('fetchTransactions', error);
      throw new Error(handleAxiosError(error));
    }
  },
  fetchTransactionById: async (transactionId: string) => {
    try {
      const response = await apiClient.get(`/customerTransaction/${transactionId}`);
      logger.debug(`fetchTransactionById request with status: ${response.status}`);
      return response.data;
    } catch (error) {
      logError('fetchTransactionById', error);
      throw new Error(handleAxiosError(error));
    }
  },
};
