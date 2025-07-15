import React, {useState} from 'react';
import {SafeAreaView, View, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {getUniqueId} from 'react-native-device-info';
import {SignInRequestPayload, VerifySignInRequestPayload} from 'src/types';
import {AuthService} from '@services/authService';
import theme from '@styles/theme';
import useStore from '@store/index';
import useForm from '@hooks/useForm';
import EmailInput from '@components/EmailInput';
import AppSnackbar from '@components/Snackbar';
import OneTimePasswordModal from '@components/OTPModal';

const SigninScreen = () => {
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
  });
  const [shouldPromptOTP, setShouldPromptOTP] = useState<boolean>(false);
  const setUser = useStore(state => state.setUser);

  const isValidFormData = () => {
    const errors: {[key: string]: string} = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async () => {
    if (!isValidFormData()) {
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setValidationErrors({});

    const signInPayload: SignInRequestPayload = {
      email: formData.email,
      deviceUniqueId: (await getUniqueId()).toString(),
    };

    try {
      const isSignIn = await AuthService.signIn(signInPayload);
      if (!isSignIn) {
        throw Error('AuthService.signIn error');
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
      const verifySignInPayload: VerifySignInRequestPayload = {
        oneTimePassword: otp,
        deviceUniqueId: (await getUniqueId()).toString(),
      };
      const response = await AuthService.verifySignIn(verifySignInPayload);
      if (!response) {
        throw new Error('AuthService.verifySignIn error');
      }
      setUser({
        fullName: response.fullName,
        email: response.email,
        mobile: response.mobile,
        isPasscodeSetup: response.passcodeExists,
        isBiometricAuthSetup: false,
      });
    } catch (error) {
      setIsError(true);
    } finally {
      setShouldPromptOTP(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <EmailInput
          value={formData.email}
          onChangeText={value => handleChangeText('email', value)}
          errorMessage={validationErrors.email}
          disabled={isLoading}
          returnKeyType="done"
          onSubmitEditing={handleSignIn}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSignIn} disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </View>

      <OneTimePasswordModal
        userEmail={formData.email}
        isVisible={shouldPromptOTP}
        onDismiss={() => setShouldPromptOTP(false)}
        onOTPComplete={handleOTPComplete}
        onResendOTP={handleSignIn}
      />

      <AppSnackbar
        visible={isError}
        message="Uh-oh... We can’t sign you in right now. 🥹"
        onDismiss={() => setIsError(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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

export default SigninScreen;
