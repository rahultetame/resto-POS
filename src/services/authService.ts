import type { StoredUser } from '../utils/storage';

type LoginPayload = {
  email: string;
  password: string;
};

export const authService = {
  login: async ({ email }: LoginPayload): Promise<{ token: string; userDetails: StoredUser }> => {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 450);
    });

    return {
      token: crypto.randomUUID(),
      userDetails: {
        id: 'USR-1001',
        name: email.split('@')[0] || 'Restaurant Manager',
        email,
        role: 'Manager',
      },
    };
  },
};
