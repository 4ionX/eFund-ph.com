import { Colors } from '@/shared/constants/theme';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ThemedText } from '../theme/ThemedText';

const LoadingOverlay = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={Colors.brand.primary} />
      <ThemedText type="default" style={styles.text}>
        Loading...
      </ThemedText>
    </View>
  );
};

export default LoadingOverlay;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 50,
    backgroundColor: 'rgba(124, 120, 120, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    marginTop: 8,
  },
});
