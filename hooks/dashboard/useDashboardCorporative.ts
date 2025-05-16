import { useState, useEffect } from 'react';
import {
  fetchTopRankig,
  fetchAverageTime,
  fetchUserActive,
  fetchNps,
} from '../../services/dashboardCorporative';
import {
  TopRanking,
  AverageTime,
  ActiveUser,
  ScoreNPS,
} from '../../interfaces/dashboard';

import { useAuth } from '../../context/AuthContext';

export const useTop = (selectedCourseId?: number) => {
  const [topRanking, setTopRanking] = useState<TopRanking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTopRankig(
          selectedCourseId,
          userInfo.enterprise_id
        );
        setTopRanking(data);
      } catch (err) {
        setError('Error al obtener los datos del progreso del curso.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCourseId]);

  return { topRanking, loading, error };
};

export const useAverageTime = () => {
  const [averagetime, setAverageTime] = useState<AverageTime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAverageTime(enterprise_id);
        setAverageTime(data);
      } catch (err) {
        setError('Error al obtener los datos del progreso del curso.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { averagetime, loading, error };
};

export const useAUserActive = () => {
  const [activeuser, setActiveUser] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUserActive(enterprise_id);
        setActiveUser(data);
      } catch (err) {
        setError('Error al obtener los datos del progreso del curso.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { activeuser, loading, error };
};

export const useNPS = (cuestypeId: number, courseId?: number) => {
  const [npsData, setNpsData] = useState<ScoreNPS[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (!storedUserInfo) {
      setError('No se encontró información del usuario en el localStorage.');
      setLoading(false);
      return;
    }

    const { enterprise_id } = JSON.parse(storedUserInfo) as {
      id: number;
      enterprise_id: number;
    };

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNps(cuestypeId, enterprise_id, courseId);
        setNpsData(data);
      } catch (err) {
        setError('Error al obtener npsdata');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cuestypeId, courseId]); // Añadir courseId a las dependencias

  return { npsData, loading, error };
};

export const useSatisfaccion = (cuestypeId: number, courseId?: number) => {
  const [satisData, setSatisData] = useState<ScoreNPS[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (!storedUserInfo) {
      setError('No se encontró información del usuario en el localStorage.');
      setLoading(false);
      return;
    }

    const { enterprise_id } = JSON.parse(storedUserInfo) as {
      id: number;
      enterprise_id: number;
    };

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNps(cuestypeId, enterprise_id, courseId);
        setSatisData(data);
      } catch (err) {
        setError('Error al obtener npsdata');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cuestypeId, courseId]); // Añadir courseId a las dependencias

  return { satisData, loading, error };
};
