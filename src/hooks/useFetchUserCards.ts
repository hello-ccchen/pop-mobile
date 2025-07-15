import useSWR from 'swr';

import {UserCardService} from '@services/userCardService';
import useStore from '@store/index';

const useFetchUserCards = () => {
  const setUserCards = useStore(state => state.setUserCards);

  const {data, error} = useSWR('/userCards', UserCardService.fetchUserCards, {
    onSuccess: cards => {
      setUserCards(cards);
    },
  });

  return {
    userCards: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useFetchUserCards;
