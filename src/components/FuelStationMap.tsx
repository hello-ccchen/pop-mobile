import React, {useCallback, useMemo, useRef} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {GeoCoordinates} from 'react-native-geolocation-service';
import MapView, {Marker as MapMarker} from 'react-native-maps';
import {Button, Card, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {FuelStation} from 'src/types';

import theme from '@styles/theme';
import {showVisitFuelStationAlert} from '@utils/linkingHelper';

const {width} = Dimensions.get('window');
const MAP_REGION_DELTA = {latitudeDelta: 0.15, longitudeDelta: 0.15};

interface FuelStationMapProps {
  stations: FuelStation[];
  nearestFuelStation: FuelStation | undefined;
  currentLocation: GeoCoordinates | undefined;
  onNavigate: (station: FuelStation | null) => void;
}

const FuelStationMap: React.FC<FuelStationMapProps> = ({
  stations,
  nearestFuelStation,
  currentLocation,
  onNavigate,
}) => {
  const mapRef = useRef<MapView | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const animateToRegion = useCallback((latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        ...MAP_REGION_DELTA,
      });
    }
  }, []);

  const handleStationSelect = useCallback(
    (index: number) => {
      const station = stations[index];
      if (station) {
        animateToRegion(station.coordinate.latitude, station.coordinate.longitude);
        flatListRef.current?.scrollToIndex({index, animated: true});
      }
    },
    [stations, animateToRegion],
  );

  const renderMarkers = useMemo(() => {
    return stations.map((fuelStation, index) => {
      const stationIcon =
        fuelStation.pumpTypeCode === 'GAS'
          ? require('../../assets/gas-station-marker.png')
          : require('../../assets/ev-station-marker.png');

      return (
        <MapMarker
          key={fuelStation.id}
          coordinate={fuelStation.coordinate}
          onPress={() => handleStationSelect(index)}>
          <Image resizeMode="center" source={stationIcon} style={styles.markerIcon} />
        </MapMarker>
      );
    });
  }, [stations, handleStationSelect]);

  const renderItem = useCallback(
    ({item, index}: {item: FuelStation; index: number}) => {
      const isNearest = item.id === nearestFuelStation?.id;

      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleStationSelect(index)}
          style={styles.cardWrapper}>
          <Card style={styles.card}>
            <Card.Title
              title={item.stationName}
              titleVariant="titleMedium"
              subtitle={item.stationAddress}
              subtitleNumberOfLines={3}
              subtitleVariant="bodySmall"
            />
            <Card.Content style={styles.cardContent}>
              <Text variant="bodySmall">{item.formattedDistance || 'N/A'}</Text>
              <Text variant="bodySmall">{`${item.totalPump} ${
                item.pumpTypeCode === 'ELE' ? 'EV Charger' : 'Pumps'
              }`}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                style={styles.carButton}
                onPress={() =>
                  isNearest ? onNavigate(item) : showVisitFuelStationAlert(item.coordinate)
                }>
                {isNearest
                  ? item.pumpTypeCode === 'GAS'
                    ? 'Purchase Fuel'
                    : 'Charge EV'
                  : 'Visit Station'}
              </Button>
            </Card.Actions>
          </Card>
        </TouchableOpacity>
      );
    },
    [nearestFuelStation, handleStationSelect, onNavigate],
  );

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
          ...MAP_REGION_DELTA,
        }}>
        {renderMarkers}
      </MapView>

      {currentLocation && (
        <TouchableOpacity
          style={styles.recenterButton}
          onPress={() => animateToRegion(currentLocation.latitude, currentLocation.longitude)}
          activeOpacity={0.7}>
          <Icon name="location-crosshairs" size={18} color={theme.colors.primary} />
        </TouchableOpacity>
      )}

      {/* Horizontal Scrollable Fuel Stations List */}
      <View style={styles.fuelStationListContainer}>
        <FlatList
          ref={flatListRef}
          data={stations}
          horizontal
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollListContentContainer}
          pagingEnabled
          snapToAlignment="center"
          onMomentumScrollEnd={event => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            handleStationSelect(index);
          }}
          renderItem={renderItem}
        />
      </View>
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
  fuelStationListContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  scrollListContentContainer: {
    paddingHorizontal: 16,
    paddingRight: 32,
  },
  cardWrapper: {
    width: width * 0.8,
    marginHorizontal: 10,
  },
  card: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 10,
  },
  carButton: {
    width: '100%',
  },
});

export default FuelStationMap;
