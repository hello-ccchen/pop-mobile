import apiClient, {handleAxiosError, logError} from '@services/api-client';

export const fetchMerchants = async () => {
  try {
    const response = await apiClient.get('/merchant/mastermerchant');
    console.log('fetchMerchants request with status:', response.status);
    return response.data;
  } catch (error) {
    logError('fetchMerchants', error);
    throw new Error(handleAxiosError(error));
  }
};
