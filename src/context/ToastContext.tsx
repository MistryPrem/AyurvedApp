import React, { createContext, useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface ToastContextType {
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const insets = useSafeAreaInsets();

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newToast: ToastMessage = {
      id: Math.random().toString(),
      message,
      type,
    };
    setToast(newToast);

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // High contrast vibrant colors distinct from general theme background
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: '#0F5257', // Deep Teal Green
          border: '#00E676', // Electric Neon Green Border
          badgeBg: '#00E676',
          badgeText: '#0B2B26',
          icon: '✓ SUCCESS',
        };
      case 'error':
        return {
          bg: '#4A0E17', // Deep Maroon Red
          border: '#FF1744', // Neon Coral Red Border
          badgeBg: '#FF1744',
          badgeText: '#FFFFFF',
          icon: '✕ ERROR',
        };
      case 'warning':
        return {
          bg: '#3E2723', // Deep Amber Brown
          border: '#FFAB00', // Bright Amber Gold Border
          badgeBg: '#FFAB00',
          badgeText: '#212121',
          icon: '⚠️ WARNING',
        };
      default:
        return {
          bg: '#1A237E', // Deep Indigo Blue
          border: '#29B6F6', // Neon Electric Blue Border
          badgeBg: '#29B6F6',
          badgeText: '#0D47A1',
          icon: 'ℹ INFO',
        };
    }
  };

  const styleConfig = toast ? getTypeStyle(toast.type) : null;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && styleConfig && (
        <View
          style={[
            styles.toastCard,
            {
              backgroundColor: styleConfig.bg,
              borderColor: styleConfig.border,
              top: (insets.top > 0 ? insets.top : 20) + 10,
            },
          ]}>
          <View style={[styles.badge, { backgroundColor: styleConfig.badgeBg }]}>
            <Text style={[styles.badgeText, { color: styleConfig.badgeText }]}>
              {styleConfig.icon}
            </Text>
          </View>
          <Text style={styles.toastText} numberOfLines={2}>
            {toast.message}
          </Text>
        </View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  toastCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 2,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    zIndex: 99999,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  toastText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
});
