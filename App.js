import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const mockPayments = [
  {
    id: 1,
    service: 'Netflix',
    amount: 15.99,
    dueDate: '2025-11-01',
    paid: false,
  },
  {
    id: 2,
    service: 'Spotify',
    amount: 9.99,
    dueDate: '2025-10-25',
    paid: false,
  },
  {
    id: 3,
    service: 'Amazon Prime',
    amount: 14.99,
    dueDate: '2025-10-30',
    paid: true,
  },
];

export default function App() {
  const [payments, setPayments] = useState(mockPayments);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isDueSoon = (dateString) => {
    const today = new Date();
    const dueDate = new Date(dateString);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 3 && diffDays >= 0;
  };

  const handlePayNow = (paymentId) => {
    setPayments(prevPayments =>
      prevPayments.map(payment =>
        payment.id === paymentId ? { ...payment, paid: true } : payment
      )
    );
  };

  const renderPaymentItem = ({ item }) => (
    <View style={[styles.paymentCard, item.paid && styles.paidCard]}>
      <View style={styles.cardHeader}>
        <Text style={styles.serviceName}>{item.service}</Text>
        {isDueSoon(item.dueDate) && !item.paid && (
          <View style={styles.dueSoonBadge}>
            <Text style={styles.dueSoonText}>Due Soon</Text>
          </View>
        )}
        {item.paid && (
          <View style={styles.paidBadge}>
            <Text style={styles.paidText}>Paid</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
        <Text style={styles.dueDate}>Due: {formatDate(item.dueDate)}</Text>
      </View>

      {!item.paid && (
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => handlePayNow(item.id)}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const unpaidPayments = payments.filter(p => !p.paid);
  const paidPayments = payments.filter(p => p.paid);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bundul Due Payments</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Payments ({unpaidPayments.length})</Text>
        <FlatList
          data={unpaidPayments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paid This Month ({paidPayments.length})</Text>
        <FlatList
          data={paidPayments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0F',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  list: {
    maxHeight: 300,
  },
  paymentCard: {
    backgroundColor: '#1A1A1F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  paidCard: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dueSoonBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dueSoonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  paidBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paidText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 12,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  payButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});