import React, {useRef, useState} from 'react';
import {View, StyleSheet, TextInput as RNTextInput} from 'react-native';
import {TextInput, Button, Text, HelperText} from 'react-native-paper';
import {AddUserCardPayload, UserCardService} from '@services/user-card-service';
import AppBottomSheetModal from '@components/bottom-sheet-modal';
import AppSnackbar from '@components/snackbar';
import useForm from '@hooks/use-form';
import useStore, {CardType, Merchant} from '@store/index';

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
  cvv: string;
}

const CardFormModal: React.FC<CardFormModalProps> = ({
  isVisible,
  cardType,
  merchant,
  onDismiss,
}) => {
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
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
    cvv: '',
  });
  const cardExpiryRef = useRef<RNTextInput>(null);
  const cvvRef = useRef<RNTextInput>(null);

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

    if (!formData.cvv) {
      errors.cvv = 'CVV is required';
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
    const addCardPayload: AddUserCardPayload = {
      cardNumber: formData.cardNumber,
      cardExpiry: formattedExpiry,
      cvv: formData.cvv,
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
      handleChangeText('cvv', '');
      onDismiss();
    }
  };

  return (
    <>
      <AppBottomSheetModal
        isVisible={isVisible}
        snapPoints={['75%']}
        onDismiss={onDismiss}
        canDismiss={!isLoading}>
        <View style={styles.container}>
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
              returnKeyType="next"
              onSubmitEditing={() => {
                cvvRef.current?.focus();
              }}
            />
            {validationErrors.cardExpiry && (
              <HelperText type="error">{validationErrors.cardExpiry}</HelperText>
            )}
          </View>
          <View style={styles.textContainer}>
            <TextInput
              ref={cvvRef}
              label="CVV"
              value={formData.cvv}
              onChangeText={value => handleChangeText('cvv', value)}
              mode="outlined"
              keyboardType="number-pad"
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleAddCard}
            />
            {validationErrors.cvv && <HelperText type="error">{validationErrors.cvv}</HelperText>}
          </View>
          <View style={styles.buttonContainer}>
            <Button mode="contained" disabled={isLoading} onPress={handleAddCard}>
              {isLoading ? 'Loading...' : 'Add Card'}
            </Button>
          </View>
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
});

export default CardFormModal;
