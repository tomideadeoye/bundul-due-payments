import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet, Platform, Image } from 'react-native';
import { Card } from 'react-native-paper';
import DueSoonBadge from './DueSoonBadge';
import { formatDate, formatCurrency, isDueSoon } from '../utils/formatters';
import { Payment } from '../data/payments';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withRepeat, Easing, withTiming } from 'react-native-reanimated';
import { PulseAnimationContext } from '../hooks/PulseAnimationContext';
import { Colors } from '../constants/theme';
import { Typography } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';
import { getLogoForService } from '../utils/logoMapper';

type PaymentCardProps = {
  payment: Payment;
  onPayNowPress: (payment: Payment) => void;
};

const PaymentCard: React.FC<PaymentCardProps> = ({ payment, onPayNowPress }) => {
  const dueSoon = isDueSoon(payment.dueDate);
  const pulse = useContext(PulseAnimationContext);
  const logo = getLogoForService(payment.service);
  const [logoError, setLogoError] = useState(false);
  const scale = useSharedValue(1);
  
  const entryOpacity = useSharedValue(0);
  const entryTranslateY = useSharedValue(20);
  
  const buttonScale = useSharedValue(1);
  
  const pulseScale = useSharedValue(1);
  
  React.useEffect(() => {
    entryOpacity.value = withSpring(1, { damping: 15, stiffness: 100 });
    entryTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  
  React.useEffect(() => {
    if (dueSoon && pulse) {
      pulseScale.value = withRepeat(
        withTiming(1.03, { duration: 2000 }),
        -1,
        true
      );
    }
  }, [dueSoon, pulse]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: entryOpacity.value,
      transform: [
        { translateY: entryTranslateY.value },
      ],
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: dueSoon && pulse ? pulseScale.value : 1 }
      ],
    };
  });

  const buttonPressIn = () => {
    buttonScale.value = withSpring(0.95, { damping: 10, stiffness: 100 });
  };

  const buttonPressOut = () => {
    buttonScale.value = withSpring(1, { damping: 10, stiffness: 100 });
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const calculateDaysUntilDue = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getServiceInitials = (serviceName: string) => {
    const words = serviceName.split(' ');
    if (words.length === 1) {
      return serviceName.substring(0, 2).toUpperCase();
    }
    return words.map(word => word[0]).join('').toUpperCase().substring(0, 2);
  };

  const renderLogoOrInitials = () => {
    if (logo && !logoError) {
      return (
        <View style={styles.logoContainer}>
          <Image 
            source={logo} 
            style={styles.logo} 
            resizeMode="contain"
            onError={() => setLogoError(true)}
          />
        </View>
      );
    }
    

    return (
      <View style={styles.initialsContainer}>
        <Text style={styles.initialsText}>{getServiceInitials(payment.service)}</Text>
      </View>
    );
  };

  const renderActionButton = () => {
    if (payment.paid) {
      return (
        <View style={styles.paidBadge}>
          <Text style={styles.paidBadgeText}>Paid</Text>
        </View>
      );
    }
    
    return (
      <>
        {Platform.OS === 'web' ? (
          <Animated.View style={buttonAnimatedStyle}>
            <Pressable 
              style={({ pressed }) => [
                styles.payButton,
                { opacity: pressed ? 0.8 : 1 }
              ]}
              onPress={() => onPayNowPress(payment)}
              onPressIn={buttonPressIn}
              onPressOut={buttonPressOut}
              accessibilityRole="button"
            >
              <Text style={styles.payButtonText}>Pay Now</Text>
            </Pressable>
          </Animated.View>
        ) : (
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity 
              style={styles.payButton} 
              onPress={() => onPayNowPress(payment)}
              onPressIn={buttonPressIn}
              onPressOut={buttonPressOut}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </>
    );
  };

  return (
    <Animated.View style={[animatedStyle, pulseStyle]}>
      <Card 
        style={[
          styles.card, 
          dueSoon && styles.dueSoonCard
        ]}
      >
        <Card.Content style={styles.cardContent}>
          <View style={styles.leftContent}>
            {renderLogoOrInitials()}
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{payment.service}</Text>
              <Text style={styles.dueDate}>{formatDate(payment.dueDate)}</Text>
            </View>
          </View>
          
          <View style={styles.rightContent}>
            <Text style={styles.amount}>{formatCurrency(payment.amount)}</Text>
            {dueSoon && <DueSoonBadge daysUntilDue={calculateDaysUntilDue(payment.dueDate)} />}
            {renderActionButton()}
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.dark.cardBackground,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
      }
    }),
  },
  dueSoonCard: {
    backgroundColor: 'rgba(255, 76, 76, 0.1)', 
    borderLeftColor: Colors.dark.danger, 
    borderLeftWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      }
    }),
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  logoContainer: {
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  initialsContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  initialsText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  serviceName: {
    ...Typography.bodyLarge,
    color: Colors.dark.text,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  dueDate: {
    ...Typography.bodySmall,
    color: Colors.dark.textSecondary,
  },
  amount: {
    ...Typography.bodyLarge,
    color: Colors.dark.text,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  payButton: {
    backgroundColor: Colors.dark.accentOrange,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 24,
    minWidth: 100,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      }
    }),
  },
  payButtonText: {
    color: Colors.dark.background,
    ...Typography.label,
    fontWeight: 'bold',
  },
  paidBadge: {
    backgroundColor: Colors.dark.accentGreen,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 24,
    minWidth: 100,
    alignItems: 'center',
  },
  paidBadgeText: {
    color: Colors.dark.background,
    ...Typography.label,
    fontWeight: 'bold',
  },
});

export default PaymentCard;