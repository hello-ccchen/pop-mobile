import React from 'react';
import {adaptNavigationTheme, PaperProvider} from 'react-native-paper';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome6';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import HomeNavigator from './navigations/HomeNavigator';
import CustomTheme from './styles/custom-theme';

const {LightTheme} = adaptNavigationTheme({reactNavigationLight: DefaultTheme});

const App = () => {
  return (
    <PaperProvider
      theme={CustomTheme}
      settings={{
        icon: props => <AwesomeIcon {...props} />,
      }}>
      <NavigationContainer theme={LightTheme}>
        <HomeNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
