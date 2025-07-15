import {useReducer, useCallback, useRef} from 'react';
import {Alert, TextInput as NativeTextInput} from 'react-native';

type CardDetail = {
  cardId: string;
  cardNumber: string;
};

type FormState = {
  selectedPump: {pumpId: string; pumpNumber: number} | null;
  selectedAmount: number | string | null;
  selectedPaymentCard: CardDetail | null;
  selectedLoyaltyCard: CardDetail | null;
};

type FormAction =
  | {type: 'SET_PUMP'; payload: {pumpId: string; pumpNumber: number} | null}
  | {type: 'SET_AMOUNT'; payload: number | string | null}
  | {type: 'SET_PAYMENT_CARD'; payload: CardDetail | null}
  | {type: 'SET_LOYALTY_CARD'; payload: CardDetail | null};

const initialFormState: FormState = {
  selectedPump: null,
  selectedAmount: null,
  selectedPaymentCard: null,
  selectedLoyaltyCard: null,
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_PUMP':
      return {...state, selectedPump: action.payload};
    case 'SET_AMOUNT':
      return {...state, selectedAmount: action.payload};
    case 'SET_PAYMENT_CARD':
      return {...state, selectedPaymentCard: action.payload};
    case 'SET_LOYALTY_CARD':
      return {...state, selectedLoyaltyCard: action.payload};
    default:
      return state;
  }
};

const usePurchaseFuelForm = () => {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const customAmountTextInput = useRef<NativeTextInput>(null);

  const parseAmount = (amtString: string | number): number | null => {
    const parsed = parseFloat(amtString.toString());
    return !isNaN(parsed) && parsed > 0 ? parsed : null;
  };

  const handleSelectPump = useCallback((pumpId: string, pumpNumber: number) => {
    dispatch({type: 'SET_PUMP', payload: {pumpId, pumpNumber}});
  }, []);

  const handleSelectAmount = useCallback((amt: number | string) => {
    if (amt === 'others' && customAmountTextInput.current) {
      customAmountTextInput.current.focus();
      dispatch({type: 'SET_AMOUNT', payload: ''});
    } else {
      dispatch({type: 'SET_AMOUNT', payload: amt});
    }
  }, []);

  const onEnterCustomAmount = useCallback((customAmount: string) => {
    if (customAmount.trim() === '') {
      dispatch({type: 'SET_AMOUNT', payload: ''});
    } else {
      const parsedAmount = parseAmount(customAmount);
      if (parsedAmount !== null) {
        dispatch({type: 'SET_AMOUNT', payload: customAmount});
      } else {
        Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      }
    }
  }, []);

  const handleSelectPaymentCard = useCallback((cardId: string, cardNumber: string) => {
    dispatch({type: 'SET_PAYMENT_CARD', payload: {cardId, cardNumber}});
  }, []);

  const handleSelectLoyaltyCard = useCallback((cardId: string, cardNumber: string) => {
    dispatch({type: 'SET_LOYALTY_CARD', payload: {cardId, cardNumber}});
  }, []);

  return {
    formState,
    customAmountTextInput,
    handleSelectPump,
    handleSelectAmount,
    onEnterCustomAmount,
    handleSelectPaymentCard,
    handleSelectLoyaltyCard,
    parseAmount,
  };
};

export default usePurchaseFuelForm;
