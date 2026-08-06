import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Product } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppState } from '../../context/AppStateContext';
import { useToast } from '../../context/ToastContext';
import { FallbackImage } from '../../components/common/FallbackImage';

export const ProductDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { product } = route.params as { product: Product };
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { addToCart, wishlist, toggleWishlist } = useAppState();
  const { showToast } = useToast();

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`${product.title} added to cart!`, 'success');
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
          {product.title}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageWrapper}>
          <FallbackImage source={{ uri: product.imageUrl }} fallbackType="product" iconSize={60} style={styles.image} />
          <TouchableOpacity
            style={styles.wishlistBtn}
            onPress={() => {
              toggleWishlist(product.id);
              showToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info');
            }}>
            <Text style={{ fontSize: 20 }}>{isWishlisted ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.detailsContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.category, { color: colors.primary }]}>{product.category}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{product.title}</Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.text }]}>₹{product.price}</Text>
            <Text style={[styles.originalPrice, { color: colors.textMuted }]}>
              ₹{product.originalPrice}
            </Text>
            <Text style={[styles.ratingBadge, { backgroundColor: colors.chipBackground, color: colors.primary }]}>
              ★ {product.rating} ({product.reviewCount} reviews)
            </Text>
          </View>

          <Text style={[styles.sectionHeading, { color: colors.text }]}>Description & Ayurvedic Benefits</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {product.description} Formulated by expert Ayurvedic doctors using 100% organic herbs. Free from harmful chemicals, parabens, and preservatives.
          </Text>

          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={handleAddToCart}>
            <Text style={styles.addBtnText}>Add to Cart — ₹{product.price}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  imageWrapper: {
    height: 280,
    backgroundColor: '#E8F5E9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  detailsContainer: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  ratingBadge: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  addBtn: {
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
