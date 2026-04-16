import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { Colors, FontSizes, Spacing, Radius } from '@/constants/design';

const PERSONAS = [
  {
    id: 'student',
    icon: '🎓',
    title: 'Student',
    description: 'Assignment deadlines, exam dates, study group meetups, and club activities.',
    aiHint: 'AI weights: Academic deadlines > Social > Admin',
    color: '#7B61FF',
  },
  {
    id: 'faculty',
    icon: '📚',
    title: 'Faculty',
    description: 'Lecture schedules, office hours, research deadlines, and student coordination.',
    aiHint: 'AI weights: Research > Teaching > Admin',
    color: '#34D399',
  },
  {
    id: 'professional',
    icon: '💼',
    title: 'Professional',
    description: 'Project deliverables, client actions, team follow-ups, and corporate bookings.',
    aiHint: 'AI weights: Client tasks > Deliverables > Meetings',
    color: '#FBBF24',
  },
];

export default function PersonaScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    if (selected) {
      buttonOpacity.value = withTiming(1, { duration: 300 });
    } else {
      buttonOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [selected]);

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonOpacity.value === 0 ? 10 : 0 }],
  }));

  const handleContinue = () => {
    if (!selected) return;
    // TODO: POST /user/profile { archetype: selected }
    router.replace('/(onboarding)/preferences' as any);
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
          <Text style={styles.step}>Step 1 of 2</Text>
          <Text style={styles.title}>Who are you?</Text>
          <Text style={styles.subtitle}>
            This trains your AI Sieve to filter noise{'\n'}
            and focus on what matters to you.
          </Text>
        </View>

        {/* Persona Cards */}
        <View style={styles.cards}>
          {PERSONAS.map((persona, index) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              selected={selected === persona.id}
              onSelect={() => setSelected(persona.id)}
              delay={index * 100}
            />
          ))}
        </View>

        {/* Tooltip */}
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            💡 You can switch your role anytime from the Profile Hub.
          </Text>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <Animated.View style={[styles.footer, buttonStyle]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selected && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueText}>
            Continue as{' '}
            {selected ? PERSONAS.find((p) => p.id === selected)?.title : '...'}
          </Text>
          <Text style={styles.continueArrow}>→</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

function PersonaCard({
  persona,
  selected,
  onSelect,
  delay,
}: {
  persona: (typeof PERSONAS)[0];
  selected: boolean;
  onSelect: () => void;
  delay: number;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20 }));
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.97, { damping: 15 }, () => {
      scale.value = withSpring(1);
    });
    onSelect();
  };

  return (
    <Animated.View style={cardStyle}>
      <TouchableOpacity
        style={[
          styles.card,
          selected && {
            borderColor: persona.color,
            backgroundColor: `${persona.color}15`,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.cardTop}>
          <View style={[styles.iconWrap, { backgroundColor: `${persona.color}20` }]}>
            <Text style={styles.icon}>{persona.icon}</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{persona.title}</Text>
            <Text style={styles.cardDescription}>{persona.description}</Text>
          </View>
          <View style={[
            styles.radio,
            selected && { backgroundColor: persona.color, borderColor: persona.color }
          ]}>
            {selected && <Text style={styles.radioCheck}>✓</Text>}
          </View>
        </View>

        {/* AI Hint — shows on select */}
        {selected && (
          <View style={[styles.aiHint, { borderColor: `${persona.color}40` }]}>
            <Text style={[styles.aiHintText, { color: persona.color }]}>
              ⚡ {persona.aiHint}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnight,
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 72,
    paddingBottom: 140,
    gap: Spacing.lg,
  },
  header: {
    gap: Spacing.sm,
  },
  step: {
    fontSize: FontSizes.xs,
    color: Colors.accentSoft,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: FontSizes['2xl'],
    color: Colors.snow,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSizes.base,
    color: Colors.snowMuted,
    lineHeight: 22,
  },
  cards: {
    gap: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: FontSizes.md,
    color: Colors.snow,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: FontSizes.sm,
    color: Colors.snowMuted,
    lineHeight: 19,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioCheck: {
    fontSize: 12,
    color: Colors.snow,
    fontWeight: '700',
  },
  aiHint: {
    borderTopWidth: 1,
    paddingTop: Spacing.sm,
  },
  aiHintText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  tooltip: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tooltipText: {
    fontSize: FontSizes.sm,
    color: Colors.snowMuted,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: 40,
    backgroundColor: Colors.midnight,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  continueButton: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueText: {
    fontSize: FontSizes.base,
    color: Colors.snow,
    fontWeight: '600',
  },
  continueArrow: {
    fontSize: FontSizes.md,
    color: Colors.snow,
  },
});
