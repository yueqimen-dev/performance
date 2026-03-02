import { create } from 'zustand';

export type UserRole = 'free' | 'pending' | 'active';

interface UserState {
  role: UserRole;
  isGA4Connected: boolean;
  setRole: (role: UserRole) => void;
  setGA4Connected: (connected: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  role: 'free', // Default state as per requirements
  isGA4Connected: true,
  setRole: (role) => set({ role }),
  setGA4Connected: (connected) => set({ isGA4Connected: connected }),
}));
