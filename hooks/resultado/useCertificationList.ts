import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Certification, ApiAssignment } from '@/interfaces/Certification';

interface UseCertificationsListReturn {
  certifications: Certification[];
  loading: boolean;
  error: string | null;
  stats: {
    active: number;
    paused: number;
    completed: number;
    cancelled: number;
  };
}
/*
export const useCertificationsList = (): UseCertificationsListReturn => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };

  const fetchCertifications = (apiData: ApiAssignment[]): Certification[] => {
    return => {

    }
  };
};
*/
const calculateStates = (certifications: Certification[]) => {
  return {
    active: certifications.filter((c) => c.is_active).length,
    paused: certifications.filter((c) => !c.is_active).length,
    completed: certifications.filter(
      (c) => c.total_questions && c.total_questions > 0
    ).length,
    cancelled: certifications.filter((c) => c.total_questions === 0).length,
  };
};
