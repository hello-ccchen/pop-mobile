import React from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, Button, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import {useLocation} from '@contexts/location-context';
import useStore from '@store/index';
import PromotionList from '@components/promotion-list';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'Home'>>();
  const {requestLocation} = useLocation();
  const promotions = useStore(state => state.promotions);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.curvedHeader}></View>
      <View style={styles.contentWrapper}>
        <View style={styles.headerContainer}>
          <Text
            variant="headlineMedium"
            style={{
              color: CUSTOM_THEME_COLOR_CONFIG.colors.surface,
              ...styles.boldText,
            }}>
            Hello, Chen
          </Text>
          <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Profile')}>
            <Avatar.Icon size={32} icon="user" />
          </TouchableOpacity>
        </View>

        <View style={styles.fuelStationBox}>
          <Text variant="bodyLarge" style={styles.boldText}>
            Locate the nearest Fuel Station to Pay On Pump
          </Text>
          <Button
            style={{marginTop: 20}}
            icon="map-location-dot"
            mode="contained"
            onPress={async () => await requestLocation()}>
            Enable Location
          </Button>
        </View>

        <PromotionList promotions={promotions} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
  },
  curvedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.secondary,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    zIndex: 1,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  headerContainer: {
    marginTop: 20,
    marginHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fuelStationBox: {
    marginVertical: 25,
    marginHorizontal: 15,
    padding: 30,
    borderRadius: 30,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 30,
    shadowColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;
