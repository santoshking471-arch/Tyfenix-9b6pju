import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_ORDERS, formatPrice, Order } from '@/constants/mockData';
import { BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

const STATUS_COLORS: Record<string, string> = {
  Pending: '#F57F17',
  Confirmed: '#1565C0',
  Shipped: '#6A1B9A',
  Delivered: '#2E7D32',
  Cancelled: '#C62828',
};

const STATUS_ICONS: Record<string, string> = {
  Pending: 'schedule',
  Confirmed: 'check-circle',
  Shipped: 'local-shipping',
  Delivered: 'done-all',
  Cancelled: 'cancel',
};

const STEPS = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

export default function OrdersScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<string>('All');

  const filters = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];
  const filtered = filter === 'All' ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === filter);

  const s = styles(colors);

  if (!isAuthenticated) {
    return (
      <View style={[s.container, { paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }]}>
        <MaterialIcons name="receipt-long" size={64} color={colors.textMuted} />
        <Text style={[s.emptyTitle, { color: colors.text }]}>Please Login</Text>
        <Text style={[s.emptySub, { color: colors.textMuted }]}>Login to view your orders</Text>
        <TouchableOpacity style={[s.btn, { backgroundColor: colors.primary }]} onPress={() => router.push('/auth/login')}>
          <Text style={s.btnText}>Login / Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={s.header}>
        <Text style={s.title}>My Orders</Text>
      </View>

      {/* Filter Tabs */}
      <View style={{ backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.filterChip, filter === item && { backgroundColor: colors.primary }]}
              onPress={() => setFilter(item)}
            >
              <Text style={[s.filterText, filter === item && { color: '#fff' }]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={o => o.id}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <MaterialIcons name="receipt-long" size={56} color={colors.textMuted} />
            <Text style={{ color: colors.textMuted, marginTop: 12, fontSize: FontSize.md }}>No orders found</Text>
          </View>
        )}
        renderItem={({ item: order }) => (
          <View style={s.orderCard}>
            {/* Order Header */}
            <View style={s.orderHeader}>
              <View>
                <Text style={[s.orderId, { color: colors.text }]}>Order #{order.id}</Text>
                <Text style={[s.orderDate, { color: colors.textMuted }]}>{order.date}</Text>
              </View>
              <View style={[s.statusBadge, { backgroundColor: STATUS_COLORS[order.status] + '20' }]}>
                <MaterialIcons name={STATUS_ICONS[order.status] as any} size={14} color={STATUS_COLORS[order.status]} />
                <Text style={[s.statusText, { color: STATUS_COLORS[order.status] }]}>{order.status}</Text>
              </View>
            </View>

            {/* Order Items */}
            {order.items.slice(0, 2).map(item => (
              <View key={item.productId} style={s.orderItem}>
                <Image source={{ uri: item.image }} style={s.itemImage} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={[s.itemName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
                  <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs }]}>Qty: {item.quantity}</Text>
                  <Text style={[{ color: colors.text, fontSize: FontSize.sm, fontWeight: FontWeight.semibold }]}>{formatPrice(item.price * item.quantity)}</Text>
                </View>
              </View>
            ))}

            {order.items.length > 2 && (
              <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs, paddingHorizontal: 12, paddingBottom: 8 }]}>+{order.items.length - 2} more items</Text>
            )}

            {/* Tracking Stepper */}
            {order.status !== 'Cancelled' && (
              <View style={s.stepper}>
                {STEPS.map((step, idx) => {
                  const orderIdx = STEPS.indexOf(order.status);
                  const isCompleted = idx <= orderIdx;
                  return (
                    <React.Fragment key={step}>
                      <View style={s.stepItem}>
                        <View style={[s.stepDot, { backgroundColor: isCompleted ? STATUS_COLORS[order.status] : colors.border }]}>
                          {isCompleted && <MaterialIcons name="check" size={10} color="#fff" />}
                        </View>
                        <Text style={[s.stepLabel, { color: isCompleted ? colors.text : colors.textMuted }]}>{step}</Text>
                      </View>
                      {idx < STEPS.length - 1 && (
                        <View style={[s.stepLine, { backgroundColor: idx < orderIdx ? STATUS_COLORS[order.status] : colors.border }]} />
                      )}
                    </React.Fragment>
                  );
                })}
              </View>
            )}

            {/* Footer */}
            <View style={[s.orderFooter, { borderTopColor: colors.border }]}>
              <Text style={[{ color: colors.text, fontWeight: FontWeight.bold }]}>Total: {formatPrice(order.total)}</Text>
              <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs }]}>{order.paymentMethod}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 16, backgroundColor: colors.surface, ...Shadow.sm, shadowColor: colors.shadow },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: colors.text },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginTop: 16 },
  emptySub: { fontSize: FontSize.md, marginTop: 8, marginBottom: 24 },
  btn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: BorderRadius.circle },
  btnText: { color: '#fff', fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  filterChip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: BorderRadius.circle, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  filterText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: colors.text },
  orderCard: { backgroundColor: colors.card, borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadow.sm, shadowColor: colors.shadow },
  orderHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  orderId: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  orderDate: { fontSize: FontSize.xs, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: BorderRadius.circle },
  statusText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  orderItem: { flexDirection: 'row', gap: 12, padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  itemImage: { width: 60, height: 60, borderRadius: BorderRadius.sm },
  itemName: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, marginBottom: 4 },
  stepper: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14 },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  stepLabel: { fontSize: 9, fontWeight: '600', textAlign: 'center', width: 52 },
  stepLine: { flex: 1, height: 2, marginBottom: 16 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1 },
});
