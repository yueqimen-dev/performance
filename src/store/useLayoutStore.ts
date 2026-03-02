import { create } from 'zustand';

interface LayoutState {
  isSidebarCollapsed: boolean;
  isChatOpen: boolean;
  initialMessage: string;
  toggleSidebar: () => void;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setInitialMessage: (msg: string) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  isSidebarCollapsed: false,
  isChatOpen: false,
  initialMessage: '',
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  setChatOpen: (open) => set({ isChatOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  setInitialMessage: (msg) => set({ initialMessage: msg }),
}));
