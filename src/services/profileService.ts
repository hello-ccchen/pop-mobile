import apiClient, {handleAxiosError, logError} from '@services/apiClient';
import {logger} from '@services/logger/loggerService';
import {ProfileRequestPayload} from 'src/types';

export const ProfileService = {
  createProfile: async (payload: ProfileRequestPayload) => {
    try {
      const response = await apiClient.post('/customer/profile', payload);
      logger.debug(`createProfile request with status: ${response.status}`);
      return response.data;
    } catch (error) {
      logError('createProfile', error);
      throw new Error(handleAxiosError(error));
    }
  },

  updateProfile: async (payload: ProfileRequestPayload) => {
    try {
      const response = await apiClient.put('/customer/profile', payload);
      logger.debug(`updateProfile request with status: ${response.status}`);
      return response.data;
    } catch (error) {
      logError('updateProfile', error);
      throw new Error(handleAxiosError(error));
    }
  },
};
