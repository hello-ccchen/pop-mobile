import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SigninScreen from '@screens/guest/signin-screen';
import SignupScreen from '@screens/guest/signup-screen';
import SplashScreen from '@screens/guest/splash-screen';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';

const AuthStack = createNativeStackNavigator();
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator initialRouteName="Splash">
      <AuthStack.Screen name="Splash" component={SplashScreen} options={{headerShown: false}} />
      <AuthStack.Group
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: {backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background},
          headerShadowVisible: false,
        }}>
        <AuthStack.Screen
          name="SignIn"
          component={SigninScreen}
          options={{
            headerTitle: 'Sign in',
          }}
        />
        <AuthStack.Screen
          name="SignUp"
          component={SignupScreen}
          options={{
            headerTitle: 'Create account',
          }}
        />
      </AuthStack.Group>
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
