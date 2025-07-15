import useSWR from 'swr';
import useStore from '@store/index';
import {fetchLookupByCategory} from '@services/lookupService';

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
