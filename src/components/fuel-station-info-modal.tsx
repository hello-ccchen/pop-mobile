import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import {FuelStation} from '@store/index';
import AppBottomSheetModal from '@components/bottom-sheet-modal';
import {showVisitFuelStationAlert} from '@utils/linking-helper';

interface FuelStationInfoModalProps {
  selectedStation: FuelStation | null;
  fuelStationDistance: string;
  nearestFuelStation: FuelStation | undefined;
  isVisible: boolean;
  backdropColor?: string;
  onDismiss: () => void;
  onNavigate: () => void;
  onSelectNextFuelStation?: () => void;
}

const FuelStationInfoModal: React.FC<FuelStationInfoModalProps> = ({
  selectedStation,
  fuelStationDistance,
  nearestFuelStation,
  isVisible,
  backdropColor,
  onDismiss,
  onNavigate,
  onSelectNextFuelStation,
}) => {
  const fuelStationLogos: Record<string, any> = {
    default: require('../../assets/petrol.png'),
  };

  if (!selectedStation) {
    return null;
  }

  return (
    <AppBottomSheetModal
      isVisible={isVisible}
      snapPoints={['30%']}
      onDismiss={onDismiss}
      backdropColor={backdropColor}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <View style={styles.modalTitleContentRow}>
            <Image
              source={fuelStationLogos.default}
              resizeMode="center"
              style={styles.modalTitleLogo}
            />
            <Text variant="titleLarge" style={styles.modalTitle}>
              {selectedStation.stationName}
            </Text>
          </View>
          {onSelectNextFuelStation && (
            <IconButton icon="chevron-right" size={30} onPress={onSelectNextFuelStation} />
          )}
        </View>

        <View style={styles.modalContentRowContainer}>
          <Icon
            name="road"
            size={14}
            color={CUSTOM_THEME_COLOR_CONFIG.colors.primary}
            style={styles.modalIcon}
          />
          <Text>{fuelStationDistance}</Text>
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

        {nearestFuelStation && selectedStation.id === nearestFuelStation.id ? (
          <Button mode="contained" style={styles.modalButton} onPress={onNavigate}>
            Purchase Fuel
          </Button>
        ) : (
          <Button
            mode="contained"
            style={styles.modalButton}
            onPress={() => showVisitFuelStationAlert(selectedStation.coordinate)}>
            Visit Station
          </Button>
        )}
      </View>
    </AppBottomSheetModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitleContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
