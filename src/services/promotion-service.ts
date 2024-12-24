import apiClient from '@services/api-client';
import {logger} from '@services/logger-service';

export const fetchPromotions = async () => {
  const response = await apiClient.get('/promotions');
  logger.info(`fetchPromotions request with status: ${response.status}`);
  return response.data;
};
