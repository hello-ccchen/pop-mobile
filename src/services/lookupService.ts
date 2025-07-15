import apiClient, {handleAxiosError, logError} from '@services/apiClient';
import {logger} from '@services/logger/loggerService';

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
