import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignUpScreen';
import SplashScreen from '../screens/SplashScreen';
import {useAuth} from '../contexts/AuthContext';
import HomeNavigator from './HomeNavigator';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const {isLoggedIn} = useAuth();
  return (
    <Stack.Navigator initialRouteName="Splash">
      {false ? (
        <Stack.Screen
          name="Home"
          component={HomeNavigator}
          options={{headerShown: false}}
        />
      ) : (
        <>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerBackTitleVisible: false}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignupScreen}
            options={{headerBackTitleVisible: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
