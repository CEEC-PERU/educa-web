import React, { useState, useEffect } from "react";
import {
  ClockIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  PlayIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { PendingCertification } from "../../interfaces/StudentCertification";
import { useStudentCertifications } from "../../hooks/useStudentCertification";

interface StudentCertificationsListProps {
  onStartExam: (assignmentId: number) => void;
  onViewResults: (assignmentId: number) => void;
}

const StudentCertificationsList: React.FC<StudentCertificationsListProps> = ({
  onStartExam,
  onViewResults,
}) => {
  const { pendingCertifications, loading, error, fetchPendingCertifications } =
    useStudentCertifications();

  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    setLocalLoading(true);
    try {
      await fetchPendingCertifications();
    } catch (error) {
      console.error("Error loading certifications:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (certification: PendingCertification) => {
    const { student_progress, assignment_details } = certification;

    if (!student_progress.can_start_new_attempt) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          En progreso
        </span>
      );
    }

    if (student_progress.total_attempts > 0) {
      const latest = student_progress.latest_attempt;
      if (latest?.passed) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Aprobado
          </span>
        );
      } else if (latest && !latest.passed) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-3 h-3 mr-1" />
            No aprobado
          </span>
        );
      }
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Disponible
      </span>
    );
  };

  if (loading || localLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="flex flex-col items-center">
          <XCircleIcon className="h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error al cargar certificaciones
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadCertifications}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (pendingCertifications.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay certificaciones pendientes
        </h3>
        <p className="text-gray-500">
          No tienes certificaciones asignadas en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Mis Certificaciones
        </h2>
        <button
          onClick={loadCertifications}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingCertifications.map((certification) => (
          <div
            key={certification.assignment_id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                </div>
                {getStatusBadge(certification)}
              </div>

              {/* Certification Info */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {certification.certification.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {certification.certification.description}
              </p>

              {/* Classroom Info */}
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <UserIcon className="h-4 w-4 mr-2" />
                <span>
                  {certification.classroom.name} -{" "}
                  {certification.classroom.code}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>
                    {certification.certification.duration_minutes} minutos
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>
                    Hasta:{" "}
                    {certification.assignment_details.due_date
                      ? formatDate(certification.assignment_details.due_date)
                      : "Sin fecha límite"}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                  <span>
                    Intentos: {certification.student_progress.total_attempts}/
                    {certification.certification.max_attempts}
                  </span>
                  <span>
                    Restantes:{" "}
                    {certification.student_progress.attempts_remaining}
                  </span>
                </div>

                {certification.student_progress.latest_attempt && (
                  <div className="text-sm text-gray-600 mb-3">
                    Último intento:
                    {certification.student_progress.latest_attempt.score !==
                      null && (
                      <span
                        className={`ml-1 font-medium ${
                          certification.student_progress.latest_attempt.passed
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {certification.student_progress.latest_attempt.score}{" "}
                        puntos
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                {certification.student_progress.can_start_new_attempt ? (
                  <button
                    onClick={() => onStartExam(certification.assignment_id)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Iniciar
                  </button>
                ) : (
                  <button
                    onClick={() => onViewResults(certification.assignment_id)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Ver Resultados
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCertificationsList;
