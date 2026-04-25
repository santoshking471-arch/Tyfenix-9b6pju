import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';
import { BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

export default function SignupScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  const { showAlert } = useAlert();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      showAlert('Missing Fields', 'Please fill all required fields.');
      return;
    }
    if (password !== confirm) {
      showAlert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      showAlert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    const ok = await signup(name.trim(), email.trim(), password);
    if (ok) router.replace('/(tabs)');
  };

  const s = styles(colors);

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={[s.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={s.heroSection}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={s.logoContainer}>
            <MaterialIcons name="shopping-bag" size={40} color="#FFB300" />
            <Text style={s.logoText}>Tyfenix</Text>
          </View>
          <Text style={s.heroTitle}>Create Account</Text>
          <Text style={s.heroSub}>Join millions of happy shoppers</Text>
        </View>

        <View style={[s.formCard, { backgroundColor: colors.surface }]}>
          {[
            { label: 'Full Name *', value: name, onChange: setName, icon: 'person', placeholder: 'Your full name', type: 'default' },
            { label: 'Email Address *', value: email, onChange: setEmail, icon: 'email', placeholder: 'your@email.com', type: 'email-address' },
            { label: 'Phone Number', value: phone, onChange: setPhone, icon: 'phone', placeholder: '+91 XXXXX XXXXX', type: 'phone-pad' },
          ].map(field => (
            <View key={field.label}>
              <Text style={[s.label, { color: colors.textSecondary }]}>{field.label}</Text>
              <View style={[s.inputRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <MaterialIcons name={field.icon as any} size={20} color={colors.textMuted} />
                <TextInput
                  style={[s.input, { color: colors.text }]}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.textMuted}
                  value={field.value}
                  onChangeText={field.onChange}
                  keyboardType={field.type as any}
                  autoCapitalize={field.type === 'default' ? 'words' : 'none'}
                />
              </View>
            </View>
          ))}

          <Text style={[s.label, { color: colors.textSecondary }]}>Password *</Text>
          <View style={[s.inputRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <MaterialIcons name="lock" size={20} color={colors.textMuted} />
            <TextInput
              style={[s.input, { color: colors.text }]}
              placeholder="Min. 6 characters"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <MaterialIcons name={showPass ? 'visibility' : 'visibility-off'} size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={[s.label, { color: colors.textSecondary }]}>Confirm Password *</Text>
          <View style={[s.inputRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <MaterialIcons name="lock-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={[s.input, { color: colors.text }]}
              placeholder="Repeat your password"
              placeholderTextColor={colors.textMuted}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={!showPass}
            />
          </View>

          <TouchableOpacity
            style={[s.signupBtn, { backgroundColor: colors.primary }, isLoading && { opacity: 0.7 }]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Text style={s.signupBtnText}>Create Account</Text>
                <MaterialIcons name="arrow-forward" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          <Text style={[s.terms, { color: colors.textMuted }]}>
            By creating an account, you agree to our{' '}
            <Text style={{ color: colors.primary }}>Terms & Conditions</Text>
            {' '}and{' '}
            <Text style={{ color: colors.primary }}>Privacy Policy</Text>
          </Text>

          <View style={s.loginRow}>
            <Text style={[{ color: colors.textSecondary }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={[{ color: colors.primary, fontWeight: FontWeight.bold }]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (colors: any) => StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A237E' },
  container: { flexGrow: 1 },
  heroSection: { paddingHorizontal: 24, paddingBottom: 32 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  logoText: { color: '#FFB300', fontSize: 28, fontWeight: FontWeight.extrabold, letterSpacing: 2 },
  heroTitle: { color: '#fff', fontSize: 28, fontWeight: FontWeight.extrabold, marginBottom: 8 },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.base },
  formCard: { marginHorizontal: 16, borderRadius: BorderRadius.xxl, padding: 24, ...Shadow.lg },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderRadius: BorderRadius.lg, borderWidth: 1, marginBottom: 16 },
  input: { flex: 1, fontSize: FontSize.base },
  signupBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, borderRadius: BorderRadius.circle, marginBottom: 16, marginTop: 4 },
  signupBtnText: { color: '#fff', fontSize: FontSize.base, fontWeight: FontWeight.bold },
  terms: { fontSize: FontSize.xs, textAlign: 'center', lineHeight: 18, marginBottom: 16 },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
});
