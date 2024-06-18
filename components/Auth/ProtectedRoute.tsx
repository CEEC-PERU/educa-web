import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!user && !isLoading) {
      router.push('/login'); 
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <p>Loading...</p>; // Mostrar una pantalla de carga mientras se verifica la autenticación
  }

  if (!user) {
    return null; // Opcional: mostrar un mensaje o pantalla cuando no hay usuario autenticado
  }

  return <>{children}</>;
};

export default ProtectedRoute;
