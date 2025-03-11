import React, {useEffect} from 'react';
import {LogBox} from 'react-native';
import {adaptNavigationTheme, PaperProvider} from 'react-native-paper';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome6';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import RootStackNavigator from '@navigations/root-stack-navigator';
import {requestUserPermissionForNotification} from '@utils/notification-helper';

const {LightTheme} = adaptNavigationTheme({reactNavigationLight: DefaultTheme});

const App = () => {
  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);

  useEffect(() => {
    requestUserPermissionForNotification();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <PaperProvider
          theme={CUSTOM_THEME_COLOR_CONFIG}
          settings={{
            icon: props => <AwesomeIcon {...props} />,
          }}>
          <NavigationContainer theme={LightTheme}>
            <RootStackNavigator />
          </NavigationContainer>
        </PaperProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
