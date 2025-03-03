import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  StatusBar,
  TouchableOpacity,
  TextInput as NativeTextInput,
} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore, {UserCard} from '@store/index';
import AppLoading from '@components/loading';
import Card from '@components/card';
import Icon from 'react-native-vector-icons/FontAwesome6';
import AppBottomSheetModal from '@components/bottom-sheet-modal';

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
  const userCards = useStore(state => state.userCards);

  const [selectedPump, setSelectedPump] = useState<number | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | string | null>(null);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const customAmountTextInput = useRef<NativeTextInput>(null);
  const [selectedPaymentCard, setSelectedPaymentCard] = useState<{
    cardId: string;
    cardNumber: string;
  } | null>(null);
  const [selectedLoyaltyCard, setSelectedLoyaltyCard] = useState<{
    cardId: string;
    cardNumber: string;
  } | null>(null);
  const [isPumpSheetVisible, setPumpSheetVisible] = useState(false);
  const [isAmountSheetVisible, setAmountSheetVisible] = useState(false);
  const [isPaymentCardSheetVisible, setPaymentCardSheetVisible] = useState(false);
  const [isLoyaltyCardSheetVisible, setLoyaltyCardSheetVisible] = useState(false);

  // Validate selectedStationId and find selectedStation
  const selectedStation = selectedStationId
    ? fuelStations.find(s => s.id === selectedStationId)
    : null;

  const bankCards = userCards.filter(card => !card.merchantGuid);

  const loyaltyCards = userCards.filter(
    card => card.merchantGuid === selectedStation?.merchantGuid && card.cardScheme === 'Loyalty',
  );

  useEffect(() => {
    if (!selectedStation) {
      Alert.alert('Station not found', 'The selected fuel station could not be found.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    }
  }, [selectedStation, navigation]);

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

  const handleSelectPaymentCard = useCallback((cardId: string, cardNumber: string) => {
    setSelectedPaymentCard({cardId, cardNumber});
  }, []);

  const handleSelectLoyaltyCard = useCallback((cardId: string, cardNumber: string) => {
    setSelectedLoyaltyCard({cardId, cardNumber});
  }, []);

  const renderCardHeaderContentContainer = (isPaymentCard: boolean) => {
    const cardTypeLabel = isPaymentCard ? 'Payment' : 'Loyalty';
    return (
      <View style={styles.cardHeaderContentContainer}>
        <Text style={styles.bottomSheetTitle}>Select {cardTypeLabel} Card</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              'Card',
              isPaymentCard ? {screen: 'PaymentCards'} : {screen: 'LoyaltyCards'},
            )
          }
          style={styles.bottomSheetTitle}>
          <Icon name="gear" size={20} color={CUSTOM_THEME_COLOR_CONFIG.colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCardBodyContentContainer = (cards: UserCard[], isPaymentCard: boolean) => {
    return (
      <BottomSheetScrollView contentContainerStyle={styles.cardBodyContentContainer}>
        {cards.length > 0
          ? cards.map(card => (
              <Card
                key={card.cardGuid}
                cardGuid={card.cardGuid}
                primaryAccountNumber={card.primaryAccountNumber}
                paymentCardScheme={card.cardScheme}
                width={260}
                height={160}
                onPress={isPaymentCard ? handleSelectPaymentCard : handleSelectLoyaltyCard}
                isSelected={
                  isPaymentCard
                    ? selectedPaymentCard?.cardId === card.cardGuid
                    : selectedLoyaltyCard?.cardId === card.cardGuid
                }
              />
            ))
          : renderNoCardContainerText(isPaymentCard)}
      </BottomSheetScrollView>
    );
  };

  const renderNoCardContainerText = (isPaymentCard: boolean) => {
    const cardTypeLabel = isPaymentCard ? 'payment' : 'loyalty';
    return (
      <View style={styles.noCardContainer}>
        <Text variant="titleMedium" style={styles.noCardContainerText}>
          {`⚠️ No ${cardTypeLabel} cards available. Please add a ${cardTypeLabel} card. You can navigate to the card screen by tapping the gear icon.`}
        </Text>
      </View>
    );
  };

  if (!selectedStation) {
    return <AppLoading />;
  }
  const fuelPumpList = generateFuelPumpList(selectedStation.totalPump);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxContentContainer}>
        <Text variant="titleLarge" style={styles.boxHeader}>
          {selectedStation?.stationName}
        </Text>
        <Text variant="bodySmall">{selectedStation?.stationAddress}</Text>

        {/* Selection Buttons */}
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setPumpSheetVisible(true)}>
            <Text style={styles.selectionButtonText}>
              ⛽ {selectedPump ? `Pump ${selectedPump}` : 'Select Pump'}
            </Text>
            <Icon
              name={isPumpSheetVisible ? 'chevron-up' : 'chevron-down'}
              size={16}
              color="#000"
              style={styles.selectionButtonIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setAmountSheetVisible(true)}>
            <Text style={styles.selectionButtonText}>
              💰 {selectedAmount ? `RM ${amount}` : 'Select Amount'}
            </Text>
            <Icon
              name={isAmountSheetVisible ? 'chevron-up' : 'chevron-down'}
              size={16}
              color="#000"
              style={styles.selectionButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.boxContentContainer}>
        <Text variant="titleLarge" style={styles.boxHeader}>
          Payment Details:
        </Text>

        {/* Selection Buttons */}
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setPaymentCardSheetVisible(true)}>
            <Text style={styles.selectionButtonText}>
              💳 {selectedPaymentCard ? selectedPaymentCard?.cardNumber : 'Select Payment Card'}
            </Text>
            <Icon
              name={isPumpSheetVisible ? 'chevron-up' : 'chevron-down'}
              size={16}
              color="#000"
              style={styles.selectionButtonIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setLoyaltyCardSheetVisible(true)}>
            <Text style={styles.selectionButtonText}>
              🎁{' '}
              {selectedLoyaltyCard
                ? selectedLoyaltyCard.cardNumber
                : 'Select Loayalty Card (Optional)'}
            </Text>
            <Icon
              name={isPumpSheetVisible ? 'chevron-up' : 'chevron-down'}
              size={16}
              color="#000"
              style={styles.selectionButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Pay Button */}
      <View style={styles.buttonContainer}>
        <Button
          style={styles.fuelAmountItemButtonContainer}
          mode="contained"
          disabled={!selectedPump || parseAmount(amount ?? '') === null || !selectedPaymentCard}
          contentStyle={{
            opacity:
              !selectedPump || parseAmount(amount ?? '') === null ? 0.5 : 1 || !selectedPaymentCard,
          }}
          onPress={() => {
            const parsedAmount = parseAmount(amount ?? '');
            if (selectedPump && parsedAmount !== null) {
              navigation.navigate('Passcode', {
                nextScreen: 'FuelingScreen',
                nextScreenParams: {
                  stationName: selectedStation.stationName,
                  stationAddress: selectedStation.stationAddress,
                  pumpNumber: selectedPump,
                  fuelAmount: parsedAmount,
                },
              });
            }
          }}>
          Pay - RM {parseAmount(amount ?? '') === null ? '0' : amount}
        </Button>
      </View>

      {/* Pump Selection Bottom Sheet */}
      <AppBottomSheetModal
        isVisible={isPumpSheetVisible}
        onDismiss={() => setPumpSheetVisible(false)}
        snapPoints={['40%']}>
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.bottomSheetTitle}>Select Pump</Text>
          <View style={styles.pumpItemListContainer}>
            {fuelPumpList.map((pump, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectPump(pump)}
                accessibilityLabel={`Pump ${pump}`}
                style={[styles.pumpItem, selectedPump === pump && styles.selectedPumpItem]}>
                <Text
                  style={[
                    styles.pumpItemText,
                    selectedPump === pump && styles.selectedPumpItemText,
                  ]}
                  variant="bodyLarge">
                  {pump}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </AppBottomSheetModal>

      {/* Amount Selection Bottom Sheet */}
      <AppBottomSheetModal
        isVisible={isAmountSheetVisible}
        onDismiss={() => setAmountSheetVisible(false)}
        snapPoints={['40%']}>
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.bottomSheetTitle}>Select Amount</Text>
          <View style={styles.fuelAmountListContainer}>
            <TextInput
              ref={customAmountTextInput}
              value={amount}
              onChangeText={customAmount => onEnterCustomAmount(customAmount)}
              inputMode="numeric"
              mode="outlined"
              returnKeyType="done"
              placeholder="Enter your preferred amount"
              style={styles.fuelAmoutCustomAmountTextInput}
            />
            <View style={styles.fuelAmountListContainer}>
              {amountList.map((amt, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectAmount(amt.value)}
                  style={[
                    styles.fuelAmountItemButton,
                    selectedAmount === amt.value && styles.selectedFuelAmountItemButton,
                  ]}>
                  <Text
                    style={[
                      styles.fuelAmountItemButtonText,
                      selectedAmount === amt.value && styles.selectedFuelAmountItemButtonText,
                    ]}>
                    {amt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </AppBottomSheetModal>

      {/* Payment Card Selection Bottom Sheet*/}
      <AppBottomSheetModal
        isVisible={isPaymentCardSheetVisible}
        onDismiss={() => setPaymentCardSheetVisible(false)}
        snapPoints={['45%']}>
        {renderCardHeaderContentContainer(true)}
        {renderCardBodyContentContainer(bankCards, true)}
      </AppBottomSheetModal>

      {/* Loyalty Card Selection Bottom Sheet */}
      <AppBottomSheetModal
        isVisible={isLoyaltyCardSheetVisible}
        onDismiss={() => setLoyaltyCardSheetVisible(false)}
        snapPoints={['45%']}>
        {renderCardHeaderContentContainer(false)}
        {renderCardBodyContentContainer(loyaltyCards, false)}
      </AppBottomSheetModal>
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
  boxContentContainer: {
    padding: 20,
    paddingVertical: 20,
    marginBottom: 25,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
    borderRadius: 25,
    shadowColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    elevation: 5,
  },
  boxHeader: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  selectionContainer: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 15,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  selectionButtonText: {
    fontSize: 14,
    color: 'black',
    flex: 1,
  },
  selectionButtonIcon: {
    marginLeft: 10,
  },
  bottomSheetTitle: {
    fontSize: 18,
    paddingHorizontal: 5,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bottomSheetContainer: {
    padding: 20,
  },
  pumpItemListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
    marginBottom: 20,
  },
  pumpItem: {
    borderRadius: 30,
    borderColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
    borderWidth: 1,
    margin: 5,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPumpItem: {
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
    borderWidth: 3,
  },
  pumpItemText: {
    padding: 10,
    textAlign: 'center',
  },
  selectedPumpItemText: {
    color: CUSTOM_THEME_COLOR_CONFIG.colors.surface,
    fontWeight: 'bold',
  },
  fuelAmoutCustomAmountTextInput: {
    width: '100%',
    height: 50,
  },
  fuelAmountListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fuelAmountItemButtonContainer: {
    width: '90%',
  },
  fuelAmountItemButton: {
    backgroundColor: '#D6DEE2',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedFuelAmountItemButton: {
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
  },
  fuelAmountItemButtonText: {
    fontWeight: 'bold',
  },
  selectedFuelAmountItemButtonText: {
    color: CUSTOM_THEME_COLOR_CONFIG.colors.surface,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cardHeaderContentContainer: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardBodyContentContainer: {
    alignItems: 'center',
  },
  noCardContainer: {
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.secondary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    elevation: 5,
    padding: 20,
    marginHorizontal: 15,
  },
  noCardContainerText: {
    color: CUSTOM_THEME_COLOR_CONFIG.colors.surface,
  },
});

export default PurchaseFuelScreen;
