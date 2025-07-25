import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  authMethod: 'google' | 'email';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  simulateGoogleLogin: () => void;
  simulateEmailLogin: (email: string, password: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (user: User) => {
        set({ user, isAuthenticated: true });
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      simulateGoogleLogin: () => {
        const user: User = {
          id: 'google_' + Date.now(),
          email: 'user@gmail.com',
          name: 'John Doe',
          avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
          authMethod: 'google'
        };
        set({ user, isAuthenticated: true });
      },
      
      simulateEmailLogin: (email: string, password: string) => {
        // Simple validation simulation
        if (email && password.length >= 6) {
          const user: User = {
            id: 'email_' + Date.now(),
            email,
            name: email.split('@')[0],
            authMethod: 'email'
          };
          set({ user, isAuthenticated: true });
        }
      },
    }),
    {
      name: 'lits-auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);