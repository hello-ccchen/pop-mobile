import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import Card from '@components/Card';
import CardAddButton from '@components/CardAddButton';
import {Merchant} from '@services/merchantService';
import {UserCard} from '@services/userCardService';

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
                <Card
                  key={card.cardGuid}
                  cardGuid={card.cardGuid}
                  primaryAccountNumber={card.primaryAccountNumber}
                />
              ))}

              {merchantCards.length === 0 && (
                <CardAddButton onPress={() => handleToggleAddCardModal(merchant)} />
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
});

export default CardList;
