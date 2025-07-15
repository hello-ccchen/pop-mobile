import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Alert, StyleSheet} from 'react-native';
import {Text, Card, Button} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import {FuelStationService} from '@services/fuelStationService';
import {logger} from '@services/logger/loggerService';
import AppLoading from '@components/Loading';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore from '@store/index';

type ReserveEVChargerCallbackProps = NativeStackScreenProps<
  AppStackScreenParams,
  'ReserveEVChargerCallback'
>;

const ReserveEVChargerCallbackScreen: React.FC<ReserveEVChargerCallbackProps> = ({
  route,
  navigation,
}) => {
  const {stationId, pumpId, pumpNumber, fuelAmount, paymentCardId, loyaltyCardId, passcode} =
    route.params;
  const [loading, setLoading] = useState(true);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const setEVChargerReservation = useStore(state => state.setEVChargerReservation);

  useEffect(() => {
    const reserveEVCharger = async () => {
      try {
        logger.debug('🚀 Sending EV Charger Reservation Request...');
        const response = await FuelStationService.reserveEVChager({
          cardGuid: paymentCardId,
          loyaltyGuid: loyaltyCardId || undefined,
          pumpGuid: pumpId,
          transactionAmount: fuelAmount,
          passcode,
        });

        logger.debug('✅ Reservation Successful:', response);
        setTransactionId(response?.mobileTransactionGuid);

        // Store reservation details in Zustand
        setEVChargerReservation(stationId, {...response, pumpNumber});
      } catch (error) {
        logger.error('❌ Reservation Failed:', error);
        Alert.alert(
          '❌ Reservation Failed',
          'Sorry, we unable to reserve EV Charger for you at this moment.',
          [{text: 'OK', onPress: () => navigation.goBack()}],
        );
      } finally {
        setLoading(false);
      }
    };

    reserveEVCharger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.header}>✅ Reservation Confirmed!</Text>
            <Text style={styles.message}>
              Your EV charger has been reserved successfully. You can view the receipt for more
              details.
            </Text>

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Home')}
                style={{marginBottom: 10}}>
                Go Home
              </Button>
              {transactionId && (
                <Button
                  mode="contained"
                  onPress={() =>
                    navigation.navigate('TransactionDetails', {
                      transactionId,
                    })
                  }>
                  View Receipt
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
  },
  cardContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default ReserveEVChargerCallbackScreen;
