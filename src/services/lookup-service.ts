import apiClient, {handleAxiosError, logError} from '@services/api-client';
import {logger} from '@services/logger/logger-service';

export interface CardType {
  guid: string;
  code: string;
  description: string;
  category: string;
  subCategory: string;
}

export const fetchLookupByCategory = async (category: string) => {
  try {
    const response = await apiClient.get(`/lookup/${category}`);
    logger.debug(`fetchLookupByCategory: ${category} request with status: ${response.status}`);
    return response.data;
  } catch (error) {
    logError(`fetchLookupByCategory: ${category}`, error);
    throw new Error(handleAxiosError(error));
  }
};
