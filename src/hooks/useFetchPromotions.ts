import useSWR from 'swr';
import {fetchPromotions} from '@services/promotionService';
import useStore from '@store/index';

const useFetchPromotions = () => {
  const setPromotions = useStore(state => state.setPromotions);

  const {data, error} = useSWR('/promotions', fetchPromotions, {
    onSuccess: promotions => {
      setPromotions(promotions);
    },
  });

  return {
    promotions: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useFetchPromotions;
