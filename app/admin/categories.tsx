import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { CATEGORIES, Category } from '@/constants/mockData';
import { BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

export default function AdminCategoriesScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    if (editCat) {
      setCategories(prev => prev.map(c => c.id === editCat.id ? { ...c, name: name.trim() } : c));
    } else {
      setCategories(prev => [...prev, { id: Date.now().toString(), name: name.trim(), icon: 'category', color: '#1A237E', productCount: 0 }]);
    }
    setShowModal(false); setEditCat(null); setName('');
  };

  const deleteCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));

  const s = styles(colors);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.title, { color: colors.text }]}>Categories</Text>
        <TouchableOpacity style={[s.addBtn, { backgroundColor: colors.primary }]} onPress={() => { setEditCat(null); setName(''); setShowModal(true); }}>
          <MaterialIcons name="add" size={18} color="#fff" />
          <Text style={s.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={c => c.id}
        contentContainerStyle={{ padding: 14, gap: 10 }}
        renderItem={({ item }) => (
          <View style={[s.card, { backgroundColor: colors.card }]}>
            <View style={[s.icon, { backgroundColor: item.color + '20' }]}>
              <MaterialIcons name={item.icon as any} size={24} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.catName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs }]}>{item.productCount} products</Text>
            </View>
            <TouchableOpacity style={[s.actionBtn, { backgroundColor: colors.primary + '20', marginRight: 8 }]} onPress={() => { setEditCat(item); setName(item.name); setShowModal(true); }}>
              <MaterialIcons name="edit" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={[s.actionBtn, { backgroundColor: colors.error + '20' }]} onPress={() => deleteCategory(item.id)}>
              <MaterialIcons name="delete" size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={showModal} transparent animationType="slide">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setShowModal(false)}>
          <View style={[s.modal, { backgroundColor: colors.surface }]}>
            <Text style={[s.modalTitle, { color: colors.text }]}>{editCat ? 'Edit Category' : 'Add Category'}</Text>
            <TextInput
              style={[s.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Category name"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />
            <TouchableOpacity style={[s.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
              <Text style={s.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.surface, ...Shadow.sm, shadowColor: colors.shadow },
  title: { flex: 1, fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.circle },
  addBtnText: { color: '#fff', fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  card: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: BorderRadius.lg, ...Shadow.sm, shadowColor: colors.shadow },
  icon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  catName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  actionBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  modal: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 48 },
  modalTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginBottom: 16 },
  input: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: BorderRadius.lg, borderWidth: 1, fontSize: FontSize.base, marginBottom: 16 },
  saveBtn: { paddingVertical: 14, borderRadius: BorderRadius.circle, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: FontSize.base, fontWeight: FontWeight.bold },
});
