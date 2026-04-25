import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { PRODUCTS, MOCK_ORDERS, MOCK_USERS, formatPrice } from '@/constants/mockData';
import { BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

export default function AdminDashboard() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <MaterialIcons name="block" size={64} color={colors.error} />
        <Text style={{ color: colors.text, fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginTop: 16 }}>Access Denied</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.primary, marginTop: 12 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalRevenue = MOCK_ORDERS.reduce((s, o) => s + o.total, 0);
  const pendingOrders = MOCK_ORDERS.filter(o => o.status === 'Pending').length;
  const shippedOrders = MOCK_ORDERS.filter(o => o.status === 'Shipped').length;

  const s = styles(colors);

  const STATS = [
    { label: 'Total Users', value: MOCK_USERS.length.toString(), icon: 'people', color: '#1565C0', bg: '#E3F2FD' },
    { label: 'Total Orders', value: MOCK_ORDERS.length.toString(), icon: 'receipt-long', color: '#6A1B9A', bg: '#F3E5F5' },
    { label: 'Revenue', value: formatPrice(totalRevenue), icon: 'attach-money', color: '#2E7D32', bg: '#E8F5E9' },
    { label: 'Products', value: PRODUCTS.length.toString(), icon: 'inventory-2', color: '#E65100', bg: '#FFF3E0' },
  ];

  const QUICK_ACTIONS = [
    { label: 'Products', icon: 'inventory-2', route: '/admin/products', color: '#1565C0' },
    { label: 'Orders', icon: 'receipt-long', route: '/admin/orders', color: '#6A1B9A' },
    { label: 'Users', icon: 'people', route: '/admin/users', color: '#2E7D32' },
    { label: 'Categories', icon: 'category', route: '/admin/categories', color: '#E65100' },
    { label: 'Banners', icon: 'image', route: '/admin/banners', color: '#AD1457' },
    { label: 'Notifications', icon: 'notifications', route: '/admin/index', color: '#F57F17' },
  ];

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={[s.headerSub, { color: colors.textMuted }]}>Admin Panel</Text>
          <Text style={[s.headerTitle, { color: colors.text }]}>Dashboard</Text>
        </View>
        <View style={[s.adminBadge, { backgroundColor: colors.primary }]}>
          <Text style={s.adminBadgeText}>ADMIN</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 40 }}>

        {/* Welcome */}
        <View style={[s.welcomeCard, { backgroundColor: colors.primary }]}>
          <View>
            <Text style={s.welcomeText}>Welcome back,</Text>
            <Text style={s.welcomeName}>{user.name} 👑</Text>
            <Text style={s.welcomeSub}>{pendingOrders} orders pending • {shippedOrders} shipped</Text>
          </View>
          <MaterialIcons name="admin-panel-settings" size={48} color="rgba(255,255,255,0.3)" />
        </View>

        {/* Stats Grid */}
        <View style={s.statsGrid}>
          {STATS.map((stat, i) => (
            <View key={i} style={[s.statCard, { backgroundColor: colors.card }]}>
              <View style={[s.statIcon, { backgroundColor: isDark ? stat.color + '30' : stat.bg }]}>
                <MaterialIcons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={[s.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[s.statLabel, { color: colors.textMuted }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View>
          <Text style={[s.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={s.actionsGrid}>
            {QUICK_ACTIONS.map((action, i) => (
              <TouchableOpacity
                key={i}
                style={[s.actionCard, { backgroundColor: colors.card }]}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[s.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <MaterialIcons name={action.icon as any} size={26} color={action.color} />
                </View>
                <Text style={[s.actionLabel, { color: colors.text }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Orders */}
        <View>
          <Text style={[s.sectionTitle, { color: colors.text }]}>Recent Orders</Text>
          {MOCK_ORDERS.map(order => (
            <TouchableOpacity key={order.id} style={[s.orderRow, { backgroundColor: colors.card }]} onPress={() => router.push('/admin/orders' as any)}>
              <View style={[s.orderStatus, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                <MaterialIcons name="receipt" size={18} color={getStatusColor(order.status)} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[{ color: colors.text, fontWeight: FontWeight.semibold }]}>#{order.id}</Text>
                <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs }]}>{order.date} • {order.paymentMethod}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[{ color: colors.text, fontWeight: FontWeight.bold }]}>{formatPrice(order.total)}</Text>
                <Text style={[{ color: getStatusColor(order.status), fontSize: FontSize.xs, fontWeight: '600' }]}>{order.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    Pending: '#F57F17',
    Confirmed: '#1565C0',
    Shipped: '#6A1B9A',
    Delivered: '#2E7D32',
    Cancelled: '#C62828',
  };
  return map[status] || '#666';
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.surface, ...Shadow.sm, shadowColor: colors.shadow },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  headerSub: { fontSize: FontSize.xs },
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  adminBadge: { marginLeft: 'auto', paddingHorizontal: 12, paddingVertical: 5, borderRadius: BorderRadius.circle },
  adminBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  welcomeCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderRadius: BorderRadius.xl },
  welcomeText: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.sm },
  welcomeName: { color: '#fff', fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, marginVertical: 4 },
  welcomeSub: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '47%', padding: 16, borderRadius: BorderRadius.xl, ...Shadow.sm, shadowColor: colors.shadow },
  statIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, marginBottom: 2 },
  statLabel: { fontSize: FontSize.xs },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: '30%', alignItems: 'center', padding: 14, borderRadius: BorderRadius.xl, gap: 8, ...Shadow.sm, shadowColor: colors.shadow },
  actionIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, textAlign: 'center' },
  orderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: BorderRadius.lg, marginBottom: 10, ...Shadow.sm, shadowColor: colors.shadow },
  orderStatus: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
});
