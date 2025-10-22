import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';

type FloatingActionButtonProps = {
  onPress: () => void;
  icon?: string;
};

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onPress,
  icon = 'add'
}) => {
  return (
    <TouchableOpacity 
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons 
        name={icon as any} 
        size={24} 
        color={Colors.dark.background} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: Spacing.xxl,
    right: Spacing.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.accentGreen,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
});

export default FloatingActionButton;