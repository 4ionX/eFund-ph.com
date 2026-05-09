import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/shared/hooks/theme/useColorScheme';
import useLoadFonts from '@/shared/hooks/theme/useLoadFonts';
import useSplash from '@/shared/hooks/theme/useSplash';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppContainer from '@/shared/components/ui/AppContainer';
import { ToastProvider } from '@/shared/context/ToastProvider';
import { useAutoLogout } from '@/features/account/hooks/useAutoLogout';
import { Pressable } from 'react-native';

const queryClient = new QueryClient();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const fontsLoaded = useLoadFonts();
  const appIsReady = useSplash();

  if (!fontsLoaded || !appIsReady) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, isLoading, session } = useAuth();

  const { resetTimer } = useAutoLogout();

  if (isLoading) {
    return null;
  }
  const isAuthenticated =
    !!user?.id &&
    session?.user?.recovery !== true &&
    session?.user?.aud === 'authenticated';

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }} onTouchStart={resetTimer}>
            <BottomSheetModalProvider>
              <ToastProvider>
                <AppContainer>
                  <Stack>
                    {/* Protected Routes */}
                    <Stack.Protected guard={isAuthenticated}>
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="loans/loan-application"
                        options={{
                          presentation: 'modal',
                          headerShown: false,
                        }}
                      />
                      <Stack.Screen
                        name="loans/loan-contract"
                        options={{
                          animation: 'slide_from_right',
                          headerShown: false,
                        }}
                      />
                      <Stack.Screen
                        name="notifications/notification"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="bills/payment"
                        options={{
                          animation: 'slide_from_right',
                          headerShown: false,
                        }}
                      />
                      <Stack.Screen
                        name="account"
                        options={{ headerShown: false }}
                      />

                      <Stack.Screen
                        name="guidelines/loan-steps"
                        options={{
                          animation: 'slide_from_right',
                          headerShown: false,
                        }}
                      />
                      <Stack.Screen
                        name="general/support"
                        options={{
                          animation: 'slide_from_right',
                          headerShown: false,
                        }}
                      />
                      <Stack.Screen
                        name="(aux)/privacy-policy"
                        options={{
                          headerShown: false,
                          animation: 'slide_from_bottom',
                        }}
                      />
                      <Stack.Screen
                        name="(aux)/terms-and-conditions"
                        options={{
                          headerShown: false,
                          animation: 'slide_from_bottom',
                        }}
                      />
                    </Stack.Protected>
                    <Stack.Protected guard={!isAuthenticated}>
                      {/* Public / Auth Routes */}
                      <Stack.Screen
                        name="auth/login"
                        options={{
                          headerShown: false,
                          animation: 'slide_from_right',
                        }}
                      />
                      <Stack.Screen
                        name="auth/reset-password"
                        options={{
                          headerShown: false,
                          animation: 'slide_from_right',
                        }}
                      />
                      <Stack.Screen
                        name="auth/sign-up"
                        options={{
                          headerShown: false,
                          animation: 'slide_from_right',
                        }}
                      />
                    </Stack.Protected>
                  </Stack>
                </AppContainer>
              </ToastProvider>
            </BottomSheetModalProvider>
            <StatusBar style="auto" />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
