import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform, TouchableOpacity, Modal, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';

type HeaderProps = {
  title: string;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  greeting?: string;
  onFilterChange?: (filter: 'all' | 'dueSoon' | 'paid') => void;
};

const AVATAR_URL = 'https://i.pravatar.cc/150?u=bundul_user';

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onSearch,
  searchPlaceholder = "Search subscriptions...",
  greeting = "Good evening, Tomide",
  onFilterChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'dueSoon' | 'paid'>('all');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleFilterChange = (filter: 'all' | 'dueSoon' | 'paid') => {
    setActiveFilter(filter);
    setDropdownVisible(false);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#00FF85', '#4DA6FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarWrapper}
          >
            <Image 
              source={{ uri: AVATAR_URL }} 
              style={styles.avatar}
              accessibilityLabel="User avatar"
            />
          </LinearGradient>
        </View>
        
        <View style={styles.titleContainer}>
          <TouchableOpacity 
            style={styles.titleWrapper}
            onPress={() => setDropdownVisible(true)}
            accessibilityRole="button"
          >
            <Text style={styles.headerTitle}>{title}</Text>
            <Ionicons name="chevron-down" size={20} color={Colors.dark.text} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.notificationIcon} accessibilityRole="button">
          <Ionicons name="notifications-outline" size={24} color={Colors.dark.text} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.greeting}>{greeting}</Text>
      
      {onSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            placeholderTextColor={Colors.dark.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            clearButtonMode="while-editing"
          />
        </View>
      )}
      
      {onFilterChange && (
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'all' && styles.activeFilterButton]}
            onPress={() => handleFilterChange('all')}
            accessibilityRole="button"
          >
            <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'dueSoon' && styles.activeFilterButton]}
            onPress={() => handleFilterChange('dueSoon')}
            accessibilityRole="button"
          >
            <Text style={[styles.filterText, activeFilter === 'dueSoon' && styles.activeFilterText]}>Due Soon</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'paid' && styles.activeFilterButton]}
            onPress={() => handleFilterChange('paid')}
            accessibilityRole="button"
          >
            <Text style={[styles.filterText, activeFilter === 'paid' && styles.activeFilterText]}>Paid</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={dropdownVisible}
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setDropdownVisible(false)}
          accessibilityRole="button"
        >
          <View style={styles.dropdownMenu}>
            {onFilterChange ? (
              <>
                <TouchableOpacity 
                  style={styles.dropdownItem}
                  onPress={() => handleFilterChange('all')}
                  accessibilityRole="button"
                >
                  <Text style={styles.dropdownItemText}>All Payments</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.dropdownItem}
                  onPress={() => handleFilterChange('dueSoon')}
                  accessibilityRole="button"
                >
                  <Text style={styles.dropdownItemText}>Upcoming</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.dropdownItem}
                  onPress={() => handleFilterChange('paid')}
                  accessibilityRole="button"
                >
                  <Text style={styles.dropdownItemText}>Paid History</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.dropdownItem, styles.lastDropdownItem]}
                  onPress={() => {
                    setDropdownVisible(false);
                  }}
                  accessibilityRole="button"
                >
                  <Text style={styles.dropdownItemText}>Settings</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity 
                style={[styles.dropdownItem, styles.lastDropdownItem]}
                onPress={() => {
                  setDropdownVisible(false);
                }}
                accessibilityRole="button"
              >
                <Text style={styles.dropdownItemText}>Settings</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.dark.headerBackground,
    paddingHorizontal: Spacing.md,
    paddingTop: 10,
    paddingBottom: Spacing.sm,
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  avatarContainer: {
    flex: 1,
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  titleContainer: {
    flex: 2,
    alignItems: 'center',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.heading2,
    color: Colors.dark.text,
    fontWeight: '700',
    marginRight: Spacing.xs,
    fontSize: 20,
  },
  notificationIcon: {
    flex: 1,
    alignItems: 'flex-end',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.accentOrange,
  },
  greeting: {
    ...Typography.bodyLarge,
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.xs,
    marginLeft: Spacing.md,
    fontSize: 14,
  },
  searchContainer: {
    marginBottom: Spacing.xs,
    marginHorizontal: Spacing.md,
  },
  searchInput: {
    ...Typography.bodyMedium,
    backgroundColor: Colors.dark.surfaceVariant,
    color: Colors.dark.text,
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    height: 36,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: Spacing.md,
    marginBottom: 0,
    backgroundColor: Colors.dark.surfaceVariant,
    borderRadius: BorderRadius.pill,
    padding: Spacing.xs,
    height: 32,
    marginTop: Spacing.xs,
  },
  filterButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.pill,
  },
  activeFilterButton: {
    backgroundColor: Colors.dark.primary,
  },
  filterText: {
    ...Typography.label,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  activeFilterText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
  },
  dropdownMenu: {
    backgroundColor: Colors.dark.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    width: 200,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
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
  dropdownItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.borderColor,
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    ...Typography.bodyLarge,
    color: Colors.dark.text,
  },
});

export default Header;