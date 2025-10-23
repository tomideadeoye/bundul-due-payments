import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Modal,
  TouchableOpacity,
  Pressable,
  Alert,
  Platform
} from 'react-native';
import { mockPayments } from './data/payments';

const PAID_PAYMENTS_STORAGE_KEY = '@bundul_paid_payments';

export default function App() {
  const [payments, setPayments] = useState(mockPayments);
  const [filteredPayments, setFilteredPayments] = useState(mockPayments);
  const [paidPayments, setPaidPayments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paidPayment, setPaidPayment] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isDueSoon = (dateString) => {
    const today = new Date();
    const dueDate = new Date(dateString);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 3 && diffDays >= 0;
  };

  const calculateTotalDue = (payments) => {
    return payments.reduce((total, payment) => total + payment.amount, 0);
  };

  const sortPaymentsByDueDate = (payments) => {
    return [...payments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  // Load paid payments from storage
  const loadPaidPayments = async () => {
    try {
      // For Snack demo, we'll simulate storage with local state
      const storedPaidPayments = [];
      setPaidPayments(storedPaidPayments);

      // Update payments to mark paid ones
      const updatedPayments = mockPayments.map(payment => {
        const isPaid = storedPaidPayments.some((paid) => paid.id === payment.id);
        return { ...payment, paid: isPaid };
      });

      const sortedPayments = sortPaymentsByDueDate(updatedPayments);
      setPayments(sortedPayments);
      applyFilters(sortedPayments, activeFilter);
    } catch (error) {
      console.error('Error loading paid payments:', error);
      // Fallback to initial state
      const sortedPayments = sortPaymentsByDueDate(mockPayments);
      setPayments(sortedPayments);
      applyFilters(sortedPayments, activeFilter);
    }
  };

  // Reload data when component mounts
  useEffect(() => {
    loadPaidPayments();
  }, []);

  // Save paid payments to storage
  useEffect(() => {
    const savePaidPayments = async () => {
      try {
        // For Snack demo, we'll just log
        console.log('Saving paid payments:', paidPayments);
      } catch (error) {
        console.error('Error saving paid payments:', error);
      }
    };

    if (paidPayments.length > 0) {
      savePaidPayments();
    }
  }, [paidPayments]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadPaidPayments();
      setRefreshing(false);
    }, 1000);
  };

  const handleSearch = (query) => {
    if (!query) {
      applyFilters(payments, activeFilter);
      return;
    }

    const lowercasedQuery = query.toLowerCase();
    const searchFiltered = payments.filter(payment =>
      payment.service.toLowerCase().includes(lowercasedQuery)
    );

    // Apply both search and filter
    applyFilters(searchFiltered, activeFilter);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFilters(payments, filter);
  };

  const applyFilters = (paymentList, filter) => {
    let filtered = [...paymentList];

    switch (filter) {
      case 'dueSoon':
        filtered = filtered.filter(payment => isDueSoon(payment.dueDate) && !payment.paid);
        break;
      case 'paid':
        filtered = paidPayments;
        break;
      case 'all':
      default:
        filtered = filtered.filter(payment => !payment.paid);
        break;
    }

    setFilteredPayments(filtered);
  };

  const handlePayNow = (payment) => {
    setSelectedPayment(payment);
    setModalVisible(true);
  };

  const handlePayLater = () => {
    if (!selectedPayment) return;

    if (Platform.OS === 'web') {
      setConfirmModalVisible(true);
    } else {
      Alert.alert(
        "Pay Later",
        `Are you sure you want to pay ${selectedPayment.service} later?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: () => {
              setModalVisible(false);
            }
          }
        ]
      );
    }
  };

  const handleConfirmPayment = () => {
    if (!selectedPayment) return;

    setModalVisible(false);
    setPaidPayment(selectedPayment);
    setShowConfirmation(true);

    // Update the payment as paid
    const updatedPayment = { ...selectedPayment, paid: true };

    // Add to paid payments
    setPaidPayments(prev => [...prev, updatedPayment]);

    // Update the main payments list
    setPayments(prevPayments =>
      prevPayments.map(p => p.id === selectedPayment.id ? updatedPayment : p)
    );

    // Also update filtered payments
    setFilteredPayments(prevPayments =>
      prevPayments.filter(payment => payment.id !== selectedPayment.id)
    );

    // Hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
      setPaidPayment(null);
    }, 3000);
  };

  // Calculate insights data
  const totalPaidThisMonth = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const upcomingPaymentsCount = filteredPayments.filter(p => !p.paid).length;
  const upcomingPaymentsTotal = calculateTotalDue(filteredPayments.filter(p => !p.paid));

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
          onPress={() => handlePayNow(item)}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => {
    if (activeFilter === 'paid') {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No payment history yet</Text>
          <Text style={styles.emptySubtext}>Your paid subscriptions will appear here</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You're all caught up! 🎉</Text>
        <Text style={styles.emptySubtext}>No payments due right now</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Due Payments</Text>
        <Text style={styles.greeting}>Good evening, Tomide</Text>
      </View>

      {/* Insights Card */}
      <View style={styles.insightsCard}>
        <Text style={styles.insightsTitle}>This Month</Text>
        <Text style={styles.insightsAmount}>{formatCurrency(totalPaidThisMonth)}</Text>
        <Text style={styles.insightsSubtitle}>paid • {upcomingPaymentsCount} upcoming</Text>
        <Text style={styles.upcomingTotal}>{formatCurrency(upcomingPaymentsTotal)} due</Text>
      </View>

      {/* Payment Confirmation Card */}
      {showConfirmation && paidPayment && (
        <View style={styles.confirmationCard}>
          <Text style={styles.confirmationText}>✓ Payment Confirmed</Text>
          <Text style={styles.confirmationService}>{paidPayment.service}</Text>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => {
              setShowConfirmation(false);
              setPaidPayment(null);
            }}
          >
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Payment List */}
      <FlatList
        data={filteredPayments}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={filteredPayments.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={renderEmptyState()}
      />

      {/* Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Payment Details</Text>
            {selectedPayment && (
              <>
                <Text style={styles.modalService}>Service: {selectedPayment.service}</Text>
                <Text style={styles.modalAmount}>Amount: {formatCurrency(selectedPayment.amount)}</Text>
                <Text style={styles.modalDate}>Due Date: {selectedPayment.dueDate}</Text>
              </>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.payLaterButton]}
                onPress={handlePayLater}
              >
                <Text style={styles.modalButtonText}>Pay Later</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.payNowButton]}
                onPress={handleConfirmPayment}
              >
                <Text style={styles.modalButtonText}>Pay Now</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Custom Confirm Modal for Web */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={() => setConfirmModalVisible(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Pay Later</Text>
            {selectedPayment && (
              <Text style={styles.confirmText}>
                Are you sure you want to pay {selectedPayment.service} later?
              </Text>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  setConfirmModalVisible(false);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0F',
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  insightsCard: {
    backgroundColor: '#1A1A1F',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  insightsTitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 8,
  },
  insightsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  insightsSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 8,
  },
  upcomingTotal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B35',
  },
  confirmationCard: {
    backgroundColor: '#4CAF50',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmationText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  confirmationService: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
  },
  dismissButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  dismissText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 11, 15, 0.9)',
  },
  modalContent: {
    backgroundColor: '#1A1A1F',
    width: '80%',
    maxWidth: 350,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  modalService: {
    fontSize: 16,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  modalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4CAF50',
  },
  modalDate: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 20,
  },
  confirmText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  payLaterButton: {
    backgroundColor: '#FF6B35',
  },
  payNowButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});