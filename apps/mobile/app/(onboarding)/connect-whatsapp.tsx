import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import { Colors, FontSizes, Spacing, Radius } from '@/constants/design';

export default function ConnectWhatsAppScreen() {
  return (
    <LinearGradient
      colors={[Colors.midnight, Colors.midnight2]}
      style={styles.container}
    >
      <Stack.Screen options={{ title: 'WhatsApp Connection', headerShown: true, headerStyle: { backgroundColor: Colors.midnight }, headerTintColor: Colors.snow }} />
      
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>💬</Text>
        </View>
        <Text style={styles.title}>Connect WhatsApp</Text>
        <Text style={styles.subtitle}>
          Securely link your WhatsApp account to let the AI Sieve monitor your designated groups.
        </Text>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>WhatsApp QR Code / Auth Flow Placeholder</Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: Spacing.xl, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  iconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#25D36620', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  icon: { fontSize: 40 },
  title: { fontSize: FontSizes['2xl'], color: Colors.snow, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: FontSizes.base, color: Colors.snowMuted, textAlign: 'center', lineHeight: 22 },
  placeholderCard: { width: '100%', height: 200, backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' },
  placeholderText: { color: Colors.snowFaint, fontSize: FontSizes.sm },
  button: { backgroundColor: Colors.surfaceAlt, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.borderStrong },
  buttonText: { color: Colors.snow, fontWeight: '600' },
});
