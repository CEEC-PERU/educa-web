import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Si el usuario no tiene token o sesión, redirige al login
      if (!user || !token) {
        router.push('/login');
      }
    }
  }, [user, isLoading, token, router]);

  if (isLoading) {
    return <p>Cargando...</p>; // Mostrar una pantalla de carga mientras se verifica la autenticación
  }

  return <>{children}</>;
};

export default ProtectedRoute;
