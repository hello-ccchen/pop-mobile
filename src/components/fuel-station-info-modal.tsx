import React from 'react';
import {Alert, Linking, StyleSheet, View, Image} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {LatLng} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import {FuelStation} from '@store/index';
import AppBottomSheetModal from '@components/bottom-sheet-modal';

interface FuelStationInfoModalProps {
  selectedStation: FuelStation | null;
  currentLocation: LatLng | undefined;
  isVisible: boolean;
  onDismiss: () => void;
  onNavigate: () => void;
}

const FuelStationInfoModal: React.FC<FuelStationInfoModalProps> = ({
  selectedStation,
  currentLocation,
  isVisible,
  onDismiss,
  onNavigate,
}) => {
  const fuelStationLogos: Record<string, any> = {
    Caltex: require('../../assets/caltex-logo.png'),
    Petron: require('../../assets/petron-logo.png'),
    Petronas: require('../../assets/petronas-logo.png'),
    Shell: require('../../assets/shell-logo.png'),
    default: require('../../assets/fuel-station-marker.png'),
  };

  const isAtFuelStation = (
    currentLocation: LatLng | undefined,
    selectedStation: FuelStation | null,
  ) => {
    if (!currentLocation || !selectedStation) return false;
    return (
      currentLocation.latitude === selectedStation?.coordinate.latitude &&
      currentLocation.longitude === selectedStation?.coordinate.longitude
    );
  };

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
            openExternalNavigationApp('waze', coordinate.latitude, coordinate.longitude),
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

  const getFuelStationLogo = (fuelStationName: string) => {
    return fuelStationLogos[fuelStationName] || fuelStationLogos['default'];
  };

  return (
    <AppBottomSheetModal isVisible={isVisible} snapPoints={['30%']} onDismiss={onDismiss}>
      {selectedStation && (
        <View style={styles.modalContainer}>
          <View style={styles.modalTitleContentRow}>
            <Image
              source={getFuelStationLogo(selectedStation.stationName)}
              resizeMode="center"
              style={styles.modalTitleLogo}
            />
            <Text variant="titleLarge" style={styles.modalTitle}>
              {selectedStation.stationName}
            </Text>
          </View>

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
            <Button mode="contained" style={styles.modalButton} onPress={onNavigate}>
              Purchase Fuel
            </Button>
          ) : (
            <Button
              mode="contained"
              style={styles.modalButton}
              onPress={() => visitFuelStation(selectedStation.coordinate)}>
              Visit Station
            </Button>
          )}
        </View>
      )}
    </AppBottomSheetModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 15,
  },
  modalTitleContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  modalTitle: {
    marginHorizontal: 5,
    fontWeight: 'bold',
  },
  modalTitleLogo: {
    width: 35,
    height: 35,
  },
  modalContentRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 10,
    paddingHorizontal: 5,
  },
  modalIcon: {
    marginRight: 5,
  },
  modalButton: {
    marginVertical: 5,
  },
});

export default FuelStationInfoModal;
