import { create } from 'zustand'

type Credentials = {
  email: string;
};

type User = Credentials & {
  address: string;
  uuid: string;
};

type AuthError = {
  error: string;
};

interface AuthState {
  user: User | null;
  login: (user: User) => void | AuthError;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  login: (newUser) => set(() => ({ user: newUser })),
  logout: () => set(() => ({ user: null })),
}))
