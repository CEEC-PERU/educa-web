import { useRouter } from "next/router";
import { useAuth } from "../../../../context/AuthContext";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Profile } from "@/interfaces/User/UserInterfaces";
import Navbar from "@/components/Navbar";
import SidebarDrawer from "@/components/student/DrawerNavigation";
import {
  AlertTriangle,
  CheckIcon,
  Clock,
  ClockIcon,
  FileText,
} from "lucide-react";
import { API_STUDENT_CERTIFICATIONS } from "../../../../utils/Endpoints";
import {
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";

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
  const { id } = router.query;
  const { user, profileInfo } = useAuth();

  // Estados de UI y Lógica
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Estados de Gestión del Examen
  const [isStarted, setIsStarted] = useState(false);
  const [isStartingEvaluation, setIsStartingEvaluation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Datos del Examen
  const [certification, setCertification] = useState<CertificationData | null>(
    null
  );
  const [attemptId, setAttemptId] = useState<number | null>(null);

  // Progreso y Tiempos
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [questionStarterTime, setQuestionStarterTime] = useState<number>(0);
  const [questionsTimes, setQuestionsTimes] = useState<{
    [key: number]: number;
  }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Mantener ref actualizado
  const timeRemainingRef = useRef<number>(0);

  let name = "";
  let uri_picture = "";
  let userId: number | null = null;

  const userInfo = user as { id: number; enterprise_id: number };
  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
    userId = userInfo.id;
  }

  if (!userId && user) {
    if (typeof user === "number") {
      userId = user;
    } else if (typeof user === "object" && user.id) {
      userId = user.id;
    } else if (typeof user === "string") {
      userId = parseInt(user);
    }
  }

  // Mantener ref actualizado
  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // tiempos y navegación entre preguntas

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

  const startEvaluation = async () => {
    if (isStartingEvaluation) return;

    try {
      setIsStartingEvaluation(true);
      if (!certification?.certification_sche_id) {
        alert("No se ha cargado la certificación correctamente.");
        setIsStartingEvaluation(false);
        return;
      }

      if (!userId) {
        alert("Usuario no identificado.");
        setIsStartingEvaluation(false);
        return;
      }

      const response = await fetch(
        `${API_STUDENT_CERTIFICATIONS}/attempt/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        setIsStarted(true);
        setQuestionStarterTime(Date.now());
      } else {
        alert(data.message || "Error al iniciar la evaluación.");
      }
    } catch (error) {
      console.error("Error starting evaluation:", error);
      alert("Error de conexión al iniciar.");
    } finally {
      setIsStartingEvaluation(false);
    }
  };

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

  // abandonar intento
  const abandonAttempt = useCallback(async () => {
    if (!attemptId || !userId) {
      console.warn("Missing attemptId or userId for abandon");
      return;
    }

    try {
      const response = await fetch(
        `${API_STUDENT_CERTIFICATIONS}/attempt/abandon`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attempt_id: attemptId,
            user_id: userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Attempt abandoned successfully");
    } catch (error) {
      console.error("Error al abandonar intento:", error);
      throw error;
    }
  }, [attemptId, userId]);

  // enviar datos de la evaluación
  const submitEvaluation = useCallback(
    async (timeExpired = false) => {
      if (isSubmitting) return;

      const currentTime = Date.now();
      const timeSpentOnCurrentQuestion = Math.round(
        (currentTime - questionStarterTime) / 1000
      );

      let finalTimesMap = { ...questionsTimes };

      if (certification && certification.questions[currentQuestionIndex]) {
        const currentQId =
          certification.questions[currentQuestionIndex].question_id;
        finalTimesMap[currentQId] =
          (finalTimesMap[currentQId] || 0) + timeSpentOnCurrentQuestion;
      }

      setQuestionsTimes(finalTimesMap);
      setIsSubmitting(true);
      setIsNavigating(true);

      try {
        const respuestasFormat = studentAnswers.map((answer) => ({
          question_id: answer.question_id,
          selected_option_ids: answer.selected_option_ids,
          answer_text: answer.answer_text || "",
          time_spent_seconds: finalTimesMap[answer.question_id] || 0,
        }));

        const response = await fetch(
          `${API_STUDENT_CERTIFICATIONS}/attempt/submit`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              attempt_id: attemptId,
              user_id: userId,
              answers: respuestasFormat,
              time_expired: timeExpired,
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          router.push(
            `/student/certificaciones/exam/${id}/resultados?attempt_id=${attemptId}`
          );
        } else {
          alert(data.message || "Error al enviar la evaluación.");
          setIsSubmitting(false);
          setIsNavigating(false);
        }
      } catch (error) {
        console.error("Error submitting evaluation:", error);
        alert("Ocurrió un error de red al enviar. Intenta nuevamente.");
        setIsSubmitting(false);
        setIsNavigating(false);
      } finally {
        setShowConfirmSubmit(false);
      }
    },
    [
      attemptId,
      userId,
      studentAnswers,
      questionsTimes,
      questionStarterTime,
      certification,
      currentQuestionIndex,
      router,
      id,
      isSubmitting,
    ]
  );

  const getStudentAnswer = (questionId: number): StudentAnswer | null => {
    return studentAnswers.find((ans) => ans.question_id === questionId) || null;
  };

  // Carga inicial de datos
  useEffect(() => {
    const fetchCertification = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${API_STUDENT_CERTIFICATIONS}/certification-scheduled/${id}`
        );
        if (!response.ok) throw new Error("Error al cargar el examen");

        const data: CertificationData = await response.json();

        if (!data.is_active) {
          setError("La certificación no está activa.");
          return;
        }

        const now = new Date();
        const startDate = new Date(data.start_date);
        const dueDate = new Date(data.due_date);

        if (now < startDate) {
          setError("La certificación aún no ha comenzado.");
          return;
        }
        if (now > dueDate) {
          setError("La certificación ha expirado.");
          return;
        }

        setCertification(data);
        setTimeRemaining(data.duration_in_minutes * 60);
      } catch (error: any) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCertification();
  }, [id]);

  const handleTimeExpired = useCallback(() => {
    alert("El tiempo ha expirado. Enviando evaluación automáticamente.");
    submitEvaluation(true);
  }, [submitEvaluation]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && timeRemaining > 0 && !isSubmitting) {
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
  }, [isStarted, timeRemaining, isSubmitting, handleTimeExpired]);

  // navegación y abandono
  useEffect(() => {
    if (!isStarted || isSubmitting) return;

    // 1. Protección contra cierre/refresh
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isNavigating && !isSubmitting) {
        // Usar fetch con keepalive para garantizar el envío
        fetch(`${API_STUDENT_CERTIFICATIONS}/attempt/abandon`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attempt_id: attemptId,
            user_id: userId,
          }),
          keepalive: true,
        }).catch((err) => console.error("Error en beforeunload:", err));

        event.preventDefault();
        event.returnValue = "";
        return "";
      }
    };

    // protección contra navegación interna
    const handleRouteChangeStart = async (url: string) => {
      if (isNavigating || isSubmitting) return;

      if (url.includes("/resultados")) return;

      const confirmExit = window.confirm(
        "¿Estás seguro que deseas salir? Tu progreso se perderá."
      );

      if (!confirmExit) {
        router.events.emit("routeChangeError");
        throw "routeChange aborted by user";
      } else {
        try {
          setIsNavigating(true);
          await abandonAttempt();
          await router.push("/student/certificaciones");
        } catch (error) {
          console.error("Navigation error:", error);
          setIsNavigating(false);
          alert("Error al salir del examen. Intenta nuevamente.");
        }
      }
    };

    // manejo de botón atrás del navegador
    const handlePopState = async (event: PopStateEvent) => {
      if (isNavigating || isSubmitting) return;

      window.history.pushState(null, "", window.location.href);

      const confirmExit = window.confirm(
        "¿Estás seguro que deseas salir? Tu progreso se perderá."
      );

      if (confirmExit) {
        try {
          setIsNavigating(true);
          await abandonAttempt();
          await router.push("/student/certificaciones");
        } catch (error) {
          console.error("Popstate navigation error:", error);
          setIsNavigating(false);
          alert("Error al salir del examen. Intenta nuevamente.");
        }
      }
    };

    // event listeners para evitar navegación no deseada
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    router.events.on("routeChangeStart", handleRouteChangeStart);

    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [
    isStarted,
    isSubmitting,
    isNavigating,
    router,
    abandonAttempt,
    attemptId,
    userId,
  ]);

  // Helpers UI
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
    return `${m}:${pad(s)}`;
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "1":
        return "Selección simple";
      case "2":
        return "Selección múltiple";
      case "3":
        return "Verdadero/Falso";
      case "4":
        return "Respuesta abierta";
      default:
        return "Selección única";
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-brand-200 text-white rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!certification || !userId) {
    return (
      <div className="p-10 text-center">
        Cargando datos o Usuario no identificado...
      </div>
    );
  }

  // Pantalla de Inicio
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
              isDrawerOpen ? "lg:ml-64" : "lg:ml-16"
            }`}
          >
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {certification.title}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {certification.description}
                  </p>
                </div>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {certification.duration_in_minutes}
                    </div>
                    <div className="text-sm text-gray-600">Minutos</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {certification.questions.length}
                    </div>
                    <div className="text-sm text-gray-600">Preguntas</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <QuestionMarkCircleIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {certification.passing_score}%
                    </div>
                    <div className="text-sm text-gray-600">Aprobación</div>
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
                        {certification ? certification.instructions : ""}
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
                    disabled={isStartingEvaluation}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors duration-300 disabled:opacity-50"
                  >
                    {isStartingEvaluation ? "Iniciando..." : "Iniciar Examen"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla del Examen
  const currentQuestion = certification.questions[currentQuestionIndex];

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
              isDrawerOpen ? "lg:ml-64" : "lg:ml-16"
            }`}
          >
            {/* Header del Examen */}
            <div className="bg-white border-b border-gray-200 p-4 sticky top-16 z-20 shadow-sm">
              <div className="container mx-auto flex justify-between items-center">
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                    {certification.title}
                  </h1>
                  <p className="text-sm text-gray-600">
                    Pregunta {currentQuestionIndex + 1} de{" "}
                    {certification.questions.length}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    timeRemaining < 300
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <ClockIcon className="h-5 w-5" />
                  <span className="font-mono font-bold text-lg">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
              {/* Barra de Progreso */}
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
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

            {/* Cuerpo de la Pregunta */}
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {currentQuestion.question_text}
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase">
                      {getQuestionTypeLabel(currentQuestion.type_id.toString())}
                    </span>
                  </div>
                  <div className="bg-gray-50 text-gray-500 text-sm px-3 py-1 rounded inline-block">
                    Valor: {currentQuestion.points_value} puntos
                  </div>
                </div>

                {/* Renderizado de Opciones */}
                <div className="space-y-3 mb-8">
                  {/* TIPO 1: Selección Simple */}
                  {currentQuestion.type_id === 1 &&
                    currentQuestion.options.map((option) => {
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
                          onClick={() =>
                            handleSingleChoiceAnswer(
                              currentQuestion.question_id,
                              option.option_id
                            )
                          }
                          className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-blue-50 border-blue-300 ring-1 ring-blue-300"
                              : "hover:bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-blue-600 bg-blue-600"
                                : "border-gray-400"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="text-gray-800">
                            {option.option_text}
                          </span>
                        </div>
                      );
                    })}

                  {/* Placeholder para otros tipos de preguntas */}
                  {currentQuestion.type_id !== 1 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                      <p>
                        Tipo de pregunta ({currentQuestion.type_id}) no
                        renderizado en esta vista.
                      </p>
                    </div>
                  )}
                </div>

                {/* Botones de Navegación */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <button
                    onClick={() =>
                      changeQuestion(Math.max(0, currentQuestionIndex - 1))
                    }
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeftIcon className="h-4 w-4" /> Anterior
                  </button>

                  {currentQuestionIndex ===
                  certification.questions.length - 1 ? (
                    <button
                      onClick={() => setShowConfirmSubmit(true)}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition-colors"
                    >
                      <CheckIcon className="h-4 w-4" /> Finalizar Examen
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
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                    >
                      Siguiente <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Confirmación */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿Finalizar evaluación?
              </h3>
              <p className="text-gray-600 mb-6">
                Asegúrate de haber respondido todas las preguntas. No podrás
                modificar tus respuestas después.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Revisar más
                </button>
                <button
                  onClick={() => submitEvaluation(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      Enviando{" "}
                      <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                    </>
                  ) : (
                    "Confirmar y Enviar"
                  )}
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
