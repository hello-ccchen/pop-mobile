// import apiClient from '@services/api-client';
// import {logger} from '@services/logger/logger-service';

export interface Promotion {
  id: number;
  imageUrl: string;
  viewMoreUrl: string;
}

const mockPromotions: Promotion[] = [
  {
    id: 2,
    imageUrl:
      'https://www.bhpetrol.com.my/wp-content/uploads/img-menang-bergaya-20250228-bhpetrol.jpg',
    viewMoreUrl: 'https://www.bhpetrol.com.my/peraduan-menang-bergaya/',
  },
  {
    id: 3,
    imageUrl: 'https://www.bhpetrol.com.my/wp-content/uploads/img-promo-mar2025-bhpetrol.jpg',
    viewMoreUrl: 'https://www.bhpetrol.com.my/promotions/promosi-mac-2025/',
  },
  {
    id: 1,
    imageUrl: 'https://www.bhpetrol.com.my/wp-content/uploads/img-promo-feb2025-bhpetrol.jpg',
    viewMoreUrl: 'https://www.bhpetrol.com.my/promotions/promosi-februari-2025/',
  },
];

export const fetchPromotions = async () => {
  // Uncomment the real API call when needed
  // const response = await apiClient.get('/promotions');
  // logger.info(`fetchPromotions request with status: ${response.status}`);

  // Return mock promotions
  return Promise.resolve(mockPromotions);
};
