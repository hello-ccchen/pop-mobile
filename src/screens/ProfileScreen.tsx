import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CustomTheme from '../styles/custom-theme';
import {useAuth} from '../contexts/AuthContext';

const ProfileScreen = () => {
  const {logout} = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={{marginHorizontal: 4}}>
          Profile screen under construction
        </Text>
        <Icon name="person-digging" size={14} />
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => logout()}>
          Log out
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CustomTheme.colors.background,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 30,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
