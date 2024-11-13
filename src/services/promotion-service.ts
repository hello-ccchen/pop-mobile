import apiClient from '@services/api-client';

export const fetchPromotions = async () => {
  const response = await apiClient.get('/promotions');
  console.log('fetchPromotions request success with status:', response.status);
  return response.data;
};
