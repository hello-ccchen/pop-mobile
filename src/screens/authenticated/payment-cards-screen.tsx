import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Card from '@components/card';
import CardFormModal, {CARD_TYPE_CODE} from '@components/card-form-modal';
import CardAddButton from '@components/card-add-button';
import useStore from '@store/index';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';

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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
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
