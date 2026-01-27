import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import SidebarDrawer from '@/components/student/DrawerNavigation';
import '@/app/globals.css';
import { useRouter } from 'next/router';
import { useMyTrainings } from '@/hooks/useMyTrainings';
import { BookOpen, Building2, ChevronRight, Calendar } from 'lucide-react';
//import Footer from '@/components/student/Footer';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

const CapacitacionesPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const { myTrainings, loading, error, refetch } = useMyTrainings();

  const handleProgramClick = (programId: number) => {
    router.push(`/student/trainings/${programId}`);
  };

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gray-50">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />

        <div className="flex flex-1 pt-16">
          <SidebarDrawer
            isDrawerOpen={isDrawerOpen}
            toggleSidebar={toggleSidebar}
          />

          <main
            className={`flex-1 p-6 transition-all duration-300 ease-in-out `}
          >
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Mis Capacitaciones
                    </h1>
                    <p className="text-sm text-gray-600">
                      {!loading && myTrainings.length > 0 && (
                        <>
                          Tienes {myTrainings.length} programa(s) de
                          capacitación disponible(s)
                        </>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={refetch}
                    disabled={loading}
                    className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-all shadow-sm"
                  >
                    <svg
                      className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {loading ? 'Actualizando...' : 'Actualizar'}
                  </button>
                </div>
              </div>

              {/* Lista de Programas */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                  // Skeleton Loader
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 animate-pulse"
                        >
                          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          </div>
                          <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : error ? (
                  // Error State
                  <div className="text-center py-16 px-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-4">
                      <svg
                        className="w-10 h-10 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Error al cargar capacitaciones
                    </h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                      onClick={refetch}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Reintentar
                    </button>
                  </div>
                ) : myTrainings.length === 0 ? (
                  // Empty State
                  <div className="text-center py-16 px-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                      <BookOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No tienes capacitaciones asignadas
                    </h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      Aún no se te han asignado programas de capacitación.
                      Contacta a tu supervisor para más información.
                    </p>
                  </div>
                ) : (
                  // Grid de Programas
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myTrainings.map((training) => (
                        <div
                          key={training.program_id}
                          onClick={() =>
                            handleProgramClick(training.program_id)
                          }
                          className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden cursor-pointer"
                        >
                          {/* Barra decorativa superior */}
                          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />

                          <div className="p-6">
                            {/* Título */}
                            <div className="mb-4">
                              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {training.title}
                              </h3>
                              {training.description && (
                                <p className="text-sm text-gray-600 line-clamp-3">
                                  {training.description}
                                </p>
                              )}
                            </div>

                            {/* Información */}
                            <div className="space-y-3 mb-6">
                              {/* Campaña */}
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg flex-shrink-0">
                                  <Building2 className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-500 font-medium">
                                    Campaña
                                  </p>
                                  <p className="text-sm font-semibold text-gray-900 truncate">
                                    {training.classroom.code}
                                  </p>
                                </div>
                              </div>

                              {/* Total Días */}
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                                  <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 font-medium">
                                    Duración del programa
                                  </p>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {training.total_days}{' '}
                                    {training.total_days === 1 ? 'día' : 'días'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Botón CTA */}
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group-hover:shadow-lg">
                              <span>Ver Programa</span>
                              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>

                          {/* Elemento decorativo */}
                          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CapacitacionesPage;
