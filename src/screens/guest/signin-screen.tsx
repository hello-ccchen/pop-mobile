import React, {useRef, useState} from 'react';
import {SafeAreaView, View, TextInput as NativeTextInput, StyleSheet} from 'react-native';
import {Button, Snackbar, Text, TextInput} from 'react-native-paper';
import {getUniqueId} from 'react-native-device-info';
import {AuthService, SignInPayload} from '@services/auth-service';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore from '@store/index';

const SigninScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const passwordTextInput = useRef<NativeTextInput | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const setUser = useStore(state => state.setUser);
  const clearUser = useStore(state => state.clearUser);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignIn = async () => {
    if (!isValidEmail(email) || !password) {
      setError('Please enter a valid email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    const signInPayload: SignInPayload = {
      username: email,
      password,
      deviceUniqueId: (await getUniqueId()).toString(),
    };

    try {
      const response = await AuthService.signIn(signInPayload);
      setUser({
        username: email,
        email: response.email,
        mobile: response.mobile,
        profile: response.profile,
      });
    } catch (error) {
      clearUser();
      setError(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.label} variant="titleLarge">
          Email
        </Text>
        <TextInput
          mode="outlined"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => {
            if (passwordTextInput.current) {
              passwordTextInput.current.focus();
            }
          }}
          value={email}
          onChangeText={setEmail}
          disabled={isLoading}
          accessibilityLabel="Email input"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label} variant="titleLarge">
          Password
        </Text>
        <TextInput
          ref={passwordTextInput}
          mode="outlined"
          value={password}
          textContentType="password"
          returnKeyType="done"
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon
              icon={!showPassword ? 'eye-slash' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          disabled={isLoading}
          accessibilityLabel="Password input"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSignIn} disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </View>
      <Snackbar visible={!!error} onDismiss={() => setError('')}>
        {error}
      </Snackbar>
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
    marginTop: 25,
    marginHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 30,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  label: {
    fontWeight: 'bold',
  },
});

export default SigninScreen;
