import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

const DEFAULT_BANNERS = [
  { id: '1', label: 'Premium Electronics Sale', image: require('@/assets/images/banner1.jpg'), active: true },
  { id: '2', label: 'Big Sale Festival', image: require('@/assets/images/banner2.jpg'), active: true },
  { id: '3', label: 'New Fashion Arrivals', image: require('@/assets/images/banner3.jpg'), active: false },
];

export default function AdminBannersScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [banners, setBanners] = useState(DEFAULT_BANNERS);

  const toggleActive = (id: string) => setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  const deleteBanner = (id: string) => setBanners(prev => prev.filter(b => b.id !== id));

  const s = styles(colors);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.title, { color: colors.text }]}>Banner Management</Text>
        <TouchableOpacity style={[s.addBtn, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="add-photo-alternate" size={18} color="#fff" />
          <Text style={s.addBtnText}>Upload</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={banners}
        keyExtractor={b => b.id}
        contentContainerStyle={{ padding: 14, gap: 14 }}
        renderItem={({ item }) => (
          <View style={[s.card, { backgroundColor: colors.card }]}>
            <Image source={item.image} style={s.bannerImg} contentFit="cover" />
            <View style={s.cardFooter}>
              <View style={{ flex: 1 }}>
                <Text style={[s.bannerLabel, { color: colors.text }]}>{item.label}</Text>
                <View style={[s.statusBadge, { backgroundColor: item.active ? colors.success + '20' : colors.error + '20' }]}>
                  <Text style={[{ color: item.active ? colors.success : colors.error, fontSize: 11, fontWeight: '700' }]}>{item.active ? 'Active' : 'Inactive'}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={[s.actionBtn, { backgroundColor: colors.primary + '20' }]} onPress={() => toggleActive(item.id)}>
                  <MaterialIcons name={item.active ? 'visibility-off' : 'visibility'} size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={[s.actionBtn, { backgroundColor: colors.error + '20' }]} onPress={() => deleteBanner(item.id)}>
                  <MaterialIcons name="delete" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.surface, ...Shadow.sm, shadowColor: colors.shadow },
  title: { flex: 1, fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.circle },
  addBtnText: { color: '#fff', fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  card: { borderRadius: BorderRadius.xl, overflow: 'hidden', ...Shadow.md, shadowColor: colors.shadow },
  bannerImg: { width: '100%', height: 160 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  bannerLabel: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, marginBottom: 6 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.circle },
  actionBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
});
