import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/supervisor/SibebarSupervisor';
import { useAuth } from '../../../context/AuthContext';
import './../../../app/globals.css';
import ProtectedRoute from '../../../components/Auth/ProtectedRoute';

// Import your interfaces
import {
  EvaluationAttempt,
  EvaluationAttemptsResponse,
  EvaluationAnswer,
  EvaluationQuestion,
  EvaluationOption,
} from '../../../interfaces/EvaluationModule/EvaluationStudentAttempt';

const CorporateUsers: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const router = useRouter();
  const { user_id, evaluation_sche_id } = router.query;

  // State for evaluation attempts
  const [evaluationAttempts, setEvaluationAttempts] = useState<
    EvaluationAttempt[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttempt, setSelectedAttempt] =
    useState<EvaluationAttempt | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Function to fetch evaluation attempts
  const fetchEvaluationAttempts = async () => {
    if (!user_id || !evaluation_sche_id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:4100/api/evaluations/scheduled/results/${user_id}/${evaluation_sche_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: EvaluationAttemptsResponse = await response.json();

      if (data.success) {
        setEvaluationAttempts(data.data);
      } else {
        setError('Failed to fetch evaluation attempts');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching evaluation attempts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or when query parameters change
  useEffect(() => {
    fetchEvaluationAttempts();
  }, [user_id, evaluation_sche_id]);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Format status helper
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'abandoned':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get user's answer for a specific question
  const getUserAnswer = (questionId: number, answers: EvaluationAnswer[]) => {
    return answers.find((answer) => answer.question_sche_id === questionId);
  };

  // Get the correct option for a question
  const getCorrectOption = (question: EvaluationQuestion) => {
    return question.options.find((option) => option.is_correct);
  };

  // Check if user's answer is correct
  const isAnswerCorrect = (userAnswer: EvaluationAnswer | undefined) => {
    return userAnswer?.is_correct || false;
  };

  // Show attempt details
  const showAttemptDetails = (attempt: EvaluationAttempt) => {
    setSelectedAttempt(attempt);
    setShowDetails(true);
  };

  // Close details modal
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedAttempt(null);
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={true} setShowSidebar={() => {}} />
          <main
            className={`p-6 flex-grow transition-all duration-300 ease-in-out ml-20`}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-black">
                Intentos de Evaluación del Usuario
              </h2>
              {user_id && evaluation_sche_id && (
                <p className="text-gray-600">
                  Usuario ID: {user_id} | Evaluación ID: {evaluation_sche_id}
                </p>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Cargando intentos...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong>Error:</strong> {error}
                <button
                  onClick={fetchEvaluationAttempts}
                  className="ml-4 text-red-700 underline hover:text-red-800"
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Evaluation Attempts List */}
            {!loading && !error && evaluationAttempts.length > 0 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Intento #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Evaluación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Puntuación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Porcentaje
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiempo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {evaluationAttempts.map((attempt) => (
                        <tr
                          key={attempt.attempt_id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {attempt.attempt_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {attempt.evaluation.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {attempt.evaluation.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {attempt.score} / {attempt.evaluation.total_points}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {attempt.percentage}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                attempt.status
                              )}`}
                            >
                              {attempt.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {attempt.time_spent_minutes} min
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(attempt.started_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => showAttemptDetails(attempt)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                            >
                              Ver Detalles
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* No Data State */}
            {!loading && !error && evaluationAttempts.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg">
                  No se encontraron intentos de evaluación para este usuario.
                </div>
              </div>
            )}

            {/* Missing Parameters State */}
            {(!user_id || !evaluation_sche_id) && (
              <div className="bg-amber-100 border border-amber-400 text-amber-700 px-4 py-3 rounded">
                <strong>Información requerida:</strong> Se necesitan los
                parámetros user_id y evaluation_sche_id en la URL.
              </div>
            )}

            {/* Details Modal */}
            {showDetails && selectedAttempt && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Detalles del Intento #{selectedAttempt.attempt_number}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {selectedAttempt.evaluation.title}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              selectedAttempt.status
                            )}`}
                          >
                            {selectedAttempt.status}
                          </span>
                          <span className="text-sm text-gray-600">
                            Puntuación: {selectedAttempt.score}/
                            {selectedAttempt.evaluation.total_points} (
                            {selectedAttempt.percentage}%)
                          </span>
                          <span className="text-sm text-gray-600">
                            Tiempo: {selectedAttempt.time_spent_minutes} min
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={closeDetails}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Questions and Answers */}
                    <div className="space-y-6">
                      {selectedAttempt.evaluation.questions
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((question, questionIndex) => {
                          const userAnswer = getUserAnswer(
                            question.question_sche_id,
                            selectedAttempt.answers
                          );
                          const correctOption = getCorrectOption(question);
                          const isCorrect = isAnswerCorrect(userAnswer);
                          const userSelectedOption = question.options.find(
                            (option) =>
                              option.option_sche_id ===
                              userAnswer?.option_sche_id
                          );

                          return (
                            <div
                              key={question.question_sche_id}
                              className={`border rounded-lg p-4 ${
                                isCorrect
                                  ? 'border-green-300 bg-green-50'
                                  : 'border-red-300 bg-red-50'
                              }`}
                            >
                              {/* Question Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                                      Pregunta {questionIndex + 1}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {question.points} puntos
                                    </span>
                                    {isCorrect ? (
                                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                        ✓ Correcta
                                      </span>
                                    ) : (
                                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                                        ✗ Incorrecta
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                                    {question.question_text}
                                  </h4>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-600">
                                    Puntos obtenidos:{' '}
                                    {userAnswer?.points_earned || 0}/
                                    {question.points}
                                  </div>
                                  {userAnswer && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Tiempo:{' '}
                                      {Math.round(
                                        userAnswer.time_spent_seconds / 60
                                      )}{' '}
                                      min
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Options */}
                              <div className="space-y-2">
                                {question.options
                                  .sort((a, b) => a.order_index - b.order_index)
                                  .map((option) => {
                                    const isUserSelected =
                                      userSelectedOption?.option_sche_id ===
                                      option.option_sche_id;
                                    const isCorrectOption = option.is_correct;

                                    let optionClass =
                                      'border border-gray-200 bg-white';
                                    let iconClass = '';
                                    let icon = '';

                                    if (isCorrectOption && isUserSelected) {
                                      // User selected the correct answer
                                      optionClass =
                                        'border-green-400 bg-green-100';
                                      iconClass = 'text-green-600';
                                      icon = '✓';
                                    } else if (
                                      isCorrectOption &&
                                      !isUserSelected
                                    ) {
                                      // This is the correct answer but user didn't select it
                                      optionClass =
                                        'border-green-400 bg-green-50';
                                      iconClass = 'text-green-600';
                                      icon = '✓';
                                    } else if (
                                      !isCorrectOption &&
                                      isUserSelected
                                    ) {
                                      // User selected wrong answer
                                      optionClass = 'border-red-400 bg-red-100';
                                      iconClass = 'text-red-600';
                                      icon = '✗';
                                    }

                                    return (
                                      <div
                                        key={option.option_sche_id}
                                        className={`p-3 rounded-md ${optionClass}`}
                                      >
                                        <div className="flex items-center space-x-3">
                                          <div
                                            className={`w-6 h-6 flex items-center justify-center ${iconClass} font-bold`}
                                          >
                                            {icon}
                                          </div>
                                          <div className="flex-1">
                                            <span className="text-gray-900">
                                              {option.option_text}
                                            </span>
                                            {isUserSelected && (
                                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                Tu respuesta
                                              </span>
                                            )}
                                            {isCorrectOption &&
                                              !isUserSelected && (
                                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                  Respuesta correcta
                                                </span>
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>

                              {/* Question Explanation */}
                              {question.explanation && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                  <div className="flex items-start space-x-2">
                                    <div className="text-blue-600 font-medium text-sm">
                                      💡 Explicación:
                                    </div>
                                    <div className="text-blue-900 text-sm">
                                      {question.explanation}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Answer Status */}
                              {!userAnswer && (
                                <div className="mt-3 p-2 bg-gray-100 border border-gray-300 rounded-md">
                                  <span className="text-gray-600 text-sm">
                                    ⚠️ No se respondió esta pregunta
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>

                    {/* Summary */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Resumen del Intento
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">
                            Total preguntas:
                          </span>
                          <div className="font-medium">
                            {selectedAttempt.evaluation.questions.length}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            Respuestas correctas:
                          </span>
                          <div className="font-medium text-green-600">
                            {
                              selectedAttempt.answers.filter(
                                (answer) => answer.is_correct
                              ).length
                            }
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            Respuestas incorrectas:
                          </span>
                          <div className="font-medium text-red-600">
                            {
                              selectedAttempt.answers.filter(
                                (answer) => !answer.is_correct
                              ).length
                            }
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Sin responder:</span>
                          <div className="font-medium text-gray-600">
                            {selectedAttempt.evaluation.questions.length -
                              selectedAttempt.answers.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CorporateUsers;
