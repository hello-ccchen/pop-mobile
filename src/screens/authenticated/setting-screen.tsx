import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, ScrollView} from 'react-native';
import {Text, List} from 'react-native-paper';
import {getUniqueId} from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {getSupportedBiometryType} from 'react-native-keychain';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import {AuthService, ForgotPasscodePayload} from '@services/authService';
import useStore from '@store/index';
import AppLoading from '@components/Loading';
import OneTimePasswordModal from '@components/OTPModal';
import AppSnackbar from '@components/Snackbar';

const SettingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'Settings'>>();
  const user = useStore(state => state.user);
  const clearUser = useStore(state => state.clearUser);
  const [isBiometricSupport, setIsBiometricSupport] = useState<boolean>(false);
  const [shouldPromptOTP, setShouldPromptOTP] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      const biometricType = await getSupportedBiometryType();
      setIsBiometricSupport(!!biometricType);
    };

    checkBiometricSupport();
  }, []);

  const handleSignOut = async () => {
    await AuthService.signOut();
    clearUser();
  };

  const handleForgotPasscode = async () => {
    const payload: ForgotPasscodePayload = {
      email: user?.email || '',
      deviceUniqueId: (await getUniqueId()).toString(),
    };
    setIsLoading(true);
    setIsError(false);
    try {
      const shouldPrompt = await AuthService.forgotPasscode(payload);
      if (!shouldPrompt) {
        throw new Error('AuthService.forgotPasscode failed.');
      }
      setShouldPromptOTP(shouldPrompt);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPComplete = async (otp: string) => {
    setShouldPromptOTP(false);
    navigation.navigate('Passcode', {screenState: 'forgotPasscode', OTP: otp});
  };

  const renderMenuItem = (title: string, icon: string, onPress: () => void, isLast?: boolean) => (
    <List.Item
      title={title}
      left={props => (
        <Icon {...props} name={icon} size={18} color={CUSTOM_THEME_COLOR_CONFIG.colors.primary} />
      )}
      onPress={onPress}
      style={[styles.menuSectionItem, isLast ? styles.lastItem : styles.firstItem]}
    />
  );

  if (!user || isLoading) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text variant="titleLarge" style={styles.name}>
            {`${user.fullName}`}
          </Text>
        </View>

        <View style={styles.menuContainer}>
          <List.Section style={styles.menuSection}>
            <List.Subheader style={styles.menuSectionHeader}>Profile</List.Subheader>
            {renderMenuItem('Update Profile', 'user-pen', () => navigation.navigate('Profile'))}
          </List.Section>

          <List.Section style={styles.menuSection}>
            <List.Subheader style={styles.menuSectionHeader}>Security</List.Subheader>
            {renderMenuItem('Forget Passcode', 'lock', handleForgotPasscode)}
            {isBiometricSupport &&
              renderMenuItem(
                user.isBiometricAuthSetup ? 'Disable Biometric' : 'Enable Biometric',
                'fingerprint',
                () =>
                  navigation.navigate('Passcode', {
                    screenState: user.isBiometricAuthSetup
                      ? 'removeBiometricAuth'
                      : 'setBiometricAuth',
                    OTP: '',
                  }),
                true,
              )}
          </List.Section>

          <List.Section style={styles.menuSection}>
            <List.Subheader style={styles.menuSectionHeader}>Account</List.Subheader>
            {renderMenuItem('Sign Out', 'right-from-bracket', handleSignOut)}
          </List.Section>
        </View>
      </ScrollView>

      <OneTimePasswordModal
        userEmail={user.email}
        isVisible={shouldPromptOTP}
        onDismiss={() => setShouldPromptOTP(false)}
        onOTPComplete={handleOTPComplete}
        onResendOTP={handleForgotPasscode}
      />

      <AppSnackbar
        visible={isError}
        message="Uh-oh... We can’t reset your passcode right now. 🥹"
        onDismiss={() => setIsError(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
  },
  headerContainer: {
    marginTop: 35,
    marginHorizontal: 20,
  },
  name: {
    fontWeight: 'bold',
  },
  menuContainer: {
    marginHorizontal: 10,
  },
  menuSectionHeader: {
    fontWeight: 'bold',
  },
  menuSection: {
    marginBottom: 5,
  },
  menuSectionItem: {
    paddingVertical: 10,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
  },
  firstItem: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D6DEE2',
  },
  lastItem: {
    borderBottomWidth: 1,
    borderColor: '#D6DEE2',
  },
});

export default SettingScreen;
