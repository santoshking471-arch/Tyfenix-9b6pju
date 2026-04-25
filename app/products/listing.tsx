import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
  Dimensions, Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useCart } from '@/hooks/useCart';
import { PRODUCTS, CATEGORIES, formatPrice } from '@/constants/mockData';
import { BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

const { width: W } = Dimensions.get('window');

type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'discount';

export default function ProductListingScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { query, categoryId, categoryName } = useLocalSearchParams<any>();
  const { addToCart } = useCart();

  const [search, setSearch] = useState(query || '');
  const [sort, setSort] = useState<SortOption>('relevance');
  const [selectedCat, setSelectedCat] = useState(categoryId || 'all');
  const [showSortModal, setShowSortModal] = useState(false);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [minRating, setMinRating] = useState(0);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
    if (selectedCat !== 'all') list = list.filter(p => p.categoryId === selectedCat);
    list = list.filter(p => p.price <= maxPrice && p.rating >= minRating);
    switch (sort) {
      case 'price_asc': return list.sort((a, b) => a.price - b.price);
      case 'price_desc': return list.sort((a, b) => b.price - a.price);
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
      case 'discount': return list.sort((a, b) => b.discount - a.discount);
      default: return list;
    }
  }, [search, selectedCat, sort, maxPrice, minRating]);

  const SORT_OPTIONS: { key: SortOption; label: string }[] = [
    { key: 'relevance', label: 'Relevance' },
    { key: 'price_asc', label: 'Price: Low to High' },
    { key: 'price_desc', label: 'Price: High to Low' },
    { key: 'rating', label: 'Top Rated' },
    { key: 'discount', label: 'Best Discount' },
  ];

  const s = styles(colors);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={[s.searchBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <MaterialIcons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={[{ flex: 1, color: colors.text, fontSize: FontSize.md }]}
            value={search}
            onChangeText={setSearch}
            placeholder="Search products..."
            placeholderTextColor={colors.textMuted}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialIcons name="close" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <View style={{ backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <FlatList
          data={[{ id: 'all', name: 'All', icon: 'apps', color: '#1A237E', productCount: 0 }, ...CATEGORIES]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.catChip, selectedCat === item.id && { backgroundColor: colors.primary }]}
              onPress={() => setSelectedCat(item.id)}
            >
              <Text style={[s.catChipText, selectedCat === item.id && { color: '#fff' }]}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Sort & Filter Bar */}
      <View style={[s.filterBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={s.filterBtn} onPress={() => setShowSortModal(true)}>
          <MaterialIcons name="sort" size={18} color={colors.primary} />
          <Text style={[s.filterBtnText, { color: colors.text }]}>Sort</Text>
        </TouchableOpacity>
        <View style={[{ width: 1, height: 20, backgroundColor: colors.border }]} />
        {[4, 4.5].map(r => (
          <TouchableOpacity key={r} style={[s.filterBtn, minRating === r && { backgroundColor: colors.primary + '20' }]} onPress={() => setMinRating(minRating === r ? 0 : r)}>
            <MaterialIcons name="star" size={14} color={colors.star} />
            <Text style={[s.filterBtnText, { color: colors.text }]}>{r}+</Text>
          </TouchableOpacity>
        ))}
        <Text style={[{ color: colors.textMuted, fontSize: FontSize.sm, marginLeft: 'auto' }]}>{filtered.length} results</Text>
      </View>

      {/* Sort Modal */}
      <Modal visible={showSortModal} transparent animationType="slide" onRequestClose={() => setShowSortModal(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setShowSortModal(false)}>
          <View style={[s.sortModal, { backgroundColor: colors.surface }]}>
            <Text style={[s.sortTitle, { color: colors.text }]}>Sort By</Text>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[s.sortOption, sort === opt.key && { backgroundColor: colors.primary + '15' }]}
                onPress={() => { setSort(opt.key); setShowSortModal(false); }}
              >
                <Text style={[{ color: sort === opt.key ? colors.primary : colors.text, fontSize: FontSize.base, fontWeight: sort === opt.key ? FontWeight.bold : FontWeight.regular }]}>{opt.label}</Text>
                {sort === opt.key && <MaterialIcons name="check" size={20} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={p => p.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        columnWrapperStyle={{ gap: 12 }}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', paddingTop: 80 }}>
            <MaterialIcons name="search-off" size={64} color={colors.textMuted} />
            <Text style={{ color: colors.textMuted, marginTop: 16, fontSize: FontSize.lg }}>No products found</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[s.card, { backgroundColor: colors.card }]}
            onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
            activeOpacity={0.85}
          >
            <Image source={{ uri: item.image }} style={s.cardImg} contentFit="cover" />
            {item.badge && <View style={[s.badge, { backgroundColor: colors.primary }]}><Text style={s.badgeText}>{item.badge}</Text></View>}
            <View style={s.cardBody}>
              <Text style={[s.cardBrand, { color: colors.textMuted }]}>{item.brand}</Text>
              <Text style={[s.cardName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                <MaterialIcons name="star" size={11} color={colors.star} />
                <Text style={{ color: colors.textSecondary, fontSize: 11 }}>{item.rating} ({item.reviews.toLocaleString()})</Text>
              </View>
              <Text style={[s.price, { color: colors.text }]}>{formatPrice(item.price)}</Text>
              <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                <Text style={{ color: colors.textMuted, fontSize: 10, textDecorationLine: 'line-through' }}>{formatPrice(item.originalPrice)}</Text>
                <Text style={{ color: colors.discount, fontSize: 11, fontWeight: '700' }}>{item.discount}%</Text>
              </View>
              <TouchableOpacity
                style={[s.addBtn, { backgroundColor: colors.primary }]}
                onPress={() => addToCart(item)}
              >
                <MaterialIcons name="add-shopping-cart" size={14} color="#fff" />
                <Text style={s.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: colors.surface, ...Shadow.sm, shadowColor: colors.shadow },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 9, borderRadius: BorderRadius.circle, borderWidth: 1 },
  catChip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: BorderRadius.circle, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  catChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: colors.text },
  filterBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 12, borderBottomWidth: 1 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: BorderRadius.md },
  filterBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  sortModal: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: BorderRadius.xxl, borderTopRightRadius: BorderRadius.xxl, padding: 20, paddingBottom: 40 },
  sortTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginBottom: 16 },
  sortOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12, borderRadius: BorderRadius.lg, marginBottom: 4 },
  card: { flex: 1, borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadow.sm, shadowColor: colors.shadow },
  cardImg: { width: '100%', height: 160 },
  badge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.xs },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  cardBody: { padding: 10 },
  cardBrand: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  cardName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, marginBottom: 6, lineHeight: 18 },
  price: { fontSize: FontSize.md, fontWeight: FontWeight.bold, marginBottom: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 7, borderRadius: BorderRadius.circle, marginTop: 8 },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
