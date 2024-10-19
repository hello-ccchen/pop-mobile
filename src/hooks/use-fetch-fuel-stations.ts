import useSWR from 'swr';
import {fetchFuelStations} from '@services/fuel-station-service';
import useStore from '@store/index';

const useFetchFuelStations = () => {
  const setFuelStations = useStore(state => state.setFuelStations);

  const {data, error} = useSWR('/fuelStations', fetchFuelStations, {
    onSuccess: stations => {
      setFuelStations(stations);
    },
  });

  return {
    fuelStations: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useFetchFuelStations;
