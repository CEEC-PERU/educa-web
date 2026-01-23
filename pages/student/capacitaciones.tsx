import SidebarDrawer from '../../components/student/DrawerNavigation';
import Navbar from '../../components/Navbar';
import { Profile } from '../../interfaces/User/UserInterfaces';
import { useRouter } from 'next/router';
import Footer from '@/components/student/Footer';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import ScreenSecurity from '@/components/ScreenSecurity';
import React, { useState } from 'react';
import { UserInfo } from '@/interfaces/Training/Training';
import { useMyTrainings } from '@/hooks/useMyTrainings';
import {
  BookOpen,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  PlayCircle,
  ArrowRight,
} from 'lucide-react';

const CapacitacionesIndex: React.FC = () => {
  const { user, profileInfo } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  const userInfo = user as UserInfo;
  const { myTrainings, loading, error, refetch } = useMyTrainings(userInfo?.id);

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleTrainingClick = (programId: number) => {
    router.push(`/student/trainings/${programId}`);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 0) return 'bg-gray-200';
    if (percentage < 30) return 'bg-red-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusBadge = (percentage: number) => {
    if (percentage === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          <Clock className="w-3 h-3" />
          No iniciado
        </span>
      );
    }
    if (percentage === 100) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3" />
          Completado
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        <PlayCircle className="w-3 h-3" />
        En progreso
      </span>
    );
  };

  return (
    <ProtectedRoute>
      <div>
        <ScreenSecurity />
        <div className="relative min-h-screen flex flex-col bg-gray-50">
          <Navbar
            bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
            borderColor="border border-stone-300"
            user={user ? { profilePicture: uri_picture } : undefined}
            toggleSidebar={toggleSidebar}
          />
          <SidebarDrawer
            isDrawerOpen={isDrawerOpen}
            toggleSidebar={toggleSidebar}
          />

          <main className="flex-grow container mx-auto px-4 py-6 pt-20 lg:ml-64">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Mis Programas de Formación
                </h1>
                <p className="text-gray-600">
                  Continúa con tu aprendizaje y completa tus capacitaciones
                </p>
              </div>

              {/* Stats Cards */}
              {!loading && myTrainings.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Total de Programas
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {myTrainings.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Completados</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {
                            myTrainings.filter(
                              (t) => t.progress?.progress_percentage === 100,
                            ).length
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Progreso Promedio
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.round(
                            myTrainings.reduce(
                              (acc, t) =>
                                acc + (t.progress?.progress_percentage || 0),
                              0,
                            ) / myTrainings.length,
                          )}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Training Cards */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {loading ? (
                  <div className="flex flex-col justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">
                      Cargando tus capacitaciones...
                    </p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <p className="text-red-600 font-medium mb-2">
                      Error al cargar
                    </p>
                    <p className="text-gray-600">{error}</p>
                    <button
                      onClick={() => refetch()}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : myTrainings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-medium text-lg mb-2">
                      No tienes capacitaciones asignadas
                    </p>
                    <p className="text-gray-600">
                      Contacta con tu supervisor para que te asigne programas de
                      formación
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myTrainings.map((training) => {
                      const progressPercentage =
                        training.progress?.progress_percentage || 0;
                      const completedContents =
                        training.progress?.completed_contents || 0;

                      return (
                        <div
                          key={training.program_id}
                          onClick={() =>
                            handleTrainingClick(training.program_id)
                          }
                          className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 cursor-pointer"
                        >
                          {/* Header con gradiente */}
                          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                          {/* Contenido */}
                          <div className="p-6">
                            {/* Status Badge */}
                            <div className="mb-4">
                              {getStatusBadge(progressPercentage)}
                            </div>

                            {/* Título */}
                            <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {training.title}
                            </h2>

                            {/* Descripción */}
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {training.description ||
                                'Sin descripción disponible'}
                            </p>

                            {/* Metadata */}
                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{training.total_days} días</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                <span>{completedContents} contenidos</span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 font-medium">
                                  Progreso
                                </span>
                                <span className="text-gray-900 font-bold">
                                  {progressPercentage}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className={`h-full ${getProgressColor(progressPercentage)} transition-all duration-500 rounded-full`}
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
                              </div>
                            </div>

                            <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group-hover:shadow-lg">
                              <span>
                                {progressPercentage === 0
                                  ? 'Comenzar'
                                  : progressPercentage === 100
                                    ? 'Revisar'
                                    : 'Continuar'}
                              </span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>

                          {/* Decorative element */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CapacitacionesIndex;
