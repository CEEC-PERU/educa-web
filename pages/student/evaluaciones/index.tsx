import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import { ClockIcon, PlayIcon, CalendarIcon, ExpandIcon } from 'lucide-react';
import SidebarDrawer from '../../../components/student/DrawerNavigation';
import Navbar from '../../../components/Navbar';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Profile } from '../../../interfaces/User/UserInterfaces';
import { useAuth } from '../../../context/AuthContext';

interface Evaluation {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_points: number;
  due_date: string;
  course_name: string;
  status: 'pending' | 'completed' | 'overdue';
  attempts_used: number;
  max_attempts: number;
  best_score?: number;
}

const EvaluationsList = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const { profileInfo } = useAuth();
  const router = useRouter();

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

  // Sample data
  useEffect(() => {
    const sampleEvaluations: Evaluation[] = [
      {
        id: '1',
        title: 'Evaluación de Claro Postpago',
        description: 'Evaluación sobre conceptos de telefonia de claro',
        duration_minutes: 60,
        total_points: 100,
        due_date: '2025-07-25T23:59:59Z',
        course_name: 'Claro Postpago',
        status: 'pending',
        attempts_used: 0,
        max_attempts: 3,
      },
      {
        id: '2',
        title: 'Examen de Historia Universal',
        description:
          'Evaluación comprensiva sobre eventos históricos del siglo XX.',
        duration_minutes: 90,
        total_points: 150,
        due_date: '2025-07-23T23:59:59Z',
        course_name: 'Historia Mundial',
        status: 'pending',
        attempts_used: 1,
        max_attempts: 2,
      },
      {
        id: '3',
        title: 'Quiz de Programación - JavaScript',
        description: 'Evaluación práctica sobre conceptos de JavaScript ES6+.',
        duration_minutes: 45,
        total_points: 75,
        due_date: '2025-07-22T23:59:59Z',
        course_name: 'Desarrollo Web',
        status: 'completed',
        attempts_used: 2,
        max_attempts: 3,
        best_score: 68,
      },
      {
        id: '4',
        title: 'Evaluación de Química Orgánica',
        description:
          'Examen sobre estructuras moleculares y reacciones químicas.',
        duration_minutes: 120,
        total_points: 200,
        due_date: '2025-07-20T23:59:59Z',
        course_name: 'Química Avanzada',
        status: 'overdue',
        attempts_used: 0,
        max_attempts: 1,
      },
    ];
    setEvaluations(sampleEvaluations);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'overdue':
        return <ExpandIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canTakeEvaluation = (evaluation: Evaluation) => {
    return (
      evaluation.status === 'pending' &&
      evaluation.attempts_used < evaluation.max_attempts
    );
  };

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
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Mis Evaluaciones
              </h1>
              <p className="text-gray-600">
                Aquí puedes ver todas tus evaluaciones asignadas y su estado
                actual.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Pendientes
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {evaluations.filter((e) => e.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Completadas
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        evaluations.filter((e) => e.status === 'completed')
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ExpandIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Vencidas
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {evaluations.filter((e) => e.status === 'overdue').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {evaluations.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Evaluations List */}
            <div className="space-y-6">
              {evaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {evaluation.title}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              evaluation.status
                            )}`}
                          >
                            {getStatusIcon(evaluation.status)}
                            {evaluation.status === 'pending' && 'Pendiente'}
                            {evaluation.status === 'completed' && 'Completada'}
                            {evaluation.status === 'overdue' && 'Vencida'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">
                          {evaluation.description}
                        </p>
                        <p className="text-sm font-medium text-gray-700 mb-4">
                          Curso: {evaluation.course_name}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {evaluation.duration_minutes} minutos
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {evaluation.total_points} puntos
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Vence: {formatDueDate(evaluation.due_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          Intentos: {evaluation.attempts_used}/
                          {evaluation.max_attempts}
                        </span>
                      </div>
                    </div>

                    {evaluation.status === 'completed' &&
                      evaluation.best_score && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Mejor puntuación:</strong>{' '}
                            {evaluation.best_score}/{evaluation.total_points}{' '}
                            puntos (
                            {Math.round(
                              (evaluation.best_score /
                                evaluation.total_points) *
                                100
                            )}
                            %)
                          </p>
                        </div>
                      )}

                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        {canTakeEvaluation(evaluation) && (
                          <Link href={`/student/evaluaciones/${evaluation.id}`}>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-brand-200 text-white rounded-lg hover:bg-brand-300 transition-colors duration-200 font-medium">
                              <PlayIcon className="h-4 w-4" />
                              Iniciar Evaluación
                            </button>
                          </Link>
                        )}

                        {evaluation.status === 'completed' && (
                          <Link
                            href={`/student/evaluaciones/${evaluation.id}/resultados`}
                          >
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
                              <DocumentTextIcon className="h-4 w-4" />
                              Ver Resultados
                            </button>
                          </Link>
                        )}
                      </div>

                      {evaluation.status === 'overdue' && (
                        <div className="text-red-600 text-sm font-medium">
                          Evaluación vencida
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {evaluations.length === 0 && (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay evaluaciones disponibles
                </h3>
                <p className="text-gray-600">
                  Cuando tengas evaluaciones asignadas, aparecerán aquí.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationsList;
