import { useEffect, useState } from 'react';
import { User } from '../interfaces/User/UserAdmin';
import { useAuth } from '../context/AuthContext';
import { getUsersByCompanyAndRole } from '../services/users/userService';

export const useProfesor = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Obtener datos del localStorage
      const storedUserInfo = localStorage.getItem('userInfo');
      if (!storedUserInfo) {
        throw new Error(
          'No se encontró información del usuario en el localStorage.'
        );
      }

      const { enterprise_id } = JSON.parse(storedUserInfo) as {
        id: number;
        enterprise_id: number;
      };
      const usersData = await getUsersByCompanyAndRole(enterprise_id, 6);
      setUsers(usersData);
      console.log('profesores', usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error al obtener usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  // Ejecuta fetchUsers cuando se monta el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    error,
    isLoading,
  };
};
