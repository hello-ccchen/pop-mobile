import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainStackNavigator from '@navigations/authenticated/MainStackNavigator';
import AuthStackNavigator from '@navigations/guest/AuthStackNavigator';
import PasscodeScreen, {ScreenState} from '@screens/authenticated/passcode-screen';
import Config from 'react-native-config';

import useStore from '@store/index';
import {logger} from '@services/logger/loggerService';
import {Transaction} from '@services/transactionService';
import {FuelStation} from '@services/fuelStationService';

type PasscodeScreenParams = {
  screenState?: ScreenState;
  OTP?: string;
  nextScreen?: keyof AppStackScreenParams;
  nextScreenParams?: object;
};

export type AppStackScreenParams = {
  Splash: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Loading: undefined;
  HomeTab: undefined;
  Home: undefined;
  Passcode: PasscodeScreenParams;
  Settings: undefined;
  Profile: undefined;
  Promotion: {viewMoreUrl: string};
  GasStation: undefined;
  EVStation: undefined;
  Transactions: undefined;
  TransactionDetails: {transaction?: Transaction; transactionId?: string};
  ReserveEVCharger: {selectedStationId: string | undefined};
  ReserveEVChargerCallback: {
    stationId: string;
    stationName: string;
    stationAddress: string;
    paymentCardId: string;
    loyaltyCardId?: string;
    pumpNumber: number;
    pumpId: string;
    fuelAmount: number;
    passcode: string;
  };
  PurchaseFuel: {selectedStationId: string | undefined};
  FuelingUnlockEV: {station: FuelStation; pumpNumber: number; fuelAmount: number};
  Fueling: {
    stationName: string;
    stationAddress: string;
    paymentCardId: string;
    loyaltyCardId?: string;
    pumpNumber: number;
    pumpId: string;
    fuelAmount: number;
    passcode: string;
    isGas: boolean;
  };
  PaymentCards: undefined;
  LoyaltyCards: undefined;
};

const RootStack = createNativeStackNavigator();
const RootStackNavigator = () => {
  const user = useStore(state => state.user);

  useEffect(() => {
    logger.debug('API_URL_IOS:', Config.API_URL_IOS);
    logger.debug('API_URL_ANDROID:', Config.API_URL_ANDROID);
  }, []);

  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {user ? (
        user.isPasscodeSetup ? (
          <RootStack.Screen name="MainStack" component={MainStackNavigator} />
        ) : (
          <RootStack.Screen name="Passcode" component={PasscodeScreen} />
        )
      ) : (
        <RootStack.Screen name="AuthStack" component={AuthStackNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
