import { Modal, View, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { ThemedText } from '@/shared/components/theme/ThemedText';

export default function CongratsModal({ visible, onProceed, onSkip }: any) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View entering={ZoomIn} style={styles.card}>
          <Animated.Text entering={FadeIn.delay(200)} style={styles.emoji}>
            🎉
          </Animated.Text>

          <ThemedText style={styles.title}>Congratulations!</ThemedText>

          <ThemedText style={styles.subtitle}>
            Your registration is complete. Do you want to proceed to loan
            application?
          </ThemedText>

          {/* BUTTONS */}
          <View style={styles.buttons}>
            {/* SKIP */}
            <Pressable onPress={onSkip} style={styles.skipBtn}>
              <ThemedText style={styles.skipText}>Skip</ThemedText>
            </Pressable>

            {/* PROCEED */}
            <Pressable onPress={onProceed} style={styles.primaryBtn}>
              <ThemedText style={{ color: '#fff' }}>Proceed</ThemedText>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },

  emoji: {
    fontSize: 40,
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },

  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 20,
  },

  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'space-between',
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  skipBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },

  skipText: {
    color: '#666',
  },
});
