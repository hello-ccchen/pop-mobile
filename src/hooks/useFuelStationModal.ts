import {useCallback, useState} from 'react';
import {FuelStation} from 'src/types';

export const useFuelStationModal = () => {
  const [selectedStation, setSelectedStation] = useState<FuelStation | null>(null);

  const selectStation = useCallback((station: FuelStation | null) => {
    setSelectedStation(station);
  }, []);

  const dismissModal = useCallback(() => {
    setSelectedStation(null);
  }, []);

  return {
    selectedStation,
    selectStation,
    dismissModal,
  };
};
