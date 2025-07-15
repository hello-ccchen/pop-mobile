import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import CardFormModal, {CARD_TYPE_CODE} from '@components/CardFormModal';
import CardList from '@components/CardList';
import useStore from '@store/index';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import {Merchant} from '@services/merchant-service';

const LoyaltyCardsScreen = () => {
  const merchants = useStore(state => state.merchants);
  const userCards = useStore(state => state.userCards);
  const loyaltyCardType = useStore(state =>
    state.cardTypes.find(type => type.code === CARD_TYPE_CODE.Loyalty),
  );
  const [shouldPromptAddCardModal, setShouldPromptAddCardModal] = useState<boolean>(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | undefined>(undefined);

  const handleToggleAddCardModal = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setShouldPromptAddCardModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CardList
          cardScheme="Loyalty"
          merchants={merchants}
          userCards={userCards}
          handleToggleAddCardModal={handleToggleAddCardModal}
        />
      </ScrollView>

      <CardFormModal
        cardType={loyaltyCardType!}
        merchant={selectedMerchant}
        isVisible={shouldPromptAddCardModal}
        onDismiss={() => setShouldPromptAddCardModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
  },
});

export default LoyaltyCardsScreen;
