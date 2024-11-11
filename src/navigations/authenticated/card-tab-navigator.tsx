import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import PaymentCardsScreen from '@screens/authenticated/payment-cards-screen';
import LoyaltyCardScreen from '@screens/authenticated/loyalty-cards-screen';

const CardOverviewTab = createMaterialTopTabNavigator();
const CardOverviewTabScreens = [
  {
    name: 'PaymentCards',
    label: 'Payment Cards',
    component: PaymentCardsScreen,
    icon: 'credit-card',
  },
  {
    name: 'LoyaltyCards',
    label: 'Loyalty Cards',
    component: LoyaltyCardScreen,
    icon: 'address-card',
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
          tabBarStyle: {backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background},
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
                  <Icon name={icon} size={16} color={color} style={{marginRight: 8}} />
                  <Text style={{color, fontWeight: 'bold'}}>{label}</Text>
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
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
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
