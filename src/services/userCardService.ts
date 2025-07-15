import apiClient, {handleAxiosError, logError} from '@services/apiClient';
import {logger} from '@services/logger/loggerService';
import {AddUserCardRequestPayload} from 'src/types';

export const UserCardService = {
  fetchUserCards: async () => {
    try {
      const response = await apiClient.get('/customercard');
      logger.debug(`fetchUserCards request with status: ${response.status}`);
      return response.data;
    } catch (error) {
      logError('fetchUserCards', error);
      throw new Error(handleAxiosError(error));
    }
  },

  addUserCard: async (payload: AddUserCardRequestPayload) => {
    try {
      const response = await apiClient.post('/customercard', payload);
      logger.debug(`addUserCard request with status: ${response.status}`);
      return response.data;
    } catch (error) {
      logError('addUserCard', error);
      throw new Error(handleAxiosError(error));
    }
  },
};
