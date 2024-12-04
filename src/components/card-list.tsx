import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import {Merchant, UserCard} from '@store/index';

export const maskCardNumber = (cardNumber: string) => {
  const firstSix = cardNumber.slice(0, 6);
  const lastFour = cardNumber.slice(-4);
  return `${firstSix}******${lastFour}`;
};

interface CardListProps {
  merchants: Merchant[];
  userCards: UserCard[];
  cardScheme: 'Master' | 'Visa' | 'Loyalty' | 'Fleet';
  handleToggleAddCardModal: (merchant: Merchant) => void;
}

const CardList: React.FC<CardListProps> = ({
  merchants,
  userCards,
  cardScheme,
  handleToggleAddCardModal,
}) => {
  return (
    <View style={styles.container}>
      {merchants.map(merchant => {
        const merchantCards = userCards.filter(
          card => card.merchantGuid === merchant.merchantGuid && card.cardScheme === cardScheme,
        );
        return (
          <View key={merchant.merchantGuid} style={styles.merchantSection}>
            <Text style={styles.merchantName}>{merchant.merchantName}</Text>

            <View style={styles.cardsContainer}>
              {merchantCards.map(card => (
                <TouchableOpacity key={card.cardGuid} style={styles.cardContainer}>
                  <Text variant="titleMedium" style={styles.cardText}>
                    {maskCardNumber(card.primaryAccountNumber)}
                  </Text>
                </TouchableOpacity>
              ))}

              {merchantCards.length === 0 && (
                <TouchableOpacity
                  onPress={() => handleToggleAddCardModal(merchant)}
                  style={[styles.cardContainer, styles.addCardContainer]}>
                  <Icon
                    name="circle-plus"
                    size={28}
                    color={CUSTOM_THEME_COLOR_CONFIG.colors.primary}
                  />
                  <Text style={styles.addCardText}>Add New Card</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  merchantSection: {
    marginVertical: 20,
    marginHorizontal: 5,
  },
  merchantName: {
    marginHorizontal: 15,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: 300,
    height: 180,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
    marginVertical: 10,
  },
  addCardContainer: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#888',
    backgroundColor: 'transparent',
  },
  cardText: {
    fontWeight: 'bold',
    color: CUSTOM_THEME_COLOR_CONFIG.colors.surface,
  },
  addCardText: {
    marginTop: 5,
    color: '#888',
  },
});

export default CardList;
