// src/pages/_app.tsx
import { AuthProvider } from '../context/AuthContext';
import { AppProps } from 'next/app';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import SessionTimeoutNotification from '../components/SessionTimeOutNotification';
import './../app/globals.css';
import EnterpriseStylesProvider from '@/context/EnterpriseStylesContext';
function MyApp({ Component, pageProps }: AppProps) {
  const protectedRoutes = [
    '/home',
    '/contenido/agregarCurso',
    '/student',
    '/corporate',
    '/content',
    '/admin',
  ];

  return (
    <AuthProvider>
      <EnterpriseStylesProvider>
        {protectedRoutes.includes(Component.name) ? (
          <ProtectedRoute>
            <Component {...pageProps} />
            <SessionTimeoutNotification />
          </ProtectedRoute>
        ) : (
          <Component {...pageProps} />
        )}
      </EnterpriseStylesProvider>
    </AuthProvider>
  );
}

export default MyApp;
