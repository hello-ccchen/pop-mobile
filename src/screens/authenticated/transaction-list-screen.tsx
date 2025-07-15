import React, {useCallback} from 'react';
import {FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View, Animated} from 'react-native';
import {Card, Text} from 'react-native-paper';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import {format} from 'date-fns';
import {Transaction} from '@services/transactionService';
import {AppStackScreenParams} from '@navigations/RootStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import useFetchTransactions from '@hooks/useFetchTransactions';
import AppLoading from '@components/Loading';

const TransactionListScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'Transactions'>>();

  const {isLoading, refreshTransactions, transactions} = useFetchTransactions();

  // Fetch transactions when the screen is focused
  useFocusEffect(
    useCallback(() => {
      refreshTransactions(); // Trigger manual re-fetch
    }, [refreshTransactions]),
  );

  const renderListItem = useCallback(
    (transaction: Transaction) => {
      const scaleAnim = new Animated.Value(1);

      const handlePressIn = () => {
        Animated.spring(scaleAnim, {
          toValue: 0.96,
          useNativeDriver: true,
          speed: 20,
        }).start();
      };

      const handlePressOut = () => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
        }).start();
      };

      const renderProductInfo = () => {
        const transactionType = transaction.transactionStatusCode;
        const productType = transaction.productInfo;
        let backgroundColor = '#f1f1f1'; // Default background
        let textColor = '#4CAF50'; // Default text color

        if (productType === 'RON 97') {
          backgroundColor = '#4CAF50'; // Green background for RON97
          textColor = CUSTOM_THEME_COLOR_CONFIG.colors.surface;
        } else if (productType === 'RON 95') {
          backgroundColor = '#FFEB3B'; // Yellow background for RON95
          textColor = '#000000';
        } else if (transactionType === 'CHC') {
          backgroundColor = '#F44336'; // Red background
          textColor = '#FFFFFF'; // White text for better contrast
        }
        return (
          (productType || transactionType === 'RSE') && (
            <View style={[styles.productTypeContainer, {backgroundColor}]}>
              <Text style={[styles.productTypeText, {color: textColor}]}>
                {transaction.productInfo ? transaction.productInfo : transaction.transactionStatus}
              </Text>
            </View>
          )
        );
      };

      return (
        <Animated.View style={{transform: [{scale: scaleAnim}]}}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('TransactionDetails', {transaction})}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.cardContainer}>
            <Card.Title
              title={transaction.stationName}
              titleVariant="titleMedium"
              titleStyle={styles.cardTitle}
              subtitle={`RM ${transaction.transactionFinalAmount ?? 'Pending'} | ${format(
                new Date(transaction.startTime),
                'dd-MMM-yyyy hh:mm a',
              )}`}
              subtitleStyle={styles.cardSubtitle}
              right={renderProductInfo}
            />
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [navigation],
  );

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text variant="headlineMedium" style={styles.headerText}>
          My Transactions
        </Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={item => item.customerTransactionGuid}
        renderItem={({item}) => renderListItem(item)}
        contentContainerStyle={[
          transactions?.length === 0 && styles.flatListEmpty,
          {paddingBottom: 50}, // More space at bottom
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found.</Text>
          </View>
        }
        getItemLayout={(_, index) => ({length: 110, offset: 110 * index, index})}
        windowSize={10}
        initialNumToRender={7}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
  },
  headerContainer: {
    marginTop: 35,
    marginHorizontal: 25,
    marginBottom: 10,
  },
  headerText: {
    fontWeight: 'bold',
  },
  flatListEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#7D8A94',
  },
  cardContainer: {
    borderBottomWidth: 1,
    borderColor: '#D6DEE2',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  cardTitle: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  subtitleContainer: {
    flexDirection: 'column', // Stack the text vertically
  },
  cardSubtitle: {
    marginBottom: 5,
    color: '#6B7280',
    fontSize: 12, // Adjust font size as needed
  },
  productTypeContainer: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  productTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default TransactionListScreen;
