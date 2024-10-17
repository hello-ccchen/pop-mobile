import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';

const PurchaseFuelScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={{marginHorizontal: 4}}>Purchase Fuel screen under construction</Text>
        <Icon name="person-digging" size={14} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
  },
  headerContainer: {
    marginTop: 35,
    marginHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PurchaseFuelScreen;
