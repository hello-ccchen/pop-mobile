import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '@contexts/auth-context';
import MainStackNavigator from '@navigations/authenticated/main-stack-navigator';
import AuthStackNavigator from '@navigations/guest/auth-stack-navigator';

export type StackScreenParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Profile: undefined;
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
