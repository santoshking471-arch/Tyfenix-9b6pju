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

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login, loginWithGoogle, isLoading } = useAuth();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      showAlert('Missing Fields', 'Please enter email and password.');
      return;
    }
    const ok = await login(email.trim(), password);
    if (ok) {
      router.replace('/(tabs)');
    } else {
      showAlert('Login Failed', 'Invalid credentials. Please try again.');
    }
  };

  const handleGoogle = async () => {
    const ok = await loginWithGoogle();
    if (ok) router.replace('/(tabs)');
  };

  const s = styles(colors);

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={[s.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={s.heroSection}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={s.logoContainer}>
            <MaterialIcons name="shopping-bag" size={40} color="#FFB300" />
            <Text style={s.logoText}>Tyfenix</Text>
          </View>
          <Text style={s.heroTitle}>Welcome Back!</Text>
          <Text style={s.heroSub}>Login to continue shopping</Text>
        </View>

        {/* Form Card */}
        <View style={[s.formCard, { backgroundColor: colors.surface }]}>
          
          {/* Demo Hint */}
          <View style={[s.hint, { backgroundColor: colors.primary + '15' }]}>
            <MaterialIcons name="info" size={16} color={colors.primary} />
            <Text style={[s.hintText, { color: colors.primary }]}>
              Test: any email + 6+ char password | Admin: santoshking471@gmail.com / Santosh@9368
            </Text>
          </View>

          <Text style={[s.label, { color: colors.textSecondary }]}>Email Address</Text>
          <View style={[s.inputRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <MaterialIcons name="email" size={20} color={colors.textMuted} />
            <TextInput
              style={[s.input, { color: colors.text }]}
              placeholder="Enter your email"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={[s.label, { color: colors.textSecondary }]}>Password</Text>
          <View style={[s.inputRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <MaterialIcons name="lock" size={20} color={colors.textMuted} />
            <TextInput
              style={[s.input, { color: colors.text }]}
              placeholder="Enter your password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <MaterialIcons name={showPass ? 'visibility' : 'visibility-off'} size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.forgotBtn}>
            <Text style={[s.forgotText, { color: colors.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.loginBtn, { backgroundColor: colors.primary }, isLoading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Text style={s.loginBtnText}>Login</Text>
                <MaterialIcons name="arrow-forward" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={s.dividerRow}>
            <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[s.dividerText, { color: colors.textMuted }]}>OR</Text>
            <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Google Login */}
          <TouchableOpacity
            style={[s.googleBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
            onPress={handleGoogle}
            disabled={isLoading}
          >
            <MaterialIcons name="account-circle" size={22} color="#DB4437" />
            <Text style={[s.googleText, { color: colors.text }]}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Signup Link */}
          <View style={s.signupRow}>
            <Text style={[{ color: colors.textSecondary }]}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={[{ color: colors.primary, fontWeight: FontWeight.bold }]}>Sign Up</Text>
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
  heroTitle: { color: '#fff', fontSize: FontSize.display, fontWeight: FontWeight.extrabold, marginBottom: 8 },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.base },
  formCard: { marginHorizontal: 16, borderRadius: BorderRadius.xxl, padding: 24, ...Shadow.lg },
  hint: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12, borderRadius: BorderRadius.md, marginBottom: 20 },
  hintText: { flex: 1, fontSize: FontSize.xs, lineHeight: 16 },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderRadius: BorderRadius.lg, borderWidth: 1, marginBottom: 16 },
  input: { flex: 1, fontSize: FontSize.base },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  loginBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, borderRadius: BorderRadius.circle, marginBottom: 20 },
  loginBtnText: { color: '#fff', fontSize: FontSize.base, fontWeight: FontWeight.bold },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, borderRadius: BorderRadius.circle, borderWidth: 1, marginBottom: 20 },
  googleText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  signupRow: { flexDirection: 'row', justifyContent: 'center' },
});
