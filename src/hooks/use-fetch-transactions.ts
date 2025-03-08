import useSWR from 'swr';
import {fetchTransactions} from '@services/transaction-service';
import useStore from '@store/index';

const useFetchTransactions = () => {
  const setTransactions = useStore(state => state.setTransactions);

  const {data, error} = useSWR('/transactions', fetchTransactions, {
    onSuccess: transactions => {
      setTransactions(transactions);
    },
  });

  return {
    transactions: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useFetchTransactions;
