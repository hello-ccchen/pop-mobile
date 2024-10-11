import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useLocation} from '@contexts/LocationContext';
import MapView from 'react-native-maps';

const FuelStationOverviewScreen = () => {
  const {currentLocation} = useLocation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="headlineMedium" style={styles.boldText}>
          Fuel Station
        </Text>
      </View>

      {currentLocation && (
        <MapView
          provider="google"
          style={styles.mapContainer}
          showsUserLocation={true}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        />
      )}

      <View style={styles.contentContainer}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{marginHorizontal: 4}}>
            Fuel station overview screen under construction
          </Text>
          <Icon name="person-digging" size={14} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  headerContainer: {
    marginTop: 35,
    marginHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FuelStationOverviewScreen;
