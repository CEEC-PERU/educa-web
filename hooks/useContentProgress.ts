import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { useAuth } from '@/context/AuthContext';
import { MyContentDetails } from '@/interfaces/Training/Training';
import {
  completeContent,
  getMyContentDetails,
  updateContentProgress,
} from '@/services/training/trainingStudentService';

export const useContentProgress = (
  programId: number,
  dayId: number,
  contentId: number,
) => {
  const [content, setContent] = useState<MyContentDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout>();
  const { token } = useAuth();

  // Cargar contenido inicial
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

  // Función para sincronizar con backend (con debounce)
  const syncProgress = useCallback(
    debounce(async (progressData) => {
      if (!token || !contentId) return;

      try {
        await updateContentProgress(contentId, progressData, token);
        console.log('Progreso sincronizado con backend');
      } catch (error) {
        console.error('Error al sincronizar progreso:', error);
        // Guardar en localStorage como fallback
        localStorage.setItem(
          `progress_${contentId}`,
          JSON.stringify(progressData),
        );
      }
    }, 5000),
    [token, contentId],
  );

  // Actualizar progreso (local + backend)
  const updateProgress = (
    progressPercentage: number,
    lastPosition?: number,
  ) => {
    if (!content) return;

    // Redondear a 2 decimales para consistencia
    const roundedProgress = Math.round(progressPercentage * 100) / 100;

    // Determinar status con tipo explícito
    const newStatus: 'completed' | 'in_progress' | 'not_started' =
      roundedProgress >= 100 ? 'completed' : 'in_progress';

    // Actualizar estado local con tipos correctos
    const newProgress: MyContentDetails = {
      ...content,
      progress_percentage: roundedProgress,
      status: newStatus,
      last_position: lastPosition ?? content.last_position,
    };
    setContent(newProgress);

    // Sincronizar con backend (con debounce de 3 segundos)
    syncProgress({
      progress_percentage: roundedProgress,
      last_position: lastPosition,
    });
  };

  // Marcar como completado
  const markAsCompleted = async () => {
    if (!content || !token) return;

    try {
      await completeContent(
        content.content_id,
        content.content_type,
        { progress_percentage: 100 },
        token,
      );

      const completedContent: MyContentDetails = {
        ...content,
        is_completed: true,
        status: 'completed' as const,
        progress_percentage: 100,
      };
      setContent(completedContent);

      console.log('Contenido completado');
    } catch (error: any) {
      console.error('Error al completar contenido:', error);
      setError(error?.message || 'Error al completar el contenido');
    }
  };

  return { content, loading, error, updateProgress, markAsCompleted };
};
