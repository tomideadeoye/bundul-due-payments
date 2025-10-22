import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PaymentCard from '@/components/PaymentCard';
import Header from '@/components/Header';
import { mockPayments, Payment } from '@/data/payments';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { useFocusEffect } from '@react-navigation/native';

const PAID_PAYMENTS_STORAGE_KEY = '@bundul_paid_payments';

export default function PaidScreen() {
  const [paidPayments, setPaidPayments] = useState<Payment[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  // Load paid payments from storage
  const loadPaidPayments = async () => {
    try {
      const storedPaidPayments = await AsyncStorage.getItem(PAID_PAYMENTS_STORAGE_KEY);
      const parsedPaidPayments = storedPaidPayments ? JSON.parse(storedPaidPayments) : [];
      setPaidPayments(parsedPaidPayments);
    } catch (error) {
      console.error('Error loading paid payments:', error);
      setPaidPayments([]);
    }
  };

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadPaidPayments();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadPaidPayments();
    setRefreshing(false);
  };

  const handlePayNow = (payment: Payment) => {
    // This shouldn't be needed for paid items, but just in case
    console.log('Payment already paid:', payment);
  };

  const renderPaymentItem = ({ item, index }: { item: Payment; index: number }) => (
    <PaymentCard 
      payment={item} 
      onPayNowPress={handlePayNow} 
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No payment history yet</Text>
      <Text style={styles.emptySubtext}>Your paid subscriptions will appear here</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Payment History" 
        greeting="Good evening, Tomide"
      />
      
      <FlatList
        data={paidPayments}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={paidPayments.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={renderEmptyState()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundPrimary,
    maxWidth: 768, 
    alignSelf: 'center', 
    width: '100%',
  },
  listContainer: {
    paddingBottom: Spacing.sm,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    ...Typography.heading3,
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    ...Typography.bodyLarge,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
});