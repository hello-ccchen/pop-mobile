import React from 'react';
import {adaptNavigationTheme, PaperProvider} from 'react-native-paper';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome6';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import CustomTheme from './styles/custom-theme';
import RootNavigator from './navigations/RootNavigator';
import {AuthProvider} from './contexts/AuthContext';

const {LightTheme} = adaptNavigationTheme({reactNavigationLight: DefaultTheme});

const App = () => {
  return (
    <AuthProvider>
      <PaperProvider
        theme={CustomTheme}
        settings={{
          icon: props => <AwesomeIcon {...props} />,
        }}>
        <NavigationContainer theme={LightTheme}>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
};

export default App;
