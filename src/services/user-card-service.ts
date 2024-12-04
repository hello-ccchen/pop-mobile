import apiClient, {handleAxiosError, logError} from './api-client';

export interface AddUserCardPayload {
  cardNumber: string;
  cardExpiry: string;
  cvv: string;
  masterMerchantGuid?: string;
  cardType: string;
}

export const UserCardService = {
  fetchUserCards: async () => {
    try {
      const response = await apiClient.get('/customercard');
      console.log('fetchUserCards request with status:', response.status);
      return response.data;
    } catch (error) {
      logError('fetchUserCards', error);
      throw new Error(handleAxiosError(error));
    }
  },

  addUserCard: async (payload: AddUserCardPayload) => {
    try {
      const response = await apiClient.post('/customercard', payload);
      console.log('addUserCard request with status:', response.status);
      return response.data;
    } catch (error) {
      logError('addUserCard', error);
      throw new Error(handleAxiosError(error));
    }
  },
};
