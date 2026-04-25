import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Address } from '@/constants/mockData';
import { BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

const DEFAULT_ADDRESSES: Address[] = [
  { id: 'a1', name: 'Home', phone: '9876543210', line1: '123 MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001', isDefault: true },
  { id: 'a2', name: 'Office', phone: '9876543211', line1: '456 Whitefield', city: 'Bangalore', state: 'Karnataka', pincode: '560066', isDefault: false },
];

export default function AddressesScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);
  const [showModal, setShowModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editLine, setEditLine] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editPin, setEditPin] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const addAddress = () => {
    if (!editName || !editLine || !editCity) return;
    setAddresses(prev => [...prev, {
      id: Date.now().toString(),
      name: editName,
      phone: editPhone,
      line1: editLine,
      city: editCity,
      state: editState,
      pincode: editPin,
      isDefault: false,
    }]);
    setShowModal(false);
    setEditName(''); setEditLine(''); setEditCity(''); setEditState(''); setEditPin(''); setEditPhone('');
  };

  const s = styles(colors);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.title, { color: colors.text }]}>My Addresses</Text>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <MaterialIcons name="add" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {addresses.map(addr => (
          <View key={addr.id} style={[s.card, { backgroundColor: colors.card }]}>
            <View style={s.cardHeader}>
              <View style={[s.typeIcon, { backgroundColor: colors.primary + '15' }]}>
                <MaterialIcons name={addr.name === 'Home' ? 'home' : 'work'} size={20} color={colors.primary} />
              </View>
              <Text style={[s.typeName, { color: colors.text }]}>{addr.name}</Text>
              {addr.isDefault && (
                <View style={[s.defaultBadge, { backgroundColor: colors.success + '20' }]}>
                  <Text style={[{ color: colors.success, fontSize: 10, fontWeight: '700' }]}>Default</Text>
                </View>
              )}
              <TouchableOpacity style={{ marginLeft: 'auto' }}>
                <MaterialIcons name="edit" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={[{ color: colors.text, fontSize: FontSize.base, marginBottom: 2 }]}>{addr.line1}</Text>
            <Text style={[{ color: colors.textSecondary, fontSize: FontSize.sm }]}>{addr.city}, {addr.state} - {addr.pincode}</Text>
            <Text style={[{ color: colors.textMuted, fontSize: FontSize.sm, marginTop: 4 }]}>+91 {addr.phone}</Text>
            {!addr.isDefault && (
              <TouchableOpacity
                style={[s.defaultBtn, { borderColor: colors.primary }]}
                onPress={() => setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === addr.id })))}
              >
                <Text style={[{ color: colors.primary, fontSize: FontSize.sm, fontWeight: FontWeight.semibold }]}>Set as Default</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={[s.addCard, { borderColor: colors.primary }]} onPress={() => setShowModal(true)}>
          <MaterialIcons name="add-location" size={28} color={colors.primary} />
          <Text style={[{ color: colors.primary, fontSize: FontSize.base, fontWeight: FontWeight.semibold }]}>Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={[s.modal, { backgroundColor: colors.surface }]}>
            <View style={s.modalHeader}>
              <Text style={[s.modalTitle, { color: colors.text }]}>Add Address</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {[
              { label: 'Address Name (e.g. Home)', val: editName, set: setEditName },
              { label: 'Phone', val: editPhone, set: setEditPhone },
              { label: 'Address Line', val: editLine, set: setEditLine },
              { label: 'City', val: editCity, set: setEditCity },
              { label: 'State', val: editState, set: setEditState },
              { label: 'PIN Code', val: editPin, set: setEditPin },
            ].map(f => (
              <View key={f.label} style={{ marginBottom: 12 }}>
                <Text style={[{ color: colors.textSecondary, fontSize: FontSize.sm, marginBottom: 6 }]}>{f.label}</Text>
                <TextInput
                  style={[s.modalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  placeholder={f.label}
                  placeholderTextColor={colors.textMuted}
                  value={f.val}
                  onChangeText={f.set}
                />
              </View>
            ))}
            <TouchableOpacity style={[s.saveBtn, { backgroundColor: colors.primary }]} onPress={addAddress}>
              <Text style={s.saveBtnText}>Save Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.surface, ...Shadow.sm, shadowColor: colors.shadow },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  card: { borderRadius: BorderRadius.xl, padding: 16, ...Shadow.sm, shadowColor: colors.shadow },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  typeIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  typeName: { fontSize: FontSize.base, fontWeight: FontWeight.bold },
  defaultBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  defaultBtn: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: BorderRadius.circle, borderWidth: 1, marginTop: 10 },
  addCard: { borderWidth: 1.5, borderStyle: 'dashed', borderRadius: BorderRadius.xl, padding: 20, alignItems: 'center', justifyContent: 'center', gap: 8, flexDirection: 'row' },
  modal: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  modalInput: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: BorderRadius.lg, borderWidth: 1, fontSize: FontSize.base },
  saveBtn: { paddingVertical: 14, borderRadius: BorderRadius.circle, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#fff', fontSize: FontSize.base, fontWeight: FontWeight.bold },
});
