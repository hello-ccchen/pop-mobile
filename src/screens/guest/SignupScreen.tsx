import React, {useEffect, useRef, useState} from 'react';
import {
  BackHandler,
  Platform,
  TextInput as RNTextInput,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {getUniqueId} from 'react-native-device-info';
import {Button, HelperText, TextInput} from 'react-native-paper';
import {
  AppStackScreenParams,
  ProfileRequestPayload,
  SignUpRequestPayload,
  VerifySignUpRequestPayload,
} from 'src/types';

import EmailInput from '@components/EmailInput';
import OneTimePasswordModal from '@components/OTPModal';
import AppSnackbar from '@components/Snackbar';
import useForm from '@hooks/useForm';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthService} from '@services/authService';
import {ProfileService} from '@services/profileService';
import useStore from '@store/index';
import theme from '@styles/theme';

type SignupScreenState = 'initial' | 'updateProfile';

const SignupScreen = () => {
  const {
    formData,
    validationErrors,
    handleChangeText,
    setValidationErrors,
    isLoading,
    setIsLoading,
    isError,
    setIsError,
  } = useForm({
    email: '',
    mobile: '',
    fullname: '',
  });
  const mobilePhoneRef = useRef<RNTextInput>(null);
  const [screenState, setScreenState] = useState<SignupScreenState>('initial');
  const [shouldPromptOTP, setShouldPromptOTP] = useState<boolean>(false);
  const setUser = useStore(state => state.setUser);
  const clearUser = useStore(state => state.clearUser);

  const navigation = useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'SignUp'>>();

  useEffect(() => {
    navigation.setOptions({
      headerBackVisible: screenState === 'initial',
    });
  }, [navigation, screenState]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const onBackPress = () => {
        if (screenState !== 'initial') {
          // Prevent back press if not in the 'initial' state
          return true;
        }
        // Allow default behavior
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }
  }, [screenState]);

  const isValidFormData = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    }

    if (screenState === 'updateProfile') {
      if (!formData.mobile) {
        errors.mobile = 'Mobile phone number is required';
      }
      if (!formData.fullname) {
        errors.fullname = 'Fullname is required';
      }

      const phoneRegex = /^01[0-9]{8,9}$/; // Phone number validation (Malaysian format)
      if (formData.mobile && !phoneRegex.test(formData.mobile)) {
        errors.mobile = 'Please enter a valid Malaysian mobile phone number';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async () => {
    if (!isValidFormData()) {
      return;
    }

    setIsLoading(true);
    setIsError(false);

    const signUpPayload: SignUpRequestPayload = {
      email: formData.email,
      deviceUniqueId: (await getUniqueId()).toString(),
    };

    try {
      const isSignUp = await AuthService.signUp(signUpPayload);
      if (!isSignUp) {
        throw Error('AuthService.signUp error');
      }
      setShouldPromptOTP(true);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPComplete = async (otp: string) => {
    try {
      const verifySignUpPayload: VerifySignUpRequestPayload = {
        oneTimePassword: otp,
        deviceUniqueId: (await getUniqueId()).toString(),
      };
      const isSignUpVerify = await AuthService.verifySignUp(verifySignUpPayload);
      if (!isSignUpVerify) {
        throw new Error('AuthService.verifySignUp error');
      }
      setScreenState('updateProfile');
    } catch (error) {
      setIsError(true);
    } finally {
      setShouldPromptOTP(false);
    }
  };

  const handleCreateProfile = async () => {
    if (!isValidFormData()) {
      return;
    }

    setIsLoading(true);
    setIsError(false);

    const profilePayload: ProfileRequestPayload = {
      mobile: formData.mobile,
      fullName: formData.fullname,
      deviceUniqueId: (await getUniqueId()).toString(),
    };

    try {
      const response = await ProfileService.createProfile(profilePayload);
      if (!response) {
        throw new Error('ProfileService.createProfile error');
      }
      setUser({
        fullName: response.fullName,
        email: response.email,
        mobile: response.mobile,
      });
    } catch (error) {
      setIsError(true);
      clearUser();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {screenState === 'initial' && (
        <>
          <View style={styles.textContainer}>
            <EmailInput
              value={formData.email}
              onChangeText={value => handleChangeText('email', value)}
              errorMessage={validationErrors.email}
              disabled={isLoading}
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleSignUp} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Continue'}
            </Button>
          </View>
        </>
      )}

      {screenState === 'updateProfile' && (
        <>
          <View style={styles.textContainer}>
            <TextInput
              label="Fullname"
              mode="outlined"
              value={formData.fullname}
              onChangeText={value => handleChangeText('fullname', value)}
              error={Boolean(validationErrors.fullname)}
              disabled={isLoading}
              returnKeyType="next"
              onSubmitEditing={() => {
                mobilePhoneRef.current?.focus();
              }}
            />
            {validationErrors.fullname && (
              <HelperText type="error">{validationErrors.fullname}</HelperText>
            )}
          </View>
          <View style={styles.textContainer}>
            <TextInput
              ref={mobilePhoneRef}
              label="Mobile Phone Number"
              mode="outlined"
              keyboardType="phone-pad"
              value={formData.mobile}
              onChangeText={value => handleChangeText('mobile', value)}
              error={Boolean(validationErrors.mobile)}
              disabled={isLoading}
              returnKeyType="done"
              onSubmitEditing={handleCreateProfile}
            />
            {validationErrors.mobile && (
              <HelperText type="error">{validationErrors.mobile}</HelperText>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleCreateProfile} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Submit'}
            </Button>
          </View>
        </>
      )}

      <OneTimePasswordModal
        userEmail={formData.email}
        isVisible={shouldPromptOTP}
        onDismiss={() => setShouldPromptOTP(false)}
        onOTPComplete={handleOTPComplete}
        onResendOTP={handleSignUp}
      />

      <AppSnackbar
        visible={isError}
        message="Uh-oh... We can’t sign you up right now. 🥹"
        onDismiss={() => setIsError(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  textContainer: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 30,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default SignupScreen;
