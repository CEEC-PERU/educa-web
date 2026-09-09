import { Inter } from "next/font/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/AuthContext";
import type { AppPropsWithLayout } from "../types/next";
import SessionTimeoutNotification from "../components/SessionTimeOutNotification";
import NotificationProvider from "../components/notifications/NotificationProvider";
import AuthBridge from "../components/notifications/AuthBridge";
import { queryClient } from "../lib/query/queryClient";
import { Toaster } from "sonner";
import "../app/globals.css";

const inter = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <div className={inter.className}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthBridge />
          {getLayout(<Component {...pageProps} />)}
          <SessionTimeoutNotification />
          <NotificationProvider />
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default MyApp;
