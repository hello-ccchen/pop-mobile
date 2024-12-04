import apiClient, {handleAxiosError, logError} from '@services/api-client';

export const fetchLookupByCategory = async (category: string) => {
  try {
    const response = await apiClient.get(`/lookup/${category}`);
    console.log(`fetchLookupByCategory: ${category} request with status: ${response.status}`);
    return response.data;
  } catch (error) {
    logError(`fetchLookupByCategory: ${category}`, error);
    throw new Error(handleAxiosError(error));
  }
};
