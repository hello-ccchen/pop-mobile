import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import React from 'react';
import {Image, SafeAreaView, StyleSheet} from 'react-native';

const LoadingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../../assets/loading.gif')}
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
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background
  },
  loadingIcon: {
    width: 100,
    height: 100,
  },
});

export default LoadingScreen;
