import { supabaseClient } from '@/core/api/supabaseClient';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export const signInWithGoogle = async () => {
  try {
    const redirectUri = AuthSession.makeRedirectUri({ scheme: 'efund' });
    console.log('Redirect URI:', redirectUri);

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUri, skipBrowserRedirect: true },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('No OAuth URL returned');

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    if (result.type !== 'success') throw new Error('Login cancelled');

    // 🔥 Parse fragment manually
    const url = result.url!;
    const fragment = url.split('#')[1];
    if (!fragment) throw new Error('No fragment in URL');

    const params = new URLSearchParams(fragment);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (!access_token || !refresh_token)
      throw new Error('No tokens returned from OAuth');

    // Set Supabase session
    await supabaseClient.auth.setSession({ access_token, refresh_token });

    // Update user state
    const { data: sessionData } = await supabaseClient.auth.getSession();

    console.log('✅ Current User:', sessionData.session?.user);
    return sessionData.session?.user;
  } catch (err: any) {
    console.error('Google login error:', err.message);
    throw err;
  }
};
