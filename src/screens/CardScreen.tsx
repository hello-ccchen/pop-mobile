import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';

const CardScreen = () => {
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{marginHorizontal: 4}}>
          My Card screen under construction
        </Text>
        <Icon name="person-digging" size={14} />
      </View>
    </SafeAreaView>
  );
};

export default CardScreen;
