import type { ReactNode } from "react";
import ProtectedRoute from "../Auth/ProtectedRoute";
import AppNavbar from "../navigation/AppNavbar";
import AppSidebarContainer from "../../features/navigation/AppSidebarContainer";
import { useNavigationStore } from "../../features/navigation/navigation.store";

const DEFAULT_NAVBAR_COLOR = "bg-navbar-primary";

type AppLayoutProps = {
  children: ReactNode;
  noPadding?: boolean;
  navbarColor?: string;
};

export default function AppLayout({
  children,
  noPadding = false,
  navbarColor = DEFAULT_NAVBAR_COLOR,
}: AppLayoutProps) {
  const { isSidebarCollapsed, isMobileSidebarOpen, setMobileSidebarOpen, toggleMobileSidebar } =
    useNavigationStore();

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col">
        <AppNavbar bgColor={navbarColor} onToggleSidebar={toggleMobileSidebar} />
        <div className="flex flex-1 pt-16">
          <AppSidebarContainer />

          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}

          <main
            className={`flex-grow transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
            } ${noPadding ? "" : "p-6"}`}
          >
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
