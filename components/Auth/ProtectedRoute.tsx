// src/components/ProtectedRoute.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!user) {
      router.push('/login'); 
    }
  }, [user, router]);

  if (!user) {
    return null;
    //Posibilidad de mostrar una pantalla de carga
  }

  return <>{children}</>;
};

export default ProtectedRoute;
