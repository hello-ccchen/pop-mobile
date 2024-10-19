import useStore from '@store/index';
import {useMemo} from 'react';

const useFilteredFuelStations = () => {
  const fuelStations = useStore(state => state.fuelStations);
  const searchFuelStationQuery = useStore(state => state.searchFuelStationQuery);

  return useMemo(() => {
    const query = searchFuelStationQuery.toLowerCase();
    return fuelStations.filter(
      station =>
        station.stationName.toLowerCase().includes(query) ||
        station.stationAddress.toLowerCase().includes(query),
    );
  }, [fuelStations, searchFuelStationQuery]);
};

export default useFilteredFuelStations;
