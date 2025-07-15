import {GeoCoordinates} from 'react-native-geolocation-service';
import {CardType, FuelStation, Merchant, Promotion, User, UserCard} from 'src/types';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface EVChargerReservation {
  mobileTransactionGuid: string;
  preAuthorisationGuid: string;
  status: 'Reserve' | 'Unlocked'; // Adjust status as needed
  authorisationID: string;
  systemTraceAuditNumber: string;
  batchNumber: string;
  retrivalReferenceNumber: string;
  transactionAmount: number;
  pumpGuid: string;
  pumpNumber: number;
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

  evChargerReservation: Record<string, EVChargerReservation | undefined>;
  setEVChargerReservation: (
    stationId: string,
    reservation: EVChargerReservation | undefined,
  ) => void;
  clearEVChargerReservation: (stationId: string) => void;
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

      // EV Charger Reservation
      evChargerReservation: {},
      setEVChargerReservation: (stationId, reservation) =>
        set(state => ({
          evChargerReservation: {
            ...state.evChargerReservation,
            [stationId]: reservation,
          },
        })),
      clearEVChargerReservation: (stationId: string) =>
        set(state => {
          const updatedReservations = {...state.evChargerReservation};
          delete updatedReservations[stationId]; // Remove only the specific station's reservation
          return {evChargerReservation: updatedReservations};
        }),
    }),
    {
      name: 'pop-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useStore;
