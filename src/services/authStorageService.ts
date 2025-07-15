import * as Keychain from 'react-native-keychain';
import {ACCESSIBLE, ACCESS_CONTROL, setGenericPassword} from 'react-native-keychain';

const ACCESS_TOKEN_KEY = 'accessToken';
const PASSCODE_KEY = 'passcode';

export const AuthStorageService = {
  setAccessToken: async (token: string) => {
    await Keychain.setGenericPassword(ACCESS_TOKEN_KEY, token, {service: ACCESS_TOKEN_KEY});
  },

  getAccessToken: async () => {
    const credentials = await Keychain.getGenericPassword({service: ACCESS_TOKEN_KEY});
    return credentials ? credentials.password : null;
  },

  clearAccessToken: async () => {
    await Keychain.resetGenericPassword({service: ACCESS_TOKEN_KEY});
  },

  setBiometricPasscode: async (passcode: string) => {
    await setGenericPassword(PASSCODE_KEY, passcode, {
      accessControl: ACCESS_CONTROL.BIOMETRY_ANY,
      accessible: ACCESSIBLE.WHEN_UNLOCKED,
    });
  },

  getBiometricPasscode: async () => {
    const credentials = await Keychain.getGenericPassword({
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
      authenticationPrompt: {
        title: 'Authenticate with Face ID/Touch ID',
        subtitle: 'Please authenticate to access secure data',
      },
    });
    return credentials ? credentials.password : null;
  },

  clearBiometricPasscode: async () => {
    await Keychain.resetGenericPassword({service: PASSCODE_KEY});
  },
};
