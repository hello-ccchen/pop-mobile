import {useMemo} from 'react';
import {FuelStation} from 'src/types';

import useStore from '@store/index';

const useFilteredFuelStations = (selectedTab: 'gas' | 'ele' | 'map') => {
  const gasStations = useStore(state => state.gasStations);
  const evStations = useStore(state => state.evChargingStations);
  const searchQuery = useStore(state => state.searchFuelStationQuery);

  return useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filterStations = (stations: FuelStation[]) =>
      stations.filter(
        station =>
          station.stationName.toLowerCase().includes(query) ||
          station.stationAddress.toLowerCase().includes(query),
      );

    if (selectedTab === 'gas') {
      return filterStations(gasStations);
    }
    if (selectedTab === 'ele') {
      return filterStations(evStations);
    }
    if (selectedTab === 'map') {
      return [...filterStations(gasStations), ...filterStations(evStations)];
    }

    return [];
  }, [gasStations, evStations, selectedTab, searchQuery]);
};

export default useFilteredFuelStations;
