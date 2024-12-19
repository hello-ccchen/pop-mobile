declare module 'react-native-config' {
  export interface NativeConfig {
    API_URL_ANDROID: string;
    API_URL_IOS: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
