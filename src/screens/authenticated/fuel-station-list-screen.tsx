import React, {useCallback, useState} from 'react';
import {Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore, {FuelStation} from '@store/index';
import FuelStationInfoModal from '@components/fuel-station-info-modal';
import {useLocation} from '@contexts/location-context';

const FuelStationListScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'FuelStation'>>();
  const {currentLocation} = useLocation();
  let fuelStations = useStore(state => state.fuelStations);
  fuelStations = fuelStations; //.concat(fuelStations).concat(fuelStations);
  const [selectedStation, setSelectedStation] = useState<FuelStation | null>(null);

  useFocusEffect(
    useCallback(() => {
      // This runs when the screen is focused (appears)

      return () => {
        // This cleanup runs when the screen is unfocused (navigating away)
        setSelectedStation(null); // Dismiss the modal
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
            onPress={() => setSelectedStation(fuelStation)}>
            <Card.Title
              style={{
                borderBottomWidth: 1,
                borderColor: '#D6DEE2',
                backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
              }}
              title={fuelStation.stationName}
              subtitle={fuelStation.stationAddress}
              subtitleNumberOfLines={2}
              subtitleStyle={{marginBottom: 5}}
              titleVariant="titleMedium"
              titleStyle={{fontWeight: 'bold', marginTop: 5}}
              left={() => (
                <Image
                  resizeMode="center"
                  source={require('../../../assets/fuel-station-marker.png')}
                  style={{width: 45, height: 45}}
                />
              )}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Fuel Station Info Modal */}
      <FuelStationInfoModal
        selectedStation={selectedStation}
        currentLocation={currentLocation}
        isVisible={!!selectedStation}
        onDismiss={() => setSelectedStation(null)}
        onNavigate={() => {
          navigation.navigate('PurchaseFuel');
          setSelectedStation(null);
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
});

export default FuelStationListScreen;
