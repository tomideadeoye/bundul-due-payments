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
import AsyncStorage from '@react-native-async-storage/async-storage';
import PaymentCard from '@/components/PaymentCard';
import PaymentConfirmationCard from '@/components/PaymentConfirmationCard';
import Header from '@/components/Header';
import InsightsCard from '@/components/InsightsCard';
import FloatingActionButton from '@/components/FloatingActionButton';
import { mockPayments, Payment } from '@/data/payments';
import { PulseAnimationProvider } from '@/hooks';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { useFocusEffect } from '@react-navigation/native';

const PAID_PAYMENTS_STORAGE_KEY = '@bundul_paid_payments';

export default function PaymentsScreen() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(mockPayments);
  const [paidPayments, setPaidPayments] = useState<Payment[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paidPayment, setPaidPayment] = useState<Payment | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'dueSoon' | 'paid'>('all');
  
  // Helper functions
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isDueSoon = (dateString: string): boolean => {
    const today = new Date();
    const dueDate = new Date(dateString);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 3 && diffDays >= 0;
  };

  const calculateTotalDue = (payments: Payment[]): number => {
    return payments.reduce((total, payment) => total + payment.amount, 0);
  };

  const sortPaymentsByDueDate = (payments: Payment[]): Payment[] => {
    return [...payments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };
  
  // Load paid payments from storage
  const loadPaidPayments = async () => {
    try {
      const storedPaidPayments = await AsyncStorage.getItem(PAID_PAYMENTS_STORAGE_KEY);
      const parsedPaidPayments = storedPaidPayments ? JSON.parse(storedPaidPayments) : [];
      setPaidPayments(parsedPaidPayments);
      
      // Update payments to mark paid ones
      const updatedPayments = mockPayments.map(payment => {
        const isPaid = parsedPaidPayments.some((paid: Payment) => paid.id === payment.id);
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

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadPaidPayments();
    }, [activeFilter])
  );

  // Save paid payments to storage
  useEffect(() => {
    const savePaidPayments = async () => {
      try {
        await AsyncStorage.setItem(PAID_PAYMENTS_STORAGE_KEY, JSON.stringify(paidPayments));
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

  const handleSearch = (query: string) => {
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

  const handleFilterChange = (filter: 'all' | 'dueSoon' | 'paid') => {
    setActiveFilter(filter);
    applyFilters(payments, filter);
  };

  const applyFilters = (paymentList: Payment[], filter: 'all' | 'dueSoon' | 'paid') => {
    let filtered = [...paymentList];
    
    switch (filter) {
      case 'dueSoon':
        filtered = filtered.filter(payment => isDueSoon(payment.dueDate) && !payment.paid);
        break;
      case 'paid':
        // This should not be used in this screen, but just in case
        filtered = paidPayments;
        break;
      case 'all':
      default:
        filtered = filtered.filter(payment => !payment.paid);
        break;
    }
    
    setFilteredPayments(filtered);
  };

  const handlePayNow = (payment: Payment) => {
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

  const renderPaymentItem = ({ item, index }: { item: Payment; index: number }) => (
    <PaymentCard 
      payment={item} 
      onPayNowPress={handlePayNow} 
    />
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
        <Text style={styles.emptyText}>You{`'`}re all caught up! 🎉</Text>
        <Text style={styles.emptySubtext}>No payments due right now</Text>
      </View>
    );
  };

  return (
    <PulseAnimationProvider>
      <View style={styles.container}>
        {/* Enhanced Header with Avatar, Filters, and Search */}
        <Header 
          title="Due Payments" 
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          greeting="Good evening, Tomide"
        />
        
        {/* Insights Card */}
        <InsightsCard 
          totalPaid={totalPaidThisMonth}
          month="October"
          upcomingCount={upcomingPaymentsCount}
          upcomingTotal={upcomingPaymentsTotal}
        />

        {/* Payment Confirmation Card */}
        {showConfirmation && paidPayment && (
          <PaymentConfirmationCard 
            payment={paidPayment} 
            onDismiss={() => {
              setShowConfirmation(false);
              setPaidPayment(null);
            }} 
          />
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
          {...Platform.select({
            web: { style: { pointerEvents: modalVisible ? 'auto' : 'none' } },
            default: { pointerEvents: modalVisible ? 'auto' : 'none' }
          })}
        >
          <Pressable 
            style={styles.modalContainer}
            onPress={() => setModalVisible(false)}
            accessibilityRole="button"
          >
            <Pressable
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
              accessibilityRole="button"
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
                {Platform.OS === 'web' ? (
                  <>
                    <Pressable 
                      style={({ pressed }) => [
                        styles.modalButton,
                        styles.payLaterButton,
                        { opacity: pressed ? 0.7 : 1 }
                      ]}
                      onPress={handlePayLater}
                      accessibilityRole="button"
                    >
                      <Text style={styles.modalButtonText}>Pay Later</Text>
                    </Pressable>
                    <Pressable 
                      style={({ pressed }) => [
                        styles.modalButton,
                        styles.payNowButton,
                        { opacity: pressed ? 0.7 : 1 }
                      ]}
                      onPress={handleConfirmPayment}
                      accessibilityRole="button"
                    >
                      <Text style={styles.modalButtonText}>Pay Now</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.payLaterButton]} 
                      onPress={handlePayLater}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                    >
                      <Text style={styles.modalButtonText}>Pay Later</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.payNowButton]} 
                      onPress={handleConfirmPayment}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                    >
                      <Text style={styles.modalButtonText}>Pay Now</Text>
                    </TouchableOpacity>
                  </>
                )}
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
          {...Platform.select({
            web: { style: { pointerEvents: confirmModalVisible ? 'auto' : 'none' } },
            default: { pointerEvents: confirmModalVisible ? 'auto' : 'none' }
          })}
        >
          <Pressable 
            style={styles.modalContainer}
            onPress={() => setConfirmModalVisible(false)}
            accessibilityRole="button"
          >
            <Pressable
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
              accessibilityRole="button"
            >
              <Text style={styles.modalTitle}>Pay Later</Text>
              {selectedPayment && (
                <Text style={styles.confirmText}>
                  Are you sure you want to pay {selectedPayment.service} later?
                </Text>
              )}
              <View style={styles.modalButtons}>
                <Pressable 
                  style={({ pressed }) => [
                    styles.modalButton,
                    styles.cancelButton,
                    { opacity: pressed ? 0.7 : 1 }
                  ]}
                  onPress={() => setConfirmModalVisible(false)}
                  accessibilityRole="button"
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
                <Pressable 
                  style={({ pressed }) => [
                    styles.modalButton,
                    styles.confirmButton,
                    { opacity: pressed ? 0.7 : 1 }
                  ]}
                  onPress={() => {
                    setConfirmModalVisible(false);
                    setModalVisible(false);
                  }}
                  accessibilityRole="button"
                >
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
        
        {/* Floating Action Button */}
        <FloatingActionButton 
          onPress={() => Alert.alert('Add Subscription', 'This feature will be implemented in the next release.')}
          icon="add"
        />
      </View>
    </PulseAnimationProvider>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 11, 15, 0.9)',
  },
  modalContent: {
    backgroundColor: Colors.dark.cardBackground,
    width: '80%',
    maxWidth: 350,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
      },
    }),
  },
  modalTitle: {
    ...Typography.heading3,
    marginBottom: Spacing.lg,
    color: Colors.dark.text,
  },
  modalService: {
    ...Typography.bodyLarge,
    marginBottom: Spacing.sm,
    color: Colors.dark.text,
  },
  modalAmount: {
    ...Typography.heading4,
    marginBottom: Spacing.sm,
    color: Colors.dark.text,
  },
  modalDate: {
    ...Typography.bodyMedium,
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.lg,
  },
  confirmText: {
    ...Typography.bodyLarge,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    color: Colors.dark.text,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
  },
  payLaterButton: {
    backgroundColor: Colors.dark.warning,
  },
  payNowButton: {
    backgroundColor: Colors.dark.accentGreen,
  },
  cancelButton: {
    backgroundColor: Colors.dark.textMuted,
  },
  confirmButton: {
    backgroundColor: Colors.dark.primary,
  },
  secondaryButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    backgroundColor: Colors.dark.cardBackground,
    borderWidth: 1,
    borderColor: Colors.dark.textMuted,
    width: '100%',
    marginTop: Spacing.sm,
  },
  modalButtonText: {
    color: Colors.dark.background,
    ...Typography.label,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: Colors.dark.textSecondary,
    ...Typography.label,
    fontWeight: '500',
  },
});