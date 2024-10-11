import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import CustomTheme from '@styles/custom-theme';

import {useAuth} from '@contexts/AuthContext';

import SplashScreen from '@screens/Guest/SplashScreen';
import LoginScreen from '@screens/Guest/LoginScreen';
import SignupScreen from '@screens/Guest/SignupScreen';

import MainNavigator from '@navigations/MainNavigator';
import ProfileScreen from '@screens/Authenticated/ProfileScreen';

export type StackScreenParamList = {
  Root: undefined;
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
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
            name="FeatureTab"
            component={MainNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              presentation: 'containedModal',
              headerBackTitleVisible: false,
              headerTitle: 'My Profile',
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
          <Stack.Group
            screenOptions={{
              headerBackTitleVisible: false,
              headerStyle: {backgroundColor: CustomTheme.colors.background},
              headerShadowVisible: false,
            }}>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerTitle: 'Log in',
              }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignupScreen}
              options={{
                headerTitle: 'Create account',
              }}
            />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
