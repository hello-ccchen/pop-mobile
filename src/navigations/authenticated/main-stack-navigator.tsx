import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome6';

import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';

import HomeTabNavigator from '@navigations/authenticated/home-tab-navigator';
import {StackScreenParamList} from '@navigations/root-stack-navigator';
import LoadingScreen from '@screens/shared/loading-screen';
import ProfileScreen from '@screens/authenticated/profile-screen';
import useFuelStations from '@hooks/use-fuel-stations';

const MainStack = createNativeStackNavigator();
const MainStackNavigator = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<StackScreenParamList, 'Home'>>();

  // Fetching all the master data...
  const {isLoading} = useFuelStations();

  const renderScreen = () => {
    if (isLoading) {
      return (
        <MainStack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{headerShown: false}}
        />
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
          name="Profile"
          component={ProfileScreen}
          options={{
            presentation: 'containedModal',
            headerBackTitleVisible: false,
            headerTitle: 'My Profile',
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
