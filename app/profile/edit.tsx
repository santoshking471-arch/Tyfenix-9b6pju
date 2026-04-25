import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';
import { BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

export default function EditProfileScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { showAlert } = useAlert();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSave = () => {
    if (!name.trim()) {
      showAlert('Name Required', 'Please enter your name.');
      return;
    }
    updateProfile({ name: name.trim(), phone: phone.trim() });
    showAlert('Profile Updated', 'Your profile has been updated successfully.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const s = styles(colors);

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.title, { color: colors.text }]}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[{ color: colors.primary, fontSize: FontSize.base, fontWeight: FontWeight.bold }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>
        <View style={s.avatarSection}>
          <Image source={{ uri: user?.avatar }} style={s.avatar} contentFit="cover" />
          <TouchableOpacity style={[s.editAvatarBtn, { backgroundColor: colors.primary }]}>
            <MaterialIcons name="camera-alt" size={16} color="#fff" />
          </TouchableOpacity>
          <Text style={[{ color: colors.textMuted, fontSize: FontSize.sm, marginTop: 8 }]}>Tap to change photo</Text>
        </View>

        <View style={[s.card, { backgroundColor: colors.card }]}>
          {[
            { label: 'Full Name', val: name, set: setName, icon: 'person', type: 'default' },
            { label: 'Email (cannot change)', val: user?.email || '', set: () => {}, icon: 'email', type: 'email-address', disabled: true },
            { label: 'Phone Number', val: phone, set: setPhone, icon: 'phone', type: 'phone-pad' },
          ].map(f => (
            <View key={f.label} style={{ marginBottom: 16 }}>
              <Text style={[{ color: colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, marginBottom: 8 }]}>{f.label}</Text>
              <View style={[s.inputRow, { backgroundColor: f.disabled ? colors.border + '40' : colors.background, borderColor: colors.border }]}>
                <MaterialIcons name={f.icon as any} size={18} color={colors.textMuted} />
                <TextInput
                  style={[{ flex: 1, color: f.disabled ? colors.textMuted : colors.text, fontSize: FontSize.base }]}
                  value={f.val}
                  onChangeText={f.set}
                  keyboardType={f.type as any}
                  editable={!f.disabled}
                />
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={[s.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
          <MaterialIcons name="save" size={20} color="#fff" />
          <Text style={s.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (colors: any) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: colors.surface, ...Shadow.sm, shadowColor: colors.shadow },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  avatarSection: { alignItems: 'center', paddingVertical: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  editAvatarBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 30, right: '35%' },
  card: { borderRadius: BorderRadius.xl, padding: 16, ...Shadow.sm, shadowColor: colors.shadow },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: BorderRadius.lg, borderWidth: 1 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, borderRadius: BorderRadius.circle },
  saveBtnText: { color: '#fff', fontSize: FontSize.base, fontWeight: FontWeight.bold },
});
