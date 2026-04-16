import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Colors, FontSizes, Spacing, Radius } from '@/constants/design';

export default function EmailScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!email.includes('@')) return;
    setLoading(true);
    // TODO: Supabase magic link / OTP
    setTimeout(() => {
      setLoading(false);
      router.push('/(auth)/otp' as any);
    }, 1000);
  };

  return (
    <LinearGradient colors={[Colors.midnight, Colors.midnight2]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inner}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Enter your email</Text>
        <Text style={styles.subtitle}>We'll send you a one-time verification code.</Text>

        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor={Colors.snowFaint}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={[styles.button, !email.includes('@') && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={loading || !email.includes('@')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send Code →'}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 80, gap: Spacing.md },
  back: { marginBottom: Spacing.sm },
  backText: { color: Colors.accentSoft, fontSize: FontSizes.base },
  title: { fontSize: FontSizes['2xl'], color: Colors.snow, fontWeight: '700' },
  subtitle: { fontSize: FontSizes.base, color: Colors.snowMuted },
  input: {
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Spacing.md, color: Colors.snow, fontSize: FontSizes.base,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  button: {
    backgroundColor: Colors.accent, borderRadius: Radius.md,
    paddingVertical: 16, alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: Colors.snow, fontWeight: '600', fontSize: FontSizes.base },
});
