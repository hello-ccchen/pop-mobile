import React, {useState} from 'react';
import {Dimensions, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Card from '@components/Card';
import CardFormModal, {CARD_TYPE_CODE} from '@components/CardFormModal';
import CardAddButton from '@components/CardAddButton';
import useStore from '@store/index';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

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
        <Text style={styles.headerText}>Credit/Debit Cards:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          snapToInterval={CARD_WIDTH + 10} // Adjust interval based on card size
          snapToAlignment="start"
          decelerationRate="fast">
          {bankCards.map(card => (
            <Card
              key={card.cardGuid}
              cardGuid={card.cardGuid}
              primaryAccountNumber={card.primaryAccountNumber}
              paymentCardScheme={card.cardScheme}
            />
          ))}

          <CardAddButton onPress={handleToggleAddCardModal} />
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
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
  },
  headerText: {
    marginHorizontal: 15,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    marginHorizontal: 15,
  },
});

export default PaymentCardsScreen;
