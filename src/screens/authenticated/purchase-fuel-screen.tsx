import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, View, Alert, StatusBar, TouchableOpacity} from 'react-native';
import {ActivityIndicator, Button, Text, TextInput} from 'react-native-paper';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore from '@store/index';
import AppLoading from '@components/loading';
import AppSelectionButton from '@components/selection-button';
import Card from '@components/card';
import useSWR from 'swr';
import {FuelStationService} from '@services/fuel-station-service';
import {UserCard} from '@services/user-card-service';
import usePurchaseFuelForm from '@hooks/use-purchase-fuel-form';

const amountList = [
  {label: 'RM 5', value: 5},
  {label: 'RM 10', value: 10},
  {label: 'RM 20', value: 20},
  {label: 'RM 40', value: 40},
  {label: 'RM 50', value: 50},
  {label: 'Others', value: 'others'},
];

type PurchaseFuelScreenProps = NativeStackScreenProps<AppStackScreenParams, 'PurchaseFuel'>;
const PurchaseFuelScreen: React.FC<PurchaseFuelScreenProps> = ({route, navigation}) => {
  const {selectedStationId} = route.params;
  const fuelStations = useStore(state => state.gasStations);
  const userCards = useStore(state => state.userCards);

  const {
    formState,
    customAmountTextInput,
    handleSelectPump,
    handleSelectAmount,
    onEnterCustomAmount,
    handleSelectPaymentCard,
    handleSelectLoyaltyCard,
    parseAmount,
  } = usePurchaseFuelForm();

  // Validate selectedStationId and find selectedStation
  const selectedStation = fuelStations.find(s => s.id === selectedStationId) || null;

  const {
    data: pumps,
    error: pumpError,
    isLoading: pumpLoading,
  } = useSWR(selectedStationId ? `/station/pump/${selectedStationId}` : null, () =>
    selectedStationId
      ? FuelStationService.fetchFuelStationPumps(selectedStationId)
      : Promise.resolve([]),
  );

  const bankCards = userCards.filter(card => !card.merchantGuid);
  const loyaltyCards = userCards.filter(
    card => card.merchantGuid === selectedStation?.merchantGuid && card.cardScheme === 'Loyalty',
  );

  useEffect(() => {
    const showAlert = (title: string, message: string) => {
      Alert.alert(title, message, [{text: 'OK', onPress: () => navigation.goBack()}]);
    };

    if (!selectedStation) {
      showAlert(
        'Station not found',
        'Sorry, there was a technical issue. Please proceed to the counter for assistance',
      );
    } else if (pumpError) {
      showAlert(
        'Station Pump not found',
        'Sorry, there was a technical issue. Please proceed to the counter for assistance',
      );
    }
  }, [selectedStation, pumpError, navigation]);

  const renderPumpSelectionButtonContent = () => {
    if (pumpLoading) {
      return <ActivityIndicator color={CUSTOM_THEME_COLOR_CONFIG.colors.primary} />;
    }

    const fuelPumpList = pumps || [];

    return (
      <>
        <Text style={styles.selectionButtonSheetTitle}>Select Pump</Text>
        <View style={styles.pumpItemListContainer}>
          {fuelPumpList.map((pump, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectPump(pump.pumpGuid, pump.pumpNumber)}
              accessibilityLabel={`Pump ${pump}`}
              style={[
                styles.pumpItem,
                formState.selectedPump?.pumpId === pump.pumpGuid && styles.selectedPumpItem,
              ]}>
              <Text
                style={[
                  styles.pumpItemText,
                  formState.selectedPump?.pumpId === pump.pumpGuid && styles.selectedPumpItemText,
                ]}
                variant="bodyLarge">
                {pump.pumpNumber}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  };

  const renderAmountSelectionButtonContent = () => {
    return (
      <>
        <Text style={styles.selectionButtonSheetTitle}>Select Amount</Text>
        <View style={styles.fuelAmountListContainer}>
          <TextInput
            ref={customAmountTextInput}
            value={formState.selectedAmount?.toString() || ''}
            onChangeText={onEnterCustomAmount}
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
                style={styles.fuelAmountItemButton}>
                <Text style={styles.fuelAmountItemButtonText}>{amt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </>
    );
  };

  const renderCardSelectionHeaderContent = (isPaymentCard: boolean, dismissSheet: () => void) => {
    const cardTypeLabel = isPaymentCard ? 'Payment' : 'Loyalty';
    return (
      <View style={styles.cardHeaderContentContainer}>
        <Text style={styles.selectionButtonSheetTitle}>Select {cardTypeLabel} Card</Text>
        <TouchableOpacity
          onPress={() => {
            dismissSheet();
            navigation.navigate(isPaymentCard ? 'PaymentCards' : 'LoyaltyCards');
          }}
          style={styles.selectionButtonSheetTitle}>
          <Icon name="gear" size={20} color={CUSTOM_THEME_COLOR_CONFIG.colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCardSelectionBodyContent = (cards: UserCard[], isPaymentCard: boolean) => {
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
                    ? formState.selectedPaymentCard?.cardId === card.cardGuid
                    : formState.selectedLoyaltyCard?.cardId === card.cardGuid
                }
              />
            ))
          : renderCardSelectionNoCardContent(isPaymentCard)}
      </BottomSheetScrollView>
    );
  };

  const renderCardSelectionNoCardContent = (isPaymentCard: boolean) => {
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

  const isInvalidForm =
    !formState.selectedPump ||
    parseAmount(formState.selectedAmount ?? '') === null ||
    !formState.selectedPaymentCard;

  const payButtonStyle = {opacity: isInvalidForm ? 0.5 : 1};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxContentContainer}>
        <Text variant="titleLarge" style={styles.boxHeader}>
          {selectedStation?.stationName}
        </Text>
        <Text variant="bodySmall">{selectedStation?.stationAddress}</Text>

        <View style={styles.selectionContainer}>
          <AppSelectionButton
            buttonText={`⛽ ${
              formState.selectedPump ? `Pump ${formState.selectedPump.pumpNumber}` : 'Select Pump'
            }`}>
            {renderPumpSelectionButtonContent()}
          </AppSelectionButton>

          <AppSelectionButton
            buttonText={`💰 ${
              formState.selectedAmount && formState.selectedAmount !== 'others'
                ? `RM ${formState.selectedAmount}`
                : 'Select Amount'
            }`}>
            {renderAmountSelectionButtonContent()}
          </AppSelectionButton>
        </View>
      </View>

      <View style={styles.boxContentContainer}>
        <Text variant="titleLarge" style={styles.boxHeader}>
          Payment Details:
        </Text>

        <View style={styles.selectionContainer}>
          <AppSelectionButton
            buttonText={`💳 ${
              formState.selectedPaymentCard
                ? formState.selectedPaymentCard?.cardNumber
                : 'Select Payment Card'
            }`}>
            {dismissSheet => (
              <>
                {renderCardSelectionHeaderContent(true, dismissSheet)}
                {renderCardSelectionBodyContent(bankCards, true)}
              </>
            )}
          </AppSelectionButton>

          <AppSelectionButton
            buttonText={`🎁 ${
              formState.selectedLoyaltyCard
                ? formState.selectedLoyaltyCard.cardNumber
                : 'Select Loayalty Card (Optional)'
            }`}>
            {dismissSheet => (
              <>
                {renderCardSelectionHeaderContent(false, dismissSheet)}
                {renderCardSelectionBodyContent(loyaltyCards, false)}
              </>
            )}
          </AppSelectionButton>
        </View>
      </View>

      {/* Pay Button */}
      <View style={styles.payButtonContainer}>
        <Button
          style={styles.fuelAmountItemButtonContainer}
          mode="contained"
          disabled={isInvalidForm}
          contentStyle={payButtonStyle}
          onPress={() => {
            const parsedAmount = parseAmount(formState.selectedAmount ?? '');
            if (formState.selectedPump && parsedAmount !== null && formState.selectedPaymentCard) {
              navigation.navigate('Passcode', {
                nextScreen: 'Fueling',
                nextScreenParams: {
                  stationName: selectedStation.stationName,
                  stationAddress: selectedStation.stationAddress,
                  pumpNumber: formState.selectedPump.pumpNumber,
                  pumpId: formState.selectedPump.pumpId,
                  fuelAmount: parsedAmount,
                  paymentCardId: formState.selectedPaymentCard.cardId,
                  loyaltyCardId: formState.selectedLoyaltyCard?.cardId,
                },
              });
            }
          }}>
          Pay - RM{' '}
          {parseAmount(formState.selectedAmount ?? '') === null ? '0' : formState.selectedAmount}
        </Button>
      </View>
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
  selectionButtonSheetTitle: {
    fontSize: 18,
    paddingHorizontal: 5,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pumpLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  fuelAmountItemButtonText: {
    fontWeight: 'bold',
  },
  payButtonContainer: {
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
