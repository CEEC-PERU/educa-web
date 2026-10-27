import type { ReactNode } from "react";
import ProtectedRoute from "../Auth/ProtectedRoute";
import AppNavbar from "../navigation/AppNavbar";
import AppSidebarContainer from "../../features/navigation/AppSidebarContainer";
import { useNavigationStore } from "../../features/navigation/navigation.store";
import WhatsAppBubble from "../WhatsAppBubble";

const DEFAULT_NAVBAR_COLOR =
  "bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300";

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
      <div className="relative min-h-screen min-w-0 flex flex-col overflow-x-hidden">
        <AppNavbar bgColor={navbarColor} onToggleSidebar={toggleMobileSidebar} />
        <div className="flex min-w-0 flex-1 pt-16">
          <AppSidebarContainer />

          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}

          <main
            className={`min-w-0 w-full flex-grow overflow-x-hidden transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
            } ${noPadding ? "" : "p-6"}`}
          >
            <div
              className={`mx-auto w-full min-w-0 ${
                noPadding ? "" : "max-w-screen-2xl"
              }`}
            >
              {children}
            </div>
          </main>
        </div>

        <WhatsAppBubble />
      </div>
    </ProtectedRoute>
  );
}



