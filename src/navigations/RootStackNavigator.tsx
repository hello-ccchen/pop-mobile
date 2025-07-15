import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainStackNavigator from '@navigations/authenticated/MainStackNavigator';
import AuthStackNavigator from '@navigations/guest/AuthStackNavigator';
import PasscodeScreen from '@screens/authenticated/PasscodeScreen';
import Config from 'react-native-config';

import useStore from '@store/index';
import {logger} from '@services/logger/loggerService';

const RootStack = createNativeStackNavigator();
const RootStackNavigator = () => {
  const user = useStore(state => state.user);

  useEffect(() => {
    logger.debug('API_URL_IOS:', Config.API_URL_IOS);
    logger.debug('API_URL_ANDROID:', Config.API_URL_ANDROID);
  }, []);

  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {user ? (
        user.isPasscodeSetup ? (
          <RootStack.Screen name="MainStack" component={MainStackNavigator} />
        ) : (
          <RootStack.Screen name="Passcode" component={PasscodeScreen} />
        )
      ) : (
        <RootStack.Screen name="AuthStack" component={AuthStackNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
