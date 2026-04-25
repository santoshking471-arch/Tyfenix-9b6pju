import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { PRODUCTS, Product, formatPrice } from '@/constants/mockData';
import { BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

export default function AdminProductsScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', price: '', originalPrice: '', category: '', brand: '', description: '' });

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ name: p.name, price: String(p.price), originalPrice: String(p.originalPrice), category: p.category, brand: p.brand, description: p.description });
    setShowAdd(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    if (editProduct) {
      setProducts(prev => prev.map(p => p.id === editProduct.id ? {
        ...p, name: form.name, price: Number(form.price), originalPrice: Number(form.originalPrice),
        category: form.category, brand: form.brand, description: form.description,
        discount: Math.round((1 - Number(form.price) / Number(form.originalPrice)) * 100),
      } : p));
    } else {
      setProducts(prev => [...prev, {
        id: Date.now().toString(), name: form.name, price: Number(form.price),
        originalPrice: Number(form.originalPrice) || Number(form.price),
        discount: 0, rating: 4.0, reviews: 0, category: form.category,
        categoryId: form.category.toLowerCase(), image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
        description: form.description, brand: form.brand, inStock: true, tags: [], sold: 0,
      }]);
    }
    setShowAdd(false);
    setEditProduct(null);
    setForm({ name: '', price: '', originalPrice: '', category: '', brand: '', description: '' });
  };

  const s = styles(colors);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.title, { color: colors.text }]}>Products ({filtered.length})</Text>
        <TouchableOpacity style={[s.addBtn, { backgroundColor: colors.primary }]} onPress={() => { setEditProduct(null); setForm({ name: '', price: '', originalPrice: '', category: '', brand: '', description: '' }); setShowAdd(true); }}>
          <MaterialIcons name="add" size={18} color="#fff" />
          <Text style={s.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={[s.searchRow, { backgroundColor: colors.surface }]}>
        <MaterialIcons name="search" size={18} color={colors.textMuted} />
        <TextInput style={[s.searchInput, { color: colors.text }]} placeholder="Search products..." placeholderTextColor={colors.textMuted} value={search} onChangeText={setSearch} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={p => p.id}
        contentContainerStyle={{ padding: 12, gap: 10 }}
        renderItem={({ item }) => (
          <View style={[s.card, { backgroundColor: colors.card }]}>
            <Image source={{ uri: item.image }} style={s.productImg} contentFit="cover" />
            <View style={{ flex: 1, paddingLeft: 12 }}>
              <Text style={[s.productName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
              <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs }]}>{item.brand} • {item.category}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <Text style={[{ color: colors.text, fontWeight: FontWeight.bold }]}>{formatPrice(item.price)}</Text>
                <Text style={[{ color: colors.discount, fontSize: FontSize.xs }]}>{item.discount}% off</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <MaterialIcons name="star" size={12} color={colors.star} />
                <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs }]}>{item.rating} • {item.sold} sold</Text>
              </View>
            </View>
            <View style={s.actions}>
              <TouchableOpacity style={[s.actionBtn, { backgroundColor: colors.primary + '20' }]} onPress={() => handleEdit(item)}>
                <MaterialIcons name="edit" size={18} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={[s.actionBtn, { backgroundColor: colors.error + '20' }]} onPress={() => handleDelete(item.id)}>
                <MaterialIcons name="delete" size={18} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={showAdd} transparent animationType="slide" onRequestClose={() => setShowAdd(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <ScrollView contentContainerStyle={{ justifyContent: 'flex-end', flexGrow: 1 }}>
            <View style={[s.modal, { backgroundColor: colors.surface }]}>
              <View style={s.modalHeader}>
                <Text style={[s.modalTitle, { color: colors.text }]}>{editProduct ? 'Edit Product' : 'Add Product'}</Text>
                <TouchableOpacity onPress={() => setShowAdd(false)}>
                  <MaterialIcons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              {[
                { label: 'Product Name *', key: 'name', placeholder: 'Enter product name' },
                { label: 'Price (₹) *', key: 'price', placeholder: 'e.g. 9999' },
                { label: 'Original Price (₹)', key: 'originalPrice', placeholder: 'e.g. 14999' },
                { label: 'Category', key: 'category', placeholder: 'e.g. Electronics' },
                { label: 'Brand', key: 'brand', placeholder: 'e.g. Samsung' },
                { label: 'Description', key: 'description', placeholder: 'Product description' },
              ].map(f => (
                <View key={f.key} style={{ marginBottom: 12 }}>
                  <Text style={[{ color: colors.textSecondary, fontSize: FontSize.sm, marginBottom: 6 }]}>{f.label}</Text>
                  <TextInput
                    style={[s.modalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                    placeholder={f.placeholder}
                    placeholderTextColor={colors.textMuted}
                    value={(form as any)[f.key]}
                    onChangeText={v => setForm(prev => ({ ...prev, [f.key]: v }))}
                    keyboardType={f.key === 'price' || f.key === 'originalPrice' ? 'numeric' : 'default'}
                    multiline={f.key === 'description'}
                  />
                </View>
              ))}
              <TouchableOpacity style={[s.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
                <Text style={s.saveBtnText}>{editProduct ? 'Update Product' : 'Add Product'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
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
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchInput: { flex: 1, fontSize: FontSize.base },
  card: { flexDirection: 'row', borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadow.sm, shadowColor: colors.shadow, padding: 12, alignItems: 'center' },
  productImg: { width: 72, height: 72, borderRadius: BorderRadius.md },
  productName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, marginBottom: 2 },
  actions: { gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  modal: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  modalInput: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: BorderRadius.lg, borderWidth: 1, fontSize: FontSize.base },
  saveBtn: { paddingVertical: 14, borderRadius: BorderRadius.circle, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#fff', fontSize: FontSize.base, fontWeight: FontWeight.bold },
});
