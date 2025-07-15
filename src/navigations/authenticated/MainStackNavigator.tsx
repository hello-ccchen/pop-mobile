import {jwtDecode} from 'jwt-decode';
import React, {useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {AppStackScreenParams} from 'src/types';

import AppLoading from '@components/Loading';
import useFetchCardTypes from '@hooks/useFetchCardTypes';
import useFetchFuelStations from '@hooks/useFetchFuelStations';
import useFetchMerchants from '@hooks/useFetchMerchants';
import useFetchPromotions from '@hooks/useFetchPromotions';
import useFetchUserCards from '@hooks/useFetchUserCards';
import useLocationTracking from '@hooks/useLocationTracking';
import HomeTabNavigator from '@navigations/authenticated/HomeTabNavigator';
import {useNavigation} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import FuelingScreen from '@screens/authenticated/FuelingScreen';
import FuelingUnlockEVScreen from '@screens/authenticated/FuelingUnlockEVScreen';
import LoyaltyCardsScreen from '@screens/authenticated/LoyaltyCardsScreen';
import PasscodeScreen from '@screens/authenticated/PasscodeScreen';
import PaymentCardsScreen from '@screens/authenticated/PaymentCardsScreen';
import ProfileScreen from '@screens/authenticated/ProfileScreen';
import PromotionScreen from '@screens/authenticated/PromotionScreen';
import PurchaseFuelScreen from '@screens/authenticated/PurchaseFuelScreen';
import ReserveEVChargerCallbackScreen from '@screens/authenticated/ReserveEVChargerCallbackScreen';
import ReserveEVChargerScreen from '@screens/authenticated/ReserveEVChargerScreen';
import SettingScreen from '@screens/authenticated/SettingScreen';
import TransactionDetailsScreen from '@screens/authenticated/TransactionDetailsScreen';
import {AuthService} from '@services/authService';
import {AuthStorageService} from '@services/authStorageService';
import {logger} from '@services/logger/loggerService';
import useStore from '@store/index';
import theme from '@styles/theme';

const MainStack = createNativeStackNavigator<AppStackScreenParams>();
const MainStackNavigator = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'Home'>>();

  const clearUser = useStore(state => state.clearUser);

  // Fetching all the master data or user data...
  const {isLoading: userCardsLoading} = useFetchUserCards();
  const {isLoading: cardTypesLoading} = useFetchCardTypes();
  const {isLoading: merchantsLoading} = useFetchMerchants();
  const {isLoading: stationsLoading} = useFetchFuelStations();
  const {isLoading: promotionsLoading} = useFetchPromotions();

  const {fetchCurrentLocation} = useLocationTracking();

  useEffect(() => {
    if (
      !userCardsLoading &&
      !cardTypesLoading &&
      !merchantsLoading &&
      !stationsLoading &&
      !promotionsLoading
    ) {
      fetchCurrentLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCardsLoading, cardTypesLoading, merchantsLoading, stationsLoading, promotionsLoading]);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      try {
        const token = await AuthStorageService.getAccessToken();
        if (token) {
          const decoded: {exp: number} = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decoded.exp < currentTime) {
            logger.debug('Token Expired, signing out');
            await AuthService.signOut();
            clearUser();
          } else {
            logger.debug('Token not yet expired...👌');
          }
        }
      } catch (error) {
        logger.error('Error checking token expiration:', error);
      }
    };

    checkTokenExpiration();

    // Check every 6 hours (6 * 60 * 60 * 1000 ms)
    const intervalId = setInterval(checkTokenExpiration, 6 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modalOptions = {
    presentation: 'containedModal' as const,
    animation: 'slide_from_bottom' as const,
    headerBackTitleVisible: false,
    headerStyle: {
      backgroundColor: theme.colors.background,
    },
    headerShadowVisible: false,
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="xmark" size={20} style={{marginRight: 20}} color={'#000000'} />
      </TouchableOpacity>
    ),
  };

  const renderScreen = () => {
    if (
      userCardsLoading ||
      cardTypesLoading ||
      merchantsLoading ||
      stationsLoading ||
      promotionsLoading
    ) {
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
          name="ReserveEVCharger"
          component={ReserveEVChargerScreen}
          options={{
            ...modalOptions,
            headerTitle: 'Reserve EV Charger',
          }}
        />
        <MainStack.Screen
          name="ReserveEVChargerCallback"
          component={ReserveEVChargerCallbackScreen}
          options={{
            ...modalOptions,
            headerTitle: 'EV Charger Reservation',
          }}
        />
        <MainStack.Screen
          name="PaymentCards"
          component={PaymentCardsScreen}
          options={{
            ...modalOptions,
            headerTitle: 'Payment Cards',
          }}
        />
        <MainStack.Screen
          name="LoyaltyCards"
          component={LoyaltyCardsScreen}
          options={{
            ...modalOptions,
            headerTitle: 'Loyalty Cards',
          }}
        />
        <MainStack.Screen
          name="Fueling"
          component={FuelingScreen}
          options={{
            ...modalOptions,
            headerShown: false,
          }}
        />
        <MainStack.Screen
          name="FuelingUnlockEV"
          component={FuelingUnlockEVScreen}
          options={{
            ...modalOptions,
            headerShown: false,
          }}
        />
        <MainStack.Screen
          name="TransactionDetails"
          component={TransactionDetailsScreen}
          options={{
            ...modalOptions,
            headerTitle: 'Transaction Details',
          }}
        />
        <MainStack.Screen
          name="Promotion"
          component={PromotionScreen}
          options={{
            ...modalOptions,
            headerTitle: 'Promotions',
          }}
        />
      </>
    );
  };

  return <MainStack.Navigator>{renderScreen()}</MainStack.Navigator>;
};

export default MainStackNavigator;
