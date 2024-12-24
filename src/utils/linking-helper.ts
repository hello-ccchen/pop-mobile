import {logger} from '@services/logger/logger-service';
import {Alert, Linking, Platform} from 'react-native';
import {LatLng} from 'react-native-maps';

// Function to open Waze or Google Maps for navigation
const openExternalNavigationApp = (app: 'waze' | 'google', latitude: number, longitude: number) => {
  const urls = {
    waze: `waze://?ll=${latitude},${longitude}&navigate=yes`,
    google: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`,
  };

  const url = urls[app];
  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Choose an app to navigate', `${app} is not installed`);
      }
    })
    .catch(err => logger.error('Error opening app:', err));
};

// Function to prompt user to choose a navigation app (Waze or Google Maps) for a fuel station
export const showVisitFuelStationAlert = (coordinate?: LatLng) => {
  if (!coordinate) {
    return;
  }

  Alert.alert(
    'Choose an app to navigate',
    undefined,
    [
      {
        text: 'Waze',
        onPress: () => openExternalNavigationApp('waze', coordinate.latitude, coordinate.longitude),
      },
      {
        text: 'Google Maps',
        onPress: () =>
          openExternalNavigationApp('google', coordinate.latitude, coordinate.longitude),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
    {cancelable: true},
  );
};

// Function to open app settings on both iOS and Android
const openLocationServicesSettings = () => {
  if (Platform.OS === 'ios') {
    // iOS will open the general app settings
    Linking.openURL('app-settings:').catch(() => {
      Alert.alert('Unable to open settings');
    });
  } else if (Platform.OS === 'android') {
    // Android will open the location services settings
    Linking.openURL('android.settings.LOCATION_SOURCE_SETTINGS').catch(() => {
      Alert.alert('Unable to open settings');
    });
  }
};

// Function to prompt user to open location service setting
export const showLocationServicesAlert = () => {
  Alert.alert(
    'Location Services Disabled',
    'Please enable location services to use POP mobile.',
    [
      {
        text: 'Go to Settings',
        onPress: openLocationServicesSettings,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
    {cancelable: true},
  );
};
