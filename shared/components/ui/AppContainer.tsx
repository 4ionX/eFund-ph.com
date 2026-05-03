// shared/components/layout/AppContainer.tsx
import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

export default function AppContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.root}>
      <View style={[styles.container, width > 768 && styles.desktop]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  desktop: {
    maxWidth: 768,
  },
});
