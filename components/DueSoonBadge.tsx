import React, { useContext } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { PulseAnimationContext } from '../hooks/PulseAnimationContext';
import { Colors } from '../constants/theme';
import { Typography } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Ionicons } from '@expo/vector-icons';

const DueSoonBadge = ({ daysUntilDue = 2 }: { daysUntilDue?: number }) => {
  const pulse = useContext(PulseAnimationContext);
  
  // Calculate gradient colors based on days until due
  const getGradientColors = (): [string, string] => {
    if (daysUntilDue >= 5) {
      return ['#F9D423', '#FFA726']; // Soft amber → orange
    } else if (daysUntilDue >= 3) {
      return ['#FFA726', '#FF7849']; // Orange → coral
    } else {
      return ['#FF4E50', '#F9D423']; // Deep red → yellow
    }
  };
  
  const gradientColors = getGradientColors();
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: pulse ? interpolate(pulse.value, [0.8, 1], [0.8, 1], Extrapolate.CLAMP) : 1,
    };
  });
  
  // Calculate progress percentage for the accent bar
  const progressPercentage = Math.max(0, Math.min(100, (5 - daysUntilDue) * 20));

  return (
    <View style={styles.container}>
      {/* Gradient Badge */}
      <Animated.View 
        style={[
          styles.badgeWrapper, 
          animatedStyle
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.badgeContainer}
        >
          <View style={styles.badgeContent}>
            <Ionicons 
              name="time-outline" 
              size={12} 
              color="white" 
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeText}>
              {daysUntilDue === 1 ? '1 day left' : `${daysUntilDue} days left`}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
      
      {/* Progress Accent Bar */}
      <View style={styles.progressContainer}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.progressFill, 
            {
              width: `${progressPercentage}%`,
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  badgeWrapper: {
    height: 22,
    borderRadius: BorderRadius.pill,
    ...Platform.select({
      ios: {
        shadowColor: '#FF4E50',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 0 6px rgba(255, 78, 80, 0.4)',
      },
    }),
  },
  badgeContainer: {
    height: 22,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    marginRight: Spacing.xs / 2,
  },
  badgeText: {
    color: 'white',
    ...Typography.caption,
    fontWeight: '600',
    fontSize: 12,
  },
  progressContainer: {
    height: 3,
    width: '100%',
    backgroundColor: Colors.dark.cardBackground,
    borderRadius: 2,
    marginTop: Spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});

export default DueSoonBadge;