import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  ClockIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';
import { AlertTriangle, Clock, FileText } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import SidebarDrawer from '../../../components/student/DrawerNavigation';
import { useAuth } from '../../../context/AuthContext';
import { Profile } from '../../../interfaces/User/UserInterfaces';

interface Question {
  question_id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'open_ended';
  points: number;
  order_index: number;
  options: QuestionOption[];
}

interface QuestionOption {
  option_id: number;
  option_text: string;
  order_index: number;
}

interface UserAnswer {
  question_id: number;
  selected_option_id?: number;
  answer_text?: string;
}

interface EvaluationData {
  evaluation_id: number;
  title: string;
  description: string;
  duration_minutes: number;
  total_points: number;
  instructions: string;
  questions: Question[];
  attempt_id?: number;
}

const TakeEvaluation = () => {
  const router = useRouter();
  const { id } = router.query;
  const { profileInfo, user } = useAuth();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Sample evaluation data
  useEffect(() => {
    if (id) {
      const sampleEvaluation: EvaluationData = {
        evaluation_id: 1,
        title: 'Evaluación de Claro Postpago',
        description: 'Evaluación sobre conceptos de telefonía de Claro',
        duration_minutes: 60,
        total_points: 100,
        instructions:
          'Lee cuidadosamente cada pregunta antes de responder. Una vez iniciada la evaluación, el tiempo comenzará a correr y no se puede pausar. Asegúrate de tener una conexión estable a internet.',
        questions: [
          {
            question_id: 1,
            question_text:
              '¿Cuál es la principal ventaja del plan postpago de Claro?',
            question_type: 'multiple_choice',
            points: 10,
            order_index: 1,
            options: [
              {
                option_id: 1,
                option_text: 'Mayor control del gasto mensual',
                order_index: 1,
              },
              {
                option_id: 2,
                option_text: 'Líneas adicionales sin costo',
                order_index: 2,
              },
              {
                option_id: 3,
                option_text: 'Internet ilimitado en todos los planes',
                order_index: 3,
              },
              {
                option_id: 4,
                option_text: 'Roaming internacional gratuito',
                order_index: 4,
              },
            ],
          },
          {
            question_id: 2,
            question_text:
              '¿Los planes postpago de Claro incluyen llamadas ilimitadas a números Claro?',
            question_type: 'true_false',
            points: 10,
            order_index: 2,
            options: [
              { option_id: 5, option_text: 'Verdadero', order_index: 1 },
              { option_id: 6, option_text: 'Falso', order_index: 2 },
            ],
          },
          {
            question_id: 3,
            question_text:
              'Explica los pasos para activar un plan postpago de Claro',
            question_type: 'open_ended',
            points: 15,
            order_index: 3,
            options: [],
          },
          {
            question_id: 4,
            question_text:
              '¿Qué documentos se requieren para contratar un plan postpago?',
            question_type: 'multiple_choice',
            points: 10,
            order_index: 4,
            options: [
              {
                option_id: 7,
                option_text: 'Solo cédula de identidad',
                order_index: 1,
              },
              {
                option_id: 8,
                option_text: 'Cédula y comprobante de ingresos',
                order_index: 2,
              },
              {
                option_id: 9,
                option_text:
                  'Cédula, comprobante de ingresos y referencias comerciales',
                order_index: 3,
              },
              {
                option_id: 10,
                option_text: 'No se requieren documentos',
                order_index: 4,
              },
            ],
          },
          {
            question_id: 5,
            question_text:
              '¿Es posible cambiar de plan postpago durante el periodo de contrato?',
            question_type: 'true_false',
            points: 10,
            order_index: 5,
            options: [
              { option_id: 11, option_text: 'Verdadero', order_index: 1 },
              { option_id: 12, option_text: 'Falso', order_index: 2 },
            ],
          },
        ],
      };
      setEvaluation(sampleEvaluation);
      setTimeRemaining(sampleEvaluation.duration_minutes * 60); // Convert to seconds
    }
  }, [id]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startEvaluation = async () => {
    try {
      // Aquí llamarías a tu API para crear el attempt
      const response = await fetch('/api/evaluations/start-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evaluation_id: evaluation?.evaluation_id,
          user_id: user?.toString,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAttemptId(data.data.attempt_id);
        setIsStarted(true);
      }
    } catch (error) {
      console.error('Error starting evaluation:', error);
      // For demo purposes, just start
      setIsStarted(true);
      setAttemptId(1); // Demo attempt ID
    }
  };

  const handleAnswerChange = (
    questionId: number,
    optionId?: number,
    text?: string
  ) => {
    setAnswers((prev) => {
      const existingIndex = prev.findIndex((a) => a.question_id === questionId);
      const newAnswer: UserAnswer = {
        question_id: questionId,
        selected_option_id: optionId,
        answer_text: text,
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      } else {
        return [...prev, newAnswer];
      }
    });
  };

  const getCurrentAnswer = (questionId: number) => {
    return answers.find((a) => a.question_id === questionId);
  };

  const isQuestionAnswered = (questionId: number) => {
    const answer = getCurrentAnswer(questionId);
    return answer && (answer.selected_option_id || answer.answer_text?.trim());
  };

  const getAnsweredCount = () => {
    return (
      evaluation?.questions.filter((q) => isQuestionAnswered(q.question_id))
        .length || 0
    );
  };

  const handleTimeExpired = () => {
    alert('El tiempo ha expirado. La evaluación se enviará automáticamente.');
    submitEvaluation(true);
  };

  const submitEvaluation = async (timeExpired = false) => {
    setIsSubmitting(true);
    try {
      // Aquí llamarías a tu API para enviar las respuestas
      const response = await fetch('/api/evaluations/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attempt_id: attemptId,
          answers: answers,
          time_expired: timeExpired,
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push(
          `/student/evaluaciones/${id}/resultados?attempt_id=${attemptId}`
        );
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      // For demo purposes, redirect anyway
      router.push(
        `/student/evaluaciones/${id}/resultados?attempt_id=${attemptId}`
      );
    }
  };

  if (!evaluation) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando...
      </div>
    );
  }

  if (!isStarted) {
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
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {evaluation.title}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {evaluation.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {evaluation.duration_minutes}
                    </div>
                    <div className="text-sm text-gray-600">Minutos</div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {evaluation.questions.length}
                    </div>
                    <div className="text-sm text-gray-600">Preguntas</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <QuestionMarkCircleIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {evaluation.total_points}
                    </div>
                    <div className="text-sm text-gray-600">Puntos</div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                  <div className="flex items-start">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-yellow-800 mb-2">
                        Instrucciones importantes:
                      </h3>
                      <p className="text-yellow-700 mb-4">
                        {evaluation.instructions}
                      </p>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        <li>
                          • Una vez iniciada, no podrás pausar la evaluación
                        </li>
                        <li>• Guarda tus respuestas frecuentemente</li>
                        <li>
                          • Asegúrate de tener conexión estable a internet
                        </li>
                        <li>• Revisa todas tus respuestas antes de enviar</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={startEvaluation}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-200 text-white rounded-lg hover:bg-brand-300 transition-colors duration-200 font-semibold text-lg"
                  >
                    <CheckIcon className="h-6 w-6" />
                    Iniciar Evaluación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = evaluation.questions[currentQuestionIndex];

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
          {/* Header with timer and progress */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {evaluation.title}
                </h1>
                <p className="text-sm text-gray-600">
                  Pregunta {currentQuestionIndex + 1} de{' '}
                  {evaluation.questions.length} • Respondidas:{' '}
                  {getAnsweredCount()}/{evaluation.questions.length}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    timeRemaining < 300
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  <ClockIcon className="h-5 w-5" />
                  <span className="font-mono font-semibold">
                    {formatTime(timeRemaining)}
                  </span>
                </div>

                {timeRemaining < 300 && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    ¡Tiempo limitado!
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-brand-200 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) /
                        evaluation.questions.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {/* Question */}
              <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex-1">
                    {currentQuestion.question_text}
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                    {currentQuestion.points} pts
                  </span>
                </div>

                {/* Answer options */}
                <div className="space-y-4">
                  {currentQuestion.question_type === 'open_ended' ? (
                    <textarea
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-transparent resize-none"
                      rows={6}
                      placeholder="Escribe tu respuesta aquí..."
                      value={
                        getCurrentAnswer(currentQuestion.question_id)
                          ?.answer_text || ''
                      }
                      onChange={(e) =>
                        handleAnswerChange(
                          currentQuestion.question_id,
                          undefined,
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    currentQuestion.options.map((option) => (
                      <label
                        key={option.option_id}
                        className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question_${currentQuestion.question_id}`}
                          value={option.option_id}
                          checked={
                            getCurrentAnswer(currentQuestion.question_id)
                              ?.selected_option_id === option.option_id
                          }
                          onChange={() =>
                            handleAnswerChange(
                              currentQuestion.question_id,
                              option.option_id
                            )
                          }
                          className="h-4 w-4 text-brand-200 focus:ring-brand-200 border-gray-300"
                        />
                        <span className="ml-3 text-gray-900">
                          {option.option_text}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.max(0, currentQuestionIndex - 1)
                    )
                  }
                  disabled={currentQuestionIndex === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Anterior
                </button>

                <div className="flex gap-3">
                  {currentQuestionIndex === evaluation.questions.length - 1 ? (
                    <button
                      onClick={() => setShowConfirmSubmit(true)}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                    >
                      <CheckIcon className="h-4 w-4" />
                      Finalizar Evaluación
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setCurrentQuestionIndex(
                          Math.min(
                            evaluation.questions.length - 1,
                            currentQuestionIndex + 1
                          )
                        )
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-200 text-white rounded-lg hover:bg-brand-300 transition-colors duration-200 font-medium"
                    >
                      Siguiente
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Question navigator */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Navegación rápida:
                </h3>
                <div className="grid grid-cols-10 gap-2">
                  {evaluation.questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        index === currentQuestionIndex
                          ? 'bg-brand-200 text-white'
                          : isQuestionAnswered(
                              evaluation.questions[index].question_id
                            )
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm submit modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar envío de evaluación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres enviar tu evaluación? Has respondido{' '}
              {getAnsweredCount()} de {evaluation.questions.length} preguntas.
              Una vez enviada, no podrás hacer cambios.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => submitEvaluation()}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Evaluación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeEvaluation;
