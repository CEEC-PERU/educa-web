import { useRouter } from 'next/router';
import { useAuth } from '../../../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { Profile } from '@/interfaces/User/UserInterfaces';
import Navbar from '@/components/Navbar';
import SidebarDrawer from '@/components/student/DrawerNavigation';
import { Question } from '@/interfaces/Certification';
import { API_STUDENT_CERTIFICATIONS } from '../../../../utils/Endpoints';

interface CertificationData {
  certification_class_id: number;
  title: string;
  description: string;
  instructions: string;
  duration_in_minutes: number;
  passing_score: number;
  user_id: number;
  enterprise_id: number;
  is_active: boolean;
  start_date: string;
  due_date: string;
  max_attempts: number;
  show_results_inmediatly: boolean;
  questions: Question[];
  attempt_id?: number;
}

const TakeCertificationExam = () => {
  const router = useRouter();
  //obtener id de la url
  const { id } = router.query;
  const { user, profileInfo } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [certification, setCertification] = useState<CertificationData | null>(
    null
  );
  const [timeRemaining, setTimeRemaining] = useState(0);

  let name = '';
  let uri_picture = '';
  let userId: number | null = null;

  const userInfo = user as { id: number; enterprise_id: number };
  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
    userId = userInfo.id;
  }

  if (!userId && user) {
    if (typeof user === 'number') {
      userId = user;
    } else if (typeof user === 'object' && user.id) {
      userId = user.id;
    } else if (typeof user === 'string') {
      userId = parseInt(user);
    }
  }

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  //validar enpoint para que cargue datos del examen de certificación
  /*
  useEffect(() => {
    const fetchCertification = async () => {
      if (!id || !userId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_STUDENT_CERTIFICATIONS}/certification-scheduled/${id}/student/${userId}`
        );

        if (!response.ok) {
          throw new Error('Error al cargar el examen de certificación');
        }

        const data: CertificationData = await response.json();

        if (!data.is_active) {
          setError('La certificación no está activa.');
          return;
        }

        const now = new Date();
        const startDate = new Date(data.start_date);
        const dueDate = new Date(data.due_date);

        if (now < startDate) {
          setError('La certificación aún no ha comenzado.');
          return;
        }

        if (now > dueDate) {
          setError('La certificación ha expirado.');
          return;
        }
        setCertification(data);
        setTimeRemaining(data.duration_in_minutes * 60);
      } catch (error: any) {
        console.error('Error fetching certification:', error);
        setError(error.message || 'Error al cargar el examen de certificación');
      } finally {
        setLoading(false);
      }
    };

    fetchCertification();
  }, [id, userId]);*/

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, timeRemaining]);

  const handleTimeExpired = () => {
    alert('El tiempo para completar el examen ha expirado.');
    //enviar evaluación automáticamente
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando examen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: Usuario no autenticado</p>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative z-10">
          <Navbar
            bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
            borderColor="border border-stone-300"
            user={uri_picture ? { profilePicture: uri_picture } : undefined}
            toggleSidebar={toggleSidebar}
          />
          <SidebarDrawer
            isDrawerOpen={isDrawerOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        <div className="pt-16">
          <div
            className={`transition-all duration-300 ${
              isDrawerOpen ? 'lg:ml-64' : 'lg:ml-16'
            }`}
          >
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {certification ? certification.title : 'Cargando...'}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default TakeCertificationExam;
