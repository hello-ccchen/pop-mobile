import CardFormModal, {CARD_TYPE_CODE} from '@components/card-form-modal';
import {maskCardNumber} from '@components/card-list';
import useStore from '@store/index';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';

// Function to get the correct icon name based on card type
const getCardIconName = (cardType: string) => {
  return cardType === 'Visa' ? 'cc-visa' : cardType === 'Master' ? 'cc-mastercard' : '';
};

const PaymentCardsScreen = () => {
  const userCards = useStore(state => state.userCards);
  const bankCards = userCards.filter(card => !card.merchantGuid);
  const bankCardType = useStore(state =>
    state.cardTypes.find(type => type.code === CARD_TYPE_CODE.CreditCard),
  );
  const [shouldPromptAddCardModal, setShouldPromptAddCardModal] = useState<boolean>(false);

  const handleToggleAddCardModal = () => {
    setShouldPromptAddCardModal(true);
  };

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
          {bankCards.map(card => (
            <TouchableOpacity key={card.cardGuid} style={styles.cardContainer}>
              <Text variant="titleMedium" style={styles.cardText}>
                {maskCardNumber(card.primaryAccountNumber)}
              </Text>
              <Icon
                name={getCardIconName(card.cardScheme)}
                size={40}
                color={CUSTOM_THEME_COLOR_CONFIG.colors.surface}
                style={styles.cardIcon}
              />
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={handleToggleAddCardModal}
            style={[styles.cardContainer, styles.addCardContainer]}>
            <Icon name="circle-plus" size={28} color={CUSTOM_THEME_COLOR_CONFIG.colors.primary} />
            <Text style={styles.addCardText}>Add New Card</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <CardFormModal
        cardType={bankCardType!}
        isVisible={shouldPromptAddCardModal}
        onDismiss={() => setShouldPromptAddCardModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  cardContainer: {
    width: 330,
    height: 190,
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
