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
  question_sche_id: number;
  evaluation_sche_id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'open_ended';
  points: number;
  order_index: number;
  explanation: string;
  options: QuestionOption[];
}

interface QuestionOption {
  option_sche_id: number;
  question_sche_id: number;
  option_text: string;
  is_correct: boolean;
  order_index: number;
}

interface UserAnswer {
  question_id: number;
  selected_option_id?: number;
  answer_text?: string;
}

interface EvaluationData {
  evaluation_sche_id: number;
  title: string;
  description: string;
  duration_minutes: number;
  total_points: number;
  passing_score: number;
  user_id: number;
  enterprise_id: number;
  is_active: boolean;
  instructions: string;
  start_date: string;
  due_date: string;
  max_attempts: number;
  show_results_immediately: boolean;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [questionStartTime, setQuestionStartTime] = useState<number>(
    Date.now()
  );
  const [questionTimes, setQuestionTimes] = useState<{ [key: number]: number }>(
    {}
  );

  let name = '';
  let uri_picture = '';
  let userId: number | null = null;

  const userInfo = user as { id: number; enterprise_id: number };
  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
    // Asegúrate de obtener el user_id correctamente del perfil
    userId = userInfo.id;
  }

  // Si no tienes el user_id en profileInfo, intenta obtenerlo de user
  if (!userId && user) {
    // Asume que user puede ser un número o un objeto con id
    if (typeof user === 'number') {
      userId = user;
    } else if (typeof user === 'object' && user.id) {
      userId = user.id;
    } else if (typeof user === 'string') {
      userId = parseInt(user);
    }
  }

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Cuando cambias de pregunta
  const changeQuestion = (newIndex: number) => {
    const currentTime = Date.now();
    const timeSpent = Math.round((currentTime - questionStartTime) / 1000);

    // Guardar tiempo de la pregunta actual
    if (evaluation) {
      const currentQuestionId =
        evaluation.questions[currentQuestionIndex].question_sche_id;
      setQuestionTimes((prev) => ({
        ...prev,
        [currentQuestionId]: (prev[currentQuestionId] || 0) + timeSpent,
      }));
    }

    setCurrentQuestionIndex(newIndex);
    setQuestionStartTime(currentTime);
  };

  // Fetch evaluation data from API
  useEffect(() => {
    const fetchEvaluation = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:4100/api/evaluations/assignment/evaluations-scheduled/${id}`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: EvaluationData = await response.json();

        // Verificar si la evaluación está activa
        if (!data.is_active) {
          setError('Esta evaluación no está disponible');
          return;
        }

        // Verificar si está dentro del período de tiempo
        const now = new Date();
        const startDate = new Date(data.start_date);
        const dueDate = new Date(data.due_date);

        if (now < startDate) {
          setError('Esta evaluación aún no ha comenzado');
          return;
        }

        if (now > dueDate) {
          setError('Esta evaluación ya ha expirado');
          return;
        }

        setEvaluation(data);
        setTimeRemaining(data.duration_minutes * 60); // Convert to seconds
      } catch (error) {
        console.error('Error fetching evaluation:', error);
        setError(
          'Error al cargar la evaluación. Por favor, intenta nuevamente.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
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
      // Validaciones antes de enviar
      if (!evaluation?.evaluation_sche_id) {
        alert('Error: No se ha cargado la evaluación correctamente');
        return;
      }

      if (!userId) {
        alert(
          'Error: Usuario no identificado. Por favor, inicia sesión nuevamente.'
        );
        return;
      }

      console.log('Datos a enviar:', {
        evaluation_sche_id: evaluation.evaluation_sche_id,
        user_id: userId,
      });

      const response = await fetch(
        'http://localhost:4100/api/evaluations/scheduled/start-attempt',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Si tienes autenticación por token, agrégalo aquí
            // 'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            evaluation_sche_id: evaluation.evaluation_sche_id,
            user_id: userId,
          }),
        }
      );

      const data = await response.json();

      console.log('Respuesta del servidor:', data);

      if (data.success) {
        setAttemptId(data.data.attempt_id);
        setIsStarted(true);
      } else {
        alert(data.message || 'Error al iniciar la evaluación');
      }
    } catch (error) {
      console.error('Error starting evaluation:', error);
      alert('Error al iniciar la evaluación');
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
      evaluation?.questions.filter((q) =>
        isQuestionAnswered(q.question_sche_id)
      ).length || 0
    );
  };

  const handleTimeExpired = () => {
    alert('El tiempo ha expirado. La evaluación se enviará automáticamente.');
    submitEvaluation(true);
  };

  const submitEvaluation = async (timeExpired = false) => {
    setIsSubmitting(true);
    try {
      // Formatear respuestas para el backend
      const formattedAnswers = answers.map((answer) => ({
        question_sche_id: answer.question_id, // Esto se mapea a question_sche_id en el backend
        selected_option_id: answer.selected_option_id,
        answer_text: answer.answer_text,
        time_spent_seconds: questionTimes[answer.question_id] || 30, // ✅ Tiempo rea
      }));

      console.log('Enviando evaluación:', {
        attempt_id: attemptId,
        answers: formattedAnswers,
        time_expired: timeExpired,
      });

      const response = await fetch(
        'http://localhost:4100/api/evaluations/scheduled/submit',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attempt_id: attemptId,
            answers: formattedAnswers,
            time_expired: timeExpired,
          }),
        }
      );

      const data = await response.json();
      console.log('Respuesta del envío:', data);

      if (data.success) {
        // Redirigir a resultados
        router.push(
          `/student/evaluaciones/${id}/resultados?attempt_id=${attemptId}`
        );
      } else {
        alert(data.message || 'Error al enviar la evaluación');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      alert('Error al enviar la evaluación');
      setIsSubmitting(false);
    }
  };

  // Función opcional para guardar progreso
  const saveAnswerProgress = async (
    questionId: number,
    optionId?: number,
    text?: string
  ) => {
    if (!attemptId) return;

    try {
      await fetch(
        'http://localhost:4100/api/evaluations/scheduled/save-answer',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attempt_id: attemptId,
            question_sche_id: questionId,
            option_sche_id: optionId,
            answer_text: text,
            time_spent_seconds: 0, // Puedes calcular el tiempo real aquí
          }),
        }
      );
    } catch (error) {
      console.error('Error saving progress:', error);
      // No mostrar error al usuario, es solo para guardar progreso
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-200 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando evaluación...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar la evaluación
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

  if (!evaluation) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">No se encontró la evaluación</p>
      </div>
    );
  }

  // Verificar que tenemos userId antes de mostrar la interfaz
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Usuario no identificado
          </h2>
          <p className="text-gray-600 mb-4">
            Por favor, inicia sesión para continuar con la evaluación.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-brand-200 text-white rounded-lg hover:bg-brand-300 transition-colors duration-200"
          >
            Ir a Login
          </button>
        </div>
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

                {/* Mostrar información adicional de la evaluación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Puntuación mínima para aprobar:
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {evaluation.passing_score} de {evaluation.total_points}{' '}
                      puntos
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Intentos máximos:</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {evaluation.max_attempts}
                    </p>
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
                        <li>
                          • Puntuación mínima para aprobar:{' '}
                          {evaluation.passing_score} puntos
                        </li>
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
                        getCurrentAnswer(currentQuestion.question_sche_id)
                          ?.answer_text || ''
                      }
                      onChange={(e) =>
                        handleAnswerChange(
                          currentQuestion.question_sche_id,
                          undefined,
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    currentQuestion.options.map((option) => (
                      <label
                        key={option.option_sche_id}
                        className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question_${currentQuestion.question_sche_id}`}
                          value={option.option_sche_id}
                          checked={
                            getCurrentAnswer(currentQuestion.question_sche_id)
                              ?.selected_option_id === option.option_sche_id
                          }
                          onChange={() =>
                            handleAnswerChange(
                              currentQuestion.question_sche_id,
                              option.option_sche_id
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
                              evaluation.questions[index].question_sche_id
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
