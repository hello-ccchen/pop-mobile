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
import useFilteredFuelStations from '@hooks/use-filtered-fuel-stations';

const FuelStationMapScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'FuelStation'>>();
  const mapRef = useRef<MapView | null>(null);
  const [currentStationIndex, setCurrentStationIndex] = useState<number>(0);
  const {selectedStation, selectStation, dismissModal} = useFuelStationModal();
  const filteredStations = useFilteredFuelStations('map');
  const nearestFuelStation = useStore(state => state.nearestFuelStation);
  const currentLocation = useStore(state => state.currentLocation);
  const setSearchStationQuery = useStore(state => state.setSearchFuelStationQuery);

  const animateToRegion = (latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSearchStationQuery('');
        dismissModal();
      };
    }, [dismissModal, setSearchStationQuery]),
  );

  useFocusEffect(
    useCallback(() => {
      if (mapRef.current) {
        const firstFilteredStation = filteredStations[0];
        if (firstFilteredStation) {
          animateToRegion(
            firstFilteredStation.coordinate.latitude,
            firstFilteredStation.coordinate.longitude,
          );
          selectStation(firstFilteredStation);
        } else if (currentLocation) {
          animateToRegion(currentLocation.latitude, currentLocation.longitude);
          selectStation(null);
        }
      }
    }, [filteredStations, currentLocation, selectStation]),
  );

  const onRecenterToUserCurrentLocation = () => {
    if (Platform.OS === 'android' || !currentLocation) {
      return;
    } // Android handles this by default
    animateToRegion(currentLocation.latitude, currentLocation.longitude);
  };

  const handleSelectNextFuelStation = useCallback(() => {
    const nextIndex = (currentStationIndex + 1) % filteredStations.length;
    setCurrentStationIndex(nextIndex);
    const nextStation = filteredStations[nextIndex];
    selectStation(nextStation);
    animateToRegion(nextStation.coordinate.latitude, nextStation.coordinate.longitude);
  }, [currentStationIndex, filteredStations, selectStation, animateToRegion]);

  const renderMarkers = useCallback(() => {
    return filteredStations.map((fuelStation, index) => {
      const stationIcon =
        fuelStation.pumpTypeCode === 'GAS'
          ? require('../../../assets/gas-station-marker.png')
          : require('../../../assets/ev-station-marker.png');
      return (
        <MapMarker
          key={index}
          coordinate={fuelStation.coordinate}
          onPress={() => selectStation(fuelStation)}>
          <Image resizeMode="center" source={stationIcon} style={{width: 50, height: 50}} />
        </MapMarker>
      );
    });
  }, [filteredStations, selectedStation, selectStation]);

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        provider="google"
        style={styles.mapContainer}
        showsUserLocation={true}
        showsMyLocationButton={currentLocation && Platform.OS === 'android'}
        initialRegion={{
          latitude: filteredStations[0]?.coordinate?.latitude || currentLocation?.latitude || 0,
          longitude: filteredStations[0]?.coordinate?.longitude || currentLocation?.longitude || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {renderMarkers()}
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
        nearestFuelStation={nearestFuelStation?.gas}
        isVisible={!!selectedStation}
        backdropColor="rgba(0, 0, 0, 0)"
        onDismiss={dismissModal}
        onNavigate={() => {
          navigation.navigate('PurchaseFuel', {selectedStationId: selectedStation?.id});
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
