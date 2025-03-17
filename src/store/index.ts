import AsyncStorage from '@react-native-async-storage/async-storage';
import {FuelStation} from '@services/fuel-station-service';
import {CardType} from '@services/lookup-service';
import {Merchant} from '@services/merchant-service';
import {Promotion} from '@services/promotion-service';
import {UserCard} from '@services/user-card-service';
import {GeoCoordinates} from 'react-native-geolocation-service';

import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export interface User {
  email: string;
  mobile: string;
  fullName: string;
  isPasscodeSetup?: boolean;
  isBiometricAuthSetup?: boolean;
}

interface StoreState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;

  userCards: UserCard[];
  setUserCards: (cards: UserCard[]) => void;

  currentLocation: GeoCoordinates | undefined;
  setCurrentLocation: (location: GeoCoordinates | undefined) => void;

  cardTypes: CardType[];
  setCardTypes: (cardTypes: CardType[]) => void;

  merchants: Merchant[];
  setMerchants: (merchants: Merchant[]) => void;

  gasStations: FuelStation[];
  setGasStations: (stations: FuelStation[]) => void;

  evChargingStations: FuelStation[];
  setEVChargingStations: (stations: FuelStation[]) => void;

  nearestFuelStation: {gas?: FuelStation; ev?: FuelStation} | undefined;
  setNearestFuelStation: (type: 'gas' | 'ev', station: FuelStation | undefined) => void;

  searchFuelStationQuery: string;
  setSearchFuelStationQuery: (query: string) => void;

  viewFuelStationOption: 'list' | 'map';
  setViewFuelStationOption: (option: 'list' | 'map') => void;

  promotions: Promotion[];
  setPromotions: (promotions: Promotion[]) => void;
}

const useStore = create<StoreState>()(
  persist(
    set => ({
      user: null,
      setUser: user => set({user}),
      clearUser: () => set({user: null}),

      userCards: [],
      setUserCards: cards => set({userCards: cards}),

      currentLocation: undefined,
      setCurrentLocation: location => set({currentLocation: location}),

      cardTypes: [],
      setCardTypes: cardTypes => set({cardTypes: cardTypes}),

      merchants: [],
      setMerchants: merchants => set({merchants: merchants}),

      gasStations: [],
      setGasStations: stations => set({gasStations: stations}),

      evChargingStations: [],
      setEVChargingStations: stations => set({evChargingStations: stations}),

      nearestFuelStation: undefined,
      setNearestFuelStation: (type, station) =>
        set(state => ({
          nearestFuelStation: {
            ...state.nearestFuelStation,
            [type]: station,
          },
        })),

      searchFuelStationQuery: '',
      setSearchFuelStationQuery: query => set({searchFuelStationQuery: query}),

      viewFuelStationOption: 'list',
      setViewFuelStationOption: option => set({viewFuelStationOption: option}),

      promotions: [],
      setPromotions: promotions => set({promotions: promotions}),
    }),
    {
      name: 'pop-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useStore;
