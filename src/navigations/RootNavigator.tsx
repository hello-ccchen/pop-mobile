import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CustomTheme from '../styles/custom-theme';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import {useAuth} from '../contexts/AuthContext';
import HomeNavigator from './HomeNavigator';
import ProfileScreen from '../screens/ProfileScreen';

export type StackScreenParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Dashboard: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const {isLoggedIn} = useAuth();
  return (
    <Stack.Navigator initialRouteName="Splash">
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Home"
            component={HomeNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              headerBackTitleVisible: false,
              headerTitle: 'My Account',
              headerStyle: {backgroundColor: CustomTheme.colors.background},
              headerShadowVisible: false,
            }}
          />
        </>
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
            options={{
              headerTitle: 'Log in',
              headerBackTitleVisible: false,
              headerStyle: {backgroundColor: CustomTheme.colors.background},
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignupScreen}
            options={{
              headerTitle: 'Create account',
              headerBackTitleVisible: false,
              headerStyle: {backgroundColor: CustomTheme.colors.background},
              headerShadowVisible: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
