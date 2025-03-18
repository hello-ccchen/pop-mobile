import React, {useCallback, useRef, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MapView, {Marker as MapMarker} from 'react-native-maps';
import {GeoCoordinates} from 'react-native-geolocation-service';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import {FuelStation} from '@services/fuel-station-service';
import {useFuelStationModal} from '@hooks/use-fuel-station-modal';
import FuelStationInfoModal from './fuel-station-info-modal';

interface FuelStationMapProps {
  stations: FuelStation[];
  nearestFuelStation: FuelStation | undefined;
  currentLocation: GeoCoordinates | undefined;
}

const FuelStationMap: React.FC<FuelStationMapProps> = ({
  stations,
  nearestFuelStation,
  currentLocation,
}) => {
  const mapRef = useRef<MapView | null>(null);
  const [currentStationIndex, setCurrentStationIndex] = useState<number>(0);
  const {selectedStation, selectStation, dismissModal} = useFuelStationModal();

  const animateToRegion = useCallback((latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
      });
    }
  }, []);

  const handleSelectNextFuelStation = useCallback(() => {
    if (stations.length < 2) {
      // No need to switch if only 1 station
      return;
    }
    const nextIndex = (currentStationIndex + 1) % stations.length;
    setCurrentStationIndex(nextIndex);
    const nextStation = stations[nextIndex];
    selectStation(nextStation);
    animateToRegion(nextStation.coordinate.latitude, nextStation.coordinate.longitude);
  }, [currentStationIndex, stations, selectStation, animateToRegion]);

  const renderMarkers = useCallback(() => {
    return stations.map((fuelStation, index) => {
      const stationIcon =
        fuelStation.pumpTypeCode === 'GAS'
          ? require('../../assets/gas-station-marker.png')
          : require('../../assets/ev-station-marker.png');

      return (
        <MapMarker
          key={index}
          coordinate={fuelStation.coordinate}
          onPress={() => selectStation(fuelStation)}>
          <Image resizeMode="center" source={stationIcon} style={styles.markerIcon} />
        </MapMarker>
      );
    });
  }, [stations, selectStation]);

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        provider="google"
        style={styles.mapContainer}
        showsUserLocation={true}
        showsMyLocationButton={false}
        initialRegion={{
          latitude: stations[0]?.coordinate?.latitude || currentLocation?.latitude || 0,
          longitude: stations[0]?.coordinate?.longitude || currentLocation?.longitude || 0,
          latitudeDelta: 0.12,
          longitudeDelta: 0.12,
        }}>
        {renderMarkers()}
      </MapView>

      {currentLocation && (
        <TouchableOpacity
          style={styles.recenterButton}
          onPress={() => {
            if (currentLocation) {
              animateToRegion(currentLocation.latitude, currentLocation.longitude);
            }
          }}
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
        backdropColor="rgba(0, 0, 0, 0)"
        onDismiss={dismissModal}
        onNavigate={() => {
          // navigation.navigate('PurchaseFuel', {selectedStationId: selectedStation?.id});
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
  markerIcon: {
    width: 50,
    height: 50,
  },
});

export default FuelStationMap;
