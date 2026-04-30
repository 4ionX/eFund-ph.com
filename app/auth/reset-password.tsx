import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedTextInput } from '@/shared/components/theme/ThemedTextInput';
import AnimatedButton from '@/shared/components/ui/AnimatedButton';
import { ImagesPath } from '@/shared/constants/images';
import { Spacing, Typography } from '@/shared/constants/theme';
import { useResetPassword } from '@/features/auth/hooks/useResetPassword';
import { router } from 'expo-router';

export default function ResetPasswordScreen() {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    errors,
    handleResetPassword,
  } = useResetPassword();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sheetContent}>
          {/* Logo */}
          <Image
            source={ImagesPath.logo}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Title */}
          <ThemedText type="subtitle" style={styles.title}>
            Reset Your Password
          </ThemedText>

          {/* Subtitle */}
          <ThemedText type="description" style={styles.subtitle}>
            Enter a new password to continue
          </ThemedText>

          {/* Password Input */}
          <ThemedTextInput
            placeholder="New Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            error={!!errors.password}
            errorMessage={errors.password}
            leftIcon={<Ionicons name="lock-closed" size={20} color="#888" />}
            rightIcon={
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#888"
              />
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
            style={styles.input}
          />

          {/* Confirm Password Input */}
          <ThemedTextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            error={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword}
            leftIcon={<Ionicons name="lock-closed" size={20} color="#888" />}
            rightIcon={
              <Ionicons
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#888"
              />
            }
            onRightIconPress={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            style={styles.input}
          />

          {/* Reset Button */}
          <AnimatedButton
            label={loading ? 'Resetting Password...' : 'Reset Password'}
            onPress={handleResetPassword}
          />

          {/* Back to Login */}
          <TouchableOpacity
            style={{ marginTop: Spacing.md }}
            onPress={() => router.back()} // closes sheet / go back
          >
            <ThemedText type="caption" style={{ color: '#007AFF' }}>
              Back to Login
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingTop: Spacing['2xl'] },
  sheetContent: { padding: Spacing.md, alignItems: 'center', gap: Spacing.xs },
  logo: { width: 150, height: 150, marginBottom: Spacing.xs },
  title: {
    marginBottom: 2,
    fontSize: Typography.size.xl,
    fontFamily: Typography.fontFamily.bold,
  },
  subtitle: {
    marginBottom: Spacing.sm,
    fontSize: Typography.size.base,
    fontFamily: Typography.fontFamily.regular,
  },
  input: { width: '100%' },
});
