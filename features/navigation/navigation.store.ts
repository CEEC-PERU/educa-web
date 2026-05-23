import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type NavigationUiState = {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  toggleSidebarCollapsed: () => void;
};

export const useNavigationStore = create<NavigationUiState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      setSidebarCollapsed: (value) => set({ isSidebarCollapsed: value }),
      toggleSidebarCollapsed: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    }),
    {
      name: "navigation-ui",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
