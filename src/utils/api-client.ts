import axios from 'axios';
import { Platform } from 'react-native';

const apiClient = axios.create({
  baseURL: Platform.OS === 'android' ? 'http://10.0.2.2:3000' :  'http://localhost:3000', // Update with your JSON server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
