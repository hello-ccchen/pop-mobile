import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import {maskCardNumber} from '@components/CardList';

interface CardProps {
  cardGuid: string;
  primaryAccountNumber: string;
  paymentCardScheme?: string;
  width?: number;
  height?: number;
  onPress?: (cardGuid: string, primaryAccountNumber: string) => void;
  isSelected?: boolean;
}

const Card: React.FC<CardProps> = ({
  cardGuid,
  primaryAccountNumber,
  paymentCardScheme,
  width = 300,
  height = 180,
  onPress,
  isSelected = false,
}) => {
  const getPaymentCardIconName = (cardType: string) =>
    cardType === 'Visa' ? 'cc-visa' : cardType === 'Master' ? 'cc-mastercard' : '';

  const handlePress = () => {
    if (onPress) {
      onPress(cardGuid, primaryAccountNumber);
    }
  };

  // Dynamically scale text and icon size based on card dimensions
  const textSize = Math.min(width, height) * 0.12; // 12% of the smallest dimension
  const iconSize = Math.min(width, height) * 0.25; // 25% of the smallest dimension
  const checkmarkSize = Math.min(width, height) * 0.15; // 15% of the card size

  const CardContent = (
    <LinearGradient
      colors={[
        CUSTOM_THEME_COLOR_CONFIG.colors.primary, // Dark Blue
        CUSTOM_THEME_COLOR_CONFIG.colors.secondary, // Orange
      ]}
      start={{x: 0, y: 0}} // Top-left corner
      end={{x: 1, y: 1}} // Bottom-right corner
      style={[styles.cardContainer, {width, height}]}>
      {/* Checkmark Icon for Selected State */}
      {isSelected && (
        <Icon name="check-circle" size={checkmarkSize} color="white" style={styles.checkmarkIcon} />
      )}
      <Text variant="titleMedium" style={[styles.cardText, {fontSize: textSize}]}>
        {maskCardNumber(primaryAccountNumber)}
      </Text>
      {paymentCardScheme && (
        <Icon
          name={getPaymentCardIconName(paymentCardScheme)}
          size={iconSize}
          color={CUSTOM_THEME_COLOR_CONFIG.colors.surface}
          style={[styles.cardIcon, {bottom: height * 0.05, right: width * 0.05}]}
        />
      )}
    </LinearGradient>
  );

  return onPress ? (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      {CardContent}
    </TouchableOpacity>
  ) : (
    <View>{CardContent}</View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
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
  },
  checkmarkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default Card;
