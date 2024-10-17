import useSWR from 'swr';
import {fetchPromotions} from '@services/promotion-service';
import useStore from '@store/index';

const usePromotions = () => {
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

export default usePromotions;
