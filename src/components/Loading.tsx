import React from 'react';
import {Image, SafeAreaView, StyleSheet} from 'react-native';

import theme from '@styles/theme';

const AppLoading = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/loading.gif')}
        resizeMode="contain"
        style={styles.loadingIcon}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingIcon: {
    width: 100,
    height: 100,
  },
});

export default AppLoading;
