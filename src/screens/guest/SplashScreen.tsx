import React from 'react';
import {Image, SafeAreaView, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {AppStackScreenParams} from 'src/types';

import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import theme from '@styles/theme';

const SplashScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'Splash'>>();

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../../assets/icon.gif')}
        resizeMode="contain"
      />
      <Text variant="headlineMedium" style={styles.header}>
        Pay on Pump
      </Text>
      <Button
        style={styles.button}
        icon="right-to-bracket"
        mode="contained"
        onPress={() => navigation.navigate('SignIn')}>
        Sign in
      </Button>
      <Button
        style={styles.button}
        icon="pencil"
        mode="outlined"
        onPress={() => navigation.navigate('SignUp')}>
        Sign up for free
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  header: {
    marginTop: 6,
    marginBottom: 40,
    color: theme.colors.secondary,
    fontWeight: 'bold',
  },
  logo: {
    width: 80,
    height: 80,
  },
  button: {
    margin: 10,
    width: 300,
  },
});

export default SplashScreen;
