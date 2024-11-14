import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore, {User} from '@store/index';
import {AuthStorageService} from '@services/auth-storage-service';

const PASSCODE_LENGTH = 6;

const SetPasscodeScreen = () => {
  const user = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);
  const [passcode, setPasscode] = useState('');
  const [initialPasscode, setInitialPasscode] = useState('');
  const [screenState, setScreenState] = useState('set'); // 'set' or 'confirm'

  const handleNumberPress = (digit: string) => {
    if (passcode.length < PASSCODE_LENGTH) {
      setPasscode(prev => prev + digit);
    }
  };

  const handleDeletePress = () => {
    setPasscode(prev => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (passcode.length === PASSCODE_LENGTH) {
      if (screenState === 'set') {
        setInitialPasscode(passcode);
        setPasscode('');
        setScreenState('confirm');
      } else if (screenState === 'confirm') {
        if (passcode === initialPasscode) {
          await AuthStorageService.setPasscode(passcode);
          setUser({
            ...(user as User),
            isPasscodeSetup: true,
          });
        } else {
          Alert.alert('Passcode Mismatch', 'Passcodes do not match. Please try again.');
          setPasscode('');
          setScreenState('set');
        }
      }
    } else {
      Alert.alert('Incomplete Passcode', 'Please enter a 6-digit Passcode.');
    }
  };

  const renderPasscodeDots = () => {
    return Array.from({length: PASSCODE_LENGTH}).map((_, index) => (
      <View
        key={index}
        style={[
          styles.passcodeDot,
          {
            backgroundColor:
              passcode.length > index
                ? CUSTOM_THEME_COLOR_CONFIG.colors.primary
                : CUSTOM_THEME_COLOR_CONFIG.colors.secondary,
          },
        ]}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="titleLarge" style={styles.title}>
          {screenState === 'set' ? 'Create new passcode' : 'Confirm your passcode'}
        </Text>
        <Text variant="titleSmall" style={styles.description}>
          {screenState === 'set'
            ? 'Set up a new 6-digit passcode to secure your payment verification.'
            : 'Please re-enter your passcode to confirm.'}
        </Text>
      </View>

      <View style={styles.passcodeDotsContainer}>{renderPasscodeDots()}</View>

      <View style={styles.keypadContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'X', 0, 'done'].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.keyButton}
            onPress={() => {
              if (item === 'X') handleDeletePress();
              else if (item === 'done') handleSubmit();
              else handleNumberPress(item.toString());
            }}
            accessibilityLabel={
              item === 'X' ? 'Delete' : item === 'done' ? 'Submit' : `Number ${item}`
            }>
            {item === 'X' ? (
              <Icon name="delete-left" size={24} color={CUSTOM_THEME_COLOR_CONFIG.colors.surface} />
            ) : item === 'done' ? (
              <Icon
                name="circle-check"
                size={24}
                color={CUSTOM_THEME_COLOR_CONFIG.colors.surface}
              />
            ) : (
              <Text variant="titleLarge" style={styles.keyText}>
                {item}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
  },
  headerContainer: {
    marginTop: 35,
    marginBottom: 20,
    marginHorizontal: 25,
    flexDirection: 'column',
    alignItems: 'center',
    height: '10%',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#6b6b6b',
  },
  passcodeDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  passcodeDot: {
    width: 15,
    height: 15,
    margin: 10,
    borderRadius: 50,
  },
  keypadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '80%',
    aspectRatio: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  keyButton: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
    borderRadius: 50,
  },
  keyText: {
    fontWeight: 'bold',
    fontSize: 28,
    color: CUSTOM_THEME_COLOR_CONFIG.colors.surface,
  },
});

export default SetPasscodeScreen;
