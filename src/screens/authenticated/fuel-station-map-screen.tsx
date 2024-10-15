import React, {useRef, useState} from 'react';
import {
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {ActivityIndicator, Button, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MapView, {LatLng, Marker as MapMarker} from 'react-native-maps';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import {useLocation} from '@contexts/location-context';
import AppBottomSheetModal from '@components/bottom-sheet-modal';
import {FuelStation} from '@store/index';
import useFuelStations from '@hooks/use-fuel-stations';

const FuelStationMapScreen = () => {
  const {currentLocation, requestLocation} = useLocation();
  const {fuelStations, isLoading} = useFuelStations();
  const mapRef = useRef<MapView | null>(null);
  const [selectedStation, setSelectedStation] = useState<FuelStation | null>(null);

  if (isLoading) return <ActivityIndicator animating={true} />; // TODO: create loading component

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

  const openExternalNavigationApp = (
    app: 'waze' | 'google',
    latitude: number,
    longitude: number,
  ) => {
    let url;
    switch (app) {
      case 'waze':
        url = `waze://?ll=${latitude},${longitude}&navigate=yes`;
        break;
      case 'google':
        url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
        break;
      default:
        return;
    }

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert(`${app} is not installed`);
        }
      })
      .catch(err => console.error('Error opening app:', err));
  };

  const visitFuelStation = (coordinate: LatLng | undefined) => {
    if (!coordinate) return;
    Alert.alert(
      'Choose an app to navigate',
      undefined,
      [
        {
          text: 'Waze',
          onPress: () =>
            openExternalNavigationApp(
              'waze',
              coordinate.latitude,
              coordinate.longitude,
            ),
        },
        {
          text: 'Google Maps',
          onPress: () =>
            openExternalNavigationApp(
              'google',
              coordinate.latitude,
              coordinate.longitude,
            ),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

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

  const isAtFuelStation = (
    currentLocation: LatLng | undefined,
    selectedStation: FuelStation | null,
  ) => {
    if (!currentLocation || !selectedStation) return false;
    return (
      currentLocation.latitude === selectedStation.coordinate.latitude &&
      currentLocation.longitude === selectedStation.coordinate.longitude
    );
  };

  const renderFuelStationInfoModal = () => {
    return (
      <AppBottomSheetModal
        isVisible={!!selectedStation}
        snapPoints={['30%']}
        onDismiss={() => setSelectedStation(null)}>
        {selectedStation && (
          <View style={styles.modalContainer}>
            <Text variant="titleLarge">{selectedStation.stationName}</Text>
            <View style={styles.modalContentRowContainer}>
              <Icon
                name="location-dot"
                size={18}
                color={CUSTOM_THEME_COLOR_CONFIG.colors.primary}
                style={styles.modalIcon}
              />
              <Text>{selectedStation.stationAddress}</Text>
            </View>
            <View style={styles.modalContentRowContainer}>
              <Icon
                name="gas-pump"
                size={18}
                color={CUSTOM_THEME_COLOR_CONFIG.colors.primary}
                style={styles.modalIcon}
              />
              <Text>{selectedStation.totalPump} Pumps</Text>
            </View>
            {isAtFuelStation(currentLocation, selectedStation) ? (
              <Button mode="contained" style={styles.modalButton}>
                Purchase Fuel
              </Button>
            ) : (
              <Button
                style={styles.modalButton}
                mode="contained"
                onPress={() => visitFuelStation(selectedStation.coordinate)}>
                Visit Station
              </Button>
            )}
          </View>
        )}
      </AppBottomSheetModal>
    );
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
              onPress={() => setSelectedStation(fuelStation)}
              image={require('../../../assets/fuel-station-marker.png')}></MapMarker>
          ))}
        </MapView>
      )}

      {/* Recenter Button Positioned Above MapView */}
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

      {renderFuelStationInfoModal()}
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
    borderRadius: 25, // Fully rounded
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
  modalContainer: {
    padding: 18,
  },
  modalContentRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 5,
  },
  modalIcon: {
    marginRight: 5,
  },
  modalButton: {
    marginVertical: 5,
  },
});

export default FuelStationMapScreen;
