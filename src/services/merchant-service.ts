import apiClient, {handleAxiosError, logError} from '@services/api-client';
import {logger} from '@services/logger/logger-service';

export interface Merchant {
  merchantGuid: string;
  merchantName: string;
}

export const fetchMerchants = async () => {
  try {
    const response = await apiClient.get('/merchant/mastermerchant');
    logger.debug(`fetchMerchants request with status: ${response.status}`);
    return response.data;
  } catch (error) {
    logError('fetchMerchants', error);
    throw new Error(handleAxiosError(error));
  }
};
