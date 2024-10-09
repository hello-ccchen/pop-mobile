import React from 'react';
import {BottomNavigation} from 'react-native-paper';
import {CommonActions} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome6';

import DashboardScreen from '../screens/DashboardScreen';
import CardScreen from '../screens/CardScreen';
import CustomTheme from '../styles/custom-theme';

const Tab = createBottomTabNavigator();
const TabScreens = [
  {
    name: 'Dashboard',
    component: DashboardScreen,
    label: 'Home',
    icon: 'house',
  },
  {
    name: 'Card',
    component: CardScreen,
    label: 'My Card',
    icon: 'credit-card',
  }
];

const HomeNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({navigation, state, descriptors, insets}) => (
        <BottomNavigation.Bar // Currently do have a known issue: Warning: A props object containing a "key" prop is being spread into JSX readmore: https://github.com/callstack/react-native-paper/pull/4494
          navigationState={state}
          safeAreaInsets={insets}
          style={{backgroundColor: CustomTheme.colors.primary}}
          activeColor={CustomTheme.colors.surface}
          activeIndicatorStyle={{
            backgroundColor: CustomTheme.colors.secondary,
          }}
          inactiveColor="#B0BEC5"
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
      {TabScreens.map(({name, component, label, icon}) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarLabel: label,
            tabBarIcon: ({color, size}) => (
              <Icon name={icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default HomeNavigator;
