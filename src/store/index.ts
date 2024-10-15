import AsyncStorage from '@react-native-async-storage/async-storage';
import {LatLng} from 'react-native-maps';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export type FuelStation = {
  coordinate: LatLng;
  stationName: string;
  stationAddress: string;
  totalPump: number;
};

interface StoreState {
  fuelStations: FuelStation[];
  setFuelStations: (stations: FuelStation[]) => void;
}

const useStore = create<StoreState>()(
  persist(
    set => ({
      fuelStations: [],
      setFuelStations: stations => set({fuelStations: stations}),
    }),
    {
      name: 'pop-app-storage',
      storage: createJSONStorage(() => AsyncStorage)
    },
  ),
);

export default useStore;
