import React, { useState } from 'react';
import {SafeAreaView, View} from 'react-native';
import {Searchbar, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FuelStationListScreen from '@screens/Authenticated/FuelStationListScreen';
import FuelStationMapScreen from '@screens/Authenticated/FuelStationMapScreen';
import CustomTheme from '@styles/custom-theme';

const FuelStationOverviewTab = createMaterialTopTabNavigator();
const FuelStationOverviewTabScreens = [
  {
    name: 'Map',
    label: 'Map View',
    component: FuelStationMapScreen,
    icon: 'map',
  },
  {
    name: 'List',
    label: 'List View',
    component: FuelStationListScreen,
    icon: 'list',
  },
];

const FuelStationTabNavigator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: CustomTheme.colors.background}}>
      <Searchbar
        placeholder="Search for fuel stations..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        icon='gas-pump'
        iconColor={CustomTheme.colors.primary}
        style={{
          marginTop: 10,
          marginHorizontal: 10,
          backgroundColor: '#D6DEE2'
        }}
      />
      <FuelStationOverviewTab.Navigator
        screenOptions={{
          tabBarStyle: {backgroundColor: CustomTheme.colors.background},
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
                  <Icon
                    name={icon}
                    size={16}
                    color={color}
                    style={{marginRight: 8}}
                  />
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
