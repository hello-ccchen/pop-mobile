import axios from 'axios';
import {API_URL_ANDROID, API_URL_IOS} from '@env';
import {Platform} from 'react-native';
import {AuthStorageService} from './auth-storage-service';
import {AuthService} from './auth-service';

const apiClient = axios.create({
  baseURL: Platform.OS === 'android' ? API_URL_ANDROID : API_URL_IOS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the access token to headers
const addAuthHeader = async (config: any) => {
  const token = await AuthStorageService.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

// Response interceptor to handle 401 (Unauthorized) error and token refresh
const handleTokenRefresh = async (error: any) => {
  if (error.response?.status === 401) {
    try {
      console.log('401 detected. Attempting token refresh...');
      const isTokenRefreshed = await AuthService.refreshToken();
      if (!isTokenRefreshed) {
        console.error('Token refresh failed.');
        throw new Error('Token refresh failed');
      }
      console.log('Token successfully refreshed');
      return Promise.reject(error);
    } catch (refreshError) {
      console.error('Error during token refresh:', refreshError);
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
};

// Add interceptors to API client
apiClient.interceptors.request.use(addAuthHeader, error => Promise.reject(error));
apiClient.interceptors.response.use(response => response, handleTokenRefresh);

const logError = (context: string, error: unknown) => {
  const isAxiosError = axios.isAxiosError(error);

  if (isAxiosError) {
    const status = error.response?.status ?? 'unknown';
    const data = error.response?.data
      ? JSON.stringify(error.response.data, null, 2)
      : 'No response data';
    console.log(`${context} failed with status: ${status}, response: ${data}`);
  } else {
    console.log(`${context} failed with unknown error: ${String(error)}`);
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
