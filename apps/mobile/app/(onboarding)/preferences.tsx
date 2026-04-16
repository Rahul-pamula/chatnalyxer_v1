import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { Colors, FontSizes, Spacing, Radius } from '@/constants/design';

const FOCUS_OPTIONS = [
  { id: 'deadlines', label: 'Deadlines & Due Dates', icon: '📅' },
  { id: 'meetings', label: 'Meetings & Events', icon: '🗓️' },
  { id: 'followups', label: 'Follow-ups & Replies', icon: '↩️' },
  { id: 'payments', label: 'Payments & Bookings', icon: '💳' },
  { id: 'tasks', label: 'Action Items & Tasks', icon: '✅' },
];

const QUIET_HOUR_OPTIONS = [
  { id: 'none', label: 'No quiet hours' },
  { id: 'night', label: '10 PM – 7 AM' },
  { id: 'custom', label: 'Custom (coming soon)', disabled: true },
];

export default function PreferencesScreen() {
  const [focusSelected, setFocusSelected] = useState<string[]>(['deadlines', 'meetings']);
  const [quietHours, setQuietHours] = useState('night');
  const [realtime, setRealtime] = useState(true);

  const toggleFocus = (id: string) => {
    setFocusSelected((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    // TODO: POST preferences to backend
    router.replace('/(onboarding)/connect');
  };

  return (
    <LinearGradient
      colors={[Colors.midnight, Colors.midnight2]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.step}>Step 2 of 2</Text>
          <Text style={styles.title}>Set Your Preferences</Text>
          <Text style={styles.subtitle}>
            Configure how the AI Sieve surfaces your obligations.
          </Text>
        </View>

        {/* Focus Areas */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Focus Areas</Text>
          <Text style={styles.sectionHint}>What types of obligations matter most to you?</Text>
          <View style={styles.pillsGrid}>
            {FOCUS_OPTIONS.map((opt) => {
              const active = focusSelected.includes(opt.id);
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => toggleFocus(opt.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.pillIcon}>{opt.icon}</Text>
                  <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notifications</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Real-time Alerts</Text>
              <Text style={styles.settingDesc}>Get notified as soon as an obligation is extracted.</Text>
            </View>
            <Switch
              value={realtime}
              onValueChange={setRealtime}
              trackColor={{ false: Colors.surface, true: Colors.accent }}
              thumbColor={Colors.snow}
            />
          </View>

          <View style={styles.subSection}>
            <Text style={styles.subSectionLabel}>Quiet Hours</Text>
            {QUIET_HOUR_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.radioRow, opt.disabled && styles.radioRowDisabled]}
                onPress={() => !opt.disabled && setQuietHours(opt.id)}
                activeOpacity={0.8}
                disabled={opt.disabled}
              >
                <View style={[
                  styles.radioCircle,
                  quietHours === opt.id && styles.radioCircleActive,
                ]}>
                  {quietHours === opt.id && <View style={styles.radioDot} />}
                </View>
                <Text style={[
                  styles.radioLabel,
                  opt.disabled && styles.radioLabelDisabled,
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            You can fine-tune every setting later from the Notification Hub in your Profile.
          </Text>
        </View>
      </ScrollView>

      {/* Continue */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueText}>Continue → Connect Channels</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.midnight },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 72,
    paddingBottom: 140,
    gap: Spacing.lg,
  },
  header: { gap: Spacing.xs },
  step: { fontSize: FontSizes.xs, color: Colors.accentSoft, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase' },
  title: { fontSize: FontSizes['2xl'], color: Colors.snow, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: FontSizes.base, color: Colors.snowMuted, lineHeight: 22 },
  section: { gap: Spacing.sm },
  sectionLabel: { fontSize: FontSizes.md, color: Colors.snow, fontWeight: '600' },
  sectionHint: { fontSize: FontSizes.sm, color: Colors.snowFaint },
  pillsGrid: { gap: Spacing.xs },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  pillActive: { borderColor: Colors.accent, backgroundColor: `${Colors.accent}18` },
  pillIcon: { fontSize: 18 },
  pillLabel: { fontSize: FontSizes.base, color: Colors.snowMuted, fontWeight: '500' },
  pillLabelActive: { color: Colors.accentSoft },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingText: { flex: 1, gap: 3, paddingRight: Spacing.sm },
  settingTitle: { fontSize: FontSizes.base, color: Colors.snow, fontWeight: '500' },
  settingDesc: { fontSize: FontSizes.xs, color: Colors.snowFaint, lineHeight: 16 },
  subSection: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  subSectionLabel: { fontSize: FontSizes.sm, color: Colors.snowMuted, fontWeight: '500', marginBottom: 2 },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  radioRowDisabled: { opacity: 0.4 },
  radioCircle: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: Colors.borderStrong,
    alignItems: 'center', justifyContent: 'center',
  },
  radioCircleActive: { borderColor: Colors.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.accent },
  radioLabel: { fontSize: FontSizes.base, color: Colors.snow },
  radioLabelDisabled: { color: Colors.snowFaint },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  infoIcon: { fontSize: 16 },
  infoText: { flex: 1, fontSize: FontSizes.sm, color: Colors.snowMuted, lineHeight: 20 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.lg, paddingBottom: 40,
    backgroundColor: Colors.midnight,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  continueButton: {
    backgroundColor: Colors.accent, borderRadius: Radius.md,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: Colors.accent, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 16,
  },
  continueText: { fontSize: FontSizes.base, color: Colors.snow, fontWeight: '600' },
});
