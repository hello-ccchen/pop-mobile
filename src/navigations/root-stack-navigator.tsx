import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainStackNavigator from '@navigations/authenticated/main-stack-navigator';
import AuthStackNavigator from '@navigations/guest/auth-stack-navigator';
import useStore from '@store/index';

export type AppStackScreenParams = {
  Splash: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Loading: undefined;
  HomeTab: undefined;
  Home: undefined;
  Profile: undefined;
  Promotion: {viewMoreUrl: string};
  FuelStation: undefined;
  PurchaseFuel: {selectedStationId: string | undefined};
};

const RootStack = createNativeStackNavigator();
const RootStackNavigator = () => {
  const user = useStore(state => state.user);
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {user ? (
        <RootStack.Screen name="MainStack" component={MainStackNavigator} />
      ) : (
        <RootStack.Screen name="AuthStack" component={AuthStackNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
