import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {getUniqueId} from 'react-native-device-info';
import {BIOMETRY_TYPE, getSupportedBiometryType} from 'react-native-keychain';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  AppStackScreenParams,
  ScreenState,
  User,
  PasscodeRequestPayload,
  ResetPasscodeRequestPayload,
} from 'src/types';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore from '@store/index';
import {AuthStorageService} from '@services/authStorageService';
import {AuthService} from '@services/authService';
import {logger} from '@services/logger/loggerService';

const MAX_RETRY_COUNT = 3;
const PASSCODE_LENGTH = 6;

const PasscodeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'Passcode'>>();
  const route = useRoute<RouteProp<AppStackScreenParams, 'Passcode'>>();
  const user = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);
  const [screenState, setScreenState] = useState<ScreenState>(null);
  const [initialPasscode, setInitialPasscode] = useState('');
  const [passcode, setPasscode] = useState('');
  const [biometricType, setBiometricType] = useState<BIOMETRY_TYPE | null>(null);
  const [oneTimePassword, setOneTimePassword] = useState<string>('');
  const [_retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const {screenState: routeScreenState, OTP} = route.params || {};
    if (routeScreenState === 'forgotPasscode' && OTP && OTP.length === 6) {
      setOneTimePassword(OTP);
      setScreenState('forgotPasscode');
    } else if (routeScreenState === 'removeBiometricAuth') {
      setScreenState('removeBiometricAuth');
    } else if (routeScreenState === 'setBiometricAuth') {
      setScreenState('setBiometricAuth');
    } else if (user && user.isPasscodeSetup) {
      setScreenState('authenticate');
    } else {
      setScreenState('setNewPasscode');
    }
  }, []);

  const handleBiometricAuthentication = useCallback(async () => {
    logger.debug('Biometric Auth Setup:', user?.isBiometricAuthSetup);

    try {
      if (user?.isBiometricAuthSetup) {
        const biometricPasscode = await AuthStorageService.getBiometricPasscode();
        logger.debug('Valid Biometric Passcode:', !!biometricPasscode);

        if (biometricPasscode) {
          setPasscode('');
          setScreenState(null);
          navigateAfterAuthentication(
            route.params?.nextScreen,
            route.params?.nextScreenParams,
            biometricPasscode,
          );
        } else {
          setPasscode('');
          Alert.alert('Biometric Authentication Error', 'Kindly use your passcode.');
        }
      } else {
        const biometric = await getSupportedBiometryType();
        if (biometric) {
          setBiometricType(biometric);
          logger.debug('Biometric Supported on this device:', biometric);
        } else {
          logger.debug('No Biometric Support on this device');
        }
      }
    } catch (error) {
      logger.error('Biometric Failed:', error);
      Alert.alert('Biometric Failed', 'Kindly use your passcode.');
    }
  }, [user, navigation]);

  useEffect(() => {
    if (screenState !== 'setBiometricAuth' && screenState !== 'authenticate') {
      return;
    }

    handleBiometricAuthentication();
  }, [screenState, handleBiometricAuthentication]);

  const handleNumberPress = (digit: string) => {
    if (passcode.length < PASSCODE_LENGTH) {
      setPasscode(prev => prev + digit);
    }
  };

  const handleDeletePress = () => {
    setPasscode(prev => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (passcode.length !== PASSCODE_LENGTH) {
      Alert.alert('Incomplete Passcode', 'Please enter a 6-digit Passcode.');
      return;
    }

    const deviceUniqueId = (await getUniqueId()).toString();

    switch (screenState) {
      case 'setNewPasscode':
        await handleSetNewPasscode();
        break;

      case 'confirmNewPasscode':
        await handleConfirmNewPasscode(deviceUniqueId);
        break;

      case 'forgotPasscode':
        await handleForgotPasscode(deviceUniqueId);
        break;

      case 'authenticate':
        await handleAuthenticate(deviceUniqueId);
        break;

      case 'setBiometricAuth':
        await handleSetBiometricAuth(deviceUniqueId);
        break;

      case 'removeBiometricAuth':
        await handleRemoveBiometricAuth(deviceUniqueId);
        break;

      default:
        logger.warn('Unexpected screenState:', screenState);
    }
  };

  const handleEnableBiometricAuth = () => {
    setScreenState('setBiometricAuth');
    setPasscode('');
  };

  const handleSetNewPasscode = async () => {
    setInitialPasscode(passcode);
    setPasscode('');
    setScreenState('confirmNewPasscode');
  };

  const handleConfirmNewPasscode = async (deviceUniqueId: string) => {
    if (passcode !== initialPasscode) {
      Alert.alert('Passcode Mismatch', 'Passcodes do not match. Please try again.');
      resetSetNewPasscodeState();
      return;
    }

    try {
      const passcodePayload: PasscodeRequestPayload = {
        passcode: passcode,
        deviceUniqueId: deviceUniqueId,
      };
      const response = await AuthService.createPasscode(passcodePayload);
      if (!response) {
        throw new Error('AuthService.createPasscode failed.');
      }
      setUser({
        ...(user as User),
        isPasscodeSetup: true,
        isBiometricAuthSetup: false,
      });
    } catch (error) {
      logger.error('handleConfirmNewPasscode error:', error);
      resetSetNewPasscodeState();
    }
  };

  const handleForgotPasscode = async (deviceUniqueId: string) => {
    try {
      const passcodePayload: ResetPasscodeRequestPayload = {
        newPasscode: passcode,
        oneTimePassword: oneTimePassword,
        deviceUniqueId,
      };
      const response = await AuthService.resetPasscode(passcodePayload);

      if (!response) {
        throw new Error('AuthService.resetPasscode failed.');
      }

      if (user?.isBiometricAuthSetup) {
        await AuthStorageService.setBiometricPasscode(passcode);
      }

      showResetAlert('Passcode Reset Successful', 'You can now use your new passcode.');
    } catch (error) {
      logger.error('handleForgotPasscode error:', error);
      showResetAlert('Passcode Reset Failed', 'Failed to reset passcode. Please try again.');
    }
  };

  const handleAuthenticate = async (deviceUniqueId: string) => {
    const passcodePayload: PasscodeRequestPayload = {
      passcode: passcode,
      deviceUniqueId: deviceUniqueId,
    };
    const response = await AuthService.validatePasscode(passcodePayload);
    if (response) {
      setPasscode('');
      setScreenState(null);
      setRetryCount(0);
      navigateAfterAuthentication(
        route.params?.nextScreen,
        route.params?.nextScreenParams,
        passcodePayload.passcode,
      );
    } else {
      handleInvalidPasscodeRetry();
      setPasscode('');
    }
  };

  const handleSetBiometricAuth = async (deviceUniqueId: string) => {
    const passcodePayload: PasscodeRequestPayload = {
      passcode: passcode,
      deviceUniqueId: deviceUniqueId,
    };
    const response = await AuthService.validatePasscode(passcodePayload);
    if (response) {
      await AuthStorageService.setBiometricPasscode(passcode);
      setScreenState('authenticate');
      setPasscode('');
      setUser({
        ...(user as User),
        isBiometricAuthSetup: true,
      });
    } else {
      handleInvalidPasscodeRetry();
      setPasscode('');
    }
  };

  const handleRemoveBiometricAuth = async (deviceUniqueId: string) => {
    const passcodePayload: PasscodeRequestPayload = {
      passcode: passcode,
      deviceUniqueId: deviceUniqueId,
    };
    const response = await AuthService.validatePasscode(passcodePayload);
    if (response) {
      await AuthStorageService.clearBiometricPasscode();
      setUser({
        ...(user as User),
        isBiometricAuthSetup: false,
      });
      resetStateAndNavigate();
    } else {
      handleInvalidPasscodeRetry();
      setPasscode('');
    }
  };

  const handleInvalidPasscodeRetry = () => {
    setRetryCount(prev => {
      const newCount = prev + 1;
      if (newCount >= MAX_RETRY_COUNT) {
        Alert.alert(
          'Authentication Failed',
          'Maximum retry limit exceeded. Redirecting to Home Screen.',
          [{text: 'OK', onPress: () => navigation.navigate('Home')}],
        );
      } else {
        Alert.alert('Incorrect Passcode', 'Please try again.');
      }
      return newCount;
    });
  };

  const resetSetNewPasscodeState = () => {
    setInitialPasscode('');
    setPasscode('');
    setScreenState('setNewPasscode');
  };

  const showResetAlert = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: 'OK',
        onPress: () => {
          resetStateAndNavigate();
        },
      },
    ]);
  };

  const resetStateAndNavigate = () => {
    setPasscode('');
    setScreenState(null);
    navigation.goBack();
  };

  const renderPasscodeDots = () => {
    return Array.from({length: PASSCODE_LENGTH}).map((_, index) => (
      <View
        key={index}
        style={[
          styles.passcodeDot,
          {
            backgroundColor:
              passcode.length > index
                ? CUSTOM_THEME_COLOR_CONFIG.colors.primary
                : CUSTOM_THEME_COLOR_CONFIG.colors.secondary,
          },
        ]}
      />
    ));
  };

  const getScreenText = (state: ScreenState) => {
    switch (state) {
      case 'setNewPasscode':
        return {
          title: 'Create new passcode',
          description: 'Set up a new 6-digit passcode to secure your payment verification.',
        };
      case 'confirmNewPasscode':
        return {
          title: 'Confirm your passcode',
          description: 'Please re-enter your passcode to confirm.',
        };
      case 'forgotPasscode':
        return {
          title: 'Set New Passcode',
          description: 'Enter a new 6-digit passcode to reset your forgotten passcode.',
        };
      case 'authenticate':
        return {
          title: 'Enter your passcode',
          description: 'Authenticate to proceed.',
        };
      case 'setBiometricAuth':
        return {
          title: 'Enable Biometric Authentication',
          description: 'Verify your passcode to enable biometric authentication.',
        };
      case 'removeBiometricAuth':
        return {
          title: 'Disable Biometric Authentication',
          description: 'Verify your passcode to disable biometric authentication.',
        };
      default:
        return {title: '', description: ''};
    }
  };

  const navigateAfterAuthentication = (
    nextScreen?: keyof AppStackScreenParams,
    nextScreenParams?: object,
    enteredPasscode?: string,
  ) => {
    if (nextScreen) {
      navigation.replace(nextScreen, {...nextScreenParams, passcode: enteredPasscode});
    } else {
      navigation.goBack();
    }
  };

  const {title, description} = getScreenText(screenState);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="titleLarge" style={styles.title}>
          {title}
        </Text>
        <Text variant="titleSmall" style={styles.description}>
          {description}
        </Text>
      </View>

      <View style={styles.passcodeDotsContainer}>{renderPasscodeDots()}</View>

      <View style={styles.keypadContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'X', 0, 'done'].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.keyButton}
            onPress={() => {
              if (item === 'X') {
                handleDeletePress();
              } else if (item === 'done') {
                handleSubmit();
              } else {
                handleNumberPress(item.toString());
              }
            }}
            accessibilityLabel={
              item === 'X' ? 'Delete' : item === 'done' ? 'Submit' : `Number ${item}`
            }>
            {item === 'X' ? (
              <Icon name="delete-left" size={24} color={CUSTOM_THEME_COLOR_CONFIG.colors.surface} />
            ) : item === 'done' ? (
              <Icon
                name="circle-check"
                size={24}
                color={CUSTOM_THEME_COLOR_CONFIG.colors.surface}
              />
            ) : (
              <Text variant="titleLarge" style={styles.keyText}>
                {item}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {screenState === 'authenticate' &&
        user?.isBiometricAuthSetup === false &&
        biometricType !== null && (
          <View style={styles.buttonContainer}>
            <Button
              style={{width: '70%'}}
              mode="text"
              labelStyle={{fontWeight: 'bold'}}
              onPress={handleEnableBiometricAuth}>
              Enable Biometric - {biometricType}
            </Button>
          </View>
        )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
  },
  headerContainer: {
    marginTop: 35,
    marginBottom: 15,
    marginHorizontal: 25,
    flexDirection: 'column',
    alignItems: 'center',
    height: '10%',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    color: '#6b6b6b',
  },
  forgotPasscodeButton: {
    marginBottom: 20,
    width: '70%',
  },
  passcodeDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  passcodeDot: {
    width: 15,
    height: 15,
    margin: 10,
    borderRadius: 50,
  },
  keypadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '80%',
    aspectRatio: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  keyButton: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
    borderRadius: 50,
  },
  keyText: {
    fontWeight: 'bold',
    fontSize: 28,
    color: CUSTOM_THEME_COLOR_CONFIG.colors.surface,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    color: CUSTOM_THEME_COLOR_CONFIG.colors.surface,
  },
  otpFormContainer: {
    marginTop: 15,
    marginHorizontal: 20,
  },
});

export default PasscodeScreen;
