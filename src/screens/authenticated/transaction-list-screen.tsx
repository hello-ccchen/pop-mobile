import React, {useCallback} from 'react';
import {FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore, {Transaction} from '@store/index';
import {format} from 'date-fns';
const TransactionListScreen = () => {
  const transactionList = useStore(state => state.transactions);

  const renderListItem = useCallback((transaction: Transaction) => {
    return (
      <TouchableOpacity activeOpacity={0.7} style={styles.cardWrapper}>
        <Card style={styles.card}>
          <Card.Title
            title={transaction.stationName}
            titleVariant="titleMedium"
            titleStyle={styles.cardTitle}
            subtitle={`Amount: ${transaction.fuelAmount}  | ${format(
              new Date(transaction.transactionDateTime),
              'MMM dd, yyyy - hh:mm a',
            )}`}
            subtitleStyle={styles.cardSubtitle}
          />
        </Card>
      </TouchableOpacity>
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="headlineMedium" style={styles.headerText}>
          Transactions
        </Text>
      </View>

      <FlatList
        data={transactionList}
        keyExtractor={item => item.transactionId}
        renderItem={({item}) => renderListItem(item)}
        contentContainerStyle={[
          styles.listContainer,
          transactionList.length === 0 && styles.flatListEmpty,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found.</Text>
          </View>
        }
        getItemLayout={(_, index) => ({length: 120, offset: 120 * index, index})}
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
  listContainer: {
    paddingHorizontal: 25, // Apply same margin as the header
    paddingBottom: 50,
    marginTop: 20,
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
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
  cardWrapper: {
    marginBottom: 10, // Spacing between cards
  },
  card: {
    borderRadius: 10,
    elevation: 3,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.surface,
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: 'gray',
  },
  cardIcon: {
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
  },
});

export default TransactionListScreen;
