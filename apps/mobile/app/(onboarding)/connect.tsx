import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, FontSizes, Spacing, Radius } from '@/constants/Theme';

export default function ConnectScreen() {
  return (
    <LinearGradient
      colors={[Colors.midnight, Colors.midnight2]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>⚡</Text>
          <Text style={styles.title}>Connect Your Channels</Text>
          <Text style={styles.subtitle}>
            The AI Sieve monitors these channels and extracts obligations in real-time.
            You control exactly which groups and folders it watches.
          </Text>
        </View>

        {/* WhatsApp Tile */}
        <ChannelTile
          icon="💬"
          name="WhatsApp"
          description="Select specific groups to monitor. Free plan: up to 2 groups."
          status="not_connected"
          accentColor="#25D366"
          onPress={() => router.push('/(onboarding)/connect-whatsapp')}
        />

        {/* Email Tile */}
        <ChannelTile
          icon="✉️"
          name="Email"
          description="Target specific folders or labels (Gmail, Outlook)."
          status="not_connected"
          accentColor="#4285F4"
          onPress={() => router.push('/(onboarding)/connect-email')}
        />

        {/* Skip for now */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip for now — I'll connect later from the Hub</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>🔒</Text>
          <Text style={styles.infoText}>
            Only message metadata is processed. Raw content never leaves your device unencrypted.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function ChannelTile({
  icon, name, description, status, accentColor, onPress,
}: {
  icon: string; name: string; description: string;
  status: 'connected' | 'not_connected';
  accentColor: string; onPress: () => void;
}) {
  const isConnected = status === 'connected';
  return (
    <TouchableOpacity style={styles.tile} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.tileIconWrap, { backgroundColor: `${accentColor}18` }]}>
        <Text style={styles.tileIcon}>{icon}</Text>
      </View>
      <View style={styles.tileText}>
        <Text style={styles.tileName}>{name}</Text>
        <Text style={styles.tileDesc}>{description}</Text>
      </View>
      <View style={[
        styles.tileBadge,
        isConnected ? { backgroundColor: `${Colors.success}20`, borderColor: Colors.success }
          : { backgroundColor: Colors.surfaceAlt, borderColor: Colors.borderStrong }
      ]}>
        <Text style={[
          styles.tileBadgeText,
          { color: isConnected ? Colors.success : Colors.snowFaint }
        ]}>
          {isConnected ? '✓ Live' : 'Connect'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.midnight },
  scroll: {
    paddingHorizontal: Spacing.lg, paddingTop: 72,
    paddingBottom: 60, gap: Spacing.md,
  },
  header: { gap: Spacing.sm, alignItems: 'center', marginBottom: Spacing.sm },
  emoji: { fontSize: 40 },
  title: { fontSize: FontSizes['2xl'], color: Colors.snow, fontWeight: '700', letterSpacing: -0.5, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.sm, color: Colors.snowMuted, lineHeight: 21, textAlign: 'center' },
  tile: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1.5, borderColor: Colors.border,
  },
  tileIconWrap: {
    width: 52, height: 52, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  tileIcon: { fontSize: 26 },
  tileText: { flex: 1, gap: 4 },
  tileName: { fontSize: FontSizes.base, color: Colors.snow, fontWeight: '600' },
  tileDesc: { fontSize: FontSizes.xs, color: Colors.snowMuted, lineHeight: 17 },
  tileBadge: {
    paddingHorizontal: Spacing.sm, paddingVertical: 5,
    borderRadius: Radius.full, borderWidth: 1,
  },
  tileBadgeText: { fontSize: FontSizes.xs, fontWeight: '600' },
  skipButton: {
    alignItems: 'center', paddingVertical: Spacing.md,
  },
  skipText: { fontSize: FontSizes.sm, color: Colors.accentSoft, textDecorationLine: 'underline' },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  infoIcon: { fontSize: 16 },
  infoText: { flex: 1, fontSize: FontSizes.xs, color: Colors.snowMuted, lineHeight: 18 },
});
