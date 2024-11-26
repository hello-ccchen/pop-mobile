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

// Flag to track refresh process and failed requests
let isRefreshing = false;
const failedRequestQueue: Array<{resolve: (value: any) => void; reject: (reason?: any) => void}> =
  [];

// Process queued requests after token refresh
const processQueue = (error: any, token: string | null = null) => {
  failedRequestQueue.forEach(({resolve, reject}) => (token ? resolve(token) : reject(error)));
  failedRequestQueue.length = 0; // Clear the queue
};

// Request interceptor to add the access token to headers
const addAuthHeader = async (config: any) => {
  const token = await AuthStorageService.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

// Response interceptor to handle 401 (Unauthorized) error and token refresh
const handleTokenRefresh = async (error: any) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      // Queue failed requests during token refresh
      return new Promise((resolve, reject) => {
        failedRequestQueue.push({resolve, reject});
      }).then(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const isTokenRefreshed = await AuthService.refreshToken();
      if (!isTokenRefreshed) throw new Error('AuthService.refreshToken() failed');

      const token = await AuthStorageService.getAccessToken();
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;

      // Process queued requests with the new token
      processQueue(null, token);

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      await AuthStorageService.clearAccessToken();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

// Add interceptors to API client
apiClient.interceptors.request.use(addAuthHeader, error => Promise.reject(error));
apiClient.interceptors.response.use(response => response, handleTokenRefresh);

const logError = (context: string, error: unknown) => {
  const errorMessage = axios.isAxiosError(error)
    ? `${context} failed with status: ${error.response?.status}, ${error.response?.data}`
    : `${context} failed with unknown error: ${error}`;
  console.log(errorMessage);
};

const handleAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'An error occurred during the request.';
  }
  return 'An unexpected error occurred.';
};

export {logError, handleAxiosError};
export default apiClient;
