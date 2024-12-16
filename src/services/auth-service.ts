import apiClient, {handleAxiosError, logError} from '@services/api-client';
import {AuthStorageService} from '@services/auth-storage-service';
import {getUniqueId} from 'react-native-device-info';

export interface SignInPayload {
  email: string;
  deviceUniqueId: string;
}

export interface VerifySignInPayload {
  deviceUniqueId: string;
  oneTimePassword: string;
}

export interface SignUpPayload extends SignInPayload {}
export interface ForgotPasscodePayload extends SignInPayload {}

export interface VerifySignUpPayload extends VerifySignInPayload {}
export interface ResetPasscodePayload extends VerifySignInPayload {
  newPasscode: string;
}

export interface PasscodePayload {
  deviceUniqueId: string;
  passcode: string;
}
const storeCredentials = async (token: string) => {
  await AuthStorageService.setAccessToken(token);
};

export const AuthService = {
  signIn: async (payload: SignInPayload) => {
    try {
      const response = await apiClient.post('/auth/login', payload);
      console.log('signIn request with status:', response.status);
      const {token} = response.data;
      await storeCredentials(token);
      return token !== '';
    } catch (error) {
      logError('signIn', error);
      throw new Error(handleAxiosError(error));
    }
  },

  verifySignIn: async (payload: VerifySignInPayload) => {
    try {
      const response = await apiClient.post('/auth/loginOTP', payload);
      console.log('verifySignIn request with status:', response.status);
      const {token, ...userData} = response.data;
      await storeCredentials(token);
      return userData;
    } catch (error) {
      logError('verifySignIn', error);
      throw new Error(handleAxiosError(error));
    }
  },

  // TODO: currently this is not in used, can consider to remove in future
  refreshToken: async () => {
    const deviceUniqueId = (await getUniqueId()).toString();
    try {
      const payload = {deviceUniqueId: deviceUniqueId};
      const response = await apiClient.post('/auth/tokenrefresh', payload);
      console.log('refreshToken request with status:', response.status);
      const {token} = response.data;
      await storeCredentials(token);
      return token !== '';
    } catch (error) {
      logError('refreshToken', error);
      throw new Error(handleAxiosError(error));
    }
  },

  signUp: async (payload: SignUpPayload) => {
    try {
      const response = await apiClient.post('/customer', payload);
      console.log('signUp request with status:', response.status);
      const {token} = response.data;
      await storeCredentials(token);
      return token !== '';
    } catch (error) {
      logError('signUp', error);
      throw new Error(handleAxiosError(error));
    }
  },

  verifySignUp: async (payload: VerifySignUpPayload) => {
    try {
      const response = await apiClient.post('/customer/verifyOTP', payload);
      console.log('verifySignUp request with status:', response.status);
      const {token} = response.data;
      await storeCredentials(token);
      return token !== '';
    } catch (error) {
      logError('verifySignUp', error);
      throw new Error(handleAxiosError(error));
    }
  },

  createPasscode: async (payload: PasscodePayload) => {
    try {
      const response = await apiClient.post('/customer/passcode', payload);
      console.log('createPasscode request with status:', response.status);
      const {passcodeExists} = response.data;
      return passcodeExists;
    } catch (error) {
      logError('createPasscode', error);
      throw new Error(handleAxiosError(error));
    }
  },

  validatePasscode: async (payload: PasscodePayload) => {
    try {
      const response = await apiClient.post('/customer/passcodeverify', payload);
      console.log('verifyPasscode request with status:', response.status);
      return response.data;
    } catch (error) {
      logError('verifyPasscode', error);
      throw new Error(handleAxiosError(error));
    }
  },

  forgotPasscode: async (payload: ForgotPasscodePayload) => {
    try {
      const response = await apiClient.post('/customer/forgotpasscode', payload);
      console.log('forgotPasscode request OTP success with status:', response.status);
      const {token} = response.data;
      return token !== '';
    } catch (error) {
      logError('forgotPasscode', error);
      throw new Error(handleAxiosError(error));
    }
  },

  resetPasscode: async (payload: ResetPasscodePayload) => {
    try {
      const response = await apiClient.put('/customer/forgotpasscode', payload);
      console.log('resetPasscode request with status:', response.status);
      return response.data;
    } catch (error) {
      logError('resetPasscode', error);
      throw new Error(handleAxiosError(error));
    }
  },

  signOut: async () => {
    try {
      await AuthStorageService.clearAccessToken();
      await AuthStorageService.clearBiometricPasscode();
    } catch (error) {
      console.log('signOut request failed with unknown error:', error);
      throw error;
    }
  },
};
