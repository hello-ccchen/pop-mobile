import React from 'react';
import {Image, SafeAreaView, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackScreenParamList} from '@navigations/RootStackNavigator';
import CustomTheme from '@styles/custom-theme';

const SplashScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<StackScreenParamList, 'Splash'>>();

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
        onPress={() => navigation.navigate('Login')}>
        Log in
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
    backgroundColor: CustomTheme.colors.surface,
  },
  header: {
    marginTop: 6,
    marginBottom: 40,
    color: CustomTheme.colors.secondary,
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
