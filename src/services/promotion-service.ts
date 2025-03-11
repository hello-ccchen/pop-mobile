import apiClient from '@services/api-client';
import {logger} from '@services/logger/logger-service';

export interface Promotion {
  end: string;
  guid: string;
  imageUrl: string;
  masterMerchantGuid: string;
  start: string;
  title: string;
  viewMoreUrl: string;
}

export const fetchPromotions = async () => {
  try {
    const response = await apiClient.get('/promotion');
    logger.debug(`fetchPromotions request with status: ${response.status}`);

    // Get today's date at 00:00:00 for accurate comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00 to only compare dates

    // Filter promotions where the 'end' date is greater than or equal to today's date
    const filteredPromotions = response.data.filter((promotion: {end: string}) => {
      const endDate = new Date(promotion.end);
      return today <= endDate; // Keep promotions where today's date is <= the 'end' date (not expired)
    });

    return filteredPromotions;
  } catch (error) {
    logger.error('Error fetching promotions:', error);
    throw error;
  }
};
