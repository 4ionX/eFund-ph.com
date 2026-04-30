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

import { useSignup } from '@/features/auth/hooks/useSignUp';
import { router } from 'expo-router';

export default function SignupScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    loading,
    errors,
    handleSignup,
    showConfirmPassword,
    setShowConfirmPassword,
  } = useSignup();

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
            Create Your Account
          </ThemedText>

          {/* Subtitle */}
          <ThemedText type="description" style={styles.subtitle}>
            Sign up to get started
          </ThemedText>

          {/* Email Input */}
          <ThemedTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            error={!!errors.email}
            errorMessage={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Ionicons name="mail" size={20} color="#888" />}
            style={styles.input}
          />

          {/* Password Input */}
          <ThemedTextInput
            placeholder="Password"
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
            secureTextEntry={!showConfirmPassword} // ✅ FIXED
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

          {/* Signup Button */}
          <AnimatedButton
            label={loading ? 'Creating Account...' : 'Sign Up'}
            onPress={handleSignup}
          />

          {/* Back to Login */}
          <TouchableOpacity
            style={{ marginTop: Spacing.md }}
            onPress={() => router.replace('/auth/login')}
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
