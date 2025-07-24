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
import { Calendar, Target, Award } from 'lucide-react';
import Navbar from '../../../../components/Navbar';
import SidebarDrawer from '../../../../components/student/DrawerNavigation';
import { useAuth } from '../../../../context/AuthContext';
import { Profile } from '../../../../interfaces/User/UserInterfaces';

interface QuestionResult {
  question_id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'open_ended';
  points: number;
  user_answer: {
    selected_option_id?: number;
    answer_text?: string;
    is_correct: boolean;
    points_earned: number;
  };
  correct_answer: {
    option_id?: number;
    option_text?: string;
    explanation?: string;
  };
  all_options: Array<{
    option_id: number;
    option_text: string;
    is_correct: boolean;
  }>;
}

interface EvaluationResult {
  attempt_id: number;
  evaluation: {
    evaluation_id: number;
    title: string;
    description: string;
    total_points: number;
    passing_score: number;
  };
  score: number;
  percentage: number;
  time_spent_minutes: number;
  completed_at: string;
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

  // Sample results data
  useEffect(() => {
    if (id && attempt_id) {
      const sampleResults: EvaluationResult = {
        attempt_id: 1,
        evaluation: {
          evaluation_id: 1,
          title: 'Evaluación de Claro Postpago',
          description: 'Evaluación sobre conceptos de telefonía de Claro',
          total_points: 55,
          passing_score: 39, // 70% of 55
        },
        score: 45,
        percentage: 81.82,
        time_spent_minutes: 42,
        completed_at: '2025-07-22T15:30:00Z',
        status: 'completed',
        passed: true,
        questions: [
          {
            question_id: 1,
            question_text:
              '¿Cuál es la principal ventaja del plan postpago de Claro?',
            question_type: 'multiple_choice',
            points: 10,
            user_answer: {
              selected_option_id: 1,
              is_correct: true,
              points_earned: 10,
            },
            correct_answer: {
              option_id: 1,
              option_text: 'Mayor control del gasto mensual',
              explanation:
                'Los planes postpago permiten un mejor control del gasto ya que tienes un monto fijo mensual.',
            },
            all_options: [
              {
                option_id: 1,
                option_text: 'Mayor control del gasto mensual',
                is_correct: true,
              },
              {
                option_id: 2,
                option_text: 'Líneas adicionales sin costo',
                is_correct: false,
              },
              {
                option_id: 3,
                option_text: 'Internet ilimitado en todos los planes',
                is_correct: false,
              },
              {
                option_id: 4,
                option_text: 'Roaming internacional gratuito',
                is_correct: false,
              },
            ],
          },
          {
            question_id: 2,
            question_text:
              '¿Los planes postpago de Claro incluyen llamadas ilimitadas a números Claro?',
            question_type: 'true_false',
            points: 10,
            user_answer: {
              selected_option_id: 5,
              is_correct: true,
              points_earned: 10,
            },
            correct_answer: {
              option_id: 5,
              option_text: 'Verdadero',
              explanation:
                'Efectivamente, la mayoría de planes postpago incluyen llamadas ilimitadas entre números Claro.',
            },
            all_options: [
              { option_id: 5, option_text: 'Verdadero', is_correct: true },
              { option_id: 6, option_text: 'Falso', is_correct: false },
            ],
          },
          {
            question_id: 3,
            question_text:
              'Explica los pasos para activar un plan postpago de Claro',
            question_type: 'open_ended',
            points: 15,
            user_answer: {
              answer_text:
                'Los pasos son: 1) Acercarse a un centro de atención Claro, 2) Presentar documentos requeridos, 3) Elegir el plan, 4) Firmar contrato, 5) Activar la línea',
              is_correct: true,
              points_earned: 12,
            },
            correct_answer: {
              explanation:
                'Respuesta parcialmente correcta. Faltó mencionar la verificación crediticia y el tiempo de activación.',
            },
            all_options: [],
          },
          {
            question_id: 4,
            question_text:
              '¿Qué documentos se requieren para contratar un plan postpago?',
            question_type: 'multiple_choice',
            points: 10,
            user_answer: {
              selected_option_id: 9,
              is_correct: true,
              points_earned: 10,
            },
            correct_answer: {
              option_id: 9,
              option_text:
                'Cédula, comprobante de ingresos y referencias comerciales',
              explanation:
                'Para un plan postpago se requiere identificación, demostrar capacidad de pago y referencias.',
            },
            all_options: [
              {
                option_id: 7,
                option_text: 'Solo cédula de identidad',
                is_correct: false,
              },
              {
                option_id: 8,
                option_text: 'Cédula y comprobante de ingresos',
                is_correct: false,
              },
              {
                option_id: 9,
                option_text:
                  'Cédula, comprobante de ingresos y referencias comerciales',
                is_correct: true,
              },
              {
                option_id: 10,
                option_text: 'No se requieren documentos',
                is_correct: false,
              },
            ],
          },
          {
            question_id: 5,
            question_text:
              '¿Es posible cambiar de plan postpago durante el periodo de contrato?',
            question_type: 'true_false',
            points: 10,
            user_answer: {
              selected_option_id: 12,
              is_correct: false,
              points_earned: 0,
            },
            correct_answer: {
              option_id: 11,
              option_text: 'Verdadero',
              explanation:
                'Sí es posible cambiar de plan, aunque pueden aplicar ciertas condiciones según el contrato.',
            },
            all_options: [
              { option_id: 11, option_text: 'Verdadero', is_correct: true },
              { option_id: 12, option_text: 'Falso', is_correct: false },
            ],
          },
        ],
      };
      setResults(sampleResults);
    }
  }, [id, attempt_id]);

  if (!results) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando resultados...
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
                          (q) => q.user_answer.is_correct
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
                          (q) => !q.user_answer.is_correct
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
                      {results.passed ? 'Aprobado' : 'No aprobado'}
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
                      key={question.question_id}
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
                          {question.user_answer.is_correct ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircleIcon className="h-5 w-5 text-red-500" />
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
                              {question.user_answer.answer_text}
                            </div>
                          </div>
                          {question.correct_answer.explanation && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Feedback:
                              </p>
                              <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                                {question.correct_answer.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {question.all_options.map((option) => (
                            <div
                              key={option.option_id}
                              className={`p-3 rounded text-sm ${
                                option.option_id ===
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
                                  {option.option_id ===
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
                          {question.correct_answer.explanation && (
                            <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 mt-2">
                              <strong>Explicación:</strong>{' '}
                              {question.correct_answer.explanation}
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
                  <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
                    Volver a Evaluaciones
                  </button>
                </Link>

                <Link href="/student/evaluaciones/historial">
                  <button className="px-6 py-3 bg-brand-200 text-white rounded-lg hover:bg-brand-300 transition-colors duration-200 font-medium">
                    Ver Historial
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
