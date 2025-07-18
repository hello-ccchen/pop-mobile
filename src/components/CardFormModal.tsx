import React, {useEffect, useRef, useState} from 'react';
import {TextInput as RNTextInput, StyleSheet, View} from 'react-native';
import {Button, HelperText, Text, TextInput} from 'react-native-paper';
import WebView from 'react-native-webview';
import {AddUserCardRequestPayload, CardType, Merchant} from 'src/types';

import AppBottomSheetModal from '@components/BottomSheetModal';
import AppLoading from '@components/Loading';
import AppSnackbar from '@components/Snackbar';
import useForm from '@hooks/useForm';
import {AuthStorageService} from '@services/authStorageService';
import {UserCardService} from '@services/userCardService';
import useStore from '@store/index';
import theme from '@styles/theme';

const checkForCreditCardSuccessAddedScript = `
    (function() {
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (document.body.innerText.includes("Success")) {
            window.ReactNativeWebView.postMessage("Success");
          }
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    })();
  `;

export const CARD_TYPE_CODE = {
  Fleet: 'FLT',
  CreditCard: 'CC',
  Loyalty: 'LYT',
};

interface CardFormModalProps {
  isVisible: boolean;
  cardType: CardType;
  merchant?: Merchant;
  onDismiss: () => void;
}

interface CardFormData {
  cardNumber: string;
  cardExpiry: string;
}

const CardFormModal: React.FC<CardFormModalProps> = ({
  isVisible,
  cardType,
  merchant,
  onDismiss,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [isPaymentCardWebFormLoading, setIsPaymentCardWebFormLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [creditCardWebFormUrl, setCreditCardWebFormUrl] = useState<string>('');
  const setUserCards = useStore(state => state.setUserCards);
  const {
    formData,
    validationErrors,
    handleChangeText,
    setValidationErrors,
    isLoading,
    setIsLoading,
    isError,
    setIsError,
  } = useForm<CardFormData>({
    cardNumber: '',
    cardExpiry: '',
  });
  const cardExpiryRef = useRef<RNTextInput>(null);

  const isCreditCard = cardType.code === CARD_TYPE_CODE.CreditCard;

  useEffect(() => {
    const fetchUserToken = async () => {
      if (isCreditCard) {
        const token = await AuthStorageService.getAccessToken();
        setCreditCardWebFormUrl(`https://awttechsolution.com/cardonboarding?token=${token}`);
      }
    };

    fetchUserToken();
  }, [isCreditCard]);

  const handleExpiryDateChange = (value: string) => {
    // Remove all non-numeric characters
    const cleanValue = value.replace(/[^0-9]/g, '');

    // Exit early for invalid cases
    if (cleanValue.length > 0) {
      const month = cleanValue.slice(0, 2);

      // Allow partial typing for the first character (e.g., "0")
      if (month.length === 1 && parseInt(month, 10) > 1) {
        return; // Invalid first digit for MM (e.g., "9" or "8")
      }

      // Allow two characters but validate as a month
      if (month.length === 2) {
        const parsedMonth = parseInt(month, 10);
        if (parsedMonth < 1 || parsedMonth > 12) {
          return; // Invalid MM (e.g., "88")
        }
      }
    }

    // Format as MM/YYYY
    let formattedValue = cleanValue;
    if (cleanValue.length > 2) {
      formattedValue = `${cleanValue.slice(0, 2)}/${cleanValue.slice(2)}`;
    }

    // Restrict to MM/YYYY (maximum 7 characters)
    if (formattedValue.length > 7) {
      formattedValue = formattedValue.slice(0, 7);
    }

    // Update the form state with the formatted value
    handleChangeText('cardExpiry', formattedValue);
  };

  const isValidFormData = () => {
    const errors: {[key: string]: string} = {};
    if (!formData.cardNumber) {
      errors.cardNumber = 'Card Number is required';
    }

    const cardNumberRegex = /^[0-9]{16}$/;
    if (formData.cardNumber && !cardNumberRegex.test(formData.cardNumber)) {
      errors.cardNumber = 'Card number must be 16 digits.';
    }

    if (!formData.cardExpiry) {
      errors.cardExpiry = 'Card Expiry is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCard = async () => {
    if (!isValidFormData()) {
      return;
    }
    setIsLoading(true);
    setIsError(false);

    const formattedExpiry = formData.cardExpiry.replace('/', '');
    const addCardPayload: AddUserCardRequestPayload = {
      cardNumber: formData.cardNumber,
      cardExpiry: formattedExpiry,
      cardType: cardType.guid,
      masterMerchantGuid: merchant?.merchantGuid,
    };

    try {
      const response = await UserCardService.addUserCard(addCardPayload);
      setUserCards(response);
    } catch (error) {
      setSnackbarMessage('Failed to add card. Please try again. 🥹');
      setIsError(true);
    } finally {
      setIsLoading(false);
      setValidationErrors({});
      handleChangeText('cardNumber', '');
      handleChangeText('cardExpiry', '');
      onDismiss();
    }
  };

  const handleCrediCardWebFormCallback = async (event: any) => {
    if (event.nativeEvent.data === 'Success') {
      const userCards = await UserCardService.fetchUserCards();
      setUserCards(userCards);
      onDismiss();
      return;
    }
    // TODO: how about failed and validation? :D
  };

  const renderPaymentCardWebForm = () => {
    return (
      <View style={styles.creditCardWebForm}>
        {isPaymentCardWebFormLoading && (
          <View style={styles.loadingContainer}>
            <AppLoading />
          </View>
        )}
        <WebView
          ref={webViewRef}
          source={{uri: creditCardWebFormUrl}}
          injectedJavaScript={checkForCreditCardSuccessAddedScript}
          onMessage={handleCrediCardWebFormCallback}
          javaScriptEnabled
          domStorageEnabled
          onLoadStart={() => setIsPaymentCardWebFormLoading(true)}
          onLoadEnd={() => setIsPaymentCardWebFormLoading(false)}
          onError={() => setIsPaymentCardWebFormLoading(false)}
        />
      </View>
    );
  };

  return (
    <>
      <AppBottomSheetModal
        isVisible={isVisible}
        snapPoints={['92%']}
        onDismiss={onDismiss}
        canDismiss={!isLoading}>
        <View style={styles.container}>
          {isCreditCard ? (
            renderPaymentCardWebForm()
          ) : (
            <>
              <Text variant="headlineSmall" style={styles.header}>
                {cardType.description}
              </Text>
              <View style={styles.textContainer}>
                <TextInput
                  label="Card Number"
                  value={formData.cardNumber}
                  onChangeText={value => handleChangeText('cardNumber', value)}
                  mode="outlined"
                  keyboardType="number-pad"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    cardExpiryRef.current?.focus();
                  }}
                />
                {validationErrors.cardNumber && (
                  <HelperText type="error">{validationErrors.cardNumber}</HelperText>
                )}
              </View>
              <View style={styles.textContainer}>
                <TextInput
                  ref={cardExpiryRef}
                  label="Card Expiry (MM/YYYY)"
                  value={formData.cardExpiry}
                  onChangeText={handleExpiryDateChange}
                  mode="outlined"
                  keyboardType="number-pad"
                  returnKeyType="done"
                  onSubmitEditing={handleAddCard}
                />
                {validationErrors.cardExpiry && (
                  <HelperText type="error">{validationErrors.cardExpiry}</HelperText>
                )}
              </View>
              <View style={styles.buttonContainer}>
                <Button mode="contained" disabled={isLoading} onPress={handleAddCard}>
                  {isLoading ? 'Loading...' : 'Add Card'}
                </Button>
              </View>
            </>
          )}
        </View>
      </AppBottomSheetModal>
      <AppSnackbar
        visible={isError}
        message={snackbarMessage}
        onDismiss={() => setIsError(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  textContainer: {
    marginTop: 15,
  },
  buttonContainer: {
    marginTop: 30,
  },
  creditCardWebForm: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default CardFormModal;
