import { useEffect, useState } from 'react';
import { User } from '../interfaces/UserAdmin';
import { useAuth } from '../context/AuthContext';
import { getUsersByCompanyAndRole } from '../services/userService';

export const useProfesor = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };

  // Función para obtener los usuarios
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const usersData = await getUsersByCompanyAndRole(userInfo.enterprise_id,6);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error al obtener usuarios');
    } finally {
      setIsLoading(false);
    }
  };



  // Retornar valores y funciones que otros componentes puedan usar
  return {
    users,          // Lista de usuarios
    error,          // Error si ocurrió
    isLoading,      // Estado de carga
    refetch: () => fetchUsers(),  // Refetching para recargar datos manualmente
  };
};
