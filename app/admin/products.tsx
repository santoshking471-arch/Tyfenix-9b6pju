import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  TextInput, Modal, ScrollView, ActivityIndicator, Alert 
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { formatPrice } from '@/constants/mockData';
import { BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

// 🔥 FIREBASE IMPORTS
import { db } from '../firebaseConfig'; 
import { 
  collection, addDoc, updateDoc, deleteDoc, 
  doc, query, orderBy, onSnapshot 
} from 'firebase/firestore';

export default function AdminProductsScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // States
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [form, setForm] = useState({ 
    name: '', price: '', originalPrice: '', 
    category: '', brand: '', description: '' 
  });

  // --- 1. REAL-TIME DATA FETCHING ---
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. FILTER LOGIC ---
  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  // --- 3. DELETE FUNCTION ---
  const handleDelete = (id: string) => {
    Alert.alert("Delete Product", "Kya aap sach mein ise delete karna chahte hain?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "products", id));
          } catch (e) {
            Alert.alert("Error", "Delete nahi ho paya.");
          }
        } 
      }
    ]);
  };

  // --- 4. SAVE / UPDATE FUNCTION ---
  const handleSave = async () => {
    if (!form.name || !form.price) {
      Alert.alert("Opps!", "Name aur Price bharna zaroori hai.");
      return;
    }

    const priceNum = Number(form.price);
    const oldPriceNum = Number(form.originalPrice) || priceNum;
    const discountPercent = Math.round((1 - priceNum / oldPriceNum) * 100);

    const productData = {
      name: form.name,
      price: priceNum,
      originalPrice: oldPriceNum,
      category: form.category,
      brand: form.brand,
      description: form.description,
      discount: discountPercent > 0 ? discountPercent : 0,
      updatedAt: new Date().toISOString(),
      // Default placeholder image (jab tak image upload system na bane)
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    };

    try {
      setIsLoading(true);
      if (editProduct) {
        await updateDoc(doc(db, "products", editProduct.id), productData);
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: new Date().toISOString(),
          rating: 4.5,
          sold: 0,
          inStock: true,
        });
      }
      setShowAdd(false);
      setEditProduct(null);
      setForm({ name: '', price: '', originalPrice: '', category: '', brand: '', description: '' });
    } catch (e) {
      Alert.alert("Error", "Database mein save nahi ho saka.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (p: any) => {
    setEditProduct(p);
    setForm({ 
      name: p.name, 
      price: String(p.price), 
      originalPrice: String(p.originalPrice), 
      category: p.category, 
      brand: p.brand, 
      description: p.description 
    });
    setShowAdd(true);
  };

  const s = styles(colors);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.title, { color: colors.text }]}>Admin Panel ({filtered.length})</Text>
        <TouchableOpacity 
          style={[s.addBtn, { backgroundColor: colors.primary }]} 
          onPress={() => { 
            setEditProduct(null); 
            setForm({ name: '', price: '', originalPrice: '', category: '', brand: '', description: '' }); 
            setShowAdd(true); 
          }}
        >
          <MaterialIcons name="add" size={18} color="#fff" />
          <Text style={s.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[s.searchRow, { backgroundColor: colors.surface }]}>
        <MaterialIcons name="search" size={18} color={colors.textMuted} />
        <TextInput 
          style={[s.searchInput, { color: colors.text }]} 
          placeholder="Search products..." 
          placeholderTextColor={colors.textMuted} 
          value={search} 
          onChangeText={setSearch} 
        />
      </View>

      {/* Product List */}
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
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
                  <Text style={[{ color: colors.text, fontWeight: FontWeight.bold }]}>₹{item.price}</Text>
                  <Text style={[{ color: colors.discount, fontSize: FontSize.xs }]}>{item.discount}% off</Text>
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
      )}

      {/* Add/Edit Modal */}
      <Modal visible={showAdd} transparent animationType="slide" onRequestClose={() => setShowAdd(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <ScrollView contentContainerStyle={{ justifyContent: 'flex-end', flexGrow: 1 }}>
            <View style={[s.modal, { backgroundColor: colors.surface }]}>
              <View style={s.modalHeader}>
                <Text style={[s.modalTitle, { color: colors.text }]}>{editProduct ? 'Update Product' : 'New Product'}</Text>
                <TouchableOpacity onPress={() => setShowAdd(false)}>
                  <MaterialIcons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              {[
                { label: 'Product Name *', key: 'name', placeholder: 'Enter product name' },
                { label: 'Price (₹) *', key: 'price', placeholder: 'e.g. 999', keyboard: 'numeric' },
                { label: 'Original Price (₹)', key: 'originalPrice', placeholder: 'e.g. 1499', keyboard: 'numeric' },
                { label: 'Category', key: 'category', placeholder: 'e.g. T-Shirts' },
                { label: 'Brand', key: 'brand', placeholder: 'e.g. Tyfenix' },
                { label: 'Description', key: 'description', placeholder: 'About product...', multiline: true },
              ].map(f => (
                <View key={f.key} style={{ marginBottom: 12 }}>
                  <Text style={[{ color: colors.textSecondary, fontSize: FontSize.sm, marginBottom: 6 }]}>{f.label}</Text>
                  <TextInput
                    style={[s.modalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                    placeholder={f.placeholder}
                    placeholderTextColor={colors.textMuted}
                    value={(form as any)[f.key]}
                    onChangeText={v => setForm(prev => ({ ...prev, [f.key]: v }))}
                    keyboardType={(f.keyboard as any) || 'default'}
                    multiline={f.multiline}
                  />
                </View>
              ))}

              <TouchableOpacity 
                style={[s.saveBtn, { backgroundColor: colors.primary }]} 
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? <ActivityIndicator color="#fff" /> : (
                  <Text style={s.saveBtnText}>{editProduct ? 'Update in Firebase' : 'Save to Firebase'}</Text>
                )}
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
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.surface, ...Shadow.sm },
  title: { flex: 1, fontSize: 18, fontWeight: FontWeight.bold },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.circle },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: FontWeight.bold },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchInput: { flex: 1, fontSize: 16 },
  card: { flexDirection: 'row', borderRadius: 12, padding: 12, alignItems: 'center', marginBottom: 10, marginHorizontal: 12, ...Shadow.sm },
  productImg: { width: 60, height: 60, borderRadius: 8 },
  productName: { fontSize: 14, fontWeight: FontWeight.semibold, marginBottom: 2 },
  actions: { gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  modal: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: FontWeight.bold },
  modalInput: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, borderWidth: 1, fontSize: 16 },
  saveBtn: { paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: FontWeight.bold },
});
