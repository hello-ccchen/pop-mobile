import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  StatusBar,
  TouchableOpacity,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import {ActivityIndicator, Button, Modal, Portal, Text, TextInput} from 'react-native-paper';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore from '@store/index';
import AppLoading from '@components/Loading';
import AppSelectionButton from '@components/SelectionButton';
import Card from '@components/Card';
import useSWR from 'swr';
import {FuelStationService} from '@services/fuelStationService';
import {UserCard} from '@services/userCardService';
import usePurchaseFuelForm from '@hooks/usePurchaseFuelForm';
import useMerchantPumpPromotions from '@hooks/useFetchMerchantPumpPromotions';

const AnimatedTooltip = ({title, description}: {title: string; description: string}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(fadeAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();

    return () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };
  }, []);

  return (
    <Animated.View style={[styles.cardBodyTooltipContainer, {opacity: fadeAnim}]}>
      <Text style={styles.cardBodyTooltipText}>{title}</Text>
      <Text variant="bodySmall">{description}</Text>
    </Animated.View>
  );
};

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
  const gasStations = useStore(state => state.gasStations);
  const evStations = useStore(state => state.evChargingStations);
  const userCards = useStore(state => state.userCards);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [visibleTooltipCardId, setVisibleTooltipCardId] = useState<string | null>(null);

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
  const selectedStation =
    gasStations.find(s => s.id === selectedStationId) ||
    evStations.find(s => s.id === selectedStationId) ||
    null;

  const isGas = selectedStation?.pumpTypeCode === 'GAS';

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

  const masterMerchantGuid = pumps?.[0]?.masterMerchantGuid;
  const pumpTypeGuid = pumps?.[0]?.pumpTypeGuid;
  const merchantPumpPromotionRequestPayload = useMemo(() => {
    if (!masterMerchantGuid || !pumpTypeGuid) {
      return undefined;
    }
    return {
      masterMerchantGuid: masterMerchantGuid,
      pumpTypeGuid: pumpTypeGuid,
    };
  }, [masterMerchantGuid, pumpTypeGuid]);
  const {promotions} = useMerchantPumpPromotions(merchantPumpPromotionRequestPayload);

  useEffect(() => {
    if (promotions?.length) {
      setShowPromotionModal(true);
    }
  }, [promotions]);

  useEffect(() => {
    if (visibleTooltipCardId) {
      const timeout = setTimeout(() => setVisibleTooltipCardId(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [visibleTooltipCardId]);

  const promotionCardGuids = useMemo(
    () => promotions?.map(promo => promo.cardGuid) ?? [],
    [promotions],
  );

  const renderPumpSelectionButtonContent = () => {
    if (pumpLoading) {
      return <ActivityIndicator color={CUSTOM_THEME_COLOR_CONFIG.colors.primary} />;
    }

    const fuelPumpList = pumps || [];

    return (
      <>
        <Text style={styles.selectionButtonSheetTitle}>{`Select ${
          isGas ? 'Pump' : 'EV Charger'
        }`}</Text>
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
      <TouchableWithoutFeedback
        onPress={() => {
          setVisibleTooltipCardId(null);
        }}>
        <View>
          <BottomSheetScrollView contentContainerStyle={styles.cardBodyContentContainer}>
            {cards.length > 0
              ? cards.map(card => {
                  const isCardEligible = promotionCardGuids.includes(card.cardGuid);
                  const matchedPromo = promotions?.find(p => p.cardGuid === card.cardGuid);
                  const isTooltipVisible = visibleTooltipCardId === card.cardGuid;

                  return (
                    <View key={card.cardGuid} style={styles.cardBodyWrapperContainer}>
                      {/* 🎁 Badge */}
                      {isCardEligible && (
                        <TouchableOpacity
                          onPress={e => {
                            e.stopPropagation();
                            setVisibleTooltipCardId(prev =>
                              prev === card.cardGuid ? null : card.cardGuid,
                            );
                          }}
                          style={styles.cardBodyBadgeContainer}>
                          <Text variant="titleMedium">🎁</Text>
                        </TouchableOpacity>
                      )}

                      {/* Tooltip */}
                      {isTooltipVisible && matchedPromo && (
                        <AnimatedTooltip
                          title={matchedPromo.discountTitle}
                          description={matchedPromo.discountDescription}
                        />
                      )}

                      {/* Actual Card */}
                      <Card
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
                    </View>
                  );
                })
              : renderCardSelectionNoCardContent(isPaymentCard)}
          </BottomSheetScrollView>
        </View>
      </TouchableWithoutFeedback>
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

  const renderPromotionsInfoModal = () => {
    return (
      <Portal>
        <Modal
          visible={showPromotionModal}
          onDismiss={() => setShowPromotionModal(false)}
          contentContainerStyle={styles.promotionInfoModalContainer}>
          <Text variant="titleLarge" style={styles.promotionInfoModalTitle}>
            🎁 Available Promotions
          </Text>

          <ScrollView style={styles.promotionInfoModalBodyContainer}>
            {promotions?.map((promo, idx) => (
              <View
                key={promo.creditCardDiscountGuid || idx}
                style={styles.promotionInfoModalBodyItemContainer}>
                <Text variant="titleMedium" style={styles.promotionInfoModalBodyItemDescription}>
                  {promo.discountTitle}
                </Text>
                <Text variant="bodyMedium">{promo.discountDescription}</Text>
              </View>
            ))}
          </ScrollView>

          <Button mode="contained" onPress={() => setShowPromotionModal(false)}>
            Got it
          </Button>
        </Modal>
      </Portal>
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
  const pumpLabel = isGas ? 'Pump' : 'EV Charger';
  return (
    <SafeAreaView style={styles.container}>
      {promotions && promotions.length > 0 && (
        <TouchableOpacity
          onPress={() => setShowPromotionModal(true)}
          style={styles.promotionBannerBox}>
          <Text style={styles.promotionBannerText} variant="titleMedium">
            🎁 {promotions.length} promotion{promotions.length > 1 ? 's' : ''} available
          </Text>
          <Icon name="chevron-right" size={16} color="#FF9800" />
        </TouchableOpacity>
      )}

      <View style={styles.boxContentContainer}>
        <Text variant="titleLarge" style={styles.boxHeader}>
          {selectedStation?.stationName}
        </Text>
        <Text variant="bodySmall">{selectedStation?.stationAddress}</Text>

        <View style={styles.selectionContainer}>
          <AppSelectionButton
            buttonText={`${isGas ? '⛽' : '⚡️'}  ${
              formState.selectedPump
                ? `${pumpLabel} ${formState.selectedPump.pumpNumber}`
                : `Select ${pumpLabel}`
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
                : 'Select Loyalty Card (Optional)'
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
                  isGas: isGas,
                },
              });
            }
          }}>
          Pay - RM{' '}
          {parseAmount(formState.selectedAmount ?? '') === null ? '0' : formState.selectedAmount}
        </Button>
      </View>

      {renderPromotionsInfoModal()}
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
    marginHorizontal: Platform.OS === 'ios' ? 15 : 0,
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
  cardBodyWrapperContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  cardBodyBadgeContainer: {
    position: 'absolute',
    top: 0,
    left: -5,
    zIndex: 10,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 1, height: 1},
    elevation: 3,
  },
  cardBodyTooltipContainer: {
    position: 'absolute',
    top: 40,
    left: 5,
    backgroundColor: '#FFF8DC',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
    width: '70%',
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 1, height: 2},
    elevation: 5,
  },
  cardBodyTooltipText: {
    fontWeight: 'bold',
    marginBottom: 4,
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
  promotionBannerBox: {
    backgroundColor: '#FFF3E0',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promotionBannerText: {
    fontWeight: 'bold',
    flex: 1,
  },
  promotionInfoModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 16,
    maxHeight: '60%',
  },
  promotionInfoModalTitle: {
    marginBottom: 20,
  },
  promotionInfoModalBodyContainer: {
    marginBottom: 20,
  },
  promotionInfoModalBodyItemContainer: {
    marginBottom: 15,
    marginLeft: 5,
  },
  promotionInfoModalBodyItemDescription: {
    fontWeight: 'bold',
  },
});

export default PurchaseFuelScreen;
