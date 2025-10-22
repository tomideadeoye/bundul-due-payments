import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

type SvgLogoProps = {
  serviceName: string;
  size?: number;
};

const SvgLogo: React.FC<SvgLogoProps> = ({ serviceName, size = 40 }) => {
  // Specific handling for Disney+
  if (serviceName === 'Disney+') {
    return (
      <View style={[styles.disneyContainer, { width: size, height: size }]}>
        <Text style={styles.disneyText}>D+</Text>
      </View>
    );
  }
  
  // Generic placeholder for other SVGs
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Text style={styles.placeholderText}>
        {serviceName.substring(0, 2).toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    marginRight: 16,
  },
  disneyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#113CCF', // Disney+ blue color
    borderRadius: 8,
    marginRight: 16,
  },
  placeholderText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 12,
  },
  disneyText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SvgLogo;