import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  FlatList, Dimensions, TextInput, Animated, Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { PRODUCTS, CATEGORIES, formatPrice, Product } from '@/constants/mockData';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 180;

const BANNERS = [
  { id: '1', image: require('@/assets/images/banner1.jpg'), label: 'Premium Electronics' },
  { id: '2', image: require('@/assets/images/banner2.jpg'), label: 'Big Sale Festival' },
  { id: '3', image: require('@/assets/images/banner3.jpg'), label: 'New Fashion Arrivals' },
];

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { count } = useCart();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [bannerIndex, setBannerIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const bannerRef = useRef<FlatList>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setBannerIndex(prev => {
        const next = (prev + 1) % BANNERS.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(timerRef.current);
  }, []);

  const trending = PRODUCTS.slice(0, 6);
  const featured = PRODUCTS.filter(p => p.badge).slice(0, 4);
  const recommended = PRODUCTS.slice(6, 12);

  const s = styles(colors, isDark);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({ pathname: '/products/listing', params: { query: searchQuery.trim() } });
    }
  };

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.greeting}>Good {getTimeGreeting()}, {user?.name?.split(' ')[0] || 'Guest'} 👋</Text>
            <Text style={s.brandName}>Tyfenix</Text>
          </View>
          <View style={s.headerActions}>
            <TouchableOpacity style={s.iconBtn} onPress={() => router.push('/cart' as any)}>
              <MaterialIcons name="notifications-none" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile' as any)}>
              <Image
                source={{ uri: user?.avatar || 'https://i.pravatar.cc/100?img=33' }}
                style={s.avatar}
                contentFit="cover"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={s.searchBar} onPress={() => router.push({ pathname: '/products/listing', params: {} })}>
          <MaterialIcons name="search" size={20} color={colors.textMuted} />
          <Text style={s.searchPlaceholder}>Search products, brands...</Text>
          <MaterialIcons name="mic" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Banner Slider */}
        <View style={s.bannerContainer}>
          <FlatList
            ref={bannerRef}
            data={BANNERS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            onMomentumScrollEnd={e => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setBannerIndex(idx);
            }}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={0.95} style={s.bannerSlide}>
                <Image source={item.image} style={s.bannerImage} contentFit="cover" />
                <View style={s.bannerOverlay}>
                  <Text style={s.bannerLabel}>{item.label}</Text>
                  <View style={s.bannerBtn}>
                    <Text style={s.bannerBtnText}>Shop Now</Text>
                    <MaterialIcons name="arrow-forward" size={14} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
          <View style={s.dotsRow}>
            {BANNERS.map((_, i) => (
              <View key={i} style={[s.dot, i === bannerIndex && s.dotActive]} />
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={s.quickStats}>
          {[
            { icon: 'local-shipping', label: 'Free Delivery', sub: 'On orders ₹499+' },
            { icon: 'assignment-return', label: 'Easy Returns', sub: '30-day policy' },
            { icon: 'verified-user', label: 'Secure Pay', sub: '100% safe' },
          ].map((item, i) => (
            <View key={i} style={s.statItem}>
              <MaterialIcons name={item.icon as any} size={22} color={colors.primary} />
              <Text style={s.statLabel}>{item.label}</Text>
              <Text style={s.statSub}>{item.sub}</Text>
            </View>
          ))}
        </View>

        {/* Categories */}
        <SectionHeader title="Shop by Category" onPress={() => router.push('/categories' as any)} colors={colors} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.categoriesRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={s.categoryChip}
              onPress={() => router.push({ pathname: '/products/listing', params: { categoryId: cat.id, categoryName: cat.name } })}
            >
              <View style={[s.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                <MaterialIcons name={cat.icon as any} size={22} color={cat.color} />
              </View>
              <Text style={s.categoryLabel} numberOfLines={1}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending */}
        <SectionHeader title="Trending Now 🔥" onPress={() => router.push('/products/listing' as any)} colors={colors} />
        <FlatList
          data={trending}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          renderItem={({ item }) => <ProductCard product={item} colors={colors} router={router} />}
        />

        {/* Featured */}
        <SectionHeader title="Featured Deals ⚡" onPress={() => router.push('/products/listing' as any)} colors={colors} />
        <FlatList
          data={featured}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          renderItem={({ item }) => <ProductCard product={item} colors={colors} router={router} wide />}
        />

        {/* Recommended */}
        <SectionHeader title="Recommended for You" onPress={() => router.push('/products/listing' as any)} colors={colors} />
        <View style={s.grid}>
          {recommended.map(product => (
            <TouchableOpacity
              key={product.id}
              style={s.gridCard}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: product.image }} style={s.gridImage} contentFit="cover" />
              {product.badge && <View style={s.gridBadge}><Text style={s.gridBadgeText}>{product.badge}</Text></View>}
              <View style={{ padding: 10 }}>
                <Text style={[s.gridName, { color: colors.text }]} numberOfLines={2}>{product.name}</Text>
                <View style={s.ratingRow}>
                  <MaterialIcons name="star" size={12} color={colors.star} />
                  <Text style={[s.ratingText, { color: colors.textSecondary }]}>{product.rating} ({product.reviews.toLocaleString()})</Text>
                </View>
                <View style={s.priceRow}>
                  <Text style={[s.gridPrice, { color: colors.text }]}>{formatPrice(product.price)}</Text>
                  <Text style={[s.gridDiscount, { color: colors.discount }]}>{product.discount}% off</Text>
                </View>
                <Text style={[s.gridOriginal, { color: colors.textMuted }]}>{formatPrice(product.originalPrice)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

function SectionHeader({ title, onPress, colors }: { title: string; onPress: () => void; colors: any }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 20, marginBottom: 12 }}>
      <Text style={{ fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: colors.text }}>{title}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={{ fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: colors.primary }}>See all</Text>
      </TouchableOpacity>
    </View>
  );
}

function ProductCard({ product, colors, router, wide }: { product: Product; colors: any; router: any; wide?: boolean }) {
  const w = wide ? 200 : 160;
  return (
    <TouchableOpacity
      style={[{
        width: w,
        backgroundColor: colors.card,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        ...Shadow.md,
        shadowColor: colors.shadow,
      }]}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
      activeOpacity={0.85}
    >
      <Image source={{ uri: product.image }} style={{ width: w, height: w * 0.75 }} contentFit="cover" />
      {product.badge && (
        <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: colors.primary, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{product.badge}</Text>
        </View>
      )}
      <View style={{ padding: 10 }}>
        <Text style={{ color: colors.text, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, marginBottom: 4 }} numberOfLines={2}>{product.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 }}>
          <MaterialIcons name="star" size={11} color={colors.star} />
          <Text style={{ color: colors.textSecondary, fontSize: 11 }}>{product.rating}</Text>
        </View>
        <Text style={{ color: colors.text, fontSize: FontSize.md, fontWeight: FontWeight.bold }}>{formatPrice(product.price)}</Text>
        <Text style={{ color: colors.discount, fontSize: 11, fontWeight: '600' }}>{product.discount}% off</Text>
      </View>
    </TouchableOpacity>
  );
}

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

const styles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.surface, paddingHorizontal: 16, paddingBottom: 12, ...Shadow.sm, shadowColor: colors.shadow },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 8 },
  greeting: { color: colors.textMuted, fontSize: FontSize.xs },
  brandName: { color: colors.primary, fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, letterSpacing: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.border },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: BorderRadius.circle, paddingHorizontal: 16, paddingVertical: 10, gap: 10, borderWidth: 1, borderColor: colors.border },
  searchPlaceholder: { flex: 1, color: colors.textMuted, fontSize: FontSize.md },
  bannerContainer: { marginTop: 12, marginHorizontal: 16 },
  bannerSlide: { width: SCREEN_WIDTH - 32, height: BANNER_HEIGHT, borderRadius: BorderRadius.xl, overflow: 'hidden' },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(0,0,0,0.45)' },
  bannerLabel: { color: '#fff', fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: 8 },
  bannerBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primary, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: BorderRadius.circle },
  bannerBtnText: { color: '#fff', fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { width: 18, backgroundColor: colors.primary },
  quickStats: { flexDirection: 'row', marginHorizontal: 16, marginTop: 16, backgroundColor: colors.surface, borderRadius: BorderRadius.lg, padding: 12, ...Shadow.sm, shadowColor: colors.shadow },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statLabel: { color: colors.text, fontSize: 11, fontWeight: FontWeight.semibold, textAlign: 'center' },
  statSub: { color: colors.textMuted, fontSize: 10, textAlign: 'center' },
  categoriesRow: { paddingHorizontal: 16, gap: 10 },
  categoryChip: { alignItems: 'center', gap: 6, width: 72 },
  categoryIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  categoryLabel: { color: colors.text, fontSize: 10, fontWeight: '600', textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10 },
  gridCard: { width: (SCREEN_WIDTH - 34) / 2, backgroundColor: colors.card, borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadow.sm, shadowColor: colors.shadow },
  gridImage: { width: '100%', height: 160 },
  gridBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#E53935', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  gridBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  gridName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, marginBottom: 4, lineHeight: 18 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 },
  ratingText: { fontSize: 11 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  gridPrice: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  gridDiscount: { fontSize: 11, fontWeight: '600' },
  gridOriginal: { fontSize: 11, textDecorationLine: 'line-through' },
});
