import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNetwork } from '../../context/NetworkContext';
import { useTheme } from '../../context/ThemeContext';
import { i18n } from '../../services/i18n';

export const OfflineBanner: React.FC = () => {
  const { isOnline, toggleNetwork } = useNetwork();
  const { colors } = useTheme();

  // Hide banner completely when online; only show persistent banner when offline
  if (isOnline) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: '#D32F2F' }]}>
      <Text style={styles.text}>
        ⚡ Offline Mode — {i18n.t('offlineNotice')}
      </Text>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleNetwork}>
        <Text style={styles.toggleText}>Go Online & Sync</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  toggleButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
