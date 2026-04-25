import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { MOCK_ORDERS, Order, formatPrice } from '@/constants/mockData';
import { BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

const STATUS_COLORS: Record<string, string> = {
  Pending: '#F57F17', Confirmed: '#1565C0', Shipped: '#6A1B9A', Delivered: '#2E7D32', Cancelled: '#C62828',
};
const ALL_STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  const updateStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    setShowStatusModal(false);
    setSelectedOrder(null);
  };

  const s = styles(colors);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.title, { color: colors.text }]}>Orders Management</Text>
      </View>

      <View style={{ backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <FlatList
          data={['All', ...ALL_STATUSES]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.chip, filter === item && { backgroundColor: colors.primary }]}
              onPress={() => setFilter(item)}
            >
              <Text style={[s.chipText, filter === item && { color: '#fff' }]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={o => o.id}
        contentContainerStyle={{ padding: 14, gap: 12 }}
        renderItem={({ item }) => (
          <View style={[s.card, { backgroundColor: colors.card }]}>
            <View style={s.cardTop}>
              <View>
                <Text style={[s.orderId, { color: colors.text }]}>#{item.id}</Text>
                <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs }]}>{item.date} • {item.paymentMethod}</Text>
              </View>
              <View style={[s.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '20' }]}>
                <Text style={[{ color: STATUS_COLORS[item.status], fontSize: FontSize.xs, fontWeight: FontWeight.bold }]}>{item.status}</Text>
              </View>
            </View>

            <Text style={[{ color: colors.textSecondary, fontSize: FontSize.sm, marginVertical: 6 }]}>
              {item.items.length} item(s) • {item.address.name} • {item.address.city}
            </Text>

            <View style={s.cardFooter}>
              <Text style={[{ color: colors.text, fontWeight: FontWeight.bold, fontSize: FontSize.lg }]}>{formatPrice(item.total)}</Text>
              <TouchableOpacity
                style={[s.updateBtn, { backgroundColor: colors.primary }]}
                onPress={() => { setSelectedOrder(item); setShowStatusModal(true); }}
              >
                <MaterialIcons name="update" size={14} color="#fff" />
                <Text style={s.updateBtnText}>Update Status</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <MaterialIcons name="receipt-long" size={56} color={colors.textMuted} />
            <Text style={{ color: colors.textMuted, marginTop: 12 }}>No orders found</Text>
          </View>
        )}
      />

      <Modal visible={showStatusModal} transparent animationType="slide" onRequestClose={() => setShowStatusModal(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setShowStatusModal(false)}>
          <View style={[s.modal, { backgroundColor: colors.surface }]}>
            <Text style={[s.modalTitle, { color: colors.text }]}>Update Order Status</Text>
            <Text style={[{ color: colors.textMuted, marginBottom: 16, fontSize: FontSize.sm }]}>Order #{selectedOrder?.id}</Text>
            {ALL_STATUSES.map(status => (
              <TouchableOpacity
                key={status}
                style={[s.statusOption, { borderColor: STATUS_COLORS[status] + '40' }, selectedOrder?.status === status && { backgroundColor: STATUS_COLORS[status] + '15' }]}
                onPress={() => selectedOrder && updateStatus(selectedOrder.id, status as Order['status'])}
              >
                <View style={[{ width: 10, height: 10, borderRadius: 5, backgroundColor: STATUS_COLORS[status] }]} />
                <Text style={[{ flex: 1, color: colors.text, fontSize: FontSize.base, fontWeight: FontWeight.medium }]}>{status}</Text>
                {selectedOrder?.status === status && <MaterialIcons name="check-circle" size={20} color={STATUS_COLORS[status]} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.surface, ...Shadow.sm, shadowColor: colors.shadow },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  chip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: BorderRadius.circle, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  chipText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: colors.text },
  card: { borderRadius: BorderRadius.lg, padding: 14, ...Shadow.sm, shadowColor: colors.shadow },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontSize: FontSize.base, fontWeight: FontWeight.bold },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.circle },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  updateBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.circle },
  updateBtnText: { color: '#fff', fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  modal: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginBottom: 4 },
  statusOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: BorderRadius.lg, borderWidth: 1, marginBottom: 8 },
});
