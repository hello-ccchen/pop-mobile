import AsyncStorage from '@react-native-async-storage/async-storage';
import {LatLng} from 'react-native-maps';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export type Promotion = {
  id: number;
  imageUrl: string;
  viewMoreUrl: string;
};

export type FuelStation = {
  coordinate: LatLng;
  stationName: string;
  stationAddress: string;
  totalPump: number;
};

interface StoreState {
  promotions: Promotion[];
  setPromotions: (promotions: Promotion[]) => void;
  fuelStations: FuelStation[];
  setFuelStations: (stations: FuelStation[]) => void;
}

const useStore = create<StoreState>()(
  persist(
    set => ({
      promotions: [],
      setPromotions: promotions => set({promotions: promotions}),
      fuelStations: [],
      setFuelStations: stations => set({fuelStations: stations}),
    }),
    {
      name: 'pop-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useStore;
