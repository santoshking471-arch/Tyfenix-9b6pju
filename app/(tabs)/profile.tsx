import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
  const { colors, isDark, toggle } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const s = styles(colors);

  const MenuItem = ({ icon, label, sub, onPress, right, danger }: any) => (
    <TouchableOpacity style={s.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[s.menuIcon, { backgroundColor: (danger ? colors.error : colors.primary) + '15' }]}>
        <MaterialIcons name={icon} size={22} color={danger ? colors.error : colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.menuLabel, { color: danger ? colors.error : colors.text }]}>{label}</Text>
        {sub && <Text style={[s.menuSub, { color: colors.textMuted }]}>{sub}</Text>}
      </View>
      {right || <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />}
    </TouchableOpacity>
  );

  if (!isAuthenticated) {
    return (
      <View style={[s.container, { paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }]}>
        <MaterialIcons name="account-circle" size={80} color={colors.textMuted} />
        <Text style={[{ color: colors.text, fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginTop: 16 }]}>Join Tyfenix</Text>
        <Text style={[{ color: colors.textMuted, fontSize: FontSize.md, marginTop: 8, marginBottom: 24 }]}>Login to access your profile</Text>
        <TouchableOpacity style={[s.loginBtn, { backgroundColor: colors.primary }]} onPress={() => router.push('/auth/login')}>
          <Text style={s.loginBtnText}>Login / Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={s.header}>
        <Text style={s.title}>My Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Card */}
        <View style={s.profileCard}>
          <Image source={{ uri: user?.avatar || 'https://i.pravatar.cc/200?img=33' }} style={s.avatar} contentFit="cover" />
          <View style={{ flex: 1 }}>
            <Text style={[s.name, { color: colors.text }]}>{user?.name}</Text>
            <Text style={[s.email, { color: colors.textSecondary }]}>{user?.email}</Text>
            {user?.isAdmin && (
              <View style={[s.adminBadge, { backgroundColor: colors.primary }]}>
                <Text style={s.adminBadgeText}>Admin</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => router.push('/profile/edit' as any)}>
            <MaterialIcons name="edit" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {[
            { label: 'Orders', value: '3', icon: 'receipt-long' },
            { label: 'Wishlist', value: '0', icon: 'favorite-border' },
            { label: 'Reviews', value: '1', icon: 'star-border' },
          ].map((stat, i) => (
            <View key={i} style={[s.statCard, { backgroundColor: colors.card }]}>
              <MaterialIcons name={stat.icon as any} size={24} color={colors.primary} />
              <Text style={[{ color: colors.text, fontSize: FontSize.xl, fontWeight: FontWeight.bold }]}>{stat.value}</Text>
              <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Account Section */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.textMuted }]}>ACCOUNT</Text>
          <View style={[s.menuGroup, { backgroundColor: colors.card }]}>
            <MenuItem icon="person-outline" label="Edit Profile" sub="Update your info" onPress={() => router.push('/profile/edit' as any)} />
            <View style={[s.divider, { backgroundColor: colors.divider }]} />
            <MenuItem icon="location-on" label="Manage Addresses" sub="Add or edit addresses" onPress={() => router.push('/profile/addresses' as any)} />
            <View style={[s.divider, { backgroundColor: colors.divider }]} />
            <MenuItem icon="receipt-long" label="My Orders" sub="Track your orders" onPress={() => router.push('/orders' as any)} />
          </View>
        </View>

        {/* Preferences */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.textMuted }]}>PREFERENCES</Text>
          <View style={[s.menuGroup, { backgroundColor: colors.card }]}>
            <MenuItem
              icon={isDark ? 'dark-mode' : 'light-mode'}
              label="Dark Mode"
              sub={isDark ? 'Currently on dark theme' : 'Currently on light theme'}
              right={<Switch value={isDark} onValueChange={toggle} trackColor={{ false: colors.border, true: colors.primary }} />}
            />
            <View style={[s.divider, { backgroundColor: colors.divider }]} />
            <MenuItem icon="notifications-none" label="Notifications" sub="Push & email alerts" onPress={() => {}} />
          </View>
        </View>

        {/* Admin Panel */}
        {user?.isAdmin && (
          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: colors.textMuted }]}>ADMIN</Text>
            <View style={[s.menuGroup, { backgroundColor: colors.card }]}>
              <MenuItem icon="admin-panel-settings" label="Admin Dashboard" sub="Manage products & orders" onPress={() => router.push('/admin/index' as any)} />
            </View>
          </View>
        )}

        {/* Support */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.textMuted }]}>SUPPORT</Text>
          <View style={[s.menuGroup, { backgroundColor: colors.card }]}>
            <MenuItem icon="help-outline" label="Help Center" onPress={() => {}} />
            <View style={[s.divider, { backgroundColor: colors.divider }]} />
            <MenuItem icon="policy" label="Privacy Policy" onPress={() => {}} />
            <View style={[s.divider, { backgroundColor: colors.divider }]} />
            <MenuItem icon="info-outline" label="About Tyfenix" sub="Version 1.0.0" onPress={() => {}} />
          </View>
        </View>

        {/* Logout */}
        <View style={s.section}>
          <TouchableOpacity style={[s.logoutBtn, { borderColor: colors.error }]} onPress={logout}>
            <MaterialIcons name="logout" size={20} color={colors.error} />
            <Text style={[s.logoutText, { color: colors.error }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 16, backgroundColor: colors.surface, ...Shadow.sm, shadowColor: colors.shadow },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: colors.text },
  loginBtn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: BorderRadius.circle },
  loginBtnText: { color: '#fff', fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, margin: 16, backgroundColor: colors.card, padding: 16, borderRadius: BorderRadius.xl, ...Shadow.md, shadowColor: colors.shadow },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.border },
  name: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  email: { fontSize: FontSize.sm, marginTop: 2 },
  adminBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: BorderRadius.circle, marginTop: 6 },
  adminBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 4 },
  statCard: { flex: 1, alignItems: 'center', padding: 14, borderRadius: BorderRadius.lg, gap: 4, ...Shadow.sm, shadowColor: colors.shadow },
  section: { paddingHorizontal: 16, marginTop: 16 },
  sectionTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, letterSpacing: 1, marginBottom: 8 },
  menuGroup: { borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadow.sm, shadowColor: colors.shadow },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  menuIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: FontSize.base, fontWeight: FontWeight.medium },
  menuSub: { fontSize: FontSize.xs, marginTop: 1 },
  divider: { height: 1, marginLeft: 68 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, borderRadius: BorderRadius.circle, borderWidth: 1.5 },
  logoutText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
});
