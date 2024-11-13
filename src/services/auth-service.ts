import apiClient, {handleAxiosError, logError} from '@services/api-client';
import {AuthStorageService} from '@services/auth-storage-service';

export interface SignInPayload {
  username: string;
  password: string;
  deviceUniqueId: string;
}

export interface SignUpPayload extends SignInPayload {
  email: string;
  mobile: string;
  profile: {
    firstName: string;
    lastName: string;
  };
}

export const AuthService = {
  signIn: async (payload: SignInPayload) => {
    try {
      const response = await apiClient.post('/auth/login', payload);
      console.log('signIn request success with status:', response.status);
      const {token, ...userData} = response.data;
      await AuthStorageService.setAccessToken(token);
      await AuthStorageService.setPassword(payload.password);
      return userData;
    } catch (error) {
      logError('signIn', error);
      throw new Error(handleAxiosError(error));
    }
  },

  signUp: async (payload: SignUpPayload) => {
    try {
      const response = await apiClient.post('/customer', payload);
      console.log('signUp request success with status:', response.status);
      const {token, ...userData} = response.data;
      await storeCredentials(token, payload.password);
      return userData;
    } catch (error) {
      logError('signUp', error);
      throw new Error(handleAxiosError(error));
    }
  },

  signOut: async () => {
    try {
      await AuthStorageService.clearAccessToken();
      await AuthStorageService.clearPassword();
    } catch (error) {
      console.log('signOut request failed with unknown error:', error);
      throw error;
    }
  },
};

const storeCredentials = async (token: string, password: string) => {
  await AuthStorageService.setAccessToken(token);
  await AuthStorageService.setPassword(password);
};
