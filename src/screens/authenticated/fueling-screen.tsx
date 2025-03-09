import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, SafeAreaView, Alert, BackHandler, Image, StatusBar} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import {FuelStationService} from '@services/fuel-station-service';

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
  } = route.params;
  const [status, setStatus] = useState<
    'processing' | 'connecting' | 'ready' | 'fueling' | 'completed' | 'error'
  >('processing');
  const [showPostActionBox, setShowPostActionBox] = useState(false);
  const [transactionId, setTransactionId] = useState<string | undefined>();

  // **Unified Back Handler for Android & iOS**
  const handleBackNavigation = useCallback(() => {
    if (status !== 'completed' && status !== 'error') {
      Alert.alert('⛽ Fueling in Progress', 'You cannot go back while fueling is in progress.', [
        {text: 'OK', onPress: () => null, style: 'cancel'},
      ]);
      return true;
    }
    navigation.navigate('Home');
    return true;
  }, [navigation, status]);

  // **Handle Android Back Button**
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackNavigation);
      return () => BackHandler.removeEventListener('hardwareBackPress', handleBackNavigation);
    }, [handleBackNavigation]),
  );

  // **Handle iOS Swipe Back**
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

  // **Ensure Swipe Gesture is Always Enabled**
  useEffect(() => {
    navigation.setOptions({gestureEnabled: true});
  }, [navigation]);

  useEffect(() => {
    const authorizePump = async () => {
      try {
        console.log('⛽ Authorizing Fuel Pump');
        const response = await FuelStationService.fuelPumpAuthorization({
          cardGuid: paymentCardId,
          loyaltyGuid: loyaltyCardId || undefined,
          pumpGuid: pumpId,
          transactionAmount: fuelAmount,
          passcode,
        });
        // Ensure mobileTransactionGuid is returned from API
        if (!response.mobileTransactionGuid) {
          throw new Error('Missing mobileTransactionGuid from API response');
        }
        setTransactionId(response.mobileTransactionGuid);
        console.log('✅ Fuel Pump Authorization Successful');

        setStatus('connecting');

        // TODO: Connect to signal-R (next step)
        setShowPostActionBox(true);
      } catch (error: unknown) {
        setStatus('error');
        console.error('❌ Fuel Pump Authorization Failed:', error);

        let errorMessage = 'Failed to authorize fuel pump. Please try again.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }

        Alert.alert('Failed to Fueling', errorMessage, [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      }
    };

    authorizePump();
  }, [navigation, paymentCardId, loyaltyCardId, pumpId, fuelAmount, passcode]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContentContainer}>
        <View style={styles.safetyInfoContainer}>
          <Text variant="titleMedium" style={styles.safetyText}>
            ⚠️ Safety Notice: Please keep your phone inside your vehicle once the screen displays
            'Ready to Fuel. Pick up the pump' for safety.
          </Text>
        </View>

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
                ⛽ {pumpNumber}
              </Text>
            </View>
            <View style={styles.amountItem}>
              <Text variant="titleMedium" style={styles.fuelInfoText}>
                💰 RM {fuelAmount}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Image
            source={require('../../../assets/loading.gif')}
            resizeMode="contain"
            style={styles.loadingIcon}
          />
          <Text variant="titleLarge" style={styles.progressText}>
            {
              {
                processing: 'Processing Payment...',
                connecting: 'Connecting to Pump...',
                ready: 'Ready to Fuel. Pick up the pump!',
                fueling: 'Fueling in Progress...',
                completed: 'Fueling Completed!',
                error: 'Failed to Fueling, Please try again.',
              }[status]
            }
          </Text>
        </View>
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
  safetyInfoContainer: {
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.secondary,
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

export default FuelingScreen;
