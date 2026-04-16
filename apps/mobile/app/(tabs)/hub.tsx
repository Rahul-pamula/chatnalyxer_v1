import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/design';

export default function HubScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hub (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.midnight, justifyContent: 'center', alignItems: 'center' },
  text: { color: Colors.snow, fontSize: 18 },
});
