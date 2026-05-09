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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* HEADER */}
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
            style={styles.forgot}
          >
            <ThemedText type="caption" style={styles.forgotText}>
              Forgot Password?
            </ThemedText>
          </TouchableOpacity>

          {/* LOGIN */}
          <AnimatedButton
            label={loading ? 'Signing In...' : 'Sign In'}
            onPress={() => handleLoginWithEmail(email, password)}
          />

          {/* SIGN UP */}
          <View style={styles.signUp}>
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
          <View style={styles.divider}>
            <View style={styles.line} />
            <ThemedText type="caption" style={styles.dividerText}>
              Sign in with
            </ThemedText>
            <View style={styles.line} />
          </View>

          {/* GOOGLE */}
          <TouchableOpacity
            style={[
              styles.googleBtn,
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

  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  logo: {
    width: 120,
    height: 120,
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
    marginTop: 4,
  },

  input: {
    width: '100%',
  },

  forgot: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
  },

  forgotText: {
    color: '#007AFF',
  },

  signUp: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md,
    flexWrap: 'wrap',
  },

  signUpText: {
    color: '#666',
  },

  signUpLink: {
    color: '#007AFF',
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },

  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ccc',
  },

  dividerText: {
    marginHorizontal: Spacing.sm,
    color: '#666',
  },

  googleBtn: {
    width: '100%',
    height: 52,
    borderRadius: Radius.full,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
  },

  googleText: {
    fontSize: Typography.size.base,
    fontFamily: Typography.fontFamily.medium,
  },

  terms: {
    textAlign: 'center',
    opacity: 0.6,
    marginTop: Spacing.lg,
  },
});
