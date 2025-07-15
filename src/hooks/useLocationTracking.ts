import {useCallback, useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {calculateFuelStationsDistances, isLocationPermissionGranted} from '@utils/location-helper';
import {logger} from '@services/logger/logger-service';
import useStore from '@store/index';

const useLocationTracking = () => {
  const PROXIMITY_THRESHOLD = 0.2; // 200 meters

  const setCurrentLocation = useStore(state => state.setCurrentLocation);
  const setGasStations = useStore(state => state.setGasStations);
  const setEVChargingStations = useStore(state => state.setEVChargingStations);
  const setNearestFuelStation = useStore(state => state.setNearestFuelStation);

  const gasStations = useStore(state => state.gasStations);
  const evChargingStations = useStore(state => state.evChargingStations);

  const appState = useRef(AppState.currentState);

  const checkAndSetPermission = useCallback(async () => {
    const granted = await isLocationPermissionGranted();
    return granted;
  }, []);

  const fetchCurrentLocation = useCallback(async () => {
    const granted = await checkAndSetPermission();
    if (!granted) {
      setCurrentLocation(undefined);
      return;
    }

    if (
      (!gasStations || gasStations.length === 0) &&
      (!evChargingStations || evChargingStations.length === 0)
    ) {
      logger.warn('No fuel stations available for distance calculation.');
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation(position.coords); // Update location state
        logger.debug('Fetched current user location', {latitude, longitude});

        // Process gas stations
        if (gasStations && gasStations.length > 0) {
          const sortedGasStations = calculateFuelStationsDistances(
            gasStations,
            latitude,
            longitude,
          ).sort((a, b) => a.distance - b.distance);
          setGasStations(sortedGasStations);

          const nearestGas = sortedGasStations.find(
            station => station.distance <= PROXIMITY_THRESHOLD,
          );
          if (nearestGas) {
            const nearestFuelStation = sortedGasStations.find(s => s.id === nearestGas.id);
            logger.debug(`User is at Gas Station: ${nearestFuelStation?.stationName}`);
            setNearestFuelStation('gas', nearestFuelStation);
          } else {
            setNearestFuelStation('gas', undefined);
          }
        }

        // Process EV charging stations
        if (evChargingStations && evChargingStations.length > 0) {
          const sortedEVStations = calculateFuelStationsDistances(
            evChargingStations,
            latitude,
            longitude,
          ).sort((a, b) => a.distance - b.distance);
          setEVChargingStations(sortedEVStations);

          const nearestEV = sortedEVStations.find(
            station => station.distance <= PROXIMITY_THRESHOLD,
          );
          if (nearestEV) {
            const nearestEVStation = sortedEVStations.find(s => s.id === nearestEV.id);
            logger.debug(`User is at EV Charging Station: ${nearestEVStation?.stationName}`);
            setNearestFuelStation('ev', nearestEVStation);
          } else {
            setNearestFuelStation('ev', undefined);
          }
        }
      },
      error => {
        logger.error('Location error:', error);
        if (error.code === 1) {
          logger.error('Location permission denied.');
        } else if (error.code === 2) {
          logger.error('Location services disabled.');
        } else if (error.code === 3) {
          logger.error('Location request timed out.');
        }
        setCurrentLocation(undefined);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, [
    checkAndSetPermission,
    gasStations,
    evChargingStations,
    setCurrentLocation,
    setGasStations,
    setEVChargingStations,
    setNearestFuelStation,
  ]);

  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        const granted = await checkAndSetPermission();
        if (granted) {
          fetchCurrentLocation();
        }
      }
      appState.current = nextAppState;
    },
    [fetchCurrentLocation, checkAndSetPermission],
  );

  useEffect(() => {
    checkAndSetPermission(); // Initial check on mount
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange, checkAndSetPermission]);

  return {fetchCurrentLocation};
};

export default useLocationTracking;
