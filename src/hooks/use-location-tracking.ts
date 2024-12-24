import {useCallback, useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {calculateFuelStationsDistances, requestLocationPermission} from '@utils/location-helper';
import {logger} from '@services/logger-service';
import useStore from '@store/index';

const useLocationTracking = () => {
  const PROXIMITY_THRESHOLD = 0.02; // 20 meters
  const setCurrentLocation = useStore(state => state.setCurrentLocation);
  const setFuelStations = useStore(state => state.setFuelStations);
  const setNearestFuelStation = useStore(state => state.setNearestFuelStation);
  const fuelStations = useStore(state => state.fuelStations);
  const appState = useRef(AppState.currentState);

  const fetchCurrentLocation = useCallback(async () => {
    if (!fuelStations || fuelStations.length === 0) {
      logger.warn('No fuel stations available for distance calculation.');
      return;
    }

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setCurrentLocation(undefined);
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation(position.coords); // Update location state
        logger.debug('Fetched current user location', {latitude, longitude});

        // Calculate distances between current location and fuel stations
        const calculatedDistances = calculateFuelStationsDistances(
          fuelStations,
          latitude,
          longitude,
        );

        // Sort stations by distance and update the sorted list
        const sortedStations = calculatedDistances.sort((a, b) => a.distance - b.distance);
        setFuelStations(sortedStations);

        // Check if the user is within 20 meters of any station
        const nearestStation = sortedStations.find(
          station => station.distance <= PROXIMITY_THRESHOLD,
        );

        if (nearestStation) {
          const nearestFuelStation = sortedStations.find(s => s.id === nearestStation.id);
          logger.info(`User is at ${nearestFuelStation?.stationName}.`);
          setNearestFuelStation(nearestFuelStation); // Set nearest fuel station
        } else {
          setNearestFuelStation(undefined); // No nearby fuel station
        }
      },
      error => {
        logger.error('Location error:', error);
        if (error.code === 1) {
          logger.error('Location permission denied.');
        } else if (error.code === 3) {
          logger.error('Location request timed out.');
        }
        setCurrentLocation(undefined); // Reset current location on error
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, [fuelStations, setCurrentLocation, setFuelStations, setNearestFuelStation]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        fetchCurrentLocation();
      }
      appState.current = nextAppState;
    },
    [fetchCurrentLocation],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange]);

  return {fetchCurrentLocation};
};

export default useLocationTracking;
