import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SigninScreen from '@screens/guest/SigninScreen';
import SignupScreen from '@screens/guest/SignupScreen';
import SplashScreen from '@screens/guest/SplashScreen';
import theme from '@styles/theme';

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
          headerStyle: {backgroundColor: theme.colors.background},
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
          headerStyle: {backgroundColor: theme.colors.background},
          headerShadowVisible: false,
          gestureEnabled: false,
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
