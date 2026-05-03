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

import { useLogin } from '@/features/auth/hooks/useLogin';
import { ThemedText } from '@/shared/components/theme/ThemedText';
import { ThemedTextInput } from '@/shared/components/theme/ThemedTextInput';
import AnimatedButton from '@/shared/components/ui/AnimatedButton';
import { ImagesPath } from '@/shared/constants/images';
import { useLoginTheme } from '@/shared/hooks/theme/useLoginTheme';
import { router } from 'expo-router';
import { Radius, Spacing, Typography } from '@/shared/constants/theme';

export default function LoginScreen() {
  const { googleBg, googleText, googleBorder } = useLoginTheme();

  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    errors,
    handleLoginWithEmail,
    googleSignIn,
    forgotPassword,
  } = useLogin();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <View style={styles.page}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* HEADER (CENTERED) */}
            <View style={styles.header}>
              <Image
                source={ImagesPath.logo}
                style={styles.logo}
                resizeMode="contain"
              />

              <ThemedText type="subtitle" style={styles.title}>
                Welcome to eFund
              </ThemedText>

              <ThemedText type="description" style={styles.subtitle}>
                Sign in to continue
              </ThemedText>
            </View>

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

            {/* FORGOT */}
            <TouchableOpacity
              onPress={() => forgotPassword(email)}
              style={styles.forgotContainer}
            >
              <ThemedText type="caption" style={styles.forgotText}>
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>

            {/* LOGIN BUTTON */}
            <AnimatedButton
              label={loading ? 'Signing In...' : 'Sign In'}
              onPress={() => handleLoginWithEmail(email, password)}
            />

            {/* SIGN UP */}
            <View style={styles.signUpContainer}>
              <ThemedText type="caption" style={styles.signUpText}>
                Don&apos;t have an account?{' '}
              </ThemedText>

              <TouchableOpacity onPress={() => router.replace('/auth/sign-up')}>
                <ThemedText type="caption" style={styles.signUpLink}>
                  Sign Up
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* DIVIDER */}
            <View style={styles.separatorContainer}>
              <View style={styles.line} />
              <ThemedText type="caption" style={styles.separatorText}>
                Sign in with
              </ThemedText>
              <View style={styles.line} />
            </View>

            {/* GOOGLE */}
            <TouchableOpacity
              style={[
                styles.googleButton,
                { backgroundColor: googleBg, borderColor: googleBorder },
              ]}
              onPress={googleSignIn}
            >
              <Ionicons name="logo-google" size={20} color={googleText} />
              <ThemedText style={[styles.googleText, { color: googleText }]}>
                Continue with Google
              </ThemedText>
            </TouchableOpacity>

            {/* TERMS */}
            <ThemedText type="caption" style={styles.terms}>
              By continuing, you agree to our Terms & Privacy Policy
            </ThemedText>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  scrollContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['2xl'],
  },

  card: {
    width: '100%',
    padding: Spacing.md,
  },

  header: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  logo: {
    width: 150,
    height: 150,
    marginBottom: Spacing.xs,
  },

  title: {
    fontSize: Typography.size.xl,
    fontFamily: Typography.fontFamily.bold,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: Typography.size.base,
    fontFamily: Typography.fontFamily.regular,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  input: {
    width: '100%',
  },

  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.sm,
  },

  forgotText: {
    fontSize: Typography.size.sm,
    fontFamily: Typography.fontFamily.medium,
    color: '#007AFF',
  },

  signUpContainer: {
    marginVertical: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  signUpText: {
    fontSize: Typography.size.sm,
    color: '#666',
  },

  signUpLink: {
    fontSize: Typography.size.sm,
    color: '#007AFF',
  },

  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: Spacing.sm,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },

  separatorText: {
    marginHorizontal: Spacing.sm,
    fontSize: Typography.size.sm,
    color: '#666',
  },

  googleButton: {
    width: '100%',
    height: 52,
    borderRadius: Radius.full,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },

  googleText: {
    fontSize: Typography.size.base,
    fontFamily: Typography.fontFamily.medium,
  },

  terms: {
    textAlign: 'center',
    opacity: 0.6,
    marginTop: Spacing.xs,
    fontSize: Typography.size.sm,
  },
});
