import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '@contexts/AuthContext';
import MainStackNavigator from '@navigations/Authenticated/MainStackNavigator';
import AuthStackNavigator from '@navigations/Guest/AuthStackNavigator';

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
