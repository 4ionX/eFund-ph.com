import React from 'react';
import { render } from '@testing-library/react-native';
import RootLayout from '@/app/_layout';

// ✅ Supabase mock
jest.mock('@/core/api/supabaseClient', () => ({
  supabaseClient: {},
}));

// ✅ Auth mock
jest.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// ✅ IMPORTANT: startup hooks
jest.mock('@/shared/hooks/theme/useLoadFonts', () => ({
  __esModule: true,
  default: () => true,
}));

jest.mock('@/shared/hooks/theme/useSplash', () => ({
  __esModule: true,
  default: () => true,
}));

jest.mock('@/shared/hooks/theme/useColorScheme', () => ({
  useColorScheme: () => 'light',
}));

describe('RootLayout Integration Test', () => {
  const { useAuth } = require('@/features/auth/hooks/useAuth');

  it('renders when NOT authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    const { toJSON } = render(<RootLayout />);
    expect(toJSON()).not.toBeNull();
  });

  it('renders when authenticated', () => {
    useAuth.mockReturnValue({
      user: { id: '123' },
      isLoading: false,
    });

    const { toJSON } = render(<RootLayout />);
    expect(toJSON()).not.toBeNull();
  });

  it('returns null when loading', () => {
    useAuth.mockReturnValue({
      user: null,
      isLoading: true,
    });

    const { toJSON } = render(<RootLayout />);
    expect(toJSON()).toBeNull();
  });
});
