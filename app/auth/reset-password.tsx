import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Linking,
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
import { supabaseClient } from '@/core/api/supabaseClient';

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

  useEffect(() => {
    const handleUrl = async (url: string | null) => {
      if (!url) return;

      try {
        const { error } = await supabaseClient.auth.exchangeCodeForSession(url);

        if (error) {
          console.log('Auth error:', error.message);
        }
      } catch (e) {
        console.log(e);
      }
    };

    if (Platform.OS === 'web') {
      handleUrl(window.location.href);
      return;
    }

    Linking.getInitialURL().then(handleUrl);

    const sub = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });

    return () => sub.remove();
  }, []);

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
    </KeyboardAvoidingView>
  );
}

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
  input: { width: '100%' },
});
