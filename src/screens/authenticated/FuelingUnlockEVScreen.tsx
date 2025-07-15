import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, Alert, BackHandler, Image, View, StatusBar} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackScreenParams, FuelProgressStatus} from 'src/types';
import AppLoading from '@components/Loading';
import useStore from '@store/index';
import {FuelStationService} from '@services/fuelStationService';
import {logger} from '@services/logger/loggerService';
import useFuelTransactionStatus from '@hooks/useFuelTransactionStatus';
import useFuelingVoiceFeedback from '@hooks/useFuelVoiceFeedback';
import {useFocusEffect} from '@react-navigation/native';
import {activateKeepAwake, deactivateKeepAwake} from '@sayem314/react-native-keep-awake';
import {Button, Text} from 'react-native-paper';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import {getFuelingStatusMessages} from '@utils/fuelingStatusMessagesHelper';

type FuelingUnlockEVScreenProps = NativeStackScreenProps<AppStackScreenParams, 'FuelingUnlockEV'>;

const FuelingUnlockEVScreen: React.FC<FuelingUnlockEVScreenProps> = ({route, navigation}) => {
  const {station, fuelAmount, pumpNumber} = route.params;
  const [transactionId, setTransactionId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  const clearEVChargerReservation = useStore(state => state.clearEVChargerReservation);
  const evChargerReservation = useStore(state => state.evChargerReservation);
  const stationId = station.id;
  const reservation = evChargerReservation?.[stationId];

  useEffect(() => {
    const unlockCharger = async () => {
      if (!reservation || reservation.status !== 'Reserve') {
        return;
      }

      setLoading(true);
      setUnlockError(null);
      try {
        logger.debug('⚡️ Unlock EV Charger...');
        const response = await FuelStationService.unlockEVCharger(
          reservation.mobileTransactionGuid,
        );

        if (!response.mobileTransactionGuid) {
          throw new Error('Missing mobileTransactionGuid from API response');
        }

        logger.debug('✅ EV Charger Unlock Successful');
        setTransactionId(response.mobileTransactionGuid);

        clearEVChargerReservation(stationId);
      } catch (error) {
        logger.error('❌ EV Charger Unlock Failed:', error);
        setUnlockError('Failed to unlock ev charger. Please try again.');
        Alert.alert('❌ Unlock Failed', 'Could not unlock the EV charger. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    unlockCharger();
  }, [clearEVChargerReservation, reservation, stationId]);

  const {status, productInfo, showPostActionBox} = useFuelTransactionStatus(transactionId);
  useFuelingVoiceFeedback(status, productInfo, false);

  // Unified Back Handler for Android & iOS
  const handleBackNavigation = useCallback(() => {
    if (status !== 'completed' && status !== 'error') {
      Alert.alert('⚠️ Charging in Progress', 'You cannot go back while charging is in progress.', [
        {text: 'OK', onPress: () => null, style: 'cancel'},
      ]);
      return true;
    }
    navigation.navigate('Home');
    return true;
  }, [navigation, status]);

  // Handle Android Back Button
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackNavigation);
      return () => BackHandler.removeEventListener('hardwareBackPress', handleBackNavigation);
    }, [handleBackNavigation]),
  );

  // Handle iOS Swipe Back
  useEffect(() => {
    const beforeRemoveListener = (event: any) => {
      if (status !== 'completed') {
        event.preventDefault();
        handleBackNavigation();
      }
    };

    navigation.addListener('beforeRemove', beforeRemoveListener);
    return () => navigation.removeListener('beforeRemove', beforeRemoveListener);
  }, [navigation, handleBackNavigation, status]);

  // Ensure Swipe Gesture is Always Enabled
  useEffect(() => {
    navigation.setOptions({gestureEnabled: true});
  }, [navigation]);

  // Keep Screen Awake During Fueling
  useEffect(() => {
    if (status !== 'completed' && status !== 'error') {
      activateKeepAwake(); // Prevents screen from turning off
    } else {
      deactivateKeepAwake(); // Allow normal behavior
    }
  }, [status]);

  // Show Alert on Error
  useEffect(() => {
    const showAlert = (title: string, message: string) => {
      Alert.alert(title, message, [{text: 'OK', onPress: () => navigation.goBack()}]);
    };

    if (unlockError || status === 'error') {
      showAlert(
        'Failed to Unlock EV Charger',
        'Sorry, there was a technical issue. Please proceed to the counter for assistance',
      );
    }
  }, [unlockError, status, navigation]);

  if (loading) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContentContainer}>
        <StationContent
          stationName={station.stationName}
          stationAddress={station.stationAddress}
          pumpNumber={pumpNumber}
          fuelAmount={fuelAmount}
        />
        <ProgressIndicator status={status} productInfo={productInfo} />
      </View>

      {showPostActionBox && (
        <View style={styles.bottomActionContainer}>
          <Button
            mode="outlined"
            style={styles.actionButton}
            onPress={() => navigation.navigate('Home')}>
            Go Home
          </Button>
          <Button
            mode="contained"
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate('TransactionDetails', {transactionId: transactionId})
            }>
            View Receipt
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

type StationContentProps = {
  stationName: string;
  stationAddress: string;
  pumpNumber: number;
  fuelAmount: number;
};
const StationContent: React.FC<StationContentProps> = ({
  stationName,
  stationAddress,
  pumpNumber,
  fuelAmount,
}) => (
  <View style={styles.stationContentContainer}>
    <View style={styles.stationInfoContainer}>
      <Text variant="titleLarge" style={styles.stationHeader}>
        {stationName}
      </Text>
      <Text variant="bodySmall">{stationAddress}</Text>
    </View>

    <View style={styles.fuelInfoContainer}>
      <View style={styles.pumpItem}>
        <Text variant="titleMedium" style={styles.fuelInfoText}>
          {`⚡️ ${pumpNumber}`}
        </Text>
      </View>
      <View style={styles.amountItem}>
        <Text variant="titleMedium" style={styles.fuelInfoText}>
          💰 RM {fuelAmount}
        </Text>
      </View>
    </View>
  </View>
);

type ProgressIndicatorProps = {
  status: FuelProgressStatus;
  productInfo: string | null;
};
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({status, productInfo}) => (
  <View style={styles.progressContainer}>
    <Image
      source={require('../../../assets/loading.gif')}
      resizeMode="contain"
      style={styles.loadingIcon}
    />
    <Text variant="titleLarge" style={styles.progressText}>
      {getFuelingStatusMessages(false, productInfo)[status]}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight || 20,
  },
  topContentContainer: {
    marginTop: 20,
  },
  stationContentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 25,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
    borderRadius: 25,
    shadowColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    elevation: 5,
  },
  stationInfoContainer: {
    marginHorizontal: 15,
  },
  stationHeader: {
    fontWeight: 'bold',
  },
  fuelInfoContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pumpItem: {
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
    borderRadius: 25,
    width: '45%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    elevation: 5,
  },
  amountItem: {
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
    borderRadius: 25,
    width: '45%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    elevation: 5,
  },
  fuelInfoText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  progressText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingIcon: {
    width: 100,
    height: 100,
  },
  bottomActionContainer: {
    position: 'absolute',
    bottom: 20,
    left: '5%',
    right: '5%',
    flexDirection: 'column',
  },
  actionButton: {
    flex: 1,
    marginVertical: 10,
  },
});
export default FuelingUnlockEVScreen;
