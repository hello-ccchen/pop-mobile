import React from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, Button, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {StackScreenParamList} from '@navigations/RootNavigator';
import CustomTheme from '@styles/custom-theme';
import {useLocation} from '@contexts/LocationContext';

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<StackScreenParamList, 'Home'>>();
  const {currentLocation, requestLocation} = useLocation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.curvedHeader}></View>
      <View style={styles.contentWrapper}>
        <View style={styles.headerContainer}>
          <Text
            variant="headlineMedium"
            style={{color: CustomTheme.colors.background, ...styles.boldText}}>
            Hello, Chen
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('Profile')}>
            <Avatar.Icon size={32} icon="user" />
          </TouchableOpacity>
        </View>

        <View style={styles.fuelStationBox}>
          <Text variant="bodyLarge" style={styles.boldText}>
            Locate the nearest Fuel Station to Pay On Pump
          </Text>
          {currentLocation ? (
            // TODO: should render the map if detected current location
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="location-dot"
                size={36}
                style={{marginRight: 8}}
                color={CustomTheme.colors.primary}
              />
              <View style={{flexDirection: 'column'}}>
                <Text style={{marginVertical: 2}}>
                  Latitude: {currentLocation.latitude}
                </Text>
                <Text style={{marginVertical: 2}}>
                  Longitude: {currentLocation.longitude}
                </Text>
              </View>
            </View>
          ) : (
            <Button
              style={{marginTop: 20}}
              icon="map-location-dot"
              mode="contained"
              onPress={async () => await requestLocation()}>
              Enable Location
            </Button>
          )}
        </View>

        <View style={styles.bodyContainer}>
          <View style={styles.menuButtonContainer}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.menuIconButton}
              onPress={() => console.log('TODO: Navigate to reward screen')}>
              <Avatar.Icon size={40} icon="gift" />
              <Text variant="bodyMedium">Rewards</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.menuIconButton}
              onPress={() => console.log('TODO: Navigate to promotion screen')}>
              <Avatar.Icon size={40} icon="tags" />
              <Text variant="bodyMedium">Promotions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CustomTheme.colors.background,
  },
  curvedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: CustomTheme.colors.secondary,
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
    backgroundColor: CustomTheme.colors.background,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 30,
    shadowColor: CustomTheme.colors.primary,
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 15,
  },
  menuButtonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  menuIconButton: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;
