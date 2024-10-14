import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '@screens/Guest/LoginScreen';
import SignupScreen from '@screens/Guest/SignupScreen';
import SplashScreen from '@screens/Guest/SplashScreen';
import CustomTheme from '@styles/custom-theme';

const AuthStack = createNativeStackNavigator();
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator initialRouteName="Splash">
      <AuthStack.Screen
        name="Splash"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Group
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: {backgroundColor: CustomTheme.colors.background},
          headerShadowVisible: false,
        }}>
        <AuthStack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerTitle: 'Log in',
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
