import React, { useState, useEffect } from 'react';
import SidebarDrawer from '../../../components/student/DrawerNavigation';
import Navbar from '../../../components/Navbar';
import { useEvaluationUI } from '../../../hooks/ui/useEvaluationUI';
import { ClockIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import { CheckCheckIcon, ExpandIcon, PlayIcon, EyeIcon } from 'lucide-react';
import { useStudentCertifications } from '../../../hooks/useStudentCertification';
import { PendingCertification } from '../../../interfaces/StudentCertification';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CertificationsList = () => {
  const { user } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };
  const { isDrawerOpen, toggleSidebar, userProfile } = useEvaluationUI();
  const { pendingCertifications, loading, error, fetchPendingCertifications } =
    useStudentCertifications(userInfo?.id);
  const router = useRouter();

  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    expired: 0,
    total: 0,
  });

  useEffect(() => {
    if (userInfo?.id) {
      console.log('Fetching certifications for user ID:', userInfo.id);
      fetchPendingCertifications();
    }
  }, [userInfo?.id, fetchPendingCertifications]);

  // CALCULAR ESTADÍSTICAS
  useEffect(() => {
    if (pendingCertifications.length > 0) {
      const now = new Date();

      const pending = pendingCertifications.filter(
        (cert) =>
          cert.student_progress.can_start_new_attempt &&
          (!cert.assignment_details.due_date ||
            new Date(cert.assignment_details.due_date) > now)
      ).length;

      const completed = pendingCertifications.filter(
        (cert) =>
          cert.student_progress.latest_attempt?.status === 'completed' &&
          cert.student_progress.latest_attempt.passed
      ).length;

      const expired = pendingCertifications.filter(
        (cert) =>
          cert.assignment_details.due_date &&
          new Date(cert.assignment_details.due_date) <= now
      ).length;

      setStats({
        pending,
        completed,
        expired,
        total: pendingCertifications.length,
      });
    }
  }, [pendingCertifications]);

  // CARGAR CERTIFICACIONES AL INICIAR

  //  MANEJAR INICIO DE EXAMEN
  const handleStartExam = (assignmentId: number) => {
    // Aquí iría la navegación al componente de examen
    //console.log('Iniciando examen para assignment:', assignmentId);
    // navigate(`/student/certifications/exam/${assignmentId}`);
    /*
    <Link href={`/student/certificaciones/exam/${assignmentId}`}>
      <h1>examen</h1>
    </Link>;*/
    router.push(`/student/certificaciones/exam/${assignmentId}`);
  };

  //  MANEJAR VISUALIZACIÓN DE RESULTADOS
  const handleViewResults = (assignmentId: number) => {
    // Aquí iría la navegación al historial de intentos
    console.log('Viendo resultados para assignment:', assignmentId);
    // navigate(`/student/certifications/history/${assignmentId}`);
  };

  //  FORMATEAR FECHA
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  //  OBTENER BADGE DE ESTADO
  const getStatusBadge = (certification: PendingCertification) => {
    const { student_progress, assignment_details } = certification;
    const now = new Date();

    // Verificar si está expirada
    if (
      assignment_details.due_date &&
      new Date(assignment_details.due_date) <= now
    ) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Expirada
        </span>
      );
    }

    if (
      !student_progress.can_start_new_attempt &&
      student_progress.latest_attempt?.status === 'in_progress'
    ) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          En progreso
        </span>
      );
    }

    if (student_progress.latest_attempt?.passed) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Aprobada
        </span>
      );
    }

    if (
      student_progress.latest_attempt &&
      !student_progress.latest_attempt.passed
    ) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          No aprobada
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Disponible
      </span>
    );
  };

  //  RENDERIZAR TARJETA DE CERTIFICACIÓN
  const renderCertificationCard = (certification: PendingCertification) => {
    const isExpired =
      certification.assignment_details.due_date &&
      new Date(certification.assignment_details.due_date) <= new Date();

    return (
      <div
        key={certification.assignment_id}
        className={`bg-white rounded-lg shadow-sm border ${
          isExpired ? 'border-red-200' : 'border-gray-200'
        } p-6 hover:shadow-md transition-shadow duration-200`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-2 rounded-lg ${
              isExpired ? 'bg-red-100' : 'bg-blue-100'
            }`}
          >
            <DocumentTextIcon
              className={`h-6 w-6 ${
                isExpired ? 'text-red-600' : 'text-blue-600'
              }`}
            />
          </div>
          {getStatusBadge(certification)}
        </div>

        {/* Información de la certificación */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {certification.certification.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {certification.certification.description}
        </p>

        {/* Detalles del aula */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="font-medium">Aula:</span>
          <span className="ml-1">{certification.classroom.code}</span>
        </div>

        {/* Información detallada */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2" />
            <span>
              Duración: {certification.certification.duration_minutes} minutos
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span>
              Preguntas: {certification.assignment_details.questions_count}
            </span>
            {certification.assignment_details.is_randomized && (
              <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                Aleatorias
              </span>
            )}
          </div>

          {certification.assignment_details.due_date && (
            <div
              className={`flex items-center text-sm ${
                isExpired ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              <span>
                Vence: {formatDate(certification.assignment_details.due_date)}
              </span>
            </div>
          )}
        </div>

        {/* Progreso del estudiante */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
            <span>
              Intentos: {certification.student_progress.total_attempts}/
              {certification.certification.max_attempts}
            </span>
            <span>
              Restantes: {certification.student_progress.attempts_remaining}
            </span>
          </div>

          {certification.student_progress.latest_attempt && (
            <div className="text-sm text-gray-600 mb-3">
              Último intento:
              {certification.student_progress.latest_attempt.score !== null && (
                <span
                  className={`ml-1 font-medium ${
                    certification.student_progress.latest_attempt.passed
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {certification.student_progress.latest_attempt.score} puntos
                </span>
              )}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex space-x-3">
          {!isExpired &&
          certification.student_progress.can_start_new_attempt ? (
            <button
              onClick={() => handleStartExam(certification.assignment_id)}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              Iniciar Examen
            </button>
          ) : (
            <button
              onClick={() => handleViewResults(certification.assignment_id)}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              Ver Detalles
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={
            userProfile.uri_picture
              ? { profilePicture: userProfile.uri_picture }
              : undefined
          }
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
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Mis Certificaciones
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona y realiza tus certificaciones asignadas
              </p>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Certificaciones Pendientes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Certificaciones Pendientes
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '-' : stats.pending}
                    </p>
                  </div>
                </div>
              </div>

              {/* Certificaciones Completadas */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCheckIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Certificaciones Completadas
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '-' : stats.completed}
                    </p>
                  </div>
                </div>
              </div>

              {/* Certificaciones Expiradas */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ExpandIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Certificaciones Expiradas
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '-' : stats.expired}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total de Certificaciones */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total de Certificaciones
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '-' : stats.total}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Listado de certificaciones */}
            <div className="space-y-6">
              {/* Estado de carga */}
              {loading && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-200"></div>
                  </div>
                  <p className="text-gray-600 mt-4">
                    Cargando certificaciones...
                  </p>
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center">
                    <div className="p-2 bg-red-100 rounded-lg mb-4">
                      <ExpandIcon className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-red-800 mb-2">
                      Error al cargar certificaciones
                    </h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                      onClick={fetchPendingCertifications}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Reintentar
                    </button>
                  </div>
                </div>
              )}

              {/* Sin certificaciones */}
              {!loading && !error && pendingCertifications.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay certificaciones asignadas
                  </h3>
                  <p className="text-gray-500">
                    No tienes certificaciones pendientes en este momento.
                  </p>
                </div>
              )}

              {/* Lista de certificaciones */}
              {!loading && !error && pendingCertifications.length > 0 && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Certificaciones Asignadas ({pendingCertifications.length})
                    </h2>
                    <button
                      onClick={fetchPendingCertifications}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Actualizar Lista
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingCertifications.map(renderCertificationCard)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationsList;
