import {FuelStation} from 'src/types';
import useSWR from 'swr';

import {FuelStationService} from '@services/fuelStationService';
import useStore from '@store/index';

const useFetchFuelStations = () => {
  const setGasStations = useStore(state => state.setGasStations);
  const setEVChargingStations = useStore(state => state.setEVChargingStations);

  const {data, error} = useSWR('/fuelStations', FuelStationService.fetchFuelStations, {
    onSuccess: stations => {
      const gasStations = stations.filter((station: FuelStation) => station.pumpTypeCode === 'GAS');
      const evStations = stations.filter((station: FuelStation) => station.pumpTypeCode === 'ELE');

      setGasStations(gasStations);
      setEVChargingStations(evStations);
    },
  });

  return {
    isLoading: !error && !data,
    isError: error,
  };
};

export default useFetchFuelStations;
