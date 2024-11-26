import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoading } = useAuth(); // Se usa solo para mostrar "Cargando..."
  const router = useRouter();

  useEffect(() => {
    const userToken = localStorage.getItem('userToken'); // Obtiene el token directamente de localStorage

    if (!isLoading) {
      // Redirige al login si el token no está presente
      if (!userToken) {
        router.push('/login');
      }
    }
  }, [isLoading, router]);

  if (isLoading) {
    return <p>Cargando...</p>; // Mostrar una pantalla de carga mientras se verifica la autenticación
  }

  return <>{children}</>;
};

export default ProtectedRoute;
