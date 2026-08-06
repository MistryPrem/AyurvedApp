import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DoctorListScreen } from '../screens/consultation/DoctorListScreen';
import { DoctorDetailScreen } from '../screens/consultation/DoctorDetailScreen';
import { UpcomingConsultationsScreen } from '../screens/consultation/UpcomingConsultationsScreen';

import { ProductListScreen } from '../screens/shop/ProductListScreen';
import { ProductDetailScreen } from '../screens/shop/ProductDetailScreen';
import { CartScreen } from '../screens/shop/CartScreen';

import { HealthTimelineScreen } from '../screens/health/HealthTimelineScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { OfflineBanner } from '../components/common/OfflineBanner';

export const RootNavigator: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<'consult' | 'shop' | 'health' | 'settings'>('consult');
  const [consultStackState, setConsultStackState] = useState<{ screen: string; params?: any }>({
    screen: 'DoctorList',
  });
  const [shopStackState, setShopStackState] = useState<{ screen: string; params?: any }>({
    screen: 'ProductList',
  });

  const navigateConsult = useCallback((screen: string, params?: any) => {
    setConsultStackState({ screen, params });
  }, []);

  const navigateShop = useCallback((screen: string, params?: any) => {
    setShopStackState({ screen, params });
  }, []);

  const handleGoBack = useCallback(() => {
    if (activeTab === 'consult') {
      if (consultStackState.screen !== 'DoctorList') {
        setConsultStackState({ screen: 'DoctorList' });
        return true;
      }
    }

    if (activeTab === 'shop') {
      if (shopStackState.screen !== 'ProductList') {
        setShopStackState({ screen: 'ProductList' });
        return true;
      }
    }

    if (activeTab !== 'consult') {
      setActiveTab('consult');
      return true;
    }

    return false;
  }, [activeTab, consultStackState.screen, shopStackState.screen]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      return handleGoBack();
    });
    return () => subscription.remove();
  }, [handleGoBack]);

  const consultNav = useMemo(
    () => ({
      navigate: navigateConsult,
      goBack: handleGoBack,
      canGoBack: () => consultStackState.screen !== 'DoctorList',
    }),
    [navigateConsult, handleGoBack, consultStackState.screen]
  );

  const shopNav = useMemo(
    () => ({
      navigate: navigateShop,
      goBack: handleGoBack,
      canGoBack: () => shopStackState.screen !== 'ProductList',
    }),
    [navigateShop, handleGoBack, shopStackState.screen]
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}>
      <OfflineBanner />

      <View style={styles.mainContainer}>
        {/* Keep Tab Views Mounted for Instant Sub-Millisecond Switching */}
        <View style={[styles.tabContent, { display: activeTab === 'consult' ? 'flex' : 'none' }]}>
          {consultStackState.screen === 'DoctorList' && (
            <DoctorListScreen navigation={consultNav} />
          )}
          {consultStackState.screen === 'DoctorDetail' && (
            <DoctorDetailScreen
              route={{ params: consultStackState.params }}
              navigation={consultNav}
            />
          )}
          {consultStackState.screen === 'UpcomingConsultations' && (
            <UpcomingConsultationsScreen navigation={consultNav} />
          )}
        </View>

        <View style={[styles.tabContent, { display: activeTab === 'shop' ? 'flex' : 'none' }]}>
          {shopStackState.screen === 'ProductList' && (
            <ProductListScreen navigation={shopNav} />
          )}
          {shopStackState.screen === 'ProductDetail' && (
            <ProductDetailScreen
              route={{ params: shopStackState.params }}
              navigation={shopNav}
            />
          )}
          {shopStackState.screen === 'Cart' && (
            <CartScreen navigation={shopNav} />
          )}
        </View>

        <View style={[styles.tabContent, { display: activeTab === 'health' ? 'flex' : 'none' }]}>
          <HealthTimelineScreen />
        </View>

        <View style={[styles.tabContent, { display: activeTab === 'settings' ? 'flex' : 'none' }]}>
          <SettingsScreen />
        </View>
      </View>

      {/* Dynamic Ayurvedic Bottom Tab Navigation */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            height: 60 + (insets.bottom > 0 ? insets.bottom : 0),
          },
        ]}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setActiveTab('consult');
            setConsultStackState({ screen: 'DoctorList' });
          }}>
          <Text style={{ fontSize: 20 }}>👨‍⚕️</Text>
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'consult' && consultStackState.screen === 'DoctorList' ? colors.primary : colors.textMuted },
            ]}>
            {t('doctors')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setActiveTab('consult');
            setConsultStackState({ screen: 'UpcomingConsultations' });
          }}>
          <Text style={{ fontSize: 20 }}>📅</Text>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'consult' &&
                  consultStackState.screen === 'UpcomingConsultations'
                    ? colors.primary
                    : colors.textMuted,
              },
            ]}>
            {t('bookings')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setActiveTab('shop');
            setShopStackState({ screen: 'ProductList' });
          }}>
          <Text style={{ fontSize: 20 }}>🌿</Text>
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'shop' ? colors.primary : colors.textMuted },
            ]}>
            {t('shop')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('health')}>
          <Text style={{ fontSize: 20 }}>📋</Text>
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'health' ? colors.primary : colors.textMuted },
            ]}>
            {t('timeline')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('settings')}>
          <Text style={{ fontSize: 20 }}>⚙️</Text>
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'settings' ? colors.primary : colors.textMuted },
            ]}>
            {t('settings')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
});
