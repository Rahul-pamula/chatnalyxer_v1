import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/design';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>History (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.midnight, justifyContent: 'center', alignItems: 'center' },
  text: { color: Colors.snow, fontSize: 18 },
});
