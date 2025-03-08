import AsyncStorage from '@react-native-async-storage/async-storage';
import {GeoCoordinates} from 'react-native-geolocation-service';
import {LatLng} from 'react-native-maps';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export interface User {
  email: string;
  mobile: string;
  fullName: string;
  isPasscodeSetup?: boolean;
  isBiometricAuthSetup?: boolean;
}

export interface UserCard {
  customerGuid: string;
  cardGuid: string;
  primaryAccountNumber: string;
  cardScheme: string;
  merchantGuid: string;
  merchantName: string;
  cardExpiry: Date;
}

export interface CardType {
  guid: string;
  code: string;
  description: string;
  category: string;
  subCategory: string;
}

export interface Merchant {
  merchantGuid: string;
  merchantName: string;
}

export interface FuelStation {
  id: string;
  coordinate: LatLng;
  stationName: string;
  stationAddress: string;
  totalPump: number;
  distance: number;
  formattedDistance: string;
  merchantGuid: string;
}

export interface Promotion {
  id: number;
  imageUrl: string;
  viewMoreUrl: string;
}

export interface Transaction {
  transactionId: string;
  transactionDateTime: string;
  paymentCard: string;
  loyaltyCard?: string;
  fuelAmount: number;
  stationPumpNumber: number;
  stationName: string;
  stationAddress: string;
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

  fuelStations: FuelStation[];
  setFuelStations: (stations: FuelStation[]) => void;

  nearestFuelStation: FuelStation | undefined;
  setNearestFuelStation: (nearestFuelStation: FuelStation | undefined) => void;

  searchFuelStationQuery: string;
  setSearchFuelStationQuery: (query: string) => void;

  promotions: Promotion[];
  setPromotions: (promotions: Promotion[]) => void;

  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
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

      fuelStations: [],
      setFuelStations: stations => set({fuelStations: stations}),

      nearestFuelStation: undefined,
      setNearestFuelStation: station => set({nearestFuelStation: station}),

      searchFuelStationQuery: '',
      setSearchFuelStationQuery: query => set({searchFuelStationQuery: query}),

      promotions: [],
      setPromotions: promotions => set({promotions: promotions}),

      transactions: [],
      setTransactions: transactions => set({transactions: transactions}),
    }),
    {
      name: 'pop-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useStore;
