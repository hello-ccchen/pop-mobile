import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';

const cardList = [{id: 1, cardNumber: '1234 5678 1234 8899', cardType: 'Visa'}];

// Function to mask the card number
const maskCardNumber = (cardNumber: string) => {
  const lastFourDigits = cardNumber.slice(-4);
  return `**** **** **** ${lastFourDigits}`;
};

// Function to get the correct icon name based on card type
const getCardIconName = (cardType: string) => {
  return cardType === 'Visa' ? 'cc-visa' : cardType === 'Master' ? 'cc-mastercard' : '';
};

const PaymentCardsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{marginHorizontal: 15, marginBottom: 10, fontWeight: 'bold'}}>
          Credit/Debit Cards:
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{marginHorizontal: 15}}>
          {cardList.map(card => (
            <TouchableOpacity
              key={card.id}
              onPress={() => console.log('Card selected:', card.cardNumber)}
              style={styles.cardContainer}>
              {/* Masked Card Number */}
              <Text variant="titleLarge" style={styles.cardText}>
                {maskCardNumber(card.cardNumber)}
              </Text>
              {/* Card Icon */}
              <Icon
                name={getCardIconName(card.cardType)}
                size={40}
                color={CUSTOM_THEME_COLOR_CONFIG.colors.surface}
                style={styles.cardIcon}
              />
            </TouchableOpacity>
          ))}

          {/* Add New Card container */}
          <TouchableOpacity
            onPress={() => console.log('Add New Card pressed')}
            style={[styles.cardContainer, styles.addCardContainer]}>
            <Icon name="circle-plus" size={28} color={CUSTOM_THEME_COLOR_CONFIG.colors.primary} />
            <Text style={styles.addCardText}>Add New Card</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  cardContainer: {
    width: 300,
    height: 200,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
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
  cardIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default PaymentCardsScreen;
