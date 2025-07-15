import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';

import theme from '@styles/theme';

interface CardAddButtonProps {
  onPress: () => void;
}

const CardAddButton: React.FC<CardAddButtonProps> = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.addCardContainer}>
      <Icon name="circle-plus" size={28} color={theme.colors.primary} />
      <Text style={styles.addCardText}>Add New Card</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addCardContainer: {
    width: 300,
    height: 180,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#888',
    backgroundColor: 'transparent',
  },
  addCardText: {
    marginTop: 5,
    color: '#888',
  },
});

export default CardAddButton;
