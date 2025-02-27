import React, {useState, useEffect} from 'react';
import {View, StyleSheet, SafeAreaView, Alert, BackHandler, Image} from 'react-native';
import {Text} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import {fuelPaymentService} from '@services/fuel-payment-service';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';

type FuelingScreenProps = NativeStackScreenProps<AppStackScreenParams, 'FuelingScreen'>;

const FuelingScreen: React.FC<FuelingScreenProps> = ({route, navigation}) => {
  const {pumpNumber, fuelAmount} = route.params;
  const [isFueling, setIsFueling] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert('⛽ Fueling in Progress', 'You cannot go back while fueling is in progress.', [
          {text: 'OK', onPress: () => null, style: 'cancel'},
        ]);
        return true; // Prevent back action
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(() => {
    fuelPaymentService.connect('12345', message => {
      if (message.type === 'fuelComplete') {
        setIsFueling(false);
        Alert.alert('⛽ Fueling Complete!', 'Your fueling is done. Click OK to return home.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]);
      }
    });

    return () => fuelPaymentService.disconnect();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.pumpItem}>
          <Text variant="titleMedium" style={styles.infoText}>
            ⛽ {pumpNumber}
          </Text>
        </View>
        <View style={styles.amountItem}>
          <Text variant="titleMedium" style={styles.infoText}>
            💰 RM {fuelAmount}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Image
          source={require('../../../assets/loading.gif')}
          resizeMode="contain"
          style={styles.loadingIcon}
        />
        <Text variant="titleLarge" style={styles.progressText}>
          {isFueling ? 'Fueling in progress ...' : 'Fueling Complete !'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
    paddingHorizontal: 20,
  },
  infoContainer: {
    position: 'absolute',
    top: 65,
    left: 35,
    right: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pumpItem: {
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
    borderRadius: 25,
    width: 150,
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
    width: 150,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    elevation: 5,
  },
  infoText: {
    fontWeight: 'bold',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressText: {
    fontWeight: 'bold',
  },
  loadingIcon: {
    width: 100,
    height: 100,
  },
});

export default FuelingScreen;
