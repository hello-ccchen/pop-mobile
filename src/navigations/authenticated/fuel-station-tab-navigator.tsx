import React, {useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {Searchbar, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FuelStationListScreen from '@screens/authenticated/fuel-station-list-screen';
import FuelStationMapScreen from '@screens/authenticated/fuel-station-map-screen';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore from '@store/index';

const FuelStationOverviewTab = createMaterialTopTabNavigator();
const FuelStationOverviewTabScreens = [
  {
    name: 'List',
    label: 'List View',
    component: FuelStationListScreen,
    icon: 'list',
  },
  {
    name: 'Map',
    label: 'Map View',
    component: FuelStationMapScreen,
    icon: 'map',
  },
];

const FuelStationTabNavigator = () => {
  const setSearchQuery = useStore(state => state.setSearchFuelStationQuery);
  const searchQuery = useStore(state => state.searchFuelStationQuery);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background}}>
      <Searchbar
        placeholder="Search for fuel stations..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        icon="gas-pump"
        iconColor={CUSTOM_THEME_COLOR_CONFIG.colors.primary}
        style={{
          marginTop: 10,
          marginHorizontal: 10,
          backgroundColor: '#D6DEE2',
        }}
      />
      <FuelStationOverviewTab.Navigator
        screenOptions={{
          tabBarStyle: {backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background},
          tabBarLabelStyle: {fontWeight: 'bold', textTransform: 'none'},
          tabBarPressColor: 'transparent',
          tabBarPressOpacity: 1,
          swipeEnabled: false,
        }}>
        {FuelStationOverviewTabScreens.map(({name, component, label, icon}) => (
          <FuelStationOverviewTab.Screen
            key={name}
            name={name}
            component={component}
            options={{
              tabBarLabel: ({color}) => (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon name={icon} size={16} color={color} style={{marginRight: 8}} />
                  <Text style={{color, fontWeight: 'bold'}}>{label}</Text>
                </View>
              ),
            }}
          />
        ))}
      </FuelStationOverviewTab.Navigator>
    </SafeAreaView>
  );
};

export default FuelStationTabNavigator;
