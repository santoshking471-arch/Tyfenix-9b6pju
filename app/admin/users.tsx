import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { MOCK_USERS } from '@/constants/mockData';
import { BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

export default function AdminUsersScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBlock = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const s = styles(colors);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.title, { color: colors.text }]}>Users ({filtered.length})</Text>
      </View>

      <View style={[s.searchRow, { backgroundColor: colors.surface }]}>
        <MaterialIcons name="search" size={18} color={colors.textMuted} />
        <TextInput style={[s.searchInput, { color: colors.text }]} placeholder="Search users..." placeholderTextColor={colors.textMuted} value={search} onChangeText={setSearch} />
      </View>

      {/* Stats */}
      <View style={[s.statsRow, { backgroundColor: colors.surface }]}>
        {[
          { label: 'Total', value: users.length, color: colors.primary },
          { label: 'Active', value: users.filter(u => u.status === 'Active').length, color: colors.success },
          { label: 'Blocked', value: users.filter(u => u.status === 'Blocked').length, color: colors.error },
        ].map((s, i) => (
          <View key={i} style={styles2.statItem}>
            <Text style={[{ color: s.color, fontSize: FontSize.xl, fontWeight: FontWeight.bold }]}>{s.value}</Text>
            <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={u => u.id}
        contentContainerStyle={{ padding: 14, gap: 10 }}
        renderItem={({ item }) => (
          <View style={[s.card, { backgroundColor: colors.card }]}>
            <Image source={{ uri: item.avatar }} style={s.avatar} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[s.name, { color: colors.text }]}>{item.name}</Text>
                <View style={[s.statusBadge, { backgroundColor: item.status === 'Active' ? colors.success + '20' : colors.error + '20' }]}>
                  <Text style={[{ color: item.status === 'Active' ? colors.success : colors.error, fontSize: 10, fontWeight: '700' }]}>{item.status}</Text>
                </View>
              </View>
              <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs }]}>{item.email}</Text>
              <Text style={[{ color: colors.textSecondary, fontSize: FontSize.xs, marginTop: 2 }]}>{item.orders} orders • Joined {item.joined}</Text>
            </View>
            <View style={s.actions}>
              <TouchableOpacity
                style={[s.actionBtn, { backgroundColor: item.status === 'Active' ? colors.warning + '20' : colors.success + '20' }]}
                onPress={() => toggleBlock(item.id)}
              >
                <MaterialIcons name={item.status === 'Active' ? 'block' : 'check-circle'} size={16} color={item.status === 'Active' ? colors.warning : colors.success} />
              </TouchableOpacity>
              <TouchableOpacity style={[s.actionBtn, { backgroundColor: colors.error + '20' }]} onPress={() => deleteUser(item.id)}>
                <MaterialIcons name="delete" size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <MaterialIcons name="people" size={56} color={colors.textMuted} />
            <Text style={{ color: colors.textMuted, marginTop: 12 }}>No users found</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles2 = StyleSheet.create({ statItem: { flex: 1, alignItems: 'center', paddingVertical: 10 } });

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.surface, ...Shadow.sm, shadowColor: colors.shadow },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchInput: { flex: 1, fontSize: FontSize.base },
  statsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: BorderRadius.lg, ...Shadow.sm, shadowColor: colors.shadow },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  name: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.circle },
  actions: { gap: 8 },
  actionBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});
