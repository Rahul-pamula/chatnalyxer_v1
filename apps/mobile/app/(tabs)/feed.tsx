import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Dimensions, PanResponder, Animated as RNAnimated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef } from 'react';
import { Colors, FontSizes, Spacing, Radius } from '@/constants/design';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.35;

// Mock tasks until AI backend is wired
const MOCK_TASKS = [
  {
    id: '1',
    title: 'Submit assignment by tonight',
    source: 'WhatsApp · Study Group',
    time: 'Due today, 11:59 PM',
    importance: 0.95,
    channel: 'whatsapp',
  },
  {
    id: '2',
    title: 'Reply to Prof. Sharma about project extension',
    source: 'WhatsApp · College Chat',
    time: 'No deadline set',
    importance: 0.72,
    channel: 'whatsapp',
  },
  {
    id: '3',
    title: 'Pay hostel fees before 20th',
    source: 'Email · admin@university.edu',
    time: 'Due Apr 20',
    importance: 0.88,
    channel: 'email',
  },
];

type Task = (typeof MOCK_TASKS)[0];

export default function FeedScreen() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [peeking, setPeeking] = useState(false);
  const [toast, setToast] = useState<{ message: string; taskId: string } | null>(null);

  const dismissTask = (id: string, action: 'accept' | 'ignore') => {
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setToast({
      message: action === 'accept' ? '✅ Task accepted' : '🗑 Task ignored. Undo?',
      taskId: id,
    });
    setTimeout(() => setToast(null), 5000);
  };

  const restoreTask = (id: string) => {
    const task = MOCK_TASKS.find((t) => t.id === id);
    if (task) {
      setTasks((prev) => [task, ...prev]);
      setToast(null);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.midnight, Colors.midnight2]} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Obligation Feed</Text>
          <Text style={styles.headerSub}>
            {tasks.length > 0 ? `${tasks.length} items need triage` : 'All clear ✓'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.peekButton, peeking && styles.peekButtonActive]}
          onPress={() => setPeeking(!peeking)}
          activeOpacity={0.8}
        >
          <Text style={styles.peekIcon}>{peeking ? '👁' : '🫣'}</Text>
          <Text style={styles.peekText}>{peeking ? 'Visible' : 'Private'}</Text>
        </TouchableOpacity>
      </View>

      {/* Feed */}
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎉</Text>
          <Text style={styles.emptyTitle}>Inbox Clean</Text>
          <Text style={styles.emptySubtitle}>
            We'll notify you the moment new obligations are extracted from your channels.
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <SwipeableTaskCard
              task={item}
              peeking={peeking}
              onAccept={() => dismissTask(item.id, 'accept')}
              onIgnore={() => dismissTask(item.id, 'ignore')}
            />
          )}
        />
      )}

      {/* Undo Toast */}
      {toast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast.message}</Text>
          {toast.message.includes('Undo') && (
            <TouchableOpacity onPress={() => restoreTask(toast.taskId)}>
              <Text style={styles.toastUndo}>RESTORE</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

function SwipeableTaskCard({
  task, peeking, onAccept, onIgnore,
}: {
  task: Task; peeking: boolean;
  onAccept: () => void; onIgnore: () => void;
}) {
  const pan = useRef(new RNAnimated.Value(0)).current;
  const opacity = useRef(new RNAnimated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx }) => pan.setValue(dx),
      onPanResponderRelease: (_, { dx }) => {
        if (dx > SWIPE_THRESHOLD) {
          RNAnimated.timing(pan, { toValue: width, duration: 250, useNativeDriver: true }).start(onAccept);
        } else if (dx < -SWIPE_THRESHOLD) {
          RNAnimated.timing(pan, { toValue: -width, duration: 250, useNativeDriver: true }).start(onIgnore);
        } else {
          RNAnimated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const rotate = pan.interpolate({ inputRange: [-width, 0, width], outputRange: ['-8deg', '0deg', '8deg'] });
  const acceptOpacity = pan.interpolate({ inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp' });
  const ignoreOpacity = pan.interpolate({ inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp' });

  const importanceDot = task.importance > 0.85 ? Colors.danger : task.importance > 0.65 ? Colors.warning : Colors.success;

  return (
    <RNAnimated.View
      style={[styles.card, { transform: [{ translateX: pan }, { rotate }] }]}
      {...panResponder.panHandlers}
    >
      {/* Accept overlay */}
      <RNAnimated.View style={[styles.swipeLabel, styles.swipeLabelRight, { opacity: acceptOpacity }]}>
        <Text style={styles.swipeLabelText}>✓ ACCEPT</Text>
      </RNAnimated.View>

      {/* Ignore overlay */}
      <RNAnimated.View style={[styles.swipeLabel, styles.swipeLabelLeft, { opacity: ignoreOpacity }]}>
        <Text style={[styles.swipeLabelText, { color: Colors.danger }]}>✕ IGNORE</Text>
      </RNAnimated.View>

      {/* Card content */}
      <View style={styles.cardHeader}>
        <View style={[styles.importanceDot, { backgroundColor: importanceDot }]} />
        <Text style={styles.cardSource}>{task.source}</Text>
        <Text style={styles.cardTime}>{task.time}</Text>
      </View>

      <Text style={[styles.cardTitle, !peeking && styles.cardTitleBlurred]}>
        {peeking ? task.title : '••••••••••••••••••••'}
      </Text>

      {/* Action buttons */}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionIgnore} onPress={onIgnore} activeOpacity={0.8}>
          <Text style={styles.actionIgnoreText}>✕ Ignore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionAccept} onPress={onAccept} activeOpacity={0.8}>
          <Text style={styles.actionAcceptText}>✓ Accept</Text>
        </TouchableOpacity>
      </View>
    </RNAnimated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.midnight },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 64, paddingBottom: Spacing.md,
  },
  headerTitle: { fontSize: FontSizes.xl, color: Colors.snow, fontWeight: '700' },
  headerSub: { fontSize: FontSizes.sm, color: Colors.snowMuted, marginTop: 2 },
  peekButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surface, paddingHorizontal: Spacing.md,
    paddingVertical: 8, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.border,
  },
  peekButtonActive: { borderColor: Colors.accent, backgroundColor: `${Colors.accent}18` },
  peekIcon: { fontSize: 16 },
  peekText: { fontSize: FontSizes.xs, color: Colors.snowMuted, fontWeight: '500' },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: 120, gap: Spacing.sm },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
    gap: Spacing.sm, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12,
  },
  swipeLabel: {
    position: 'absolute', top: 16, zIndex: 10,
    backgroundColor: 'transparent',
  },
  swipeLabelRight: { right: 16 },
  swipeLabelLeft: { left: 16 },
  swipeLabelText: { fontSize: FontSizes.sm, color: Colors.success, fontWeight: '700', letterSpacing: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  importanceDot: { width: 8, height: 8, borderRadius: 4 },
  cardSource: { flex: 1, fontSize: FontSizes.xs, color: Colors.snowMuted, fontWeight: '500' },
  cardTime: { fontSize: FontSizes.xs, color: Colors.snowFaint },
  cardTitle: { fontSize: FontSizes.md, color: Colors.snow, fontWeight: '600', lineHeight: 24 },
  cardTitleBlurred: { color: Colors.snowFaint, letterSpacing: 4 },
  cardActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: 4 },
  actionIgnore: {
    flex: 1, paddingVertical: 10, borderRadius: Radius.md,
    backgroundColor: `${Colors.danger}15`, borderWidth: 1, borderColor: `${Colors.danger}40`,
    alignItems: 'center',
  },
  actionIgnoreText: { color: Colors.danger, fontWeight: '600', fontSize: FontSizes.sm },
  actionAccept: {
    flex: 1, paddingVertical: 10, borderRadius: Radius.md,
    backgroundColor: `${Colors.success}15`, borderWidth: 1, borderColor: `${Colors.success}40`,
    alignItems: 'center',
  },
  actionAcceptText: { color: Colors.success, fontWeight: '600', fontSize: FontSizes.sm },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, padding: Spacing.lg },
  emptyIcon: { fontSize: 56 },
  emptyTitle: { fontSize: FontSizes.xl, color: Colors.snow, fontWeight: '700' },
  emptySubtitle: { fontSize: FontSizes.base, color: Colors.snowMuted, textAlign: 'center', lineHeight: 23 },
  toast: {
    position: 'absolute', bottom: 100, left: Spacing.lg, right: Spacing.lg,
    backgroundColor: Colors.surfaceAlt, borderRadius: Radius.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderStrong,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12,
  },
  toastText: { fontSize: FontSizes.sm, color: Colors.snow, fontWeight: '500' },
  toastUndo: { fontSize: FontSizes.sm, color: Colors.accent, fontWeight: '700', letterSpacing: 0.5 },
});
