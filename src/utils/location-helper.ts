import * as turf from '@turf/turf';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform} from 'react-native';
import {FuelStation} from '@store/index';

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      // Starting from Android 6.0 (API level 23), we need to request permissions at runtime
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This app needs to access your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  if (Platform.OS === 'ios') {
    const hasPermission = await Geolocation.requestAuthorization('whenInUse');
    return hasPermission === 'granted';
  }

  // If it's neither Android nor iOS, we deny permission
  return false;
};

export const calculateFuelStationsDistances = (
  fuelStations: FuelStation[],
  latitude: number,
  longitude: number,
): FuelStation[] => {
  return fuelStations.map(station => {
    const userPoint = turf.point([longitude, latitude]);
    const stationPoint = turf.point([station.coordinate.longitude, station.coordinate.latitude]);
    const distance = turf.distance(userPoint, stationPoint, {units: 'kilometers'});
    const formattedDistance = formatFuelStationDistance(distance);
    return {...station, distance, formattedDistance};
  });
};

const formatFuelStationDistance = (distance: number): string => {
  return distance < 1 ? `${(distance * 1000).toFixed(0)}m away` : `${distance.toFixed(2)}km away`;
};
