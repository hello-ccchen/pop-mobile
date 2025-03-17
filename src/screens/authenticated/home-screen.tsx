import React from 'react';
import {Image, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore from '@store/index';
import PromotionList from '@components/promotion-list';
import {showLocationServicesAlert, showVisitFuelStationAlert} from '@utils/linking-helper';
import {FuelStation} from '@services/fuel-station-service';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'Home'>>();
  const user = useStore(state => state.user);
  const currentLocation = useStore(state => state.currentLocation);
  const gasStations = useStore(state => state.gasStations);
  const nearestFuelStation = useStore(state => state.nearestFuelStation);
  const promotions = useStore(state => state.promotions);

  const renderFuelStationBox = (station: FuelStation) => {
    const title = station.formattedDistance
      ? `${station.stationName}: ${station.formattedDistance}`
      : station.stationName;
    return (
      <View style={styles.quickAccessBox}>
        <View style={styles.fuelStationNameContainer}>
          <Image
            resizeMode="center"
            source={require('../../../assets/fuel-station-marker.png')}
            style={styles.markerImage}
          />
          <Text variant="bodyLarge" style={styles.boldText}>
            {title}
          </Text>
        </View>
        <Text variant="bodyMedium" style={styles.stationAddress}>
          {station.stationAddress}
        </Text>
        <Button
          style={styles.button}
          icon={station === nearestFuelStation ? 'cart-shopping' : 'location-arrow'}
          mode="contained"
          onPress={() => {
            station === nearestFuelStation
              ? navigation.navigate('PurchaseFuel', {selectedStationId: station.id})
              : showVisitFuelStationAlert(station.coordinate);
          }}>
          {station === nearestFuelStation ? 'Purchase Fuel' : 'Visit Station'}
        </Button>
      </View>
    );
  };

  const renderLocationServiceDisableBox = () => (
    <View style={styles.quickAccessBox}>
      <Text variant="bodyLarge" style={styles.boldText}>
        Locate the nearest Fuel Station to Pay On Pump
      </Text>
      <Button
        style={styles.button}
        icon="map-location-dot"
        mode="contained"
        onPress={showLocationServicesAlert}>
        Enable Location
      </Button>
    </View>
  );

  const renderQuickAccessBox = () => {
    if (!currentLocation) {
      return renderLocationServiceDisableBox();
    }
    const stationToRender = nearestFuelStation || gasStations[0];
    return renderFuelStationBox(stationToRender);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.curvedHeader} />
      <View style={styles.contentWrapper}>
        <View style={styles.headerContainer}>
          <Text variant="headlineMedium" style={styles.headerText}>
            Hello {user?.fullName}
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('Settings')}
            style={styles.profileSettingIcon}>
            <Icon name="user-gear" size={14} color={CUSTOM_THEME_COLOR_CONFIG.colors.background} />
          </TouchableOpacity>
        </View>
        {renderQuickAccessBox()}
        <PromotionList promotions={promotions} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
  },
  curvedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.secondary,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    zIndex: 1,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  headerContainer: {
    marginTop: 20,
    marginHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: CUSTOM_THEME_COLOR_CONFIG.colors.surface,
    fontWeight: 'bold',
  },
  profileSettingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
  },
  boldText: {
    fontWeight: 'bold',
  },
  quickAccessBox: {
    marginVertical: 25,
    marginHorizontal: 15,
    padding: 30,
    borderRadius: 30,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 30,
    shadowColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
  },
  fuelStationNameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  markerImage: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
  stationAddress: {
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
});

export default HomeScreen;
