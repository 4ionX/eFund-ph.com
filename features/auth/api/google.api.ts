import { supabaseClient } from '@/core/api/supabaseClient';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export const signInWithGoogle = async () => {
  try {
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'efund',
      path: 'auth/callback',
    });

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo:
          Platform.OS === 'web' ? window.location.origin : redirectUri,
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('No OAuth URL');

    // 🌐 WEB
    if (Platform.OS === 'web') {
      window.location.href = data.url;
      return;
    }

    // 📱 MOBILE
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    if (result.type !== 'success') {
      throw new Error('Login cancelled');
    }

    const { data: session } = await supabaseClient.auth.getSession();

    return session.session?.user;
  } catch (err: any) {
    console.error('Google login error:', err.message);
    throw err;
  }
};
