import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useCart } from '@/hooks/useCart';
import { useAlert } from '@/template';
import { formatPrice } from '@/constants/mockData';
import { BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

type PaymentMethod = 'cod' | 'upi' | 'card';

export default function CheckoutScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, total, discount, clearCart } = useCart();
  const { showAlert } = useAlert();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const [upiId, setUpiId] = useState('');
  const [placing, setPlacing] = useState(false);

  const deliveryFee = total >= 499 ? 0 : 49;
  const finalTotal = total + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!name || !phone || !address || !city || !state || !pincode) {
      showAlert('Missing Address', 'Please fill all address fields.');
      return;
    }
    if (payment === 'upi' && !upiId.trim()) {
      showAlert('UPI ID Required', 'Please enter your UPI ID.');
      return;
    }
    setPlacing(true);
    await new Promise(r => setTimeout(r, 2000));
    setPlacing(false);
    clearCart();
    router.replace('/order-success' as any);
  };

  const s = styles(colors);

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.text }]}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120, paddingTop: 16, gap: 16 }}>

        {/* Delivery Address */}
        <View style={[s.section, { backgroundColor: colors.card }]}>
          <View style={s.sectionHeader}>
            <MaterialIcons name="location-on" size={20} color={colors.primary} />
            <Text style={[s.sectionTitle, { color: colors.text }]}>Delivery Address</Text>
          </View>

          {[
            { label: 'Full Name', val: name, set: setName, icon: 'person', type: 'default', caps: 'words' },
            { label: 'Phone Number', val: phone, set: setPhone, icon: 'phone', type: 'phone-pad', caps: 'none' },
            { label: 'Address Line', val: address, set: setAddress, icon: 'home', type: 'default', caps: 'sentences' },
            { label: 'City', val: city, set: setCity, icon: 'location-city', type: 'default', caps: 'words' },
            { label: 'State', val: state, set: setState, icon: 'map', type: 'default', caps: 'words' },
            { label: 'PIN Code', val: pincode, set: setPincode, icon: 'pin', type: 'numeric', caps: 'none' },
          ].map(field => (
            <View key={field.label} style={{ marginBottom: 12 }}>
              <Text style={[s.fieldLabel, { color: colors.textSecondary }]}>{field.label}</Text>
              <View style={[s.inputRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <MaterialIcons name={field.icon as any} size={18} color={colors.textMuted} />
                <TextInput
                  style={[{ flex: 1, color: colors.text, fontSize: FontSize.base }]}
                  placeholder={field.label}
                  placeholderTextColor={colors.textMuted}
                  value={field.val}
                  onChangeText={field.set}
                  keyboardType={field.type as any}
                  autoCapitalize={field.caps as any}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View style={[s.section, { backgroundColor: colors.card }]}>
          <View style={s.sectionHeader}>
            <MaterialIcons name="payment" size={20} color={colors.primary} />
            <Text style={[s.sectionTitle, { color: colors.text }]}>Payment Method</Text>
          </View>

          {([
            { key: 'cod', label: 'Cash on Delivery', sub: 'Pay when you receive', icon: 'money' },
            { key: 'upi', label: 'UPI / Wallet', sub: 'GPay, PhonePe, Paytm', icon: 'account-balance-wallet' },
            { key: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: 'credit-card' },
          ] as const).map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[s.paymentOption, payment === opt.key && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }]}
              onPress={() => setPayment(opt.key)}
            >
              <View style={[s.payIcon, { backgroundColor: colors.primary + '15' }]}>
                <MaterialIcons name={opt.icon as any} size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[{ color: colors.text, fontWeight: FontWeight.semibold }]}>{opt.label}</Text>
                <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs }]}>{opt.sub}</Text>
              </View>
              <View style={[s.radio, { borderColor: colors.primary }]}>
                {payment === opt.key && <View style={[s.radioFill, { backgroundColor: colors.primary }]} />}
              </View>
            </TouchableOpacity>
          ))}

          {payment === 'upi' && (
            <View style={{ marginTop: 8 }}>
              <Text style={[s.fieldLabel, { color: colors.textSecondary }]}>UPI ID</Text>
              <View style={[s.inputRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <MaterialIcons name="alternate-email" size={18} color={colors.textMuted} />
                <TextInput
                  style={[{ flex: 1, color: colors.text, fontSize: FontSize.base }]}
                  placeholder="yourname@paytm"
                  placeholderTextColor={colors.textMuted}
                  value={upiId}
                  onChangeText={setUpiId}
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}

          {payment === 'card' && (
            <View style={[s.demoBanner, { backgroundColor: colors.warning + '15' }]}>
              <MaterialIcons name="info" size={16} color={colors.warning} />
              <Text style={[{ color: colors.warning, fontSize: FontSize.xs }]}>Demo mode - No real payment will be charged</Text>
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={[s.section, { backgroundColor: colors.card }]}>
          <View style={s.sectionHeader}>
            <MaterialIcons name="receipt" size={20} color={colors.primary} />
            <Text style={[s.sectionTitle, { color: colors.text }]}>Order Summary</Text>
          </View>
          <Text style={[{ color: colors.textMuted, fontSize: FontSize.sm, marginBottom: 12 }]}>{items.length} {items.length === 1 ? 'item' : 'items'}</Text>
          {[
            { label: 'Subtotal', value: formatPrice(total + discount) },
            { label: 'Discount', value: `-${formatPrice(discount)}`, color: colors.success },
            { label: 'Delivery', value: deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee), color: deliveryFee === 0 ? colors.success : colors.text },
          ].map(row => (
            <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={[{ color: colors.textSecondary, fontSize: FontSize.md }]}>{row.label}</Text>
              <Text style={[{ color: row.color || colors.text, fontSize: FontSize.md, fontWeight: FontWeight.medium }]}>{row.value}</Text>
            </View>
          ))}
          <View style={[{ height: 1, backgroundColor: colors.divider, marginVertical: 10 }]} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[{ color: colors.text, fontSize: FontSize.lg, fontWeight: FontWeight.bold }]}>Total</Text>
            <Text style={[{ color: colors.text, fontSize: FontSize.lg, fontWeight: FontWeight.bold }]}>{formatPrice(finalTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[s.footer, { paddingBottom: insets.bottom + 12, borderTopColor: colors.border, backgroundColor: colors.surface }]}>
        <View>
          <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs }]}>Order Total</Text>
          <Text style={[{ color: colors.text, fontSize: FontSize.xl, fontWeight: FontWeight.bold }]}>{formatPrice(finalTotal)}</Text>
        </View>
        <TouchableOpacity
          style={[s.placeBtn, { backgroundColor: colors.primary }, placing && { opacity: 0.7 }]}
          onPress={handlePlaceOrder}
          disabled={placing}
        >
          {placing ? <ActivityIndicator color="#fff" /> : (
            <>
              <MaterialIcons name="check-circle" size={20} color="#fff" />
              <Text style={s.placeBtnText}>Place Order</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = (colors: any) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: colors.surface, ...Shadow.sm, shadowColor: colors.shadow },
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  section: { borderRadius: BorderRadius.xl, padding: 16, ...Shadow.sm, shadowColor: colors.shadow },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: BorderRadius.lg, borderWidth: 1 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: BorderRadius.lg, borderWidth: 1.5, borderColor: colors.border, marginBottom: 10 },
  payIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioFill: { width: 10, height: 10, borderRadius: 5 },
  demoBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: BorderRadius.md, marginTop: 4 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1 },
  placeBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 14, borderRadius: BorderRadius.circle },
  placeBtnText: { color: '#fff', fontSize: FontSize.base, fontWeight: FontWeight.bold },
});
