import React from 'react';
import {Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {AppStackScreenParams, Promotion} from 'src/types';

import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import theme from '@styles/theme';

interface PromotionListProps {
  promotions: Promotion[];
}

const PromotionList: React.FC<PromotionListProps> = ({promotions}) => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'Home'>>();

  const renderList = () => {
    if (promotions.length > 0) {
      return (
        <View>
          <Text style={styles.promotionHeader}>Promotions:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.promotionsContainer}
            snapToInterval={CARD_WIDTH + 10} // Ensures each card snaps into view
            snapToAlignment="start"
            decelerationRate="fast" // Smooth snapping effect
          >
            {promotions.map(promo => (
              <View key={promo.guid} style={styles.promotionCard}>
                <Image
                  source={{uri: promo.imageUrl}}
                  style={styles.promotionImage}
                  resizeMode="center"
                />

                <TouchableOpacity
                  style={styles.promotionButton}
                  onPress={() =>
                    navigation.navigate('Promotion', {viewMoreUrl: promo.viewMoreUrl})
                  }>
                  <Text style={styles.promotionViewMoreButton}>View More</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      );
    }

    return null;
  };

  return renderList();
};

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = 180;

const styles = StyleSheet.create({
  promotionHeader: {
    flexDirection: 'row',
    marginTop: 15,
    marginHorizontal: 25,
    fontWeight: 'bold',
  },
  promotionsContainer: {
    marginHorizontal: 25,
    marginTop: 5,
    marginBottom: 16,
  },
  promotionCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 10,
    borderRadius: 30,
    overflow: 'hidden',
    borderColor: theme.colors.secondary,
    borderWidth: 2,
    backgroundColor: theme.colors.background,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
    shadowColor: theme.colors.primary,
  },
  promotionImage: {
    width: '100%',
    height: '80%',
  },
  promotionButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promotionViewMoreButton: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PromotionList;
