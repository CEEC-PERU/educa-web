import type { ReactNode } from "react";
import ProtectedRoute from "../Auth/ProtectedRoute";
import AppNavbar from "../navigation/AppNavbar";
import AppSidebarContainer from "../../features/navigation/AppSidebarContainer";
import { useNavigationStore } from "../../features/navigation/navigation.store";

const DEFAULT_NAVBAR_COLOR =
  "bg-gradient-to-r from-blue-500 to-violet-500 opacity-90";

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
  const isSidebarCollapsed = useNavigationStore((s) => s.isSidebarCollapsed);

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col">
        <AppNavbar bgColor={navbarColor} />
        <div className="flex flex-1 pt-16">
          <AppSidebarContainer />
          <main
            className={`flex-grow transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? "ml-16" : "ml-64"
            } ${noPadding ? "" : "p-6"}`}
          >
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
