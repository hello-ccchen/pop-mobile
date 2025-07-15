import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {AppStackScreenParams} from 'src/types';

import AppLoading from '@components/Loading';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import theme from '@styles/theme';

type PromotionScreenProps = NativeStackScreenProps<AppStackScreenParams, 'Promotion'>;

const PromotionScreen: React.FC<PromotionScreenProps> = ({route}) => {
  const {viewMoreUrl} = route.params;
  const [isWebLoading, setIsWebLoading] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.promotionWebContainer}>
        {isWebLoading && (
          <View style={styles.loadingContainer}>
            <AppLoading />
          </View>
        )}
        <WebView
          source={{uri: viewMoreUrl}}
          style={styles.webview}
          onLoadStart={() => setIsWebLoading(true)}
          onLoadEnd={() => setIsWebLoading(false)}
          onError={() => setIsWebLoading(false)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  webview: {
    flex: 1,
  },
  promotionWebContainer: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default PromotionScreen;
