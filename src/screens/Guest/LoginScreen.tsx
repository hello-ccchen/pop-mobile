import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  TextInput as NativeTextInput,
  StyleSheet,
} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import CustomTheme from '@styles/custom-theme';
import {useAuth} from '@contexts/AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const passwordTextInput = useRef<NativeTextInput | null>(null);
  const {login} = useAuth();

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
          onChangeText={value => setEmail(value)}
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
          onChangeText={value => setPassword(value)}
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon
              icon={!showPassword ? 'eye-slash' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => login()}>
          Log in
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: CustomTheme.colors.background,
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

export default LoginScreen;
