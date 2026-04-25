import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, Dimensions, Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAlert } from '@/template';
import { PRODUCTS, REVIEWS, formatPrice } from '@/constants/mockData';
import { BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

const { width: W } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addToCart, isInCart, getQuantity } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showAlert } = useAlert();

  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'desc' | 'reviews'>('desc');
  const scrollY = useRef(new Animated.Value(0)).current;

  const product = PRODUCTS.find(p => p.id === id);
  if (!product) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.text }}>Product not found</Text>
      </View>
    );
  }

  const reviews = REVIEWS.filter(r => r.productId === id);
  const inCartQty = getQuantity(product.id);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, qty);
    showAlert('Added to Cart', `${product.name} added to your cart!`, [
      { text: 'Continue', style: 'cancel' },
      { text: 'Go to Cart', onPress: () => router.push('/cart' as any) },
    ]);
  };

  const s = styles(colors);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Floating Header */}
      <View style={s.floatingHeader}>
        <TouchableOpacity style={[s.floatBtn, { backgroundColor: colors.surface }]} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={[s.floatBtn, { backgroundColor: colors.surface }]} onPress={() => toggleWishlist(product)}>
            <MaterialIcons name={wishlisted ? 'favorite' : 'favorite-border'} size={22} color={wishlisted ? '#E53935' : colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[s.floatBtn, { backgroundColor: colors.surface }]} onPress={() => router.push('/cart' as any)}>
            <MaterialIcons name="shopping-cart" size={22} color={colors.text} />
            {inCartQty > 0 && (
              <View style={s.floatBadge}><Text style={s.floatBadgeText}>{inCartQty}</Text></View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Image Slider */}
        <View style={s.imageSliderContainer}>
          <FlatList
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            onMomentumScrollEnd={e => setImgIdx(Math.round(e.nativeEvent.contentOffset.x / W))}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={{ width: W, height: 300 }} contentFit="cover" />
            )}
          />
          {/* Dots */}
          <View style={s.imageDots}>
            {product.images.map((_, i) => (
              <View key={i} style={[s.dot, { backgroundColor: i === imgIdx ? colors.primary : 'rgba(255,255,255,0.6)' }]} />
            ))}
          </View>
          {product.badge && (
            <View style={[s.imgBadge, { backgroundColor: colors.primary }]}>
              <Text style={s.imgBadgeText}>{product.badge}</Text>
            </View>
          )}
        </View>

        <View style={[s.contentCard, { backgroundColor: colors.surface }]}>
          {/* Brand & Name */}
          <Text style={[s.brand, { color: colors.textMuted }]}>{product.brand}</Text>
          <Text style={[s.name, { color: colors.text }]}>{product.name}</Text>

          {/* Rating Row */}
          <View style={s.ratingRow}>
            <View style={[s.ratingBadge, { backgroundColor: '#2E7D32' }]}>
              <Text style={s.ratingBadgeText}>{product.rating}</Text>
              <MaterialIcons name="star" size={12} color="#fff" />
            </View>
            <Text style={[{ color: colors.textMuted, fontSize: FontSize.sm }]}>{product.reviews.toLocaleString()} ratings</Text>
            <View style={[s.soldBadge, { backgroundColor: colors.primary + '15' }]}>
              <Text style={[{ color: colors.primary, fontSize: FontSize.xs, fontWeight: FontWeight.semibold }]}>{product.sold.toLocaleString()} sold</Text>
            </View>
          </View>

          {/* Price */}
          <View style={s.priceSection}>
            <Text style={[s.price, { color: colors.text }]}>{formatPrice(product.price)}</Text>
            <Text style={[s.originalPrice, { color: colors.textMuted }]}>{formatPrice(product.originalPrice)}</Text>
            <View style={[s.discountBadge, { backgroundColor: colors.discount }]}>
              <Text style={s.discountText}>{product.discount}% OFF</Text>
            </View>
          </View>

          {/* Savings */}
          <Text style={[{ color: colors.success, fontSize: FontSize.sm, fontWeight: '600', marginBottom: 16 }]}>
            You save {formatPrice(product.originalPrice - product.price)}!
          </Text>

          {/* Quantity */}
          <View style={s.qtySection}>
            <Text style={[{ color: colors.text, fontWeight: FontWeight.semibold, fontSize: FontSize.md }]}>Quantity:</Text>
            <View style={[s.qtyControls, { borderColor: colors.border }]}>
              <TouchableOpacity style={s.qtyBtn} onPress={() => setQty(q => Math.max(1, q - 1))}>
                <MaterialIcons name="remove" size={18} color={colors.primary} />
              </TouchableOpacity>
              <Text style={[s.qtyText, { color: colors.text }]}>{qty}</Text>
              <TouchableOpacity style={s.qtyBtn} onPress={() => setQty(q => Math.min(10, q + 1))}>
                <MaterialIcons name="add" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Delivery Info */}
          <View style={[s.deliveryCard, { backgroundColor: colors.background }]}>
            <MaterialIcons name="local-shipping" size={20} color={colors.primary} />
            <View>
              <Text style={[{ color: colors.text, fontWeight: FontWeight.semibold, fontSize: FontSize.sm }]}>Free Delivery by Tomorrow</Text>
              <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs }]}>Order within 2 hours for same-day dispatch</Text>
            </View>
          </View>
        </View>

        {/* Tabs: Description / Reviews */}
        <View style={{ marginTop: 8, backgroundColor: colors.surface }}>
          <View style={s.tabRow}>
            {(['desc', 'reviews'] as const).map(t => (
              <TouchableOpacity
                key={t}
                style={[s.tabBtn, tab === t && { borderBottomWidth: 2, borderBottomColor: colors.primary }]}
                onPress={() => setTab(t)}
              >
                <Text style={[s.tabText, { color: tab === t ? colors.primary : colors.textMuted }]}>
                  {t === 'desc' ? 'Description' : `Reviews (${reviews.length})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ padding: 16 }}>
            {tab === 'desc' ? (
              <Text style={[{ color: colors.textSecondary, lineHeight: 22, fontSize: FontSize.base }]}>{product.description}</Text>
            ) : (
              reviews.length > 0 ? reviews.map(r => (
                <View key={r.id} style={[s.reviewCard, { backgroundColor: colors.background }]}>
                  <View style={s.reviewHeader}>
                    <Image source={{ uri: r.avatar }} style={s.reviewAvatar} contentFit="cover" />
                    <View>
                      <Text style={[{ color: colors.text, fontWeight: FontWeight.semibold }]}>{r.userName}</Text>
                      <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs }]}>{r.date}</Text>
                    </View>
                    <View style={[s.ratingBadge, { backgroundColor: '#2E7D32', marginLeft: 'auto' }]}>
                      <Text style={s.ratingBadgeText}>{r.rating}</Text>
                      <MaterialIcons name="star" size={10} color="#fff" />
                    </View>
                  </View>
                  <Text style={[{ color: colors.textSecondary, fontSize: FontSize.sm, marginTop: 8, lineHeight: 20 }]}>{r.comment}</Text>
                </View>
              )) : (
                <Text style={[{ color: colors.textMuted, textAlign: 'center', marginTop: 20 }]}>No reviews yet</Text>
              )
            )}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[s.actionBar, { paddingBottom: insets.bottom + 8, backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[s.cartBtn, { borderColor: colors.primary }]}
          onPress={handleAddToCart}
        >
          <MaterialIcons name="shopping-cart" size={20} color={colors.primary} />
          <Text style={[s.cartBtnText, { color: colors.primary }]}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.buyBtn, { backgroundColor: colors.primary }]}
          onPress={() => {
            addToCart(product, qty);
            router.push('/checkout' as any);
          }}
        >
          <MaterialIcons name="flash-on" size={20} color="#fff" />
          <Text style={s.buyBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  floatingHeader: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 54, paddingBottom: 10, zIndex: 10 },
  floatBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', ...Shadow.md },
  floatBadge: { position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderRadius: 8, backgroundColor: '#E53935', alignItems: 'center', justifyContent: 'center' },
  floatBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  imageSliderContainer: { position: 'relative' },
  imageDots: { position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  imgBadge: { position: 'absolute', top: 16, right: 16, paddingHorizontal: 12, paddingVertical: 5, borderRadius: BorderRadius.circle },
  imgBadgeText: { color: '#fff', fontSize: FontSize.xs, fontWeight: '700' },
  contentCard: { padding: 16, marginTop: 1 },
  brand: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  name: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, lineHeight: 28, marginBottom: 10 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  ratingBadgeText: { color: '#fff', fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  soldBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  priceSection: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  price: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold },
  originalPrice: { fontSize: FontSize.base, textDecorationLine: 'line-through' },
  discountBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  discountText: { color: '#fff', fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  qtySection: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 14 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: BorderRadius.md },
  qtyBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  qtyText: { paddingHorizontal: 16, fontSize: FontSize.base, fontWeight: FontWeight.bold },
  deliveryCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: BorderRadius.lg },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  reviewCard: { padding: 14, borderRadius: BorderRadius.lg, marginBottom: 12 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18 },
  actionBar: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1 },
  cartBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: BorderRadius.circle, borderWidth: 1.5 },
  cartBtnText: { fontSize: FontSize.base, fontWeight: FontWeight.bold },
  buyBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: BorderRadius.circle },
  buyBtnText: { color: '#fff', fontSize: FontSize.base, fontWeight: FontWeight.bold },
});
