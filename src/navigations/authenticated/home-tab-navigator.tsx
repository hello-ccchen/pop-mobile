import React from 'react';
import {BottomNavigation} from 'react-native-paper';
import {CommonActions} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome6';

import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';

import HomeScreen from '@screens/authenticated/home-screen';
import CardTabNavigator from '@navigations/authenticated/card-tab-navigator';
import FuelStationTabNavigator from '@navigations/authenticated/fuel-station-tab-navigator';
import RewardScreen from '@screens/authenticated/reward-screen';
import TransactionScreen from '@screens/authenticated/transaction-screen';

const HomeTab = createBottomTabNavigator();
const HomeTabScreens = [
  {
    name: 'Home',
    label: 'Home',
    component: HomeScreen,
    icon: 'house',
  },
  {
    name: 'Card',
    label: 'Card',
    component: CardTabNavigator,
    icon: 'credit-card',
  },
  {
    name: 'FuelStation',
    label: 'Station',
    component: FuelStationTabNavigator,
    icon: 'gas-pump',
  },
  {
    name: 'Reward',
    label: 'Reward',
    component: RewardScreen,
    icon: 'gift',
  },
  {
    name: 'Transaction',
    label: 'Transaction',
    component: TransactionScreen,
    icon: 'file-invoice-dollar',
  },
];

const HomeTabNavigator = () => {
  return (
    <HomeTab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({navigation, state, descriptors, insets}) => (
        <BottomNavigation.Bar // Currently do have a known issue: Warning: A props object containing a "key" prop is being spread into JSX readmore: https://github.com/callstack/react-native-paper/pull/4494
          navigationState={state}
          safeAreaInsets={insets}
          style={{backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary}}
          activeColor={CUSTOM_THEME_COLOR_CONFIG.colors.surface}
          activeIndicatorStyle={{
            backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.secondary,
          }}
          inactiveColor="#D6DEE2"
          onTabPress={({route, preventDefault}) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({route, focused, color}) => {
            const {options} = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({focused, color, size: 22});
            }
            return null;
          }}
          getLabelText={({route}) => {
            const {options} = descriptors[route.key];
            return options.tabBarLabel as string;
          }}
        />
      )}>
      {HomeTabScreens.map(({name, component, label, icon}) => (
        <HomeTab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarLabel: label,
            tabBarIcon: ({color, size}) => <Icon name={icon} size={size} color={color} />,
          }}
        />
      ))}
    </HomeTab.Navigator>
  );
};

export default HomeTabNavigator;
