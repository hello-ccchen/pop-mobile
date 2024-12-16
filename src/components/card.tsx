import React from 'react';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import {maskCardNumber} from '@components/card-list';

interface CardProps {
  cardGuid: string;
  primaryAccountNumber: string;
  paymentCardScheme?: string; // Optional for cases where no icon is needed
}

const Card: React.FC<CardProps> = ({cardGuid, primaryAccountNumber, paymentCardScheme}) => {
  const getPaymentCardIconName = (cardType: string) =>
    cardType === 'Visa' ? 'cc-visa' : cardType === 'Master' ? 'cc-mastercard' : '';

  return (
    <LinearGradient
      key={cardGuid}
      colors={[
        CUSTOM_THEME_COLOR_CONFIG.colors.primary, // Dark Blue
        CUSTOM_THEME_COLOR_CONFIG.colors.secondary, // Orange
      ]}
      start={{x: 0, y: 0}} // Top-left corner
      end={{x: 1, y: 1}} // Bottom-right corner
      style={styles.cardContainer}>
      <Text variant="titleMedium" style={styles.cardText}>
        {maskCardNumber(primaryAccountNumber)}
      </Text>
      {paymentCardScheme && (
        <Icon
          name={getPaymentCardIconName(paymentCardScheme)}
          size={50}
          color={CUSTOM_THEME_COLOR_CONFIG.colors.surface}
          style={styles.cardIcon}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 300,
    height: 180,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  cardText: {
    fontWeight: 'bold',
    color: CUSTOM_THEME_COLOR_CONFIG.colors.surface,
  },
  cardIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default Card;
