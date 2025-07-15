import React, {useEffect} from 'react';
import {LogBox} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PaperProvider, adaptNavigationTheme} from 'react-native-paper';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome6';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import RootStackNavigator from '@navigations/RootStackNavigator';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import theme from '@styles/theme';
import {requestUserPermissionForNotification} from '@utils/notificationHelper';

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
          theme={theme}
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
