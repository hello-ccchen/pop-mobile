import React, {useCallback, useEffect} from 'react';
import {
  Alert,
  BackHandler,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {AppStackScreenParams, FuelProgressStatus} from 'src/types';

import AppLoading from '@components/Loading';
import useFuelAuthorization from '@hooks/useFuelAuthorization';
import useFuelTransactionStatus from '@hooks/useFuelTransactionStatus';
import useFuelingVoiceFeedback from '@hooks/useFuelVoiceFeedback';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {activateKeepAwake, deactivateKeepAwake} from '@sayem314/react-native-keep-awake';
import theme from '@styles/theme';
import {getFuelingStatusMessages} from '@utils/fuelingStatusMessagesHelper';

type FuelingScreenProps = NativeStackScreenProps<AppStackScreenParams, 'Fueling'>;

const FuelingScreen: React.FC<FuelingScreenProps> = ({route, navigation}) => {
  const {
    stationName,
    stationAddress,
    pumpNumber,
    pumpId,
    fuelAmount,
    paymentCardId,
    loyaltyCardId,
    passcode,
    isGas,
  } = route.params;

  const {
    transactionId,
    loading: isFetchingTransactionId,
    error: fetchTransactionIdError,
  } = useFuelAuthorization({
    cardGuid: paymentCardId,
    loyaltyGuid: loyaltyCardId || undefined,
    pumpGuid: pumpId,
    transactionAmount: fuelAmount,
    passcode,
  });

  const {status, productInfo, showPostActionBox} = useFuelTransactionStatus(transactionId);
  useFuelingVoiceFeedback(status, productInfo, isGas);

  // Unified Back Handler for Android & iOS
  const handleBackNavigation = useCallback(() => {
    const isFuelingIncomplete =
      status !== 'completed' && status !== 'error' && !fetchTransactionIdError;

    if (isFuelingIncomplete) {
      const title = isGas ? '⚠️ Fueling in Progress' : '⚠️ Charging in Progress';
      const message = isGas
        ? 'You cannot go back while fueling is in progress.'
        : 'You cannot go back while charging is in progress.';

      Alert.alert(title, message, [{text: 'OK', onPress: () => null, style: 'cancel'}]);

      return true;
    }
    navigation.navigate('Home');
    return true;
  }, [navigation, status, fetchTransactionIdError, isGas]);

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

    if (fetchTransactionIdError || status === 'error') {
      showAlert(
        'Failed to Fueling',
        'Sorry, there was a technical issue. Please proceed to the counter for assistance',
      );
    }
  }, [fetchTransactionIdError, status, navigation]);

  if (isFetchingTransactionId) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContentContainer}>
        {isGas && <SafetyNotice />}
        <StationContent
          isGas={isGas}
          stationName={stationName}
          stationAddress={stationAddress}
          pumpNumber={pumpNumber}
          fuelAmount={fuelAmount}
        />
        <ProgressIndicator status={status} productInfo={productInfo} isGas={isGas} />
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

const SafetyNotice: React.FC = () => (
  <View style={styles.safetyInfoContainer}>
    <Text variant="titleMedium" style={styles.safetyText}>
      ⚠️ Safety Notice: Please keep your phone inside your vehicle once the screen displays 'Ready
      to Fuel. Pick up the pump' for safety.
    </Text>
  </View>
);

type StationContentProps = {
  stationName: string;
  stationAddress: string;
  pumpNumber: number;
  fuelAmount: number;
  isGas: boolean;
};
const StationContent: React.FC<StationContentProps> = ({
  stationName,
  stationAddress,
  pumpNumber,
  fuelAmount,
  isGas,
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
          {`${isGas ? '⛽' : '⚡️'}`} {pumpNumber}
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
  isGas: boolean;
};
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({status, productInfo, isGas}) => (
  <View style={styles.progressContainer}>
    <Image
      source={require('../../../assets/loading.gif')}
      resizeMode="contain"
      style={styles.loadingIcon}
    />
    <Text variant="titleLarge" style={styles.progressText}>
      {getFuelingStatusMessages(isGas, productInfo)[status]}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight || 20,
  },
  topContentContainer: {
    marginTop: 20,
    marginHorizontal: Platform.OS === 'ios' ? 15 : 0,
  },
  safetyInfoContainer: {
    backgroundColor: theme.colors.secondary,
    padding: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  safetyText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stationContentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 25,
    backgroundColor: theme.colors.background,
    borderRadius: 25,
    shadowColor: theme.colors.primary,
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
    backgroundColor: theme.colors.background,
    borderRadius: 25,
    width: '45%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    elevation: 5,
  },
  amountItem: {
    backgroundColor: theme.colors.background,
    borderRadius: 25,
    width: '45%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
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

export default FuelingScreen;
