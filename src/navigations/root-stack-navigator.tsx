import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainStackNavigator from '@navigations/authenticated/main-stack-navigator';
import AuthStackNavigator from '@navigations/guest/auth-stack-navigator';
import PasscodeScreen, {ScreenState} from '@screens/authenticated/passcode-screen';
import Config from 'react-native-config';

import useStore from '@store/index';
import {logger} from '@services/logger/logger-service';

export type AppStackScreenParams = {
  Splash: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Loading: undefined;
  HomeTab: undefined;
  Home: undefined;
  Passcode: {screenState: ScreenState; OTP: string} | undefined;
  Settings: undefined;
  Profile: undefined;
  Promotion: {viewMoreUrl: string};
  FuelStation: undefined;
  PurchaseFuel: {selectedStationId: string | undefined};
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
