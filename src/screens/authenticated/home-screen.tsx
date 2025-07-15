import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Button, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore from '@store/index';
import PromotionList from '@components/PromotionList';
import {showLocationServicesAlert, showVisitFuelStationAlert} from '@utils/linking-helper';
import {FuelStation} from '@services/fuelStationService';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'Home'>>();
  const user = useStore(state => state.user);
  const currentLocation = useStore(state => state.currentLocation);
  const gasStations = useStore(state => state.gasStations);
  const evStations = useStore(state => state.evChargingStations);
  const nearestFuelStation = useStore(state => state.nearestFuelStation);
  const promotions = useStore(state => state.promotions);
  const evChargerReservation = useStore(state => state.evChargerReservation);

  const renderFuelStationBox = (station: FuelStation) => {
    const isGas = station.pumpTypeCode === 'GAS';
    const title = station.formattedDistance
      ? `${station.stationName}: ${station.formattedDistance}`
      : station.stationName;
    const reservation = evChargerReservation?.[station.id];

    return (
      <TouchableWithoutFeedback>
        <View style={styles.quickAccessBox}>
          {/* Reservation Chip Indicator */}
          {!isGas && reservation && (
            <View style={styles.reservationChip}>
              <Text variant="bodySmall" style={styles.reservationChipText}>
                Reserved
              </Text>
            </View>
          )}

          <View style={styles.fuelStationNameContainer}>
            <Image
              resizeMode="center"
              source={
                isGas
                  ? require('../../../assets/gas-station-marker.png')
                  : require('../../../assets/ev-station-marker.png')
              }
              style={styles.markerImage}
            />
            <Text variant="bodyMedium" style={styles.boldText}>
              {title}
            </Text>
          </View>
          <Text variant="bodySmall" style={styles.stationAddress}>
            {station.stationAddress}
          </Text>

          <View style={{flexDirection: 'row', gap: 10}}>
            {isGas ? (
              <Button
                style={[styles.button, {flex: 1}]}
                labelStyle={{fontSize: 12}}
                mode="contained"
                onPress={() => {
                  if (station === nearestFuelStation?.gas) {
                    navigation.navigate('PurchaseFuel', {selectedStationId: station.id});
                  } else {
                    showVisitFuelStationAlert(station.coordinate);
                  }
                }}>
                {station === nearestFuelStation?.gas ? 'Purchase Fuel' : 'Visit Station'}
              </Button>
            ) : (
              <>
                {station === nearestFuelStation?.ev ? (
                  <Button
                    style={[styles.button, {flex: 1}]}
                    labelStyle={{fontSize: 12}}
                    mode="contained"
                    onPress={() => {
                      if (reservation) {
                        navigation.navigate('FuelingUnlockEV', {
                          station: station,
                          fuelAmount: reservation.transactionAmount,
                          pumpNumber: reservation.pumpNumber,
                        });
                      } else {
                        navigation.navigate('PurchaseFuel', {selectedStationId: station.id});
                      }
                    }}>
                    {reservation ? 'Unlock & Charge' : 'Charge EV'}
                  </Button>
                ) : (
                  <>
                    {!reservation && (
                      <Button
                        style={[styles.button, {flex: 1}]}
                        labelStyle={{fontSize: 12}}
                        mode="outlined"
                        onPress={() =>
                          navigation.navigate('ReserveEVCharger', {selectedStationId: station.id})
                        }>
                        Reserve
                      </Button>
                    )}
                    <Button
                      style={[styles.button, {flex: 1}]}
                      labelStyle={{fontSize: 12}}
                      mode="contained"
                      onPress={() => showVisitFuelStationAlert(station.coordinate)}>
                      Visit Station
                    </Button>
                  </>
                )}
              </>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderLocationServiceDisableBox = () => (
    <View style={styles.locationServiceDisableBox}>
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

    const gasStation = nearestFuelStation?.gas || gasStations[0];
    const evStation = nearestFuelStation?.ev || evStations[0];

    const stations = [gasStation, evStation].filter(Boolean);

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickAccessScrollContainer}
        snapToInterval={CARD_WIDTH + 10} // Ensures scrolling lands on full card
        snapToAlignment="start"
        decelerationRate="fast" // Makes snapping immediate
      >
        {stations.map(station => renderFuelStationBox(station))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.curvedHeader} />
      <ScrollView style={styles.contentWrapper}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = 200;

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
    zIndex: 0,
  },
  contentWrapper: {
    flexGrow: 1,
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
  quickAccessScrollContainer: {
    paddingHorizontal: 10,
  },
  quickAccessBox: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginTop: 25,
    marginBottom: 30,
    marginRight: 5,
    padding: 25,
    borderRadius: 30,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
    // Shadow for iOS
    shadowColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary, // Shadow color
    shadowOffset: {width: 0, height: 4}, // Positioning
    shadowOpacity: 0.3, // Intensity
    shadowRadius: 10, // Spread
    // Shadow for Android
    elevation: 10, // Elevation creates shadow on Android
  },
  locationServiceDisableBox: {
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
    width: 40,
    height: 40,
    marginHorizontal: 5,
  },
  stationAddress: {
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
  reservationChip: {
    alignSelf: 'center',
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  reservationChipText: {
    color: CUSTOM_THEME_COLOR_CONFIG.colors.surface,
    fontWeight: 'bold',
    fontSize: 10,
  },
});

export default HomeScreen;
