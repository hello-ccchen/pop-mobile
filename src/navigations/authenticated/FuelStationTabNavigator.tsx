import React from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Searchbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import EVStationListScreen from '@screens/authenticated/EVStationListScreen';
import GasStationListScreen from '@screens/authenticated/GasStationListScreen';
import useStore from '@store/index';
import theme from '@styles/theme';

const FuelStationOverviewTab = createMaterialTopTabNavigator();
const FuelStationOverviewTabScreens = [
  {
    name: 'GasList',
    label: 'Gas Stations',
    component: GasStationListScreen,
    icon: 'gas-pump',
  },
  {
    name: 'EVList',
    label: 'EV Chargers',
    component: EVStationListScreen,
    icon: 'charging-station',
  },
];

const FuelStationTabNavigator = () => {
  const setSearchQuery = useStore(state => state.setSearchFuelStationQuery);
  const searchQuery = useStore(state => state.searchFuelStationQuery);
  const viewType = useStore(state => state.viewFuelStationOption);
  const setViewType = useStore(state => state.setViewFuelStationOption);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <TouchableOpacity
        onPress={() => setViewType(viewType === 'list' ? 'map' : 'list')}
        style={styles.toggleButton}>
        <Icon
          name={viewType === 'list' ? 'map' : 'list'}
          size={18}
          color="#000000"
          style={styles.toggleIcon}
        />
        <Text style={styles.toggleText}>{viewType === 'list' ? 'View Map' : 'View List'}</Text>
      </TouchableOpacity>

      <FuelStationOverviewTab.Navigator
        initialRouteName="GasList"
        screenOptions={{
          tabBarStyle: styles.tabBarStyle,
          tabBarLabelStyle: styles.tabBarLabelStyle,
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
                <View style={styles.tabLabelContainer}>
                  <Icon name={icon} size={16} color={color} style={styles.tabIcon} />
                  <Text style={[styles.tabLabel, {color}]}>{label}</Text>
                </View>
              ),
            }}
          />
        ))}
      </FuelStationOverviewTab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  searchBar: {
    backgroundColor: '#D6DEE2',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleIcon: {
    marginRight: 8,
  },
  toggleText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000000',
  },
  tabBarStyle: {
    backgroundColor: theme.colors.background,
  },
  tabBarLabelStyle: {
    fontWeight: 'bold',
    textTransform: 'none',
  },
  tabLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabIcon: {
    marginRight: 8,
  },
  tabLabel: {
    fontWeight: 'bold',
  },
});

export default FuelStationTabNavigator;
