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
import {Button, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MapView, {LatLng, Marker as MapMarker} from 'react-native-maps';
import {useLocation} from '@contexts/LocationContext';
import CustomTheme from '@styles/custom-theme';
import AppBottomSheetModal from '@components/AppBottomSheetModal';

type FuelStation = {
  coordinate: LatLng;
  stationName: string;
  stationAddress: string;
  totalPump: number;
};

const mockFuelStationList: FuelStation[] = [
  {
    coordinate: {
      latitude: 3.1984372304234716,
      longitude: 101.71495368473684,
    },
    stationAddress: '30, Jalan Genting Kelang, Taman Danau Kota, 53300 Kuala Lumpur',
    stationName: 'Shell',
    totalPump: 8,
  },
  {
    coordinate: {
      latitude: 3.198128883101675,
      longitude: 101.71566984959985,
    },
    stationAddress:
      'Jalan Genting Kelang, Kawasan Perusahaan Pkns, 53300 Kuala Lumpur',
    stationName: 'Petron',
    totalPump: 9,
  },
  {
    coordinate: {
      latitude: 3.199863625015403,
      longitude: 101.70387524960586,
    },
    stationAddress: 'Kampung Kuantan, 53000 Kuala Lumpur',
    stationName: 'Petronas',
    totalPump: 6,
  },
];

const FuelStationMapScreen = () => {
  const {currentLocation, requestLocation} = useLocation();
  const mapRef = useRef<MapView | null>(null);
  const [selectedStation, setSelectedStation] = useState<FuelStation | null>(null);
  const fuelStationList: FuelStation[] = [
    ...mockFuelStationList,
    {
      ...mockFuelStationList[0],
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
          <View style={{padding: 20}}>
            <Text variant="titleLarge">{selectedStation.stationName}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <Icon
                name="location-dot"
                size={18}
                color={CustomTheme.colors.primary}
                style={{marginHorizontal: 5}}
              />
              <Text>{selectedStation.stationAddress}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <Icon
                name="gas-pump"
                size={18}
                color={CustomTheme.colors.primary}
                style={{marginHorizontal: 5}}
              />
              <Text>{selectedStation.totalPump} Pumps</Text>
            </View>
            {isAtFuelStation(currentLocation, selectedStation) ? (
              <Button mode="contained" style={{marginVertical: 5}}>
                Purchase Fuel
              </Button>
            ) : (
              <Button
                style={{marginVertical: 5}}
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
          {fuelStationList.map(fuelStation => (
            <MapMarker
              coordinate={fuelStation.coordinate}
              onPress={() => setSelectedStation(fuelStation)}
            />
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
            color={CustomTheme.colors.primary}
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
    padding: 20,
  },
  modalContentRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  modalIcon: {
    marginHorizontal: 5,
  },
  modalButton: {
    marginVertical: 5,
  },
});

export default FuelStationMapScreen;
