// hooks/useDeleteUser.ts

import { useState } from 'react';
import { deleteUserById } from '../../services/userService';

export const useDeleteUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const deleteUser = async (userId: number) => {
    setIsLoading(true);
    setError(null); // Limpiamos el error anterior
    setSuccess(false); // Restablecemos el estado de éxito

    try {
      await deleteUserById(userId);
      setSuccess(true); // Si la eliminación fue exitosa, actualizamos el estado de éxito
    } catch (err) {
      setError('Error al eliminar el usuario.'); // Manejamos cualquier error
    } finally {
      setIsLoading(false); // Restablecemos el estado de carga
    }
  };

  return {
    isLoading,
    error,
    success,
    deleteUser,
  };
};
