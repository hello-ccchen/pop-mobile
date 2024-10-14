import React from 'react';
import {adaptNavigationTheme, PaperProvider} from 'react-native-paper';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome6';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CustomTheme from '@styles/custom-theme';
import RootStackNavigator from '@navigations/RootStackNavigator';
import {AuthProvider} from '@contexts/AuthContext';
import {LocationProvider} from '@contexts/LocationContext';


const {LightTheme} = adaptNavigationTheme({reactNavigationLight: DefaultTheme});

const App = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <GestureHandlerRootView style={{flex: 1}}>
          <BottomSheetModalProvider>
            <PaperProvider
              theme={CustomTheme}
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
