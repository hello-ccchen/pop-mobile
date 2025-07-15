import {LatLng} from 'react-native-maps';

type PasscodeScreenParams = {
  screenState?: ScreenState;
  OTP?: string;
  nextScreen?: keyof AppStackScreenParams;
  nextScreenParams?: object;
};

export type AppStackScreenParams = {
  Splash: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Loading: undefined;
  HomeTab: undefined;
  Home: undefined;
  Passcode: PasscodeScreenParams;
  Settings: undefined;
  Profile: undefined;
  Promotion: {viewMoreUrl: string};
  GasStation: undefined;
  EVStation: undefined;
  Transactions: undefined;
  TransactionDetails: {transaction?: Transaction; transactionId?: string};
  ReserveEVCharger: {selectedStationId: string | undefined};
  ReserveEVChargerCallback: {
    stationId: string;
    stationName: string;
    stationAddress: string;
    paymentCardId: string;
    loyaltyCardId?: string;
    pumpNumber: number;
    pumpId: string;
    fuelAmount: number;
    passcode: string;
  };
  PurchaseFuel: {selectedStationId: string | undefined};
  FuelingUnlockEV: {station: FuelStation; pumpNumber: number; fuelAmount: number};
  Fueling: {
    stationName: string;
    stationAddress: string;
    paymentCardId: string;
    loyaltyCardId?: string;
    pumpNumber: number;
    pumpId: string;
    fuelAmount: number;
    passcode: string;
    isGas: boolean;
  };
  PaymentCards: undefined;
  LoyaltyCards: undefined;
};

export type ScreenState =
  | 'setNewPasscode'
  | 'confirmNewPasscode'
  | 'authenticate'
  | 'setBiometricAuth'
  | 'removeBiometricAuth'
  | 'forgotPasscode'
  | null;

export type FuelProgressStatus =
  | 'processing'
  | 'connecting'
  | 'ready'
  | 'fueling'
  | 'completed'
  | 'error';

export interface Merchant {
  merchantGuid: string;
  merchantName: string;
}

export interface FuelStation {
  id: string;
  coordinate: LatLng;
  stationName: string;
  stationAddress: string;
  totalPump: number;
  distance: number;
  formattedDistance: string;
  merchantGuid: string;
  pumpTypeCode: 'GAS' | 'ELE';
}

export interface FuelPump {
  pumpGuid: string; // Unique identifier for the pump
  pumpNumber: number; // Pump number at the station
  pumpStatusCode: string; // Status code (e.g., "IDL")
  pumpStatusDesc: string; // Human-readable status (e.g., "Idle")
  pumpTypeCode: string; // Fuel type code (e.g., "GAS")
  pumpTypeDesc: string; // Fuel type description (e.g., "Gasoline")
  pumpTypeGuid: string;
  stationGuid: string;
  masterMerchantGuid: string;
}

export interface FuelPumpAuthorizationRequestPayload {
  cardGuid: string;
  loyaltyGuid?: string;
  pumpGuid: string;
  transactionAmount: number;
  passcode: string;
}

export interface CardType {
  guid: string;
  code: string;
  description: string;
  category: string;
  subCategory: string;
}

export interface UserCard {
  customerGuid: string;
  cardGuid: string;
  primaryAccountNumber: string;
  cardScheme: string;
  merchantGuid: string;
  merchantName: string;
  cardExpiry: Date;
}

export interface AddUserCardRequestPayload {
  cardNumber: string;
  cardExpiry: string;
  masterMerchantGuid?: string;
  cardType: string;
}

export interface User {
  email: string;
  mobile: string;
  fullName: string;
  isPasscodeSetup?: boolean;
  isBiometricAuthSetup?: boolean;
}

export interface SignInRequestPayload {
  email: string;
  deviceUniqueId: string;
}

export interface VerifySignInRequestPayload {
  deviceUniqueId: string;
  oneTimePassword: string;
}

export interface SignUpRequestPayload extends SignInRequestPayload {}
export interface ForgotPasscodeRequestPayload extends SignInRequestPayload {}

export interface VerifySignUpRequestPayload extends VerifySignInRequestPayload {}
export interface ResetPasscodeRequestPayload extends VerifySignInRequestPayload {
  newPasscode: string;
}

export interface PasscodeRequestPayload {
  deviceUniqueId: string;
  passcode: string;
}

export interface ProfileRequestPayload {
  deviceUniqueId: string;
  mobile: string;
  fullName: string;
}

export interface Promotion {
  end: string;
  guid: string;
  imageUrl: string;
  masterMerchantGuid: string;
  start: string;
  title: string;
  viewMoreUrl: string;
}

export interface MerchantPumpPromotionRequestPayload {
  masterMerchantGuid?: string;
  pumpTypeGuid?: string;
}

export interface MerchantPumpPromotion {
  customerGuid: string;
  cardGuid: string;
  primaryAccountNumber: string;
  cardScheme: string;
  cardType: string;
  merchantGuid: string | null;
  merchantName: string | null;
  cardExpiry: string;
  cardToken: string;
  discountDescription: string;
  discountTitle: string;
  termsAndConditionUrl: string;
  creditCardDiscountGuid: string;
}

export interface Transaction {
  cardType: string;
  creditCardNumber: string;
  customerGuid: string;
  customerTransactionGuid: string;
  endTime: string | null;
  loyaltyCardInfo: string | null;
  loyaltyPoint: number | null;
  masterMerchantName: string;
  merchantName: string;
  preAuthAmount: number;
  productInfo: string | null;
  startTime: string;
  stationName: string;
  transactionFinalAmount: number | null;
  transactionStatus: string;
  transactionStatusCode: string;
}
