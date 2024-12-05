import { useEffect, useState } from 'react';
import { Shift } from '../interfaces/Classroom';
import {getShifts} from '../services/shiftService';
import { useAuth } from '../context/AuthContext';

export const useShifts = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();

  const fetchShifts = async () => {
    setIsLoading(true);
    try {
      // Llamada al servicio para obtener los Shifts
      const response = await getShifts();
      if (response === null) {
        setShifts([]);
      } else if (Array.isArray(response)) {
        setShifts(response);
      } else {
        setShifts([response]);
      }
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      setError('Error al obtener los classrooms.');
    } finally {
      setIsLoading(false);
    }
  };

  // Ejecuta fetchClassrooms cuando se monta el componente
  useEffect(() => {
    fetchShifts();
  }, []);

  return {
    shifts,
    error,
    isLoading,
    fetchShifts, 
  };
};

