import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CustomTheme from '../styles/custom-theme';

const SignupScreen = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CustomTheme.colors.background,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{margin: 4}}>Sign up screen under construction</Text>
        <Icon name="person-digging" size={14} />
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;
