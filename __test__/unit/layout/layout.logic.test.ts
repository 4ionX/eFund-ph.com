type AuthUser = {
  id: string;
};

describe('Auth logic', () => {
  it('should detect authenticated user', () => {
    const user: AuthUser | null = { id: '123' };

    const isAuthenticated = Boolean((user as AuthUser | null)?.id);

    expect(isAuthenticated).toBe(true);
  });

  it('should detect unauthenticated user', () => {
    const user: AuthUser | null = null;

    const isAuthenticated = Boolean((user as AuthUser | null)?.id);

    expect(isAuthenticated).toBe(false);
  });
});
