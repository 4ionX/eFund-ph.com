/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/**
 * Colors, typography, spacing, and radius for the app.
 * Supports light and dark mode, plus brand and semantic colors.
 */

export const Colors = {
  light: {
    background: '#FFFFFF',
    card: '#F8FAFC',
    text: '#0F172A',
    border: '#E2E8F0',
    tint: '#3B82F6',
    notification: '#EF4444',
    icon: '#64748B',
  },

  dark: {
    background: '#0D0D0D',
    card: '#1E293B',
    text: '#F8FAFC',
    border: '#3B3B3B',
    tint: '#3B82F6',
    notification: '#F87171',
    icon: '#94A3B8',
  },

  brand: {
    primary: '#246BFD',
    secondary: '#3CE8B0',
  },

  semantic: {
    error: '#DC2626',
    success: '#16A34A',
    warning: '#F59E0B',
    info: '#0EA5E9',
    disabled: '#94A3B8',
  },
};

/* ======================
   TYPOGRAPHY
====================== */

export const Typography = {
  fontFamily: {
    regular: 'regular',
    medium: 'medium',
    semiBold: 'semiBold',
    bold: 'bold',
  },
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    '2xl': 32,
    '3xl': 38,
    '4xl': 44,
  },
};

/* ======================
   SPACING & RADIUS
====================== */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
};

export const Radius = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 999,
};

export const IconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};
