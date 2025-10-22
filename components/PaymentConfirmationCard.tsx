import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Card } from 'react-native-paper';
import { Payment } from '../data/payments';
import { formatCurrency } from '../utils/formatters';

type PaymentConfirmationCardProps = {
  payment: Payment;
  onDismiss: () => void;
};

const PaymentConfirmationCard: React.FC<PaymentConfirmationCardProps> = ({ payment, onDismiss }) => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <Text style={styles.title}>Payment Confirmed</Text>
        <Text style={styles.serviceName}>{payment.service}</Text>
        <Text style={styles.amount}>{formatCurrency(payment.amount)}</Text>
        <Text style={styles.message}>Your payment has been processed successfully</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#e8f5e9', // Light green background for success
    borderLeftColor: '#4caf50', // Green border
    borderLeftWidth: 4,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      }
    }),
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmark: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    color: '#333',
    marginBottom: 4,
  },
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#388e3c',
    textAlign: 'center',
  },
});

export default PaymentConfirmationCard;