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
      {/* PAGE WRAPPER (CENTER FIX FOR WEB) */}
      <View style={styles.page}>
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

            {/* Email */}
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

            {/* Password */}
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

            {/* Confirm Password */}
            <ThemedTextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
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

            {/* Button */}
            <AnimatedButton
              label={loading ? 'Creating Account...' : 'Sign Up'}
              onPress={handleSignup}
            />

            {/* Back login */}
            <TouchableOpacity
              style={{ marginTop: Spacing.md }}
              onPress={() => router.replace('/auth/login')}
            >
              <ThemedText
                type="caption"
                style={{
                  color: '#007AFF',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
              >
                Back to Login
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  page: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 480, // 🔥 same as login (mobile-like web)
    paddingTop: Spacing['2xl'],
  },

  sheetContent: {
    padding: Spacing.md,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'stretch', // 🔥 FIX INPUT FULL WIDTH
    gap: Spacing.xs,
  },

  logo: {
    width: 150,
    height: 150,
    marginBottom: Spacing.xs,
    alignSelf: 'center',
  },

  title: {
    marginBottom: 2,
    fontSize: Typography.size.xl,
    fontFamily: Typography.fontFamily.bold,
    textAlign: 'center', // 🔥 CENTER FIX
  },

  subtitle: {
    marginBottom: Spacing.sm,
    fontSize: Typography.size.base,
    fontFamily: Typography.fontFamily.regular,
    textAlign: 'center',
  },

  input: {
    width: '100%',
  },
});
