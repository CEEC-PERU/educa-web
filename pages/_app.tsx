import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "../context/AuthContext";
import type { AppPropsWithLayout } from "../types/next";
import SessionTimeoutNotification from "../components/SessionTimeOutNotification";
import NotificationProvider from "../components/notifications/NotificationProvider";
import AuthBridge from "../components/notifications/AuthBridge";
import { queryClient } from "../lib/query/queryClient";
import "../app/globals.css";

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthBridge />
        {getLayout(<Component {...pageProps} />)}
        <SessionTimeoutNotification />
        <NotificationProvider />
      </AuthProvider>
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default MyApp;
