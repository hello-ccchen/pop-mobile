import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';

const CardScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{marginHorizontal: 4}}>
          My Card Screen Under construction
        </Text>
        <Icon name="person-digging" size={14} />
      </View>
    </View>
  );
};

export default CardScreen;
