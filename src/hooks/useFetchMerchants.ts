import useSWR from 'swr';

import {fetchMerchants} from '@services/merchantService';
import useStore from '@store/index';

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
