import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { Colors, FontSizes, Spacing } from '@/constants/design';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const glowOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo fade in + scale up
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    logoScale.value = withDelay(300, withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.2)) }));

    // Glow pulse
    glowOpacity.value = withDelay(600, withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1200 }),
        withTiming(0.3, { duration: 1200 })
      ), -1, true
    ));

    // Tagline fade
    taglineOpacity.value = withDelay(900, withTiming(1, { duration: 600 }));

    // Navigate after 2.5s
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  return (
    <LinearGradient
      colors={[Colors.midnight, Colors.midnight2, Colors.midnight3]}
      style={styles.container}
    >
      {/* Glow orb behind logo */}
      <Animated.View style={[styles.glowOrb, glowStyle]} />

      {/* Logo Container */}
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <View style={styles.logoMark}>
          <Text style={styles.logoIcon}>⚡</Text>
        </View>
        <Text style={styles.logoText}>Chatnalyxer</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, taglineStyle]}>
        Your obligations, intelligently extracted.
      </Animated.Text>

      {/* Bottom bar */}
      <View style={styles.footer}>
        <View style={styles.loadingBar}>
          <Animated.View style={[styles.loadingFill, glowStyle]} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.midnight,
  },
  glowOrb: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.accentGlow,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 80,
  },
  logoContainer: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
  },
  logoIcon: {
    fontSize: 36,
  },
  logoText: {
    fontSize: FontSizes['3xl'],
    color: Colors.snow,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: Spacing.md,
    fontSize: FontSizes.base,
    color: Colors.snowMuted,
    letterSpacing: 0.3,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    width: 120,
    alignItems: 'center',
  },
  loadingBar: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.border,
    borderRadius: 99,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 99,
  },
});
