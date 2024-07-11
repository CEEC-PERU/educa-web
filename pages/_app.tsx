// src/pages/_app.tsx
import { AuthProvider } from '../context/AuthContext';
import { AppProps } from 'next/app';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import './../app/globals.css';
function MyApp({ Component, pageProps }: AppProps) {
  const protectedRoutes = ['/home', '/contenido/agregarCurso', '/student', '/corporate', '/content', '/admin'];

  return (
    <AuthProvider>
      {protectedRoutes.includes(Component.name) ? (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
}

export default MyApp;
