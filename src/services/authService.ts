import {getUniqueId} from 'react-native-device-info';
import {
  ForgotPasscodeRequestPayload,
  PasscodeRequestPayload,
  ResetPasscodeRequestPayload,
  SignInRequestPayload,
  SignUpRequestPayload,
  VerifySignInRequestPayload,
  VerifySignUpRequestPayload,
} from 'src/types';

import apiClient, {handleAxiosError, logError} from '@services/apiClient';
import {AuthStorageService} from '@services/authStorageService';
import {logger} from '@services/logger/loggerService';

const storeCredentials = async (token: string) => {
  await AuthStorageService.setAccessToken(token);
};

export const AuthService = {
  signIn: async (payload: SignInRequestPayload) => {
    try {
      const response = await apiClient.post('/auth/login', payload);
      logger.debug(`signIn request with status: ${response.status}`);
      const {token} = response.data;
      await storeCredentials(token);
      return token !== '';
    } catch (error) {
      logError('signIn', error);
      throw new Error(handleAxiosError(error));
    }
  },

  verifySignIn: async (payload: VerifySignInRequestPayload) => {
    try {
      const response = await apiClient.post('/auth/loginOTP', payload);
      logger.debug(`verifySignIn request with status: ${response.status}`);
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
      logger.debug(`refreshToken request with status: ${response.status}`);
      const {token} = response.data;
      await storeCredentials(token);
      return token !== '';
    } catch (error) {
      logError('refreshToken', error);
      throw new Error(handleAxiosError(error));
    }
  },

  signUp: async (payload: SignUpRequestPayload) => {
    try {
      const response = await apiClient.post('/customer', payload);
      logger.debug(`signUp request with status: ${response.status}`);
      const {token} = response.data;
      await storeCredentials(token);
      return token !== '';
    } catch (error) {
      logError('signUp', error);
      throw new Error(handleAxiosError(error));
    }
  },

  verifySignUp: async (payload: VerifySignUpRequestPayload) => {
    try {
      const response = await apiClient.post('/customer/verifyOTP', payload);
      logger.debug(`verifySignUp request with status: ${response.status}`);
      const {token} = response.data;
      await storeCredentials(token);
      return token !== '';
    } catch (error) {
      logError('verifySignUp', error);
      throw new Error(handleAxiosError(error));
    }
  },

  createPasscode: async (payload: PasscodeRequestPayload) => {
    try {
      const response = await apiClient.post('/customer/passcode', payload);
      logger.debug(`createPasscode request with status: ${response.status}`);
      const {passcodeExists} = response.data;
      return passcodeExists;
    } catch (error) {
      logError('createPasscode', error);
      throw new Error(handleAxiosError(error));
    }
  },

  validatePasscode: async (payload: PasscodeRequestPayload) => {
    try {
      const response = await apiClient.post('/customer/passcodeverify', payload);
      logger.debug(`verifyPasscode request with status: ${response.status}`);
      return response.data;
    } catch (error) {
      logError('verifyPasscode', error);
      throw new Error(handleAxiosError(error));
    }
  },

  forgotPasscode: async (payload: ForgotPasscodeRequestPayload) => {
    try {
      const response = await apiClient.post('/customer/forgotpasscode', payload);
      logger.debug(`forgotPasscode request OTP success with status: ${response.status}`);
      const {token} = response.data;
      return token !== '';
    } catch (error) {
      logError('forgotPasscode', error);
      throw new Error(handleAxiosError(error));
    }
  },

  resetPasscode: async (payload: ResetPasscodeRequestPayload) => {
    try {
      const response = await apiClient.put('/customer/forgotpasscode', payload);
      logger.debug(`resetPasscode request with status: ${response.status}`);
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
      logger.error('signOut request failed with unknown error:', error);
      throw error;
    }
  },
};
