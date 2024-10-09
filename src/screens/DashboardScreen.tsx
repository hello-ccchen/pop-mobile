import React from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Avatar, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {StackScreenParamList} from '../navigations/RootNavigator';

const DashboardScreen = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<StackScreenParamList, 'Dashboard'>
    >();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Avatar.Icon size={36} icon="user" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text>Home screen under construction</Text>
        <Icon name="person-digging" size={14} style={{margin: 4}} />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  userContainer: {
    marginTop: 30,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  userText: {
    margin: 6,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
});
export default DashboardScreen;
