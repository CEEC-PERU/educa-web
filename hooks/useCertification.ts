import { useState, useEffect } from 'react';
import { API_CERTIFICATES } from '../utils/Endpoints';
import { Certification } from '../interfaces/Certification';

export function useCertifications(userId?: number) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertifications = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_CERTIFICATES}/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || 'Error al obtener certificados');
      setCertifications(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, [userId]);

  return { certifications, loading, error, reload: fetchCertifications };
}
