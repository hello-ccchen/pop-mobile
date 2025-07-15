import apiClient from '@services/apiClient';
import {logger} from '@services/logger/loggerService';

export interface Promotion {
  end: string;
  guid: string;
  imageUrl: string;
  masterMerchantGuid: string;
  start: string;
  title: string;
  viewMoreUrl: string;
}

export interface MerchantPumpPromotionRequest {
  masterMerchantGuid?: string;
  pumpTypeGuid?: string;
}

export interface MerchantPumpPromotion {
  customerGuid: string;
  cardGuid: string;
  primaryAccountNumber: string;
  cardScheme: string;
  cardType: string;
  merchantGuid: string | null;
  merchantName: string | null;
  cardExpiry: string;
  cardToken: string;
  discountDescription: string;
  discountTitle: string;
  termsAndConditionUrl: string;
  creditCardDiscountGuid: string;
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

export const getMerchantPumpPromotions = async (
  payload: MerchantPumpPromotionRequest,
): Promise<MerchantPumpPromotion[]> => {
  try {
    const response = await apiClient.post('/customercard/cardlist', payload);
    logger.debug(`getMerchantPumpPromotions request status: ${response.status}`);
    return response.data;
  } catch (error) {
    logger.error('Error in getMerchantPumpPromotions:', error);
    throw error;
  }
};
