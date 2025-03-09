import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import CardFormModal, {CARD_TYPE_CODE} from '@components/card-form-modal';
import CardList from '@components/card-list';
import useStore from '@store/index';
import {Merchant} from '@services/merchant-service';

const FleetCardsScreen = () => {
  const merchants = useStore(state => state.merchants);
  const userCards = useStore(state => state.userCards);
  const fleetCardType = useStore(state =>
    state.cardTypes.find(type => type.code === CARD_TYPE_CODE.Fleet),
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
          cardScheme="Fleet"
          merchants={merchants}
          userCards={userCards}
          handleToggleAddCardModal={handleToggleAddCardModal}
        />
      </ScrollView>

      <CardFormModal
        cardType={fleetCardType!}
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
  },
});

export default FleetCardsScreen;
