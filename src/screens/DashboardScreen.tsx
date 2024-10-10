import React from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Avatar, Button, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {StackScreenParamList} from '../navigations/RootNavigator';
import CustomTheme from '../styles/custom-theme';

const DashboardScreen = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<StackScreenParamList, 'Dashboard'>
    >();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="headlineMedium" style={styles.boldText}>
          Hello, CC Chen
        </Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Profile')}>
          <Avatar.Icon size={32} icon="user" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={{paddingTop: 25}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="gas-pump"
              size={20}
              color={CustomTheme.colors.primary}
              style={{marginRight: 6}}></Icon>
            <Text variant="titleMedium">Nearby Fuel Station</Text>
          </View>
          <View style={styles.shadowBox}>
            <Text variant="bodyLarge">
              Locate the nearest Fuel Station to Pay On Pump
            </Text>
            <Button
              style={{marginTop: 20}}
              icon="location-crosshairs"
              mode="elevated"
              onPress={() => console.log('TODO: Enabled Current Location')}>
              Enabled Location
            </Button>
          </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: 20}}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{alignItems: 'center', marginRight: 25}}
            onPress={() => console.log('TODO: Navigate to reward screen')}>
            <Avatar.Icon size={46} icon="gift" />
            <Text variant="bodyMedium">Rewards</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{alignItems: 'center'}}
            onPress={() => console.log('TODO: Navigate to promotion screen')}>
            <Avatar.Icon size={46} icon="tags" />
            <Text variant="bodyMedium">Promotions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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
    flexDirection: 'column',
    marginHorizontal: 25,
  },
  shadowBox: {
    marginVertical: 10,
    padding: 30,
    backgroundColor: CustomTheme.colors.background,
    borderRadius: 10,
    // iOS shadow
    shadowColor: CustomTheme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    // Android shadow
    elevation: 5,
  },
});
export default DashboardScreen;
