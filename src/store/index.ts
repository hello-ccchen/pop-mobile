import AsyncStorage from '@react-native-async-storage/async-storage';
import {GeoCoordinates} from 'react-native-geolocation-service';
import {LatLng} from 'react-native-maps';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export interface User {
  username: string;
  email: string;
  mobile: string;
  profile: {
    firstName: string;
    lastName: string;
  };
  isPasscodeSetup?: boolean;
}

export interface Promotion {
  id: number;
  imageUrl: string;
  viewMoreUrl: string;
}

export interface FuelStation {
  id: string;
  coordinate: LatLng;
  stationName: string;
  stationAddress: string;
  totalPump: number;
  distance: number;
  formattedDistance: string;
}

interface StoreState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;

  currentLocation: GeoCoordinates | undefined;
  setCurrentLocation: (location: GeoCoordinates | undefined) => void;

  promotions: Promotion[];
  setPromotions: (promotions: Promotion[]) => void;

  fuelStations: FuelStation[];
  setFuelStations: (stations: FuelStation[]) => void;

  nearestFuelStation: FuelStation | undefined;
  setNearestFuelStation: (nearestFuelStation: FuelStation | undefined) => void;

  searchFuelStationQuery: string;
  setSearchFuelStationQuery: (query: string) => void;
}

const useStore = create<StoreState>()(
  persist(
    set => ({
      user: null,
      setUser: user => set({user}),
      clearUser: () => set({user: null}),

      currentLocation: undefined,
      setCurrentLocation: location => set({currentLocation: location}),

      promotions: [],
      setPromotions: promotions => set({promotions: promotions}),

      fuelStations: [],
      setFuelStations: stations => set({fuelStations: stations}),

      nearestFuelStation: undefined,
      setNearestFuelStation: station => set({nearestFuelStation: station}),

      searchFuelStationQuery: '',
      setSearchFuelStationQuery: query => set({searchFuelStationQuery: query}),
    }),
    {
      name: 'pop-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useStore;
