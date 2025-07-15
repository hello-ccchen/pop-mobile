import axios from 'axios';
import {Platform} from 'react-native';
import Config from 'react-native-config';

import {AuthStorageService} from '@services/authStorageService';
import {logger} from '@services/logger/loggerService';

const apiClient = axios.create({
  baseURL: Platform.OS === 'android' ? Config.API_URL_ANDROID : Config.API_URL_IOS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the access token to headers
const addAuthHeader = async (config: any) => {
  const token = await AuthStorageService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Add interceptors to API client
apiClient.interceptors.request.use(addAuthHeader, error => Promise.reject(error));

const logError = (context: string, error: unknown) => {
  const isAxiosError = axios.isAxiosError(error);

  if (isAxiosError) {
    const status = error.response?.status ?? 'unknown';
    const data = error.response?.data
      ? JSON.stringify(error.response.data, null, 2)
      : 'No response data';
    logger.error(`${context} failed with status: ${status}, response: ${data}`);
  } else {
    logger.error(`${context} failed with unknown error: ${String(error)}`);
  }
};

const handleAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'An error occurred during the request.';
  }
  return 'An unexpected error occurred.';
};

export {logError, handleAxiosError};
export default apiClient;
