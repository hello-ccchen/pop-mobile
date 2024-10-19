import React, {useCallback} from 'react';
import {Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore from '@store/index';
import FuelStationInfoModal from '@components/fuel-station-info-modal';
import {useFuelStationModal} from '@hooks/use-fuel-station-modal';

const FuelStationListScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'FuelStation'>>();
  const {selectedStation, selectStation, dismissModal} = useFuelStationModal();
  const fuelStations = useStore(state => state.fuelStations);
  const nearestFuelStation = useStore(state => state.nearestFuelStation);

  useFocusEffect(
    useCallback(() => {
      // This runs when the screen is focused (appears)
      return () => {
        // This cleanup runs when the screen is unfocused (navigating away)
        dismissModal(); // Dismiss the modal
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        {fuelStations.map((fuelStation, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.5}
            onPress={() => selectStation(fuelStation)}>
            <Card.Title
              style={styles.cardContainer}
              title={fuelStation.stationName}
              titleVariant="titleMedium"
              titleStyle={styles.cardTitle}
              subtitle={fuelStation.stationAddress}
              subtitleNumberOfLines={2}
              subtitleStyle={styles.cardSubtitle}
              left={() => (
                <View style={styles.cardLeftContentContainer}>
                  <Image
                    resizeMode="center"
                    source={require('../../../assets/fuel-station-marker.png')}
                    style={styles.cardLeftIcon}
                  />
                  <Text style={styles.cardLeftText}>{fuelStation.formattedDistance}</Text>
                </View>
              )}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Fuel Station Info Modal */}
      <FuelStationInfoModal
        selectedStation={selectedStation}
        fuelStationDistance={selectedStation ? selectedStation.formattedDistance : ''}
        nearestFuelStation={nearestFuelStation}
        isVisible={!!selectedStation}
        onDismiss={dismissModal}
        onNavigate={() => {
          navigation.navigate('PurchaseFuel');
          dismissModal();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    borderBottomWidth: 1,
    borderColor: '#D6DEE2',
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
    paddingVertical: 5,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  cardSubtitle: {
    marginBottom: 5,
  },
  cardLeftContentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: 100,
  },
  cardLeftIcon: {
    width: 40,
    height: 40,
  },
  cardLeftText: {
    fontSize: 11,
    width: 45,
    textAlign: 'center',
  },
});

export default FuelStationListScreen;
