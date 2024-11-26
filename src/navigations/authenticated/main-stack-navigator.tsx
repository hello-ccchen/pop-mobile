import React, {useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome6';

import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';

import HomeTabNavigator from '@navigations/authenticated/home-tab-navigator';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';

import AppLoading from '@components/loading';
import SettingScreen from '@screens/authenticated/setting-screen';
import ProfileScreen from '@screens/authenticated/profile-screen';
import PurchaseFuelScreen from '@screens/authenticated/purchase-fuel-screen';
import PromotionScreen from '@screens/authenticated/promotion-screen';
import PasscodeScreen from '@screens/authenticated/passcode-screen';

import useFetchFuelStations from '@hooks/use-fetch-fuel-stations';
import useFetchPromotions from '@hooks/use-fetch-promotions';
import useLocationTracking from '@hooks/use-location-tracking';

const MainStack = createNativeStackNavigator<AppStackScreenParams>();
const MainStackNavigator = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'Home'>>();

  // Fetching all the master data...
  const {isLoading: stationsLoading} = useFetchFuelStations();
  const {isLoading: promotionsLoading} = useFetchPromotions();

  const {fetchCurrentLocation} = useLocationTracking();

  useEffect(() => {
    if (!stationsLoading && !promotionsLoading) {
      fetchCurrentLocation();
    }
  }, [stationsLoading, promotionsLoading]);

  const modalOptions = {
    presentation: 'containedModal' as const,
    animation: 'slide_from_bottom' as const,
    headerBackTitleVisible: false,
    headerStyle: {
      backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
    },
    headerShadowVisible: false,
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="xmark" size={20} style={{marginRight: 20}} />
      </TouchableOpacity>
    ),
  };

  const renderScreen = () => {
    if (stationsLoading || promotionsLoading) {
      return (
        <MainStack.Screen name="Loading" component={AppLoading} options={{headerShown: false}} />
      );
    }

    return (
      <>
        <MainStack.Screen
          name="HomeTab"
          component={HomeTabNavigator}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="Passcode"
          component={PasscodeScreen}
          options={{
            ...modalOptions,
            headerLeft: () => null,
          }}
        />
        <MainStack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            ...modalOptions,
            headerTitle: 'Update Profile',
          }}
        />
        <MainStack.Screen
          name="Settings"
          component={SettingScreen}
          options={{
            ...modalOptions,
          }}
        />
        <MainStack.Screen
          name="PurchaseFuel"
          component={PurchaseFuelScreen}
          options={{
            ...modalOptions,
            headerTitle: 'Purchase Fuel',
          }}
        />
        <MainStack.Screen
          name="Promotion"
          component={PromotionScreen}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerBackTitleVisible: false,
            headerTitle: 'Promotions',
            headerStyle: {
              backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
            },
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="xmark" size={20} style={{marginRight: 20}} />
              </TouchableOpacity>
            ),
          }}
        />
      </>
    );
  };

  return <MainStack.Navigator>{renderScreen()}</MainStack.Navigator>;
};

export default MainStackNavigator;
