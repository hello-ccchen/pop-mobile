import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '@contexts/auth-context';
import MainStackNavigator from '@navigations/authenticated/main-stack-navigator';
import AuthStackNavigator from '@navigations/guest/auth-stack-navigator';

export type AppStackScreenParams = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Loading: undefined;
  HomeTab: undefined;
  Home: undefined;
  Profile: undefined;
  Promotion: {viewMoreUrl: string};
  FuelStation: undefined;
  PurchaseFuel: undefined;
};

const RootStack = createNativeStackNavigator();
const RootStackNavigator = () => {
  const {isLoggedIn} = useAuth();
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {isLoggedIn ? (
        <RootStack.Screen name="MainStack" component={MainStackNavigator} />
      ) : (
        <RootStack.Screen name="AuthStack" component={AuthStackNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
