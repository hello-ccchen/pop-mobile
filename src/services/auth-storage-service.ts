import * as Keychain from 'react-native-keychain';

const ACCESS_TOKEN_KEY = 'accessToken';
const PASSWORD_KEY = 'password';

export const AuthStorageService = {
  getAccessToken: async () => {
    const credentials = await Keychain.getGenericPassword({service: ACCESS_TOKEN_KEY});
    return credentials ? credentials.password : null;
  },

  setAccessToken: async (token: string) => {
    await Keychain.setGenericPassword(ACCESS_TOKEN_KEY, token, {service: ACCESS_TOKEN_KEY});
  },

  clearAccessToken: async () => {
    await Keychain.resetGenericPassword({service: ACCESS_TOKEN_KEY});
  },

  getPassword: async () => {
    const credentials = await Keychain.getGenericPassword({service: PASSWORD_KEY});
    return credentials ? credentials.password : null;
  },

  setPassword: async (password: string) => {
    await Keychain.setGenericPassword(PASSWORD_KEY, password, {service: PASSWORD_KEY});
  },

  clearPassword: async () => {
    await Keychain.resetGenericPassword({service: PASSWORD_KEY});
  },
};
