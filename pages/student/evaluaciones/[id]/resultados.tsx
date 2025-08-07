import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  TrophyIcon,
} from '@heroicons/react/24/solid';
import { API_EVALUATIONS_R } from '../../../../utils/Endpoints';
import { Calendar, Target, Award } from 'lucide-react';
import Navbar from '../../../../components/Navbar';
import SidebarDrawer from '../../../../components/student/DrawerNavigation';
import { useAuth } from '../../../../context/AuthContext';
import { Profile } from '../../../../interfaces/User/UserInterfaces';

interface QuestionResult {
  question_sche_id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'open_ended';
  points: number;
  explanation: string;
  user_answer: {
    selected_option_id?: number;
    answer_text?: string;
    is_correct: boolean | null;
    points_earned: number;
  };
  correct_options: Array<{
    option_sche_id: number;
    option_text: string;
    is_correct: boolean;
  }>;
  all_options: Array<{
    option_sche_id: number;
    option_text: string;
    is_correct: boolean;
  }>;
}

interface EvaluationResult {
  attempt_id: number;
  evaluation: {
    evaluation_sche_id: number;
    title: string;
    description: string;
    total_points: number;
    passing_score: number;
  };
  score: number;
  percentage: number;
  time_spent_minutes: number;
  completed_at: string;
  submitted_at: string;
  status: string;
  passed: boolean;
  questions: QuestionResult[];
}

const EvaluationResults = () => {
  const router = useRouter();
  const { id, attempt_id } = router.query;
  const { profileInfo } = useAuth();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [results, setResults] = useState<EvaluationResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
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

  // Fetch results from API
  useEffect(() => {
    const fetchResults = async () => {
      if (!attempt_id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_EVALUATIONS_R}/scheduled/attempt/${attempt_id}/results`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Error al cargar los resultados');
        }

        // Transformar los datos para que coincidan con la interfaz
        const transformedResults: EvaluationResult = {
          attempt_id: data.data.attempt_id,
          evaluation: {
            evaluation_sche_id: data.data.evaluation.evaluation_sche_id,
            title: data.data.evaluation.title,
            description: data.data.evaluation.description,
            total_points: data.data.evaluation.total_points,
            passing_score: data.data.evaluation.passing_score,
          },
          score: data.data.score,
          percentage: parseFloat(data.data.percentage),
          time_spent_minutes: data.data.time_spent_minutes,
          completed_at: data.data.completed_at,
          submitted_at: data.data.submitted_at,
          status: data.data.status,
          passed: data.data.score >= data.data.evaluation.passing_score,
          questions: data.data.evaluation.questions.map((question: any) => {
            // Buscar la respuesta del usuario para esta pregunta
            const userAnswer = data.data.answers.find(
              (answer: any) =>
                answer.question_sche_id === question.question_sche_id
            );

            return {
              question_sche_id: question.question_sche_id,
              question_text: question.question_text,
              question_type: question.question_type,
              points: question.points,
              explanation: question.explanation,
              user_answer: {
                selected_option_id: userAnswer?.option_sche_id || null,
                answer_text: userAnswer?.answer_text || '',
                is_correct: userAnswer?.is_correct || false,
                points_earned: userAnswer?.points_earned || 0,
              },
              correct_options: question.options.filter(
                (opt: any) => opt.is_correct
              ),
              all_options: question.options,
            };
          }),
        };

        setResults(transformedResults);
      } catch (error) {
        console.error('Error fetching results:', error);
        setError(
          'Error al cargar los resultados. Por favor, intenta nuevamente.'
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

  if (!results) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">No se encontraron resultados</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-50 border-green-200';
    if (percentage >= 80) return 'bg-blue-50 border-blue-200';
    if (percentage >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      completed: 'Completada',
      time_expired: 'Tiempo Expirado',
      abandoned: 'Abandonada',
      in_progress: 'En Progreso',
    };
    return statusMap[status] || status;
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
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
              <Link href="/student/evaluaciones">
                <button className="inline-flex items-center gap-2 text-brand-200 hover:text-brand-300 mb-4">
                  <ArrowLeftIcon className="h-4 w-4" />
                  Volver a evaluaciones
                </button>
              </Link>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Resultados de la Evaluación
              </h1>
              <p className="text-gray-600">{results.evaluation.title}</p>
            </div>

            {/* Results Summary */}
            <div
              className={`rounded-lg border-2 p-8 mb-8 ${getScoreBgColor(
                results.percentage
              )}`}
            >
              <div className="text-center">
                {results.passed ? (
                  <div className="mb-4">
                    <TrophyIcon className="h-16 w-16 text-yellow-500 mx-auto mb-2" />
                    <h2 className="text-2xl font-bold text-green-700">
                      ¡Felicitaciones!
                    </h2>
                    <p className="text-green-600">Has aprobado la evaluación</p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-2" />
                    <h2 className="text-2xl font-bold text-red-700">
                      No aprobaste
                    </h2>
                    <p className="text-red-600">
                      Necesitas mejorar tu puntuación
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                  <div className="text-center">
                    <div
                      className={`text-4xl font-bold ${getScoreColor(
                        results.percentage
                      )}`}
                    >
                      {results.score}
                    </div>
                    <div className="text-sm text-gray-600">
                      de {results.evaluation.total_points} puntos
                    </div>
                  </div>

                  <div className="text-center">
                    <div
                      className={`text-4xl font-bold ${getScoreColor(
                        results.percentage
                      )}`}
                    >
                      {results.percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Porcentaje obtenido
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">
                      {results.time_spent_minutes}
                    </div>
                    <div className="text-sm text-gray-600">
                      Minutos utilizados
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600">
                      {Math.round(
                        (results.evaluation.passing_score /
                          results.evaluation.total_points) *
                          100
                      )}
                      %
                    </div>
                    <div className="text-sm text-gray-600">
                      Requerido para aprobar
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Correctas
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        results.questions.filter(
                          (q) => q.user_answer.is_correct === true
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Incorrectas
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        results.questions.filter(
                          (q) => q.user_answer.is_correct === false
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Completada
                    </p>
                    <p className="text-xs text-gray-900">
                      {formatDate(results.completed_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Estado</p>
                    <p className="text-sm font-bold text-gray-900">
                      {getStatusText(results.status)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Results Toggle */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Revisión detallada de respuestas
                </h3>
                <div
                  className={`transform transition-transform ${
                    showDetails ? 'rotate-180' : ''
                  }`}
                >
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {showDetails && (
                <div className="mt-6 space-y-6">
                  {results.questions.map((question, index) => (
                    <div
                      key={question.question_sche_id}
                      className="border-l-4 border-gray-200 pl-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                          Pregunta {index + 1}: {question.question_text}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {question.user_answer.points_earned}/
                            {question.points} pts
                          </span>
                          {question.user_answer.is_correct === true ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : question.user_answer.is_correct === false ? (
                            <XCircleIcon className="h-5 w-5 text-red-500" />
                          ) : (
                            <ClockIcon className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                      </div>

                      {question.question_type === 'open_ended' ? (
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Tu respuesta:
                            </p>
                            <div className="bg-gray-50 p-3 rounded text-sm">
                              {question.user_answer.answer_text ||
                                'Sin respuesta'}
                            </div>
                          </div>
                          {question.explanation && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Explicación:
                              </p>
                              <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                                {question.explanation}
                              </div>
                            </div>
                          )}
                          {question.user_answer.is_correct === null && (
                            <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800">
                              <strong>Nota:</strong> Esta respuesta requiere
                              evaluación manual.
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {question.all_options.map((option) => (
                            <div
                              key={option.option_sche_id}
                              className={`p-3 rounded text-sm ${
                                option.option_sche_id ===
                                question.user_answer.selected_option_id
                                  ? option.is_correct
                                    ? 'bg-green-100 border border-green-300'
                                    : 'bg-red-100 border border-red-300'
                                  : option.is_correct
                                  ? 'bg-green-50 border border-green-200'
                                  : 'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{option.option_text}</span>
                                <div className="flex items-center gap-2">
                                  {option.option_sche_id ===
                                    question.user_answer.selected_option_id && (
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-700">
                                      Tu respuesta
                                    </span>
                                  )}
                                  {option.is_correct && (
                                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          {question.explanation && (
                            <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 mt-2">
                              <strong>Explicación:</strong>{' '}
                              {question.explanation}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="text-center space-y-4">
              <div className="flex justify-center gap-4">
                <Link href="/student/evaluaciones">
                  <button className="px-6 py-3 bg-brand-200  text-white rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
                    Volver a Evaluaciones
                  </button>
                </Link>

                
              </div>

              {!results.passed && (
                <p className="text-sm text-gray-600">
                  Puedes intentar nuevamente si tienes intentos disponibles
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationResults;
