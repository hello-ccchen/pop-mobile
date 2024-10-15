import React, {useEffect} from 'react';
import {adaptNavigationTheme, PaperProvider} from 'react-native-paper';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome6';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import RootStackNavigator from '@navigations/root-stack-navigator';
import {AuthProvider} from '@contexts/auth-context';
import {LocationProvider} from '@contexts/location-context';
import {LogBox} from 'react-native';

const {LightTheme} = adaptNavigationTheme({reactNavigationLight: DefaultTheme});

const App = () => {
  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);

  return (
    <AuthProvider>
      <LocationProvider>
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
      </LocationProvider>
    </AuthProvider>
  );
};

export default App;
