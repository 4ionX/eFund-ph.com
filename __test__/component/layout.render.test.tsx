import React from 'react';
import { render } from '@testing-library/react-native';
import RootLayout from '@/app/_layout';

jest.mock('@/core/api/supabaseClient', () => ({
  supabaseClient: {
    auth: {
      getUser: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
    })),
  },
}));

jest.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({ user: null, isLoading: false }),
}));

jest.mock('@/shared/hooks/theme/useSplash', () => ({
  __esModule: true,
  default: () => ({ appIsReady: true }),
}));

jest.mock('@/shared/hooks/theme/useLoadFonts', () => ({
  __esModule: true,
  default: () => true,
}));

describe('RootLayout Component', () => {
  it('should render layout when ready', () => {
    const { toJSON } = render(<RootLayout />);
    expect(toJSON()).not.toBeNull();
  });
});
