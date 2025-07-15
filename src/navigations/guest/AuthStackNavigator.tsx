import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SigninScreen from '@screens/guest/SigninScreen';
import SignupScreen from '@screens/guest/SignupScreen';
import SplashScreen from '@screens/guest/SplashScreen';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';

const AuthStack = createNativeStackNavigator();
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator initialRouteName="Splash">
      <AuthStack.Screen name="Splash" component={SplashScreen} options={{headerShown: false}} />
      <AuthStack.Screen
        name="SignIn"
        component={SigninScreen}
        options={{
          headerTitle: 'Sign in',
          headerBackTitleVisible: false,
          headerStyle: {backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background},
          headerShadowVisible: false,
          gestureEnabled: false,
        }}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{
          headerTitle: 'Create account',
          headerBackTitleVisible: false,
          headerStyle: {backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background},
          headerShadowVisible: false,
          gestureEnabled: false,
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
