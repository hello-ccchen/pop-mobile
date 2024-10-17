import React, {useCallback, useRef, useState} from 'react';
import {Image, Platform, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MapView, {Marker as MapMarker} from 'react-native-maps';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore, {FuelStation} from '@store/index';
import {useLocation} from '@contexts/location-context';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import FuelStationInfoModal from '@components/fuel-station-info-modal';

const FuelStationMapScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'FuelStation'>>();
  const mapRef = useRef<MapView | null>(null);
  const {currentLocation, requestLocation} = useLocation();
  const [selectedStation, setSelectedStation] = useState<FuelStation | null>(null);
  const fuelStations = useStore(state => state.fuelStations);
  const fuelStationList: FuelStation[] = [
    ...fuelStations,
    {
      ...fuelStations[0],
      coordinate: {
        latitude: currentLocation?.latitude as number,
        longitude: currentLocation?.longitude as number,
      },
    },
  ];

  useFocusEffect(
    useCallback(() => {
      // This runs when the screen is focused (appears)

      return () => {
        // This cleanup runs when the screen is unfocused (navigating away)
        setSelectedStation(null); // Dismiss the modal
      };
    }, []),
  );

  const onRecenterPress = () => {
    if (Platform.OS === 'android') return;
    if (!currentLocation) return;
    requestLocation().then(() => {
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentLocation && (
        <MapView
          ref={mapRef}
          provider="google"
          style={styles.mapContainer}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={Platform.OS === 'android'}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          {/* Fuel Station Markers */}
          {fuelStationList.map((fuelStation, index) => (
            <MapMarker
              key={index}
              coordinate={fuelStation.coordinate}
              onPress={() => setSelectedStation(fuelStation)}>
              <Image
                resizeMode="center"
                source={require('../../../assets/fuel-station-marker.png')}
                style={{width: 50, height: 50}}
              />
            </MapMarker>
          ))}
        </MapView>
      )}

      {/* Recenter Button Positioned Above MapView only for ios */}
      {Platform.OS === 'ios' && (
        <TouchableOpacity
          style={styles.recenterButton}
          onPress={onRecenterPress}
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
