import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import theme from '@styles/theme';
import PaymentCardsScreen from '@screens/authenticated/PaymentCardsScreen';
import FleetCardScreen from '@screens/authenticated/FleetCardsScreen';
import LoyaltyCardsScreen from '@screens/authenticated/LoyaltyCardsScreen';

const CardOverviewTab = createMaterialTopTabNavigator();
const CardOverviewTabScreens = [
  {
    name: 'FleetCard',
    label: 'Fleet',
    component: FleetCardScreen,
    icon: 'credit-card',
  },
  {
    name: 'LoyaltyCards',
    label: 'Loyalty',
    component: LoyaltyCardsScreen,
    icon: 'address-card',
  },
  {
    name: 'PaymentCards',
    label: 'Payment',
    component: PaymentCardsScreen,
    icon: 'cc-visa',
  },
];

const CardTabNavigator = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="headlineSmall" style={styles.boldText}>
          My Cards
        </Text>
      </View>
      <CardOverviewTab.Navigator
        screenOptions={{
          tabBarStyle: {backgroundColor: theme.colors.background},
          tabBarLabelStyle: {fontWeight: 'bold', textTransform: 'none'},
          tabBarPressColor: 'transparent',
          tabBarPressOpacity: 1,
          swipeEnabled: false,
        }}>
        {CardOverviewTabScreens.map(({name, component, label, icon}) => (
          <CardOverviewTab.Screen
            key={name}
            name={name}
            component={component}
            options={{
              tabBarLabel: ({color}) => (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon name={icon} size={14} color={color} style={{marginRight: 8}} />
                  <Text style={{color, fontWeight: 'bold', fontSize: 14}}>{label}</Text>
                </View>
              ),
            }}
          />
        ))}
      </CardOverviewTab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 5,
    marginHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default CardTabNavigator;
