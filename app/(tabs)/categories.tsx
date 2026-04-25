import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { CATEGORIES, PRODUCTS, formatPrice } from '@/constants/mockData';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

export default function CategoriesScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState(CATEGORIES[0].id);
  const [search, setSearch] = useState('');

  const filtered = PRODUCTS.filter(p =>
    p.categoryId === selected &&
    (search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  const s = styles(colors);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={s.header}>
        <Text style={s.title}>Categories</Text>
        <View style={s.searchRow}>
          <MaterialIcons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search in category..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <View style={s.body}>
        {/* Sidebar */}
        <View style={s.sidebar}>
          <FlatList
            data={CATEGORIES}
            keyExtractor={i => i.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[s.sideItem, selected === item.id && { backgroundColor: colors.primary + '18', borderRightWidth: 3, borderRightColor: colors.primary }]}
                onPress={() => setSelected(item.id)}
              >
                <View style={[s.sideIcon, { backgroundColor: item.color + '20' }]}>
                  <MaterialIcons name={item.icon as any} size={18} color={item.color} />
                </View>
                <Text style={[s.sideName, { color: selected === item.id ? colors.primary : colors.text }]} numberOfLines={2}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Product Grid */}
        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={i => i.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10, gap: 10 }}
          columnWrapperStyle={{ gap: 10 }}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <MaterialIcons name="search-off" size={48} color={colors.textMuted} />
              <Text style={{ color: colors.textMuted, marginTop: 12 }}>No products found</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.card}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.image }} style={s.cardImage} contentFit="cover" />
              {item.badge && (
                <View style={s.badge}><Text style={s.badgeText}>{item.badge}</Text></View>
              )}
              <View style={s.cardBody}>
                <Text style={[s.cardName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 4 }}>
                  <MaterialIcons name="star" size={11} color={colors.star} />
                  <Text style={{ color: colors.textSecondary, fontSize: 10 }}>{item.rating}</Text>
                </View>
                <Text style={[s.price, { color: colors.text }]}>{formatPrice(item.price)}</Text>
                <Text style={{ color: colors.discount, fontSize: 10, fontWeight: '600' }}>{item.discount}% off</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.surface, paddingHorizontal: 16, paddingBottom: 12, paddingTop: 8, ...Shadow.sm, shadowColor: colors.shadow },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: colors.text, marginBottom: 10 },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: BorderRadius.circle, paddingHorizontal: 14, paddingVertical: 8, gap: 8, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, color: colors.text, fontSize: FontSize.md },
  body: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 90, backgroundColor: colors.surface, borderRightWidth: 1, borderRightColor: colors.border },
  sideItem: { paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center', gap: 6, borderRightWidth: 3, borderRightColor: 'transparent' },
  sideIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  sideName: { fontSize: 10, fontWeight: '600', textAlign: 'center', lineHeight: 13 },
  card: { flex: 1, backgroundColor: colors.card, borderRadius: BorderRadius.md, overflow: 'hidden', ...Shadow.sm, shadowColor: colors.shadow },
  cardImage: { width: '100%', height: 110 },
  badge: { position: 'absolute', top: 6, left: 6, backgroundColor: colors.primary, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  cardBody: { padding: 8 },
  cardName: { fontSize: 11, fontWeight: FontWeight.semibold, marginBottom: 4, lineHeight: 15 },
  price: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, marginBottom: 2 },
});
