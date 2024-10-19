import React, {useCallback, useRef, useState} from 'react';
import {Image, Platform, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MapView, {Marker as MapMarker} from 'react-native-maps';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore from '@store/index';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import FuelStationInfoModal from '@components/fuel-station-info-modal';
import {useFuelStationModal} from '@hooks/use-fuel-station-modal';

const FuelStationMapScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'FuelStation'>>();
  const mapRef = useRef<MapView | null>(null);
  const [currentStationIndex, setCurrentStationIndex] = useState<number>(0);
  const {selectedStation, selectStation, dismissModal} = useFuelStationModal();
  const fuelStations = useStore(state => state.fuelStations);
  const nearestFuelStation = useStore(state => state.nearestFuelStation);
  const currentLocation = useStore(state => state.currentLocation);

  useFocusEffect(
    useCallback(() => {
      // This runs when the screen is focused (appears)
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: fuelStations[0].coordinate.latitude,
          longitude: fuelStations[0].coordinate.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        selectStation(fuelStations[0]);
      }

      return () => {
        // This cleanup runs when the screen is unfocused (navigating away)
        dismissModal(); // Dismiss the modal
      };
    }, []),
  );

  const onRecenterToUserCurrentLocation = () => {
    if (Platform.OS === 'android') return; // android by default already supported
    if (!currentLocation) return;
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleSelectNextFuelStation = () => {
    const nextIndex = (currentStationIndex + 1) % fuelStations.length; // Cycle to the next station
    setCurrentStationIndex(nextIndex);
    const nextStation = fuelStations[nextIndex];
    selectStation(nextStation); // Set the selected station to the next one

    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: nextStation.coordinate.latitude,
        longitude: nextStation.coordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        provider="google"
        style={styles.mapContainer}
        showsUserLocation={true}
        showsMyLocationButton={currentLocation && Platform.OS === 'android'}
        initialRegion={{
          latitude: fuelStations[0].coordinate.latitude,
          longitude: fuelStations[0].coordinate.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {/* Fuel Station Markers */}
        {fuelStations.map((fuelStation, index) => {
          const isSelected = selectedStation?.id === fuelStation.id; // Check if this marker is selected
          const markerColor = isSelected
            ? CUSTOM_THEME_COLOR_CONFIG.colors.secondary
            : CUSTOM_THEME_COLOR_CONFIG.colors.primary;
          return (
            <MapMarker
              key={index}
              coordinate={fuelStation.coordinate}
              onPress={() => selectStation(fuelStation)}>
              <Image
                resizeMode="center"
                tintColor={markerColor}
                source={require('../../../assets/fuel-station-marker.png')}
                style={{width: 50, height: 50}}
              />
            </MapMarker>
          );
        })}
      </MapView>

      {/* Recenter Button Positioned Above MapView only for ios */}
      {Platform.OS === 'ios' && currentLocation && (
        <TouchableOpacity
          style={styles.recenterButton}
          onPress={onRecenterToUserCurrentLocation}
          activeOpacity={0.7}>
          <Icon
            name="location-crosshairs"
            size={18}
            color={CUSTOM_THEME_COLOR_CONFIG.colors.primary}
          />
        </TouchableOpacity>
      )}

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
        onSelectNextFuelStation={handleSelectNextFuelStation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  recenterButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 100,
  },
});

export default FuelStationMapScreen;
