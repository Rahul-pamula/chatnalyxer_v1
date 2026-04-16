import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Colors, FontSizes, Spacing, Radius } from '@/constants/Theme';

const { width, height } = Dimensions.get('window');

// Google Icon SVG component
const GoogleIcon = () => (
  <Text style={{ fontSize: 20 }}>G</Text>
);

export default function LoginScreen() {
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(30);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 600 });
    contentY.value = withSpring(0, { damping: 20 });
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  const handleGoogleLogin = () => {
    // Google OAuth via Supabase — wired in next step
    router.push('/(onboarding)/persona');
  };

  return (
    <LinearGradient
      colors={[Colors.midnight, Colors.midnight2]}
      style={styles.container}
    >
      {/* Background decoration */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <Animated.View style={[styles.content, contentStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoMark}>
            <Text style={{ fontSize: 28 }}>⚡</Text>
          </View>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>Chatnalyxer</Text>
          <Text style={styles.subtitle}>
            Your private AI obligation engine.{'\n'}Zero-knowledge. Zero noise.
          </Text>
        </View>

        {/* Auth Card */}
        <View style={styles.card}>
          {/* Google Button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            activeOpacity={0.85}
          >
            <View style={styles.googleIconWrap}>
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email placeholder */}
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => router.push('/(auth)/email')}
            activeOpacity={0.85}
          >
            <Text style={styles.emailButtonText}>Continue with Email</Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.terms}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.{'\n'}
            All your data is encrypted locally.
          </Text>
        </View>

        {/* Trust Badge */}
        <View style={styles.trustBadge}>
          <Text style={styles.trustIcon}>🔒</Text>
          <Text style={styles.trustText}>Zero-Knowledge Architecture. We cannot read your messages.</Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnight,
  },
  decorCircle1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.accentGlow,
  },
  decorCircle2: {
    position: 'absolute',
    bottom: 100,
    left: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(52, 211, 153, 0.06)',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoMark: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  welcomeText: {
    fontSize: FontSizes.md,
    color: Colors.snowMuted,
    fontWeight: '400',
  },
  appName: {
    fontSize: FontSizes['2xl'],
    color: Colors.snow,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.snowFaint,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.snow,
    borderRadius: Radius.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  googleIconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4285F4',
  },
  googleButtonText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.midnight,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: FontSizes.xs,
    color: Colors.snowFaint,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emailButton: {
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  emailButtonText: {
    fontSize: FontSizes.base,
    fontWeight: '500',
    color: Colors.snow,
  },
  terms: {
    fontSize: FontSizes.xs,
    color: Colors.snowFaint,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: -Spacing.xs,
  },
  termsLink: {
    color: Colors.accentSoft,
    fontWeight: '500',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  trustIcon: {
    fontSize: 14,
  },
  trustText: {
    fontSize: FontSizes.xs,
    color: Colors.snowFaint,
    textAlign: 'center',
    lineHeight: 16,
    flex: 1,
  },
});
