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
import AppLoading from '@components/Loading';

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
            {/* Promotion Info */}
            {transaction.ccPromotionTitle && (
              <DetailRow label="Promotion Title" value={transaction.ccPromotionTitle} />
            )}
            {/* Payment Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.sectionTitle}>Payment Summary</Text>

              <View style={styles.row}>
                <Text style={styles.label}>Pre-Auth Amount</Text>
                <Text style={styles.value}>RM {transaction.preAuthAmount?.toFixed(2) ?? '-'}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Amount Before Discount</Text>
                <Text style={styles.value}>
                  {transaction.transactionOriginalAmount !== null &&
                  transaction.transactionOriginalAmount !== undefined
                    ? `RM ${transaction.transactionOriginalAmount.toFixed(2)}`
                    : 'Pending'}
                </Text>
              </View>

              <View style={styles.row}>
                <Text
                  style={[
                    styles.label,
                    transaction.promotionDiscountedValue === 0 && styles.subtleText,
                  ]}>
                  Promotion Discount
                </Text>
                <Text
                  style={[
                    styles.value,
                    transaction.promotionDiscountedValue === 0 && styles.subtleText,
                  ]}>
                  - RM {(transaction.promotionDiscountedValue ?? 0).toFixed(2)}
                </Text>
              </View>

              <View style={styles.dividerLine} />

              <View style={styles.row}>
                <Text style={[styles.label, styles.totalLabel]}>Total Paid</Text>
                <Text style={[styles.value, styles.totalValue]}>
                  {transaction.transactionFinalAmount !== null &&
                  transaction.transactionFinalAmount !== undefined
                    ? `RM ${transaction.transactionFinalAmount.toFixed(2)}`
                    : 'Pending'}
                  {transaction.promotionDiscountedValue > 0 && (
                    <Text style={styles.discountNote}> (after discount)</Text>
                  )}
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
    color: '#111827',
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
  summaryContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#374151',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  totalLabel: {
    color: '#000',
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#1D4ED8',
    fontSize: 16,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  discountNote: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginLeft: 4,
  },
  subtleText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});

export default TransactionDetailsScreen;
