import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainStackNavigator from '@navigations/authenticated/main-stack-navigator';
import AuthStackNavigator from '@navigations/guest/auth-stack-navigator';
import PasscodeScreen, {ScreenState} from '@screens/authenticated/passcode-screen';
import {API_URL_ANDROID, API_URL_IOS} from '@env';
import useStore from '@store/index';

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
  console.log('API_URL_IOS:', API_URL_IOS);
  console.log('API_URL_ANDROID:', API_URL_ANDROID);
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
