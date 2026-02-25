import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/supervisor/SibebarSupervisor';
import '@/app/globals.css';
import { useRouter } from 'next/router';
import { useTrainingAssignment } from '@/hooks/useTraininingAssignment';
import {
  User,
  Building2,
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  Download,
} from 'lucide-react';

const TrainingAssignmentStudentsPage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const router = useRouter();
  const { programId } = router.query;
  const { studentAssignments, loading, error, refetch } = useTrainingAssignment(
    Number(programId),
  );

  // Helper para obtener color según progreso
  const getProgressColor = (percentage: number) => {
    if (percentage === 0) return 'from-gray-400 to-gray-500';
    if (percentage < 30) return 'from-red-400 to-red-500';
    if (percentage < 70) return 'from-yellow-400 to-yellow-500';
    return 'from-green-400 to-green-500';
  };

  const getStatusConfig = (percentage: number) => {
    if (percentage === 100) {
      return {
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: <Award className="w-4 h-4" />,
        label: 'Completado',
      };
    }
    if (percentage > 0) {
      return {
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: <TrendingUp className="w-4 h-4" />,
        label: 'En progreso',
      };
    }
    return {
      color: 'bg-gray-100 text-gray-600 border-gray-200',
      icon: <Clock className="w-4 h-4" />,
      label: 'Sin iniciar',
    };
  };

  const exportToCSV = () => {
    const headers = ['DNI', 'Campaña', 'Contenidos Completados', 'Total Contenidos', 'Progreso (%)'];
    const rows = studentAssignments.map((s) => [
      s.dni,
      `"${(s.classroom.name || '').replace(/"/g, '""')}"`,
      s.progress.completed_contents,
      s.progress.total_contents,
      s.progress.progress_percentage,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const today = new Date().toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.href = url;
    link.download = `estudiantes_programa_${programId}_${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />

      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className="flex-1 p-6 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto">
            {/* Header con estadísticas rápidas */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    Estudiantes Asignados
                  </h1>
                  <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
                  >
                    ← Volver a la lista de Asignaciones
                  </button>
                  <p className="text-sm text-gray-600">
                    {!loading && studentAssignments.length > 0 && (
                      <>
                        Gestiona el progreso de {studentAssignments.length}{' '}
                        estudiante(s)
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                  {!loading && studentAssignments.length > 0 && (
                    <button
                      onClick={exportToCSV}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-sm font-medium text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm hover:shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      Exportar CSV
                    </button>
                  )}
                  <button
                    onClick={refetch}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-all shadow-sm"
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

              {/* Stats cards - Solo si hay datos */}
              {!loading && studentAssignments.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {/* Total estudiantes */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {studentAssignments.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Completados */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Completados
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {
                            studentAssignments.filter(
                              (s) => s.progress.progress_percentage === 100,
                            ).length
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Promedio de progreso */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Progreso Promedio
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.round(
                            studentAssignments.reduce(
                              (acc, s) => acc + s.progress.progress_percentage,
                              0,
                            ) / studentAssignments.length,
                          )}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lista de estudiantes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                // Skeleton Loader Mejorado
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl animate-pulse"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="h-8 bg-gray-200 rounded-lg w-32"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                        </div>
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
                    Error al cargar estudiantes
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
              ) : studentAssignments.length === 0 ? (
                // Empty State
                <div className="text-center py-16 px-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay estudiantes asignados
                  </h3>
                  <p className="text-gray-600 max-w-sm mx-auto">
                    Aún no se han asignado estudiantes a este programa. Asigna
                    campañas para comenzar.
                  </p>
                </div>
              ) : (
                // Cards de Estudiantes
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {studentAssignments.map((student) => {
                      const status = getStatusConfig(
                        student.progress.progress_percentage,
                      );

                      return (
                        <div
                          key={student.student_id}
                          className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 overflow-hidden"
                        >
                          {/* Decorative gradient bar */}
                          <div
                            className={`h-1.5 bg-gradient-to-r ${getProgressColor(student.progress.progress_percentage)}`}
                          />

                          <div className="p-6">
                            {/* Header: DNI y Estado */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                  <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">
                                    DNI
                                  </p>
                                  <p className="text-lg font-bold text-gray-900">
                                    {student.dni}
                                  </p>
                                </div>
                              </div>

                              {/* Badge de estado */}
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${status.color} transition-colors`}
                              >
                                {status.icon}
                                {status.label}
                              </span>
                            </div>

                            {/* Campaña */}
                            <div className="mb-5">
                              <div className="flex items-center gap-2 mb-1.5">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <p className="text-xs text-gray-500 font-medium">
                                  Campaña
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-gray-700 pl-6">
                                {student.classroom.name}
                              </p>
                            </div>

                            {/* Separador */}
                            <div className="border-t border-gray-200 my-4"></div>

                            {/* Progreso Visual */}
                            <div className="space-y-3">
                              {/* Header de progreso */}
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-600">
                                  Contenidos completados
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                  {student.progress.completed_contents}/
                                  {student.progress.total_contents}
                                </span>
                              </div>

                              {/* Barra de progreso */}
                              <div className="relative">
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                  <div
                                    className={`h-full bg-gradient-to-r ${getProgressColor(student.progress.progress_percentage)} rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
                                    style={{
                                      width: `${student.progress.progress_percentage}%`,
                                    }}
                                  >
                                    {/* Efecto de brillo animado */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                                  </div>
                                </div>
                              </div>

                              {/* Porcentaje destacado */}
                              <div className="flex items-center justify-center pt-1">
                                <div
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r ${getProgressColor(student.progress.progress_percentage)} bg-opacity-10`}
                                >
                                  <span className="text-xl font-extrabold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                    {student.progress.progress_percentage}%
                                  </span>
                                  <span className="text-xs text-gray-600 font-medium">
                                    completado
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Elemento decorativo de fondo */}
                          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500"></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Estilos para la animación del shimmer */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default TrainingAssignmentStudentsPage;
