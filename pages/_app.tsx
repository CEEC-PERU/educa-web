import { AuthProvider } from "../context/AuthContext";
import type { AppPropsWithLayout } from "../types/next";
import SessionTimeoutNotification from "../components/SessionTimeOutNotification";
import "../app/globals.css";

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <AuthProvider>
      {getLayout(<Component {...pageProps} />)}
      <SessionTimeoutNotification />
    </AuthProvider>
  );
}

export default MyApp;
