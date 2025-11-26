import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import React, { useState, useEffect } from 'react';
import { Profile } from '@/interfaces/User/UserInterfaces';
import Navbar from '@/components/Navbar';
import SidebarDrawer from '@/components/student/DrawerNavigation';
import Link from 'next/link';
import { ArrowLeftIcon, XCircleIcon } from 'lucide-react';
import { API_STUDENT_CERTIFICATIONS } from '@/utils/Endpoints';

const ResultadosPage = () => {
  const router = useRouter();
  const { attempt_id } = router.query;
  const { profileInfo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  let name = '';
  let uri_picture = '';
  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!attempt_id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_STUDENT_CERTIFICATIONS}/attempt/${attempt_id}/results`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Error al cargar los resultados');
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        setError(
          'No se pudieron cargar los resultados. Por favor, inténtalo de nuevo más tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [attempt_id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-200 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar los resultados
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-brand-200 text-white rounded-lg hover:bg-brand-300 transition-colors duration-200"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

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
            isDrawerOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
              <Link href="/student/certificaciones">
                <button className="inline-flex items-center gap-2 text-bran-200 hover:text-brand-300 mb-4">
                  <ArrowLeftIcon className="h-4 w-4" />
                  Volver a Certificaciones
                </button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Resultados del Examen
              </h1>
              <p className="text-gray-600"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadosPage;
