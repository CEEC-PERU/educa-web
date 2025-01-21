import { useEffect, useState } from 'react';
import { Template} from '../interfaces/Template';
import {  getTemplates } from '../services/template';
import { useAuth } from '../context/AuthContext';

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      // Llamada al servicio para obtener los templates
      const response = await getTemplates();
      if (response === null) {
        setTemplates([]);
      } else if (Array.isArray(response)) {
        setTemplates(response);
      } else {
        setTemplates([response]);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Error al obtener los templates.');
    } finally {
      setIsLoading(false);
    }
  };

  // Ejecuta fetchClassrooms cuando se monta el componente
  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    error,
    isLoading,
    fetchTemplates, 
  };
};

