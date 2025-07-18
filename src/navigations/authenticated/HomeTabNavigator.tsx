import React from 'react';
import {BottomNavigation} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';

import CardTabNavigator from '@navigations/authenticated/CardTabNavigator';
import FuelStationTabNavigator from '@navigations/authenticated/FuelStationTabNavigator';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CommonActions} from '@react-navigation/native';
import HomeScreen from '@screens/authenticated/HomeScreen';
import TransactionListScreen from '@screens/authenticated/TransactionListScreen';
import theme from '@styles/theme';

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
    name: 'Transaction',
    label: 'Transaction',
    component: TransactionListScreen,
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
          style={{backgroundColor: theme.colors.primary}}
          activeColor={theme.colors.surface}
          activeIndicatorStyle={{
            backgroundColor: theme.colors.secondary,
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
