import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Clipboard,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Text, Card, Divider} from 'react-native-paper';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import {format} from 'date-fns';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useSWR from 'swr';
import {TransactionService} from '@services/transaction-service';
import AppLoading from '@components/loading';

type TransactionDetailsRouteProp = RouteProp<AppStackScreenParams, 'TransactionDetails'>;

const TransactionDetailsScreen = () => {
  const navigation = useNavigation(); // Use navigation hook
  const {params} = useRoute<TransactionDetailsRouteProp>();
  const transactionId = params.transactionId;

  const {data, isLoading, error} = useSWR(transactionId ? transactionId : null, id =>
    id ? TransactionService.fetchTransactionById(id) : null,
  );

  if (isLoading) {
    return <AppLoading />;
  }

  if (error) {
    // Show Alert when error occurs
    Alert.alert('Error', 'There was an issue loading the transaction details. Please try again.', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(), // Navigate back when OK is pressed
      },
    ]);
    return null; // Avoid rendering the rest of the screen in case of an error
  }

  const transaction = params.transaction ?? data;

  const copyToClipboard = () => {
    Clipboard.setString(transaction.customerTransactionGuid);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            {/* Transaction Reference */}
            <TouchableOpacity onPress={copyToClipboard} activeOpacity={0.7}>
              <DetailRow
                label="Transaction Reference"
                value={transaction.customerTransactionGuid}
                highlight
              />
            </TouchableOpacity>

            <DetailRow label="Station Name" value={transaction.stationName} />
            <DetailRow label="Merchant" value={transaction.merchantName} />
            <DetailRow label="Card Type" value={transaction.cardType} />
            <DetailRow label="Credit Card" value={transaction.creditCardNumber} />

            <DetailRow
              label="Date"
              value={format(new Date(transaction.startTime), 'dd-MMM-yyyy  hh:mm a')}
            />

            <DetailRow label="Status" value={transaction.transactionStatus} />
            {transaction.productInfo && (
              <DetailRow label="Product" value={transaction.productInfo} />
            )}

            {transaction.quantity && transaction.unitPrice && (
              <DetailRow
                label={
                  transaction.productInfo?.toLowerCase().includes('fast charging')
                    ? 'Energy Charged'
                    : 'Fuel Volume'
                }
                value={`${transaction.quantity} ${
                  transaction.productInfo?.toLowerCase().includes('fast charging') ? 'kWh' : 'Lr'
                } @ RM ${transaction.unitPrice.toFixed(2)}/${
                  transaction.productInfo?.toLowerCase().includes('fast charging') ? 'kWh' : 'Lr'
                }`}
              />
            )}

            {transaction.loyaltyCardInfo && (
              <DetailRow label="Loyalty Card" value={transaction.loyaltyCardInfo} />
            )}
            {transaction.loyaltyPoint && (
              <DetailRow
                label="Loyalty Points Earned"
                value={transaction.loyaltyPoint.toString()}
              />
            )}
            {/* Pre-Auth & Total Spent in the same row */}
            <View style={styles.amountContainer}>
              <View style={styles.amountItem}>
                <Text style={styles.detailLabel}>Pre-Auth Amount</Text>
                <Text style={styles.detailValue}>RM {transaction.preAuthAmount}</Text>
              </View>
              <Divider style={styles.verticalDivider} />
              <View style={styles.amountItem}>
                <Text style={[styles.detailLabel, styles.highlightLabel]}>Total Spent</Text>
                <Text style={[styles.detailValue, styles.highlightValue]}>
                  {transaction.transactionFinalAmount
                    ? `RM ${transaction.transactionFinalAmount}`
                    : 'Pending'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailRow = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <View style={styles.detailRow}>
    <Text style={[styles.detailLabel, highlight && styles.highlightLabel]}>{label}</Text>
    <Text selectable style={[styles.detailValue, highlight && styles.highlightValue]}>
      {value}
    </Text>
    <Divider style={styles.divider} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    marginVertical: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  amountItem: {
    flex: 1,
    alignItems: 'center',
  },
  verticalDivider: {
    height: '80%',
    width: 1,
    backgroundColor: '#D6DEE2',
  },
  highlightLabel: {
    color: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
  },
  highlightValue: {
    color: CUSTOM_THEME_COLOR_CONFIG.colors.primary,
    fontWeight: 'bold',
  },
  divider: {
    marginTop: 5,
    backgroundColor: '#D6DEE2',
  },
});

export default TransactionDetailsScreen;
