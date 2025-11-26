import { useRouter } from 'next/router';
import { useAuth } from '../../../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { Profile } from '@/interfaces/User/UserInterfaces';
import Navbar from '@/components/Navbar';
import SidebarDrawer from '@/components/student/DrawerNavigation';
import {
  AlertTriangle,
  CheckIcon,
  Clock,
  ClockIcon,
  FileText,
} from 'lucide-react';
import { API_STUDENT_CERTIFICATIONS } from '../../../../utils/Endpoints';
import {
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/solid';

interface QuestionOption {
  option_id: number;
  question_id: number;
  option_text: string;
  is_correct: boolean;
  option_order: number;
}

interface Question {
  question_id: number;
  question_text: string;
  type_id: number;
  points_value: number;
  options: QuestionOption[];
}

interface CertificationData {
  assignment_id: number;
  certification_sche_id: number;
  title: string;
  description: string;
  instructions: string;
  duration_in_minutes: number;
  passing_score: number;
  user_id: number;
  enterprise_id: number;
  is_active: boolean;
  start_date: string;
  due_date: string;
  max_attempts: number;
  show_results_inmediatly: boolean;
  questions: Question[];
  attempt_id?: number;
}

interface StudentAnswer {
  question_id: number;
  selected_option_ids: number[];
  answer_text?: string;
}

const TakeCertificationExam = () => {
  const router = useRouter();
  //obtener id de la url
  const { id } = router.query;
  const { user, profileInfo } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [certification, setCertification] = useState<CertificationData | null>(
    null
  );
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [questionStarterTime, setQuestionStarterTime] = useState<number>(
    Date.now()
  );
  const [questionsTimes, setQuestionsTimes] = useState<{
    [key: number]: number;
  }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  let name = '';
  let uri_picture = '';
  let userId: number | null = null;

  const userInfo = user as { id: number; enterprise_id: number };
  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
    userId = userInfo.id;
  }

  if (!userId && user) {
    if (typeof user === 'number') {
      userId = user;
    } else if (typeof user === 'object' && user.id) {
      userId = user.id;
    } else if (typeof user === 'string') {
      userId = parseInt(user);
    }
  }

  //handler para abrir y cerrar el sidebar
  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  //handler para cambiar de pregunta en el examen
  const changeQuestion = (newIndex: number) => {
    const currentTime = Date.now();
    const timeSpent = Math.round((currentTime - questionStarterTime) / 1000);

    if (certification) {
      const currentQuestionId =
        certification.questions[currentQuestionIndex].question_id;
      setQuestionsTimes((prev) => ({
        ...prev,
        [currentQuestionId]: (prev[currentQuestionId] || 0) + timeSpent,
      }));
    }
    setCurrentQuestionIndex(newIndex);
    setQuestionStarterTime(currentTime);
  };

  //handler para iniciar la evaluación
  const startEvaluation = async () => {
    try {
      if (!certification?.certification_sche_id) {
        alert('No se ha cargado la certificación correctamente.');
        return;
      }

      if (!userId) {
        alert('Usuario no identificado. Por favor, inicia sesión.');
        return;
      }

      const response = await fetch(
        `${API_STUDENT_CERTIFICATIONS}/attempt/start`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            certification_sche_id: certification.certification_sche_id,
            assignment_id: certification.assignment_id,
            user_id: userId,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setAttemptId(data.data.attempt_id);
      } else {
        alert(data.message || 'Error al iniciar la evaluación.');
      }
    } catch (error) {
      console.error('Error starting evaluation:', error);
      alert(
        'Ocurrió un error al iniciar la evaluación. Por favor, intenta nuevamente.'
      );
    } finally {
      setIsStarted(true);
    }
  };

  //handler para manejar las respuestas de elección simple
  const handleSingleChoiceAnswer = (questionId: number, optionId: number) => {
    setStudentAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex(
        (ans) => ans.question_id === questionId
      );

      const newAnswer: StudentAnswer = {
        question_id: questionId,
        selected_option_ids: [optionId],
      };

      if (existingAnswerIndex >= 0) {
        const updatedAnswers = [...prev];
        updatedAnswers[existingAnswerIndex] = newAnswer;
        return updatedAnswers;
      } else {
        return [...prev, newAnswer];
      }
    });
  };

  //handler para enviar la evaluación
  const submitEvaluation = async (timeExpired = false) => {
    setIsSubmitting(true);
    try {
      const respuestasFormat = studentAnswers.map((answer) => ({
        question_id: answer.question_id,
        selected_option_ids: answer.selected_option_ids,
        answer_text: answer.answer_text || '',
        time_spent_seconds: questionsTimes[answer.question_id] || 0,
      }));

      console.log('Submitting Answers:', respuestasFormat);

      const response = await fetch(
        `${API_STUDENT_CERTIFICATIONS}/attempt/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            attempt_id: attemptId,
            user_id: userId,
            answers: respuestasFormat,
            time_expired: timeExpired,
          }),
        }
      );

      const data = await response.json();
      console.log('Submit Attempt Response:', data);

      if (data.success) {
        router.push(
          `/student/certificaciones/exam/${id}/resultados?attempt_id=${attemptId}`
        );
      } else {
        alert(data.message || 'Error al enviar la evaluación.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      alert(
        'Ocurrió un error al enviar la evaluación. Por favor, intenta nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
      setShowConfirmSubmit(false);
    }
  };

  const getStudentAnswer = (questionId: number): StudentAnswer | null => {
    return studentAnswers.find((ans) => ans.question_id === questionId) || null;
  };

  useEffect(() => {
    const fetchCertification = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_STUDENT_CERTIFICATIONS}/certification-scheduled/${id}`
        );

        if (!response.ok) {
          throw new Error('Error al cargar el examen de certificación');
        }

        const data: CertificationData = await response.json();
        console.log('------------------------------------------');
        console.log('Certification Data:', data);

        if (!data.is_active) {
          setError('La certificación no está activa.');
          return;
        }

        const now = new Date();
        const startDate = new Date(data.start_date);
        const dueDate = new Date(data.due_date);

        if (now < startDate) {
          setError('La certificación aún no ha comenzado.');
          return;
        }

        if (now > dueDate) {
          setError('La certificación ha expirado.');
          return;
        }
        setCertification(data);
        setTimeRemaining(data.duration_in_minutes * 60);
      } catch (error: any) {
        console.error('Error fetching certification:', error);
        setError(error.message || 'Error al cargar el examen de certificación');
      } finally {
        setLoading(false);
      }
    };

    fetchCertification();
  }, [id]);

  //contador regresivo para el examen
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

  //método auxiliar para darle formato a la fecha
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

  //handler para manejar tiempo expirado y enviar la evaluación de forma automática
  const handleTimeExpired = () => {
    alert(
      'El tiempo para completar el examen ha expirado. La evaluación se enviará automáticamente.'
    );
    submitEvaluation();
  };

  //método auxiliar para obtener la etiqueta del tipo de pregunta
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case '1':
        return 'Selección simple';
      case '2':
        return 'Selección múltiple';
      case '3':
        return 'Verdadero/Falso';
      case '4':
        return 'Respuesta abierta';
      default:
        return 'Selección única';
    }
  };

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

  if (!certification) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">
          No se encontró el examen de certificación
        </p>
      </div>
    );
  }

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
                    {certification ? certification.title : 'Cargando...'}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {certification ? certification.description : ''}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {certification ? certification.duration_in_minutes : 0}{' '}
                    </div>
                    <div className="text-sm text-gray-600">Minutos</div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {certification ? certification.questions.length : 0}
                    </div>
                    <div className="text-sm text-gray-600">Preguntas</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <QuestionMarkCircleIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {certification ? certification.passing_score : 0}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Porcentaje para aprobar
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 font-bold">
                        Intentos permitidos:{' '}
                        {certification ? certification.max_attempts : 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                  <div className="flex items-start">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-yellow-800 mb-2">
                        Asegúrate de leer todas las instrucciones antes de
                        comenzar el examen.
                      </h3>
                      <p className="text-yellow-700 mb-4">
                        {certification ? certification.instructions : ''}
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
                          • Para preguntas de selección múltiple, puedes elegir
                          más de una opción
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={startEvaluation}
                    className="bg-blue-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors duration-300"
                  >
                    Iniciar Examen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = certification.questions[currentQuestionIndex];
  console.log('Current Question:', currentQuestion);
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

        <div className="pt-16">
          <div
            className={`transition-all duration-300 ${
              isDrawerOpen ? 'lg:ml-64' : 'lg:ml-16'
            }`}
          >
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="container mx-auto flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-semibold  text-gray-900">
                    Examen de Certificación: {certification.title}
                  </h1>
                  <p className="text-sm text-gray-600">
                    Pregunta {currentQuestionIndex + 1} de{' '}
                    {certification.questions.length} • Respondidas:{' '}
                    {Object.keys(questionsTimes).length}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      timeRemaining < 300
                        ? 'bg-red-100 text-red-500'
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
                      ¡Quedan menos de 5 minutos!
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand-200 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((currentQuestionIndex + 1) /
                          certification.questions.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex-items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {currentQuestion.question_text}
                        </h2>
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                          {currentQuestion.points_value} pts
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {getQuestionTypeLabel(
                            currentQuestion.type_id.toString()
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* opciones */}
                  <div className="space-y-4">
                    {currentQuestion.type_id === 1 ? (
                      // Selección simple
                      <div>
                        {currentQuestion.options.map((option) => {
                          const studentAnswer = getStudentAnswer(
                            currentQuestion.question_id
                          );
                          const isSelected =
                            studentAnswer?.selected_option_ids.includes(
                              option.option_id
                            ) || false;
                          return (
                            <div
                              key={option.option_id}
                              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer mt-2"
                              onClick={() =>
                                handleSingleChoiceAnswer(
                                  currentQuestion.question_id,
                                  option.option_id
                                )
                              }
                            >
                              <input
                                type="radio"
                                name={`question_${currentQuestion.question_id}`}
                                checked={isSelected}
                                onChange={() =>
                                  handleSingleChoiceAnswer(
                                    currentQuestion.question_id,
                                    option.option_id
                                  )
                                }
                                className="h-5 w-5 text-blue-600 border-gray-300"
                              />
                              <label className="text-gray-800 flex-1 cursor-pointer">
                                {option.option_text}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() =>
                        changeQuestion(Math.max(0, currentQuestionIndex - 1))
                      }
                      disabled={currentQuestionIndex === 0}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                      Anterior
                    </button>

                    <div className="flex gap-3">
                      {currentQuestionIndex ===
                      certification.questions.length - 1 ? (
                        <button
                          onClick={() => setShowConfirmSubmit(true)}
                          className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                        >
                          <CheckIcon className="h-4 w-4" />
                          Enviar Examen
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            changeQuestion(
                              Math.min(
                                certification.questions.length - 1,
                                currentQuestionIndex + 1
                              )
                            )
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                        >
                          Siguiente
                          <ArrowRightIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* modal de confirmación */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md w-mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ¿Estás seguro de que deseas enviar el examen?
              </h3>
              <p className="text-gray-700 mb-6">
                Una vez enviado, no podrás modificar tus respuestas.
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
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  {isSubmitting ? 'Enviando...' : 'Confirmar Envío'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeCertificationExam;
