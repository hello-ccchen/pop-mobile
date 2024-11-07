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

  const parseAmount = (amount: string | number): number | null => {
    const parsed = parseFloat(amount.toString());
    return !isNaN(parsed) && parsed > 0 ? parsed : null;
  };

  const handleSelectPump = (pump: number) => {
    setSelectedPump(pump);
  };

  const handleSelectAmount = (amount: number | string) => {
    setSelectedAmount(amount);

    if (amount === 'others' && customAmountTextInput.current) {
      customAmountTextInput.current.focus();
      setAmount('');
      return;
    }

    setAmount(amount.toString());
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
        <Text variant="titleLarge" style={{fontWeight: '600'}}>
          {selectedStation?.stationName}
        </Text>
        <Text variant="bodySmall">{selectedStation?.stationAddress}</Text>
      </View>
      <View style={styles.pumpContentContainer}>
        <Text variant="bodyMedium">Select a Pump</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{marginHorizontal: 15}}
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
          style={{width: '100%', height: 50}}
        />
        <View style={styles.amountList}>
          {amountList.map((amount, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectAmount(amount.value)}
              style={[
                styles.amountButton,
                selectedAmount === amount.value && styles.selectedAmountButton,
              ]}>
              <Text
                style={[
                  styles.amountText,
                  selectedAmount === amount.value && styles.selectedAmountText,
                ]}>
                {amount.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          style={{width: '90%'}}
          mode="contained"
          disabled={!selectedPump || parseAmount(amount ?? '') === null}
          contentStyle={{
            opacity: !selectedPump || parseAmount(amount ?? '') === null ? 0.5 : 1,
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
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  pumpContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  amountList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
