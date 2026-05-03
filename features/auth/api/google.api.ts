import { supabaseClient } from '@/core/api/supabaseClient';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export const signInWithGoogle = async () => {
  try {
    // ✅ Correct redirect URI
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'efund',
      path: 'auth/callback',
    });

    console.log('Redirect URI:', redirectUri);

    // 🔐 Start OAuth request
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('No OAuth URL returned');

    // 🌐 WEB handling (important fix)
    if (Platform.OS === 'web') {
      window.location.href = data.url;
      return;
    }

    // 📱 MOBILE handling
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    if (result.type !== 'success') {
      throw new Error('Login cancelled');
    }

    // 🔥 FIX: Supabase already handles session internally
    // No need to manually parse fragments anymore

    const { data: sessionData, error: sessionError } =
      await supabaseClient.auth.getSession();

    if (sessionError) throw sessionError;

    console.log('✅ Current User:', sessionData.session?.user);

    return sessionData.session?.user;
  } catch (err: any) {
    console.error('Google login error:', err.message);
    throw err;
  }
};
