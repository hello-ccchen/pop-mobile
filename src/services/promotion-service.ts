import apiClient from '@utils/api-client';

export const fetchPromotions = async () => {
  const response = await apiClient.get('/promotions');
  console.log('fetchPromotions response', response.status);
  return response.data;
};
