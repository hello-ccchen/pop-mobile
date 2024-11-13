import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput as NativeTextInput,
} from 'react-native';
import {Button, Snackbar, TextInput} from 'react-native-paper';
import {getUniqueId} from 'react-native-device-info';
import {AuthService, SignUpPayload} from '@services/auth-service';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore from '@store/index';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  retypePassword: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const SignupScreen = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    retypePassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const setUser = useStore(state => state.setUser);
  const clearUser = useStore(state => state.clearUser);

  const firstNameRef = useRef<NativeTextInput>(null);
  const lastNameRef = useRef<NativeTextInput>(null);
  const emailRef = useRef<NativeTextInput>(null);
  const mobileRef = useRef<NativeTextInput>(null);
  const passwordRef = useRef<NativeTextInput>(null);
  const retypePasswordRef = useRef<NativeTextInput>(null);

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({...prev, [name]: value}));
    setValidationErrors(prev => ({...prev, [name]: ''})); // Clear validation error when user starts typing
  };

  const formatFieldName = (field: string) => {
    return field
      .replace(/([A-Z])/g, ' $1') // Add space before each uppercase letter
      .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
  };

  const validate = (): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Validate required fields
    Object.keys(formData).forEach(field => {
      if (!formData[field as keyof FormData]) {
        errors[field] = `${formatFieldName(field)} is required`;
      }
    });

    // Validate email format
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate phone number (Malaysia format)
    const phoneRegex = /^01[0-9]{8,9}$/; // Mobile phone numbers starting with 01 and followed by 8-9 digits
    if (formData.mobile && !phoneRegex.test(formData.mobile)) {
      errors.mobile = 'Please enter a valid Malaysia phone number';
    }

    // Validate password (minimum 6 characters)
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Check if passwords match
    if (formData.password !== formData.retypePassword) {
      errors.retypePassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleSignUp = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

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
          {['firstName', 'lastName', 'email', 'mobile', 'password', 'retypePassword'].map(
            (field, index) => (
              <View key={field} style={styles.textContainer}>
                <TextInput
                  ref={
                    field === 'firstName'
                      ? firstNameRef
                      : field === 'lastName'
                      ? lastNameRef
                      : field === 'email'
                      ? emailRef
                      : field === 'mobile'
                      ? mobileRef
                      : field === 'password'
                      ? passwordRef
                      : retypePasswordRef
                  }
                  placeholder={formatFieldName(field)}
                  mode="outlined"
                  returnKeyType={index === 5 ? 'done' : 'next'}
                  secureTextEntry={
                    field === 'password'
                      ? !showPassword
                      : field === 'retypePassword'
                      ? !showRetypePassword
                      : false
                  }
                  onChangeText={value => handleChange(field as keyof FormData, value)}
                  value={formData[field as keyof FormData]}
                  keyboardType={
                    field === 'email'
                      ? 'email-address'
                      : field === 'mobile'
                      ? 'phone-pad'
                      : 'default'
                  }
                  error={Boolean(validationErrors[field])}
                  onSubmitEditing={() => {
                    if (index < 5) {
                      const nextField = [
                        firstNameRef,
                        lastNameRef,
                        emailRef,
                        mobileRef,
                        passwordRef,
                        retypePasswordRef,
                      ][index + 1];
                      nextField.current?.focus();
                    }
                  }}
                  right={
                    field === 'password' ? (
                      <TextInput.Icon
                        icon={showPassword ? 'eye' : 'eye-slash'}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    ) : field === 'retypePassword' ? (
                      <TextInput.Icon
                        icon={showRetypePassword ? 'eye' : 'eye-slash'}
                        onPress={() => setShowRetypePassword(!showRetypePassword)}
                      />
                    ) : null
                  }
                />
                {validationErrors[field] && (
                  <Text style={styles.errorText}>{validationErrors[field]}</Text>
                )}
              </View>
            ),
          )}
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleSignUp} disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </View>
          <Snackbar visible={isError} onDismiss={() => setIsError(false)}>
            Uh-oh... We can’t sign you up right now. 🥹
          </Snackbar>
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
    paddingBottom: 20,
  },
  textContainer: {
    marginTop: 25,
    marginHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 30,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default SignupScreen;
