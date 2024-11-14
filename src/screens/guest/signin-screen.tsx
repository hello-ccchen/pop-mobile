import React, {useRef} from 'react';
import {SafeAreaView, View, StyleSheet, TextInput as RNTextInput} from 'react-native';
import {Button} from 'react-native-paper';
import {getUniqueId} from 'react-native-device-info';
import {AuthService, SignInPayload} from '@services/auth-service';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore from '@store/index';
import useForm from '@hooks/use-form';
import EmailInput from '@components/email-input';
import PasswordInput from '@components/password-input';
import ErrorSnackbar from '@components/error-snackbar';

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
    password: '',
  });

  const setUser = useStore(state => state.setUser);
  const clearUser = useStore(state => state.clearUser);

  const passwordRef = useRef<RNTextInput>(null);

  const isValidFormData = () => {
    const errors: {[key: string]: string} = {};
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async () => {
    if (!isValidFormData()) return;

    setIsLoading(true);
    setIsError(false);
    setValidationErrors({});

    const signInPayload: SignInPayload = {
      username: formData.email,
      password: formData.password,
      deviceUniqueId: (await getUniqueId()).toString(),
    };

    try {
      const response = await AuthService.signIn(signInPayload);
      setUser({
        username: formData.email,
        email: response.email,
        mobile: response.mobile,
        profile: response.profile,
      });
    } catch (error) {
      clearUser();
      setIsError(true);
    } finally {
      setIsLoading(false);
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
          returnKeyType="next"
          onSubmitEditing={() => {
            passwordRef.current?.focus();
          }}
        />
      </View>

      <View style={styles.textContainer}>
        <PasswordInput
          ref={passwordRef}
          value={formData.password}
          onChangeText={value => handleChangeText('password', value)}
          errorMessage={validationErrors.password}
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

      <ErrorSnackbar
        visible={isError}
        errorMessage="Uh-oh... We can’t sign you in right now. 🥹"
        onDismiss={() => setIsError(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
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
