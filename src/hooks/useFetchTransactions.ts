import useSWR, {mutate} from 'swr';
import {TransactionService} from '@services/transactionService';

const useFetchTransactions = () => {
  const {data, error} = useSWR('/transactions', TransactionService.fetchTransactions, {
    revalidateOnFocus: true,
  });

  const refreshTransactions = () => {
    mutate('/transactions'); // Manually trigger re-fetching
  };

  return {
    transactions: data,
    isLoading: !error && !data,
    isError: error,
    refreshTransactions, // Return the function for manual re-fetching
  };
};

export default useFetchTransactions;
