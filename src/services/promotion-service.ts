import apiClient from '@services/api-client';
import {logger} from '@services/logger/logger-service';

export interface Promotion {
  id: number;
  imageUrl: string;
  viewMoreUrl: string;
}

export const fetchPromotions = async () => {
  const response = await apiClient.get('/promotions');
  logger.info(`fetchPromotions request with status: ${response.status}`);
  return response.data;
};
