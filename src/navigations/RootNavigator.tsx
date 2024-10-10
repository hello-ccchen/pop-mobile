import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import CustomTheme from '../styles/custom-theme';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {useAuth} from '../contexts/AuthContext';
import HomeNavigator from './HomeNavigator';


export type StackScreenParamList = {
  Root: undefined;
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Dashboard: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const {isLoggedIn} = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackScreenParamList, 'Root'>>();
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
              presentation: 'containedModal',
              headerBackTitleVisible: false,
              headerTitle: 'My Account',
              headerStyle: {backgroundColor: CustomTheme.colors.background},
              headerShadowVisible: false,
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon name="xmark" size={20} style={{marginRight: 20}} />
                </TouchableOpacity>
              ),
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
