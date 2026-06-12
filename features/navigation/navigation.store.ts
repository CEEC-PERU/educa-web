import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type NavigationUiState = {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  toggleSidebarCollapsed: () => void;
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (value: boolean) => void;
  toggleMobileSidebar: () => void;
};

export const useNavigationStore = create<NavigationUiState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      setSidebarCollapsed: (value) => set({ isSidebarCollapsed: value }),
      toggleSidebarCollapsed: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      isMobileSidebarOpen: false,
      setMobileSidebarOpen: (value) => set({ isMobileSidebarOpen: value }),
      toggleMobileSidebar: () =>
        set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
    }),
    {
      name: "navigation-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
    },
  ),
);
