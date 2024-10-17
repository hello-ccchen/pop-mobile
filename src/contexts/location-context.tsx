import React, {createContext, useState, useEffect, ReactNode, useContext} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation, {GeoCoordinates} from 'react-native-geolocation-service';

type LocationContextType = {
  currentLocation: GeoCoordinates | undefined;
  requestLocation: () => Promise<void>;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [currentLocation, setCurrentLocation] = useState<GeoCoordinates>();

  // Starting from Android 6.0 (API level 23), we need to request permissions at runtime
  const requestLocationPermissionForAndroid = async () => {
    try {
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
  };

  const requestLocation = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await requestLocationPermissionForAndroid();
      if (!hasPermission) return;
    }

    if (Platform.OS === 'ios') {
      const hasPermission = await Geolocation.requestAuthorization('whenInUse');
      if (!hasPermission) return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setCurrentLocation(position.coords);
      },
      error => {
        console.log(error.code, error.message);
        setCurrentLocation(undefined);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <LocationContext.Provider value={{currentLocation, requestLocation}}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within an LocationProvider');
  }
  return context;
};
