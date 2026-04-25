import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

export default function OrderSuccessScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  const orderId = `TYF${Date.now().toString().slice(-6)}`;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, tension: 60, friction: 5, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.content}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Image source={require('@/assets/images/order-success.png')} style={styles.illustration} contentFit="contain" />
        </Animated.View>

        <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
          <View style={[styles.checkCircle, { backgroundColor: '#2E7D32' }]}>
            <MaterialIcons name="check" size={36} color="#fff" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Order Placed!</Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]}>
            Your order has been successfully placed. We'll notify you once it's shipped.
          </Text>

          <View style={[styles.orderIdCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[{ color: colors.textMuted, fontSize: FontSize.sm }]}>Order ID</Text>
            <Text style={[{ color: colors.primary, fontSize: FontSize.lg, fontWeight: FontWeight.bold }]}>#{orderId}</Text>
          </View>

          <View style={styles.infoRow}>
            {[
              { icon: 'local-shipping', label: 'Expected Delivery', value: '3-5 Days' },
              { icon: 'support-agent', label: 'Customer Support', value: '24/7' },
            ].map((info, i) => (
              <View key={i} style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <MaterialIcons name={info.icon as any} size={24} color={colors.primary} />
                <Text style={[{ color: colors.textMuted, fontSize: FontSize.xs, marginTop: 4 }]}>{info.label}</Text>
                <Text style={[{ color: colors.text, fontWeight: FontWeight.bold, fontSize: FontSize.sm }]}>{info.value}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.trackBtn, { borderColor: colors.primary }]}
          onPress={() => router.push('/orders' as any)}
        >
          <MaterialIcons name="track-changes" size={20} color={colors.primary} />
          <Text style={[styles.trackText, { color: colors.primary }]}>Track Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.shopBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <MaterialIcons name="shopping-bag" size={20} color="#fff" />
          <Text style={styles.shopText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  illustration: { width: 200, height: 200, marginBottom: 16 },
  checkCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 30, fontWeight: FontWeight.extrabold, marginBottom: 12, textAlign: 'center' },
  sub: { fontSize: FontSize.base, textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  orderIdCard: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: BorderRadius.xl, borderWidth: 1, alignItems: 'center', marginBottom: 24 },
  infoRow: { flexDirection: 'row', gap: 12 },
  infoCard: { flex: 1, alignItems: 'center', padding: 16, borderRadius: BorderRadius.lg },
  footer: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 12 },
  trackBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: BorderRadius.circle, borderWidth: 1.5 },
  trackText: { fontSize: FontSize.base, fontWeight: FontWeight.bold },
  shopBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: BorderRadius.circle },
  shopText: { color: '#fff', fontSize: FontSize.base, fontWeight: FontWeight.bold },
});
