import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MyContentDetails } from '@/interfaces/Training/Training';
import { getMyContentDetails } from '@/services/training/trainingStudentService';

export const useContentProgress = (
  programId: number,
  dayId: number,
  contentId: number,
) => {
  const [content, setContent] = useState<MyContentDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  //retornando content de prueba
  useEffect(() => {
    const fetchContent = async () => {
      if (!programId || !dayId || !contentId || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getMyContentDetails(
          programId,
          dayId,
          contentId,
          token,
        );
        setContent(data);
        setError(null);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setContent(null);
          setError(null);
        } else {
          setError('Error al cargar el contenido');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [programId, dayId, contentId, token]);

  const updateProgress = (
    progressPercentage: number,
    lastPosition?: number,
  ) => {
    if (content) {
      setContent({
        ...content,
        progress_percentage: progressPercentage,
        status: progressPercentage >= 100 ? 'completed' : 'in_progress',
      });
      console.log('Progreso actualizado (local):', {
        contentId: content.content_id,
        progressPercentage,
        lastPosition,
      });
    }
  };

  const markAsCompleted = () => {
    if (content) {
      setContent({
        ...content,
        progress_percentage: 100,
        status: 'completed',
      });

      console.log('Contenido completado (local):', content.content_id);
    }
  };

  return {
    content,
    loading,
    error,
    updateProgress,
    markAsCompleted,
  };
};
