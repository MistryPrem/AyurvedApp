import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useAppState } from '../../context/AppStateContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { useNetwork } from '../../context/NetworkContext';
import { offlineSync } from '../../services/offlineSync';
import { FallbackImage } from '../../components/common/FallbackImage';

export const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useAppState();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { isOnline } = useNetwork();

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (!isOnline) {
      offlineSync.enqueueAction('CHECKOUT_CART', { items: cart, total: cartTotal });
      clearCart();
      showToast('Offline Mode: Order queued for auto-sync!', 'info');
      navigation.navigate('ProductList');
      return;
    }

    clearCart();
    showToast('Order Placed Successfully!', 'success');
    navigation.navigate('ProductList');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack ? navigation.goBack() : navigation.navigate('ProductList')}>
          <Text style={[styles.backBtnText, { color: colors.primary }]}>← {t('back')}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {t('cartSummary')}
        </Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Your cart is empty.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.product.id}
            renderItem={({ item }) => (
              <View style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <FallbackImage source={{ uri: item.product.imageUrl }} fallbackType="product" iconSize={24} style={styles.image} />
                <View style={styles.info}>
                  <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                    {item.product.title}
                  </Text>
                  <Text style={[styles.price, { color: colors.secondary }]}>₹{item.product.price}</Text>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={[styles.qtyBtn, { borderColor: colors.border }]}
                      onPress={() => updateQuantity(item.product.id, item.quantity - 1)}>
                      <Text style={[styles.qtyText, { color: colors.text }]}>-</Text>
                    </TouchableOpacity>
                    <Text style={[styles.qtyValue, { color: colors.text }]}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={[styles.qtyBtn, { borderColor: colors.border }]}
                      onPress={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      <Text style={[styles.qtyText, { color: colors.text }]}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.product.id)}>
                  <Text style={{ fontSize: 18 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />

          <View style={[styles.footer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total Amount:</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>₹{cartTotal}</Text>
            </View>
            <TouchableOpacity
              style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
              onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    paddingRight: 12,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  checkoutBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
