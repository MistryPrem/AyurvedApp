import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Product } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { useToast } from '../../context/ToastContext';
import { isTablet, scaleFont } from '../../utils/responsive';
import { FallbackImage } from '../common/FallbackImage';

interface Props {
  product: Product;
  onPress: () => void;
}

export const ProductCard = React.memo<Props>(({ product, onPress }) => {
  const { colors } = useTheme();
  const { addToCart, wishlist, toggleWishlist } = useAppState();
  const { showToast } = useToast();
  const isWishlisted = wishlist.includes(product.id);
  const tablet = isTablet();

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`🛒 "${product.title}" added to cart!`, 'success');
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    showToast(
      isWishlisted ? `Removed "${product.title}" from wishlist` : `Added "${product.title}" to wishlist ❤️`,
      'info'
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${product.title}, Price ₹${product.price}`}>
      <View style={[styles.imageContainer, { height: tablet ? 180 : 140 }]}>
        <FallbackImage source={{ uri: product.imageUrl }} fallbackType="product" iconSize={40} style={styles.image} />
        <TouchableOpacity
          style={styles.wishlistBadge}
          onPress={handleToggleWishlist}>
          <Text style={{ fontSize: tablet ? 18 : 14 }}>{isWishlisted ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.category, { color: colors.primary, fontSize: scaleFont(10) }]} numberOfLines={1}>
          {product.category}
        </Text>
        <Text style={[styles.title, { color: colors.text, fontSize: scaleFont(13) }]} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.ratingRow}>
          <Text style={[styles.ratingText, { color: colors.secondary, fontSize: scaleFont(11) }]}>
            ★ {product.rating} ({product.reviewCount})
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.text, fontSize: scaleFont(15) }]}>₹{product.price}</Text>
          <Text style={[styles.originalPrice, { color: colors.textMuted, fontSize: scaleFont(12) }]}>
            ₹{product.originalPrice}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={handleAddToCart}>
          <Text style={[styles.addBtnText, { fontSize: scaleFont(12) }]}>+ Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  imageContainer: {
    backgroundColor: '#F0F4F2',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 10,
  },
  category: {
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontWeight: '600',
    marginTop: 2,
    height: 38,
  },
  ratingRow: {
    marginTop: 4,
  },
  ratingText: {
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  price: {
    fontWeight: '700',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  addBtn: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
