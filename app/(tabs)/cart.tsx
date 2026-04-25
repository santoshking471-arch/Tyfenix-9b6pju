import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/constants/mockData';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

export default function CartScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, count, subtotal, discount, total, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();

  const s = styles(colors);

  if (!isAuthenticated) {
    return (
      <View style={[s.container, { paddingTop: insets.top }, { alignItems: 'center', justifyContent: 'center' }]}>
        <MaterialIcons name="shopping-cart" size={64} color={colors.textMuted} />
        <Text style={[s.emptyTitle, { color: colors.text }]}>Please Login</Text>
        <Text style={[s.emptySub, { color: colors.textMuted }]}>Login to view your cart & checkout</Text>
        <TouchableOpacity style={[s.loginBtn, { backgroundColor: colors.primary }]} onPress={() => router.push('/auth/login')}>
          <Text style={s.loginBtnText}>Login / Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={[s.container, { paddingTop: insets.top }, { alignItems: 'center', justifyContent: 'center' }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Image source={require('@/assets/images/empty-cart.png')} style={{ width: 200, height: 200 }} contentFit="contain" />
        <Text style={[s.emptyTitle, { color: colors.text }]}>Your Cart is Empty</Text>
        <Text style={[s.emptySub, { color: colors.textMuted }]}>Looks like you haven't added anything yet</Text>
        <TouchableOpacity style={[s.loginBtn, { backgroundColor: colors.primary }]} onPress={() => router.push('/(tabs)' as any)}>
          <Text style={s.loginBtnText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={s.header}>
        <Text style={s.title}>My Cart</Text>
        <Text style={s.itemCount}>{count} {count === 1 ? 'item' : 'items'}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={i => i.product.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, gap: 12, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={s.cartCard}>
            <Image source={{ uri: item.product.image }} style={s.productImage} contentFit="cover" />
            <View style={s.cardContent}>
              <Text style={s.productName} numberOfLines={2}>{item.product.name}</Text>
              <Text style={s.brandName}>{item.product.brand}</Text>
              <View style={s.priceRow}>
                <Text style={s.price}>{formatPrice(item.product.price)}</Text>
                <Text style={s.originalPrice}>{formatPrice(item.product.originalPrice)}</Text>
                <Text style={s.discountBadge}>{item.product.discount}% off</Text>
              </View>
              <View style={s.qtyRow}>
                <View style={s.qtyControls}>
                  <TouchableOpacity style={s.qtyBtn} onPress={() => updateQuantity(item.product.id, item.quantity - 1)}>
                    <MaterialIcons name="remove" size={18} color={colors.primary} />
                  </TouchableOpacity>
                  <Text style={s.qty}>{item.quantity}</Text>
                  <TouchableOpacity style={s.qtyBtn} onPress={() => updateQuantity(item.product.id, item.quantity + 1)}>
                    <MaterialIcons name="add" size={18} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.product.id)}>
                  <MaterialIcons name="delete-outline" size={22} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={s.priceCard}>
            <Text style={[s.priceCardTitle, { color: colors.text }]}>Price Details</Text>
            <View style={s.priceRow2}>
              <Text style={[s.priceKey, { color: colors.textSecondary }]}>Price ({count} items)</Text>
              <Text style={[s.priceVal, { color: colors.text }]}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={s.priceRow2}>
              <Text style={[s.priceKey, { color: colors.textSecondary }]}>Discount</Text>
              <Text style={[s.priceVal, { color: colors.success }]}>-{formatPrice(discount)}</Text>
            </View>
            <View style={s.priceRow2}>
              <Text style={[s.priceKey, { color: colors.textSecondary }]}>Delivery</Text>
              <Text style={[s.priceVal, { color: colors.success }]}>FREE</Text>
            </View>
            <View style={[s.divider, { backgroundColor: colors.divider }]} />
            <View style={s.priceRow2}>
              <Text style={[s.totalKey, { color: colors.text }]}>Total Amount</Text>
              <Text style={[s.totalVal, { color: colors.text }]}>{formatPrice(total)}</Text>
            </View>
            <Text style={[s.savingText, { color: colors.success }]}>
              You save {formatPrice(discount)} on this order!
            </Text>
          </View>
        )}
      />

      <View style={[s.footer, { paddingBottom: insets.bottom + 12, backgroundColor: colors.surface }]}>
        <View>
          <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs }]}>Total</Text>
          <Text style={[{ color: colors.text, fontSize: FontSize.xl, fontWeight: FontWeight.bold }]}>{formatPrice(total)}</Text>
        </View>
        <TouchableOpacity style={[s.checkoutBtn, { backgroundColor: colors.primary }]} onPress={() => router.push('/checkout' as any)}>
          <Text style={s.checkoutBtnText}>Proceed to Checkout</Text>
          <MaterialIcons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, backgroundColor: colors.surface, ...Shadow.sm, shadowColor: colors.shadow },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: colors.text },
  itemCount: { fontSize: FontSize.md, color: colors.textSecondary },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginTop: 16 },
  emptySub: { fontSize: FontSize.md, marginTop: 8, marginBottom: 24, textAlign: 'center', paddingHorizontal: 32 },
  loginBtn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: BorderRadius.circle },
  loginBtnText: { color: '#fff', fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  cartCard: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadow.sm, shadowColor: colors.shadow },
  productImage: { width: 110, height: 120 },
  cardContent: { flex: 1, padding: 12 },
  productName: { color: colors.text, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, marginBottom: 2 },
  brandName: { color: colors.textMuted, fontSize: FontSize.xs, marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  price: { color: colors.text, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  originalPrice: { color: colors.textMuted, fontSize: FontSize.xs, textDecorationLine: 'line-through' },
  discountBadge: { color: colors.success, fontSize: FontSize.xs, fontWeight: '600' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qtyControls: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: BorderRadius.sm },
  qtyBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  qty: { paddingHorizontal: 12, fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: colors.text },
  priceCard: { backgroundColor: colors.card, borderRadius: BorderRadius.lg, padding: 16, marginTop: 8, ...Shadow.sm, shadowColor: colors.shadow },
  priceCardTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: 12 },
  priceRow2: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  priceKey: { fontSize: FontSize.md },
  priceVal: { fontSize: FontSize.md, fontWeight: FontWeight.medium },
  divider: { height: 1, marginVertical: 10 },
  totalKey: { fontSize: FontSize.base, fontWeight: FontWeight.bold },
  totalVal: { fontSize: FontSize.base, fontWeight: FontWeight.bold },
  savingText: { fontSize: FontSize.sm, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: BorderRadius.circle },
  checkoutBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: FontWeight.semibold },
});
