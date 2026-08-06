import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { generateProducts } from '../../data/generators';
import { ProductCard } from '../../components/shop/ProductCard';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppState } from '../../context/AppStateContext';
import { getGridColumns, scaleFont } from '../../utils/responsive';
import { Product } from '../../types';

const ALL_PRODUCTS = generateProducts(20000);
const PAGE_SIZE = 24;

const CATEGORIES = [
  'All',
  'Immunity & Vitality',
  'Chyawanprash & Tonics',
  'Hair Care & Oils',
  'Skincare & Herbal Soaps',
  'Digestive Health',
];

export const ProductListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { cart } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'priceAsc' | 'priceDesc'>('rating');
  const [page, setPage] = useState(1);
  const [numColumns, setNumColumns] = useState(getGridColumns());

  // Listen to screen dimension changes for tablet responsiveness
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setNumColumns(getGridColumns());
    });
    return () => subscription?.remove();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = ALL_PRODUCTS;

    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'priceAsc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, page * PAGE_SIZE);
  }, [filteredProducts, page]);

  const loadMore = useCallback(() => {
    if (visibleProducts.length < filteredProducts.length) {
      setPage((prev) => prev + 1);
    }
  }, [visibleProducts.length, filteredProducts.length]);

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      />
    ),
    [navigation]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.topRow}>
          <TextInput
            style={[
              styles.searchInput,
              { backgroundColor: colors.background, color: colors.text, borderColor: colors.border, fontSize: scaleFont(13) },
            ]}
            placeholder={t('searchProduct')}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setPage(1);
            }}
          />
          <TouchableOpacity
            style={[styles.cartBadgeBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Cart')}>
            <Text style={[styles.cartBadgeText, { fontSize: scaleFont(14) }]}>
              🛒 {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryRow}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            keyExtractor={(cat) => cat}
            renderItem={({ item }) => {
              const active = item === selectedCategory;
              return (
                <TouchableOpacity
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? colors.primary : colors.chipBackground,
                    },
                  ]}
                  onPress={() => {
                    setSelectedCategory(item);
                    setPage(1);
                  }}>
                  <Text style={[styles.chipText, { color: active ? '#FFFFFF' : colors.primary, fontSize: scaleFont(12) }]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View style={styles.sortRow}>
          <Text style={[styles.sortLabel, { color: colors.textMuted, fontSize: scaleFont(12) }]}>Sort by:</Text>
          <TouchableOpacity onPress={() => setSortBy('rating')}>
            <Text
              style={[
                styles.sortOption,
                { color: sortBy === 'rating' ? colors.primary : colors.textSecondary, fontSize: scaleFont(12) },
              ]}>
              Rating
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortBy('priceAsc')}>
            <Text
              style={[
                styles.sortOption,
                { color: sortBy === 'priceAsc' ? colors.primary : colors.textSecondary, fontSize: scaleFont(12) },
              ]}>
              Price: Low-High
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortBy('priceDesc')}>
            <Text
              style={[
                styles.sortOption,
                { color: sortBy === 'priceDesc' ? colors.primary : colors.textSecondary, fontSize: scaleFont(12) },
              ]}>
              Price: High-Low
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.resultsText, { color: colors.textMuted, fontSize: scaleFont(11) }]}>
        Showing {visibleProducts.length} of {filteredProducts.length} products ({numColumns} Columns)
      </Text>

      <FlatList
        key={numColumns} // Re-render grid when column count changes
        data={visibleProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        numColumns={numColumns}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={5}
        removeClippedSubviews={true}
        ListFooterComponent={() =>
          visibleProducts.length < filteredProducts.length ? (
            <ActivityIndicator style={{ marginVertical: 16 }} color={colors.primary} />
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 12,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  cartBadgeBtn: {
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  categoryRow: {
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 8,
  },
  chipText: {
    fontWeight: '600',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  sortLabel: {},
  sortOption: {
    fontWeight: '600',
  },
  resultsText: {
    marginHorizontal: 12,
    marginVertical: 6,
  },
});
