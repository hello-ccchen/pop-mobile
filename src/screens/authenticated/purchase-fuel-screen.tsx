import React, {useRef, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput as NativeTextInput,
  Alert,
} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore from '@store/index';
import AppLoading from '@components/loading';

const amountList = [
  {label: 'RM 5', value: 5},
  {label: 'RM 10', value: 10},
  {label: 'RM 20', value: 20},
  {label: 'RM 40', value: 40},
  {label: 'RM 50', value: 50},
  {label: 'Others', value: 'others'},
];

type PurchaseFuelScreenProps = NativeStackScreenProps<AppStackScreenParams, 'PurchaseFuel'>;

// Helper function to generate the pump list based on total pumps
const generateFuelPumpList = (totalPump: number) =>
  Array.from({length: totalPump}, (_, i) => i + 1);

const PurchaseFuelScreen: React.FC<PurchaseFuelScreenProps> = ({route, navigation}) => {
  const {selectedStationId} = route.params;
  const fuelStations = useStore(state => state.fuelStations);
  // const userCards = useStore(state => state.userCards);

  // Validate selectedStationId and find selectedStation
  const selectedStation = selectedStationId
    ? fuelStations.find(s => s.id === selectedStationId)
    : null;

  useEffect(() => {
    if (!selectedStation) {
      Alert.alert('Station not found', 'The selected fuel station could not be found.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    }
  }, [selectedStation, navigation]);

  if (!selectedStation) {
    return <AppLoading />;
  }

  const fuelPumpList = generateFuelPumpList(selectedStation.totalPump);

  const [selectedPump, setSelectedPump] = useState<number | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | string | null>(null);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const customAmountTextInput = useRef<NativeTextInput>(null);

  const parseAmount = (amtString: string | number): number | null => {
    const parsed = parseFloat(amtString.toString());
    return !isNaN(parsed) && parsed > 0 ? parsed : null;
  };

  const handleSelectPump = (pump: number) => {
    setSelectedPump(pump);
  };

  const handleSelectAmount = (amt: number | string) => {
    setSelectedAmount(amt);

    if (amt === 'others' && customAmountTextInput.current) {
      customAmountTextInput.current.focus();
      setAmount('');
      return;
    }

    setAmount(amt.toString());
  };

  const onEnterCustomAmount = (customAmount: string) => {
    if (customAmount === '') {
      setSelectedAmount('others');
      setAmount(customAmount);
    } else {
      const parsedAmount = parseAmount(customAmount);
      if (parsedAmount !== null) {
        setAmount(customAmount);
      } else {
        Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stationContentContainer}>
        <Text variant="titleLarge" style={styles.stationHeader}>
          {selectedStation?.stationName}
        </Text>
        <Text variant="bodySmall">{selectedStation?.stationAddress}</Text>
      </View>
      <View style={styles.pumpContentContainer}>
        <Text variant="bodyMedium">Select a Pump</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pumpContentScrollContainer}
          contentContainerStyle={styles.pumpItemList}>
          {fuelPumpList.map((pump, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectPump(pump)}
              accessibilityLabel={`Pump ${pump}`}
              style={[styles.pumpItem, selectedPump === pump && styles.selectedPumpItem]}>
              <Text
                style={[styles.pumpItemText, selectedPump === pump && styles.selectedPumpItemText]}
                variant="bodyLarge">
                {pump}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.amountContentContainer}>
        <TextInput
          ref={customAmountTextInput}
          value={amount}
          onChangeText={customAmount => onEnterCustomAmount(customAmount)}
          inputMode="numeric"
          mode="outlined"
          returnKeyType="done"
          placeholder="Enter your preferred amount"
          style={styles.amoutTextInput}
        />
        <View style={styles.amountList}>
          {amountList.map((amt, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectAmount(amt.value)}
              style={[
                styles.amountButton,
                selectedAmount === amt.value && styles.selectedAmountButton,
              ]}>
              <Text
                style={[
                  styles.amountText,
                  selectedAmount === amt.value && styles.selectedAmountText,
                ]}>
                {amt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          style={styles.amountButtonContainer}
          mode="contained"
          disabled={!selectedPump || parseAmount(amount ?? '') === null}
          contentStyle={{
            opacity: !selectedPump || parseAmount(amount ?? '') === null ? 0.5 : 1,
          }}
          onPress={() => {
            const parsedAmount = parseAmount(amount ?? '');
            if (selectedPump && parsedAmount !== null) {
              navigation.navigate('Passcode', {
                nextScreen: 'FuelingScreen',
                nextScreenParams: {
                  pumpNumber: selectedPump,
                  fuelAmount: parsedAmount,
                },
              });
            }
          }}>
          Pay - RM {parseAmount(amount ?? '') === null ? '0' : amount}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
  },
  stationContentContainer: {
    justifyContent: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  stationHeader: {
    fontWeight: 'bold',
  },
  pumpContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pumpContentScrollContainer: {
    marginHorizontal: 15,
    borderRadius: 5,
  },
  pumpItemList: {
    flexDirection: 'row',
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
    borderRadius: 30,
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginBottom: 20,
  },
  pumpItem: {
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
    borderRadius: 30,
    margin: 5,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPumpItem: {
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.secondary,
    borderWidth: 3,
    borderColor: 'white',
  },
  pumpItemText: {
    padding: 10,
    textAlign: 'center',
  },
  selectedPumpItemText: {
    color: CUSTOM_THEME_COLOR_CONFIG.colors.surface,
    fontWeight: 'bold',
  },
  amountContentContainer: {
    alignContent: 'flex-start',
    marginHorizontal: 20,
  },
  amoutTextInput: {
    width: '100%',
    height: 50,
  },
  amountList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amountButtonContainer: {
    width: '90%',
  },
  amountButton: {
    backgroundColor: '#D6DEE2',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedAmountButton: {
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.secondary,
  },
  amountText: {
    fontWeight: 'bold',
  },
  selectedAmountText: {
    color: CUSTOM_THEME_COLOR_CONFIG.colors.surface,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default PurchaseFuelScreen;
