import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome6';

import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';

import HomeTabNavigator from '@navigations/authenticated/home-tab-navigator';
import ProfileScreen from '@screens/authenticated/profile-screen';
import {StackScreenParamList} from '../root-stack-navigator';

const MainStack = createNativeStackNavigator();
const MainStackNavigator = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<StackScreenParamList, 'Home'>>();

  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="HomeTab"
        component={HomeTabNavigator}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          presentation: 'containedModal',
          headerBackTitleVisible: false,
          headerTitle: 'My Profile',
          headerStyle: {backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background},
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="xmark" size={20} style={{marginRight: 20}} />
            </TouchableOpacity>
          ),
        }}
      />
    </MainStack.Navigator>
  );
};

export default MainStackNavigator;
