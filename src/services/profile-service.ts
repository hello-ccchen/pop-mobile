import apiClient, {handleAxiosError, logError} from './api-client';

export interface ProfilePayload {
  deviceUniqueId: string;
  mobile: string;
  fullName: string;
}

export const ProfileService = {
  createProfile: async (payload: ProfilePayload) => {
    try {
      const response = await apiClient.post('/customer/profile', payload);
      console.log('createProfile request with status:', response.status);
      return response.data;
    } catch (error) {
      logError('createProfile', error);
      throw new Error(handleAxiosError(error));
    }
  },

  updateProfile: async (payload: ProfilePayload) => {
    try {
      const response = await apiClient.put('/customer/profile', payload);
      console.log('updateProfile request with status:', response.status);
      return response.data;
    } catch (error) {
      logError('updateProfile', error);
      throw new Error(handleAxiosError(error));
    }
  },
};
