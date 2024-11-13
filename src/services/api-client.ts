import axios from 'axios';
import {API_URL_ANDROID, API_URL_IOS} from '@env';
import {Platform} from 'react-native';
import {AuthStorageService} from './auth-storage-service';

const apiClient = axios.create({
  baseURL: Platform.OS === 'android' ? API_URL_ANDROID : API_URL_IOS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the access token in headers
apiClient.interceptors.request.use(
  async config => {
    const token = await AuthStorageService.getAccessToken();
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

const logError = (context: string, error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.log(`${context} failed with status: ${error.response?.status}`, error.response?.data);
  } else {
    console.log(`${context} failed with unknown error:`, error);
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
