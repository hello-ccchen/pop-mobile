import React, {useRef} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput as RNTextInput,
} from 'react-native';
import {Button, HelperText, TextInput} from 'react-native-paper';
import {getUniqueId} from 'react-native-device-info';
import {AuthService, SignUpPayload} from '@services/auth-service';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore from '@store/index';
import useForm from '@hooks/use-form';
import ErrorSnackbar from '@components/error-snackbar';
import EmailInput from '@components/email-input';
import PasswordInput from '@components/password-input';

const SignupScreen = () => {
  const {
    formData,
    validationErrors,
    handleChangeText,
    setValidationErrors,
    setIsLoading,
    setIsError,
    isLoading,
    isError,
  } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const setUser = useStore(state => state.setUser);
  const clearUser = useStore(state => state.clearUser);

  const lastNameRef = useRef<RNTextInput>(null);
  const mobileRef = useRef<RNTextInput>(null);
  const emailRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);
  const retypePasswordRef = useRef<RNTextInput>(null);

  const isValidFormData = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.mobile) errors.mobile = 'Mobile Phone Number is required';

    if (!formData.password) errors.password = 'Password is required';
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (formData.password && !passwordRegex.test(formData.password))
      errors.password =
        'Password must be at least 6 characters and include uppercase, lowercase, number, and symbol';
    if (formData.password !== formData.confirmPassword)
      errors.retypePassword = 'Passwords do not match';

    const phoneRegex = /^01[0-9]{8,9}$/; // Phone number validation (Malaysian format)
    if (formData.mobile && !phoneRegex.test(formData.mobile))
      errors.mobile = 'Please enter a valid Malaysian mobile phone number';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async () => {
    if (!isValidFormData()) return;

    setIsLoading(true);
    setIsError(false);

    const signUpPayload: SignUpPayload = {
      username: formData.email,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
      deviceUniqueId: (await getUniqueId()).toString(),
      profile: {firstName: formData.firstName, lastName: formData.lastName},
    };

    try {
      const response = await AuthService.signUp(signUpPayload);
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.textContainer}>
            <TextInput
              label="First Name"
              mode="outlined"
              value={formData.firstName}
              onChangeText={value => handleChangeText('firstName', value)}
              error={Boolean(validationErrors.firstName)}
              disabled={isLoading}
              returnKeyType="next"
              onSubmitEditing={() => {
                lastNameRef.current?.focus();
              }}
            />
            {validationErrors.firstName && (
              <HelperText type="error">{validationErrors.firstName}</HelperText>
            )}
          </View>

          <View style={styles.textContainer}>
            <TextInput
              ref={lastNameRef}
              label="Last Name"
              mode="outlined"
              value={formData.lastName}
              onChangeText={value => handleChangeText('lastName', value)}
              error={Boolean(validationErrors.lastName)}
              disabled={isLoading}
              returnKeyType="next"
              onSubmitEditing={() => {
                mobileRef.current?.focus();
              }}
            />
            {validationErrors.lastName && (
              <HelperText type="error">{validationErrors.lastName}</HelperText>
            )}
          </View>

          <View style={styles.textContainer}>
            <TextInput
              ref={mobileRef}
              label="Mobile Phone Number"
              mode="outlined"
              keyboardType="phone-pad"
              value={formData.mobile}
              onChangeText={value => handleChangeText('mobile', value)}
              error={Boolean(validationErrors.mobile)}
              disabled={isLoading}
              returnKeyType="next"
              onSubmitEditing={() => {
                emailRef.current?.focus();
              }}
            />
            {validationErrors.mobile && (
              <HelperText type="error">{validationErrors.mobile}</HelperText>
            )}
          </View>

          <View style={styles.textContainer}>
            <EmailInput
              ref={emailRef}
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
              returnKeyType="next"
              onSubmitEditing={() => {
                retypePasswordRef.current?.focus();
              }}
            />
          </View>

          <View style={styles.textContainer}>
            <PasswordInput
              ref={retypePasswordRef}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={value => handleChangeText('confirmPassword', value)}
              errorMessage={validationErrors.confirmPassword}
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleSignUp} disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </View>

          <ErrorSnackbar
            visible={isError}
            errorMessage="Uh-oh... We can’t sign you up right now. 🥹"
            onDismiss={() => setIsError(false)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
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
