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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* LOGO */}
          <Image
            source={ImagesPath.logo}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* TITLE */}
          <ThemedText type="subtitle" style={styles.title}>
            Create Your Account
          </ThemedText>

          <ThemedText type="description" style={styles.subtitle}>
            Sign up to get started
          </ThemedText>

          {/* EMAIL */}
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

          {/* PASSWORD */}
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

          {/* CONFIRM PASSWORD */}
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

          {/* BUTTON */}
          <AnimatedButton
            label={loading ? 'Creating Account...' : 'Sign Up'}
            onPress={handleSignup}
          />

          {/* LOGIN LINK */}
          <TouchableOpacity
            style={styles.backLogin}
            onPress={() => router.replace('/auth/login')}
          >
            <ThemedText type="caption" style={styles.backLoginText}>
              Back to Login
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },

  card: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },

  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },

  title: {
    fontSize: Typography.size.xl,
    fontFamily: Typography.fontFamily.bold,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: Typography.size.base,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: Spacing.md,
  },

  input: {
    width: '100%',
  },

  backLogin: {
    marginTop: Spacing.md,
    alignSelf: 'center',
  },

  backLoginText: {
    color: '#007AFF',
  },
});
