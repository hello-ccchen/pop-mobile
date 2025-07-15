import useSWR from 'swr';

import {fetchLookupByCategory} from '@services/lookupService';
import useStore from '@store/index';

const useFetchCardTypes = () => {
  const setCardTypes = useStore(state => state.setCardTypes);

  const {data, error} = useSWR('/cardtypes', () => fetchLookupByCategory('CustomerCardType'), {
    onSuccess: cardTypes => {
      setCardTypes(cardTypes);
    },
  });

  return {
    cardTypes: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useFetchCardTypes;
