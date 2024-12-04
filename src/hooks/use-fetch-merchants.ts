import useSWR from 'swr';
import useStore from '@store/index';
import {fetchMerchants} from '@services/merchant-service';

const useFetchMerchants = () => {
  const setMerchants = useStore(state => state.setMerchants);

  const {data, error} = useSWR('/merchants', fetchMerchants, {
    onSuccess: merchants => {
      setMerchants(merchants);
    },
  });

  return {
    merchants: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useFetchMerchants;
