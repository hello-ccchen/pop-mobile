import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';

type PromotionScreenProps = NativeStackScreenProps<AppStackScreenParams, 'Promotion'>;

const PromotionScreen: React.FC<PromotionScreenProps> = ({route}) => {
  const {viewMoreUrl} = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <WebView source={{uri: viewMoreUrl}} style={styles.webview} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
  },
  webview: {
    flex: 1,
  },
});

export default PromotionScreen;
