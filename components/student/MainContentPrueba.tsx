import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import "./../../app/globals.css";
import { useSesionProgress } from "../../hooks/useProgressSession";
import {
  Question,
  ModuleResults,
  VideosInteractivo,
  CourseEvaluation,
  ModuleEvaluation,
  CourseResults,
} from "../../interfaces/StudentModule";
import { useResultModule } from "../../hooks/resultado/useResultModule";
import {
  useCuestionarioStar,
  useCuestionarioNPS,
  useCreateCuestionario,
} from "../../hooks/useCuestionario";
import { useResultCourse } from "../../hooks/courses/useCourseResults";
import { useAuth } from "../../context/AuthContext";
import NPSForm from "./../../components/student/NPSForm";
import StarForm from "./../../components/student/StarForm";

interface MainContentProps {
  sessionVideosInteractivos?: VideosInteractivo[];
  sessionVideo?: string;
  sessionId?: number;
  evaluationQuestions?: Question[];
  onFinish?: () => void;
  onUpdated?: () => void;
  onProgress?: (progress: number, isCompleted: boolean) => void;
  videoProgress?: number;
  selectedModuleId?: number | null;
  moduleResults?: ModuleResults[];
  courseResults?: CourseResults[];
  courseEvaluation?: CourseEvaluation[];
  moduleEvaluation?: ModuleEvaluation[];
}

const MainContentPrueba: React.FC<MainContentProps> = ({
  sessionVideosInteractivos,
  sessionVideo,
  sessionId,
  evaluationQuestions,
  onFinish,
  onUpdated,
  onProgress,
  videoProgress = 0,
  selectedModuleId,
  moduleResults,
  courseResults,
  courseEvaluation,
  moduleEvaluation,
}) => {
  // State variables
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0); // New state variable
  const [videoEnded, setVideoEnded] = useState(false);
  const [evaluationCompleted, setEvaluationCompleted] = useState(false);
  const [showStartMessage, setShowStartMessage] = useState(true);
  const [showReaction, setShowReaction] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showGif, setShowGif] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showNPSForm, setShowNPSForm] = useState(false);
  const [showStarForm, setShowStarForm] = useState(false);
  const [textAnswer, setTextAnswer] = useState(""); // For open-ended questions
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]); // For multiple choice
  const [evamodulecount, setEvaModCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Referencia para el temporizador
  const { createSession_Progress, session_progress } = useSesionProgress();
  // Nuevo estado para guardar todas las respuestas seleccionadas
  const isProgressSent = useRef(false); // Usamos useRef para evitar reinicio en cada render
  const [answers, setAnswers] = useState<
    {
      question_id: number;
      response: string | number | number[];
      response2: string | number | string[];
      isCorret: boolean | string;
      isCorrect2: boolean[] | boolean | string;
      score: number | null;
    }[]
  >([]);
  const [showContinueButton, setShowContinueButton] = useState(false); // Estado de botón CONTINUAR
  const isPptx = sessionVideo && sessionVideo.endsWith(".pptx");

  const estrella_vacia =
    "https://res.cloudinary.com/dk2red18f/image/upload/v1730907469/CEEC/PREQUIZZ/lqcb3aig5blvbpxryatq.png";
  const estrella_llena =
    "https://res.cloudinary.com/dk2red18f/image/upload/v1730907418/CEEC/PREQUIZZ/kqw9stwbaz9tftv5ep77.png";

  const videoRef = useRef<HTMLVideoElement>(null);

  const optionColors = [
    "bg-blue-500",
    "bg-orange-500",
    "bg-purple-500",
    "bg-cyan-500",
  ];
  // Context
  const { user, token } = useAuth();
  const userInfo = user as { id: number };
  const { createResultModule } = useResultModule();
  const { createResultCourse } = useResultCourse();

  const router = useRouter();
  const courseId = Array.isArray(router.query.course_id)
    ? parseInt(router.query.course_id[0], 10)
    : parseInt(router.query.course_id as string, 10);

  const { createCuestionarioResult } = useCreateCuestionario();
  const { cuestionariostar } = useCuestionarioStar(courseId);
  const { cuestionariosnps } = useCuestionarioNPS(courseId);
  const [finalTime, setFinalTime] = useState<number | null>(null); // Nuevo estado para el tiempo final

  // Marcar progreso al 100% si es PPTX
  useEffect(() => {
    if (isPptx && sessionId && onProgress) {
      // Solo ejecuta si no se ha marcado completado antes
      onProgress(100, true);
    }
    // eslint-disable-next-line
  }, [sessionVideo, sessionId]);

  useEffect(() => {
    // Actualización automática sin recargar cuando cambia el estado
    if (moduleResults && moduleResults.length > 0) {
      console.log("Resultados del módulo actualizados", moduleResults);
    }
    // Actualización automática sin recargar cuando cambia el estado
    if (courseResults && courseResults.length > 0) {
      console.log("Resultados del cursos actualizados", courseResults);
    }
  }, [moduleResults, courseResults]); // Se actualizará cada vez que cambien los resultados del módulo

  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setTotalScore(0);
    setCorrectAnswers(0); // Reset correct answers
    setVideoEnded(false);
    setEvaluationCompleted(false);
    setShowStartMessage(true);
    setCurrentVideoIndex(0);
    setShowGif(false);
  }, [
    sessionVideo,
    evaluationQuestions,
    selectedModuleId,
    sessionVideosInteractivos,
  ]);
  //modificacion progreso
  useEffect(() => {
    isProgressSent.current = false; // Permitir nuevos envíos de progreso en la nueva sesión
  }, [sessionId, sessionVideo]);

  // Marcar progreso al 100% si es PPTX y guardar en BD
  useEffect(() => {
    if (isPptx && sessionId && !isProgressSent.current) {
      const sendSessionProgress = async () => {
        const sessionProgress = {
          session_id: sessionId,
          progress: 100,
          is_completed: true,
          user_id: userInfo.id,
        };
        await createSession_Progress(sessionProgress);
        if (onProgress) onProgress(100, true);
        isProgressSent.current = true;
      };
      sendSessionProgress();
    }
    // eslint-disable-next-line
  }, [isPptx, sessionId, sessionVideo]);

  useEffect(() => {
    if (!videoRef.current) return;

    const handleTimeUpdate = () => {
      const currentTime = videoRef.current!.currentTime;
      const duration = videoRef.current!.duration;
      const progress = (currentTime / duration) * 100;

      if (onProgress) onProgress(progress, false);

      if (progress >= 100 && !isProgressSent.current) {
        sendSessionProgress(100, true); // Marcar como completado
        isProgressSent.current = true;
      }

      setCurrentTime(currentTime);
    };

    const handlePause = () => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        const progress = (currentTime / duration) * 100;
        // Enviar el progreso actual al pausar
        sendSessionProgress(progress, false); // No se ha completado, solo se guarda el progreso actual
      }
    };

    // Función para manejar cuando el usuario sale de la ventana o pestaña
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && videoRef.current) {
        videoRef.current.pause(); // Pausa automáticamente el video al salir de la ventana
      }
    };

    // Función para manejar cuando el usuario retrocede en el navegador
    const handlePopState = () => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        const progress = (currentTime / duration) * 100;

        sendSessionProgress(progress, false);
      }
    };

    // Función auxiliar para enviar el progreso de la sesión al servidor
    const sendSessionProgress = async (
      progress: number,
      isCompleted: boolean,
    ) => {
      const progressUpdate = Math.round(progress);

      if (sessionId && !isProgressSent.current) {
        const sessionProgress = {
          session_id: sessionId,
          progress: progressUpdate,
          is_completed: isCompleted,
          user_id: userInfo.id,
        };

        await createSession_Progress(sessionProgress);

        if (!isCompleted) {
          // Permitir nuevas actualizaciones si no se ha completado la sesión
          isProgressSent.current = false;
        }
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        const progress = (currentTime / duration) * 100;
        if (onProgress) onProgress(progress, false);

        videoRef.current.pause();
        // Muestra un mensaje de confirmación al usuario (en algunos navegadores)
        e.preventDefault();
        e.returnValue = ""; // Obligatorio para algunos navegadores modernos
      }
    };

    // Evitar que el usuario adelante el video
    const handleSeeking = () => {
      if (videoRef.current!.currentTime > currentTime) {
        videoRef.current!.currentTime = currentTime;
      }
    };

    videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    videoRef.current.addEventListener("seeking", handleSeeking);
    videoRef.current.addEventListener("pause", handlePause); // Escucha el evento "pause" (cuando el usuario pausa el video)
    document.addEventListener("visibilitychange", handleVisibilityChange); // Detecta cambios de ventana o pestaña
    window.addEventListener("beforeunload", handleBeforeUnload); // Escucha el evento "beforeunload" (cuando el usuario intenta salir o recargar la página)
    window.addEventListener("popstate", handlePopState); // Detecta retroceso en el historial del navegador

    if (videoProgress > 0 && !videoEnded) {
      const duration = videoRef.current!.duration;
      const targetTime = (videoProgress / 100) * duration;
      if (targetTime > 0 && targetTime < duration) {
        videoRef.current.currentTime = targetTime;
      }
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        videoRef.current.removeEventListener("seeking", handleSeeking);
        videoRef.current.removeEventListener("pause", handlePause); // Elimina el evento "pause"
        document.addEventListener("visibilitychange", handleVisibilityChange); // Evento para cambiar de pestaña
      }
      window.removeEventListener("beforeunload", handleBeforeUnload); // Elimina el evento "beforeunload" del objeto window
      window.removeEventListener("popstate", handlePopState); // Elimina el evento de retroceso
    };
  }, [
    onProgress,
    currentTime,
    videoProgress,
    videoEnded,
    sessionVideo,
    sessionVideosInteractivos,
  ]);

  // Lógica para el textarea
  useEffect(() => {
    if (
      evaluationQuestions?.[currentQuestion]?.type_id === 3 &&
      textAnswer.trim() !== ""
    ) {
      setShowContinueButton(true); // Mostrar el botón continuar si el textarea no está vacío
    } else {
      setShowContinueButton(false); // Ocultar el botón continuar si está vacío
    }
  }, [textAnswer, currentQuestion]);

  const handleNextQuestion = () => {
    if (
      evaluationQuestions?.[currentQuestion]?.type_id === 3 &&
      textAnswer.trim() === ""
    ) {
      alert("Por favor, responde la pregunta.");
      return;
    }
    if (currentQuestion >= (evaluationQuestions?.length || 0) - 1) {
      handleFinish(); // Llamar a handleFinish si es la última pregunta
      return;
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setSelectedOptions([]);
      setTextAnswer("");
      setIsCorrect(null);
    }
  };

  useEffect(() => {
    // Timer to track duration of the evaluation
    const startTime = Date.now();
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOptionSelect = (
    optionId: number,
    optionText: string,
    isCorrect: boolean,
    score: number,
  ) => {
    setSelectedOption(optionId);
    setIsCorrect(isCorrect);
    setShowReaction(true);
    // Obtener el question_id de la pregunta actual
    // Obtener el question_id de la pregunta actual
    const questionId = evaluationQuestions?.[currentQuestion]?.question_id;

    // Guardar la respuesta seleccionada en el estado answers
    if (questionId !== undefined) {
      setAnswers((prevAnswers) => {
        const updatedAnswers = prevAnswers.filter(
          (answer) => answer.question_id !== questionId,
        );
        return [
          ...updatedAnswers,
          {
            question_id: questionId,
            response: optionId,
            response2: optionText,
            isCorret: isCorrect,
            isCorrect2: "",
            score: score,
          },
        ];
      });
    }

    if (isCorrect) {
      setTotalScore(
        (prev) => prev + (evaluationQuestions?.[currentQuestion]?.score || 0),
      );
      setCorrectAnswers((prev) => prev + 1); // Increment correct answers count
    }
    setTimeout(() => {
      setShowReaction(false);
    }, 2000);
  };

  const handleTextAnswerChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setTextAnswer(value);

    // Obtener el question_id de la pregunta actual
    const questionId = evaluationQuestions?.[currentQuestion]?.question_id;

    // Verificar si el questionId es válido
    if (questionId !== undefined) {
      setAnswers((prevAnswers) => {
        // Filtrar respuestas anteriores y agregar la nueva o actualizarla
        const updatedAnswers = prevAnswers.filter(
          (answer) => answer.question_id !== questionId,
        );
        return [
          ...updatedAnswers,
          {
            question_id: questionId,
            response: "",
            response2: value,
            isCorret: "",
            isCorrect2: "",
            score: evaluationQuestions?.[currentQuestion]?.score || 0,
          },
        ];
      });
    }

    // Mostrar botón continuar si hay texto en el textarea
    setShowContinueButton(value.trim() !== "");
  };

  const handleMultipleSelect = (
    optionId: number,
    optionText: string,
    isCorrect: boolean,
    score: number,
  ) => {
    let newSelectedOptions = [...selectedOptions];
    let newOptionTexts =
      (answers.find(
        (answer) =>
          answer.question_id ===
          evaluationQuestions?.[currentQuestion]?.question_id,
      )?.response2 as string[]) || [];
    let OptionCorrect =
      (answers.find(
        (answer) =>
          answer.question_id ===
          evaluationQuestions?.[currentQuestion]?.question_id,
      )?.isCorrect2 as boolean[]) || [];
    // Verificar si la opción ya está seleccionada
    if (selectedOptions.includes(optionId)) {
      newSelectedOptions = newSelectedOptions.filter((opt) => opt !== optionId);
      newOptionTexts = newOptionTexts.filter((text) => text !== optionText); //Remover el texto de la opción
      OptionCorrect = OptionCorrect.filter((text) => text !== isCorrect); //Remover el texto de la opción
    } else {
      newSelectedOptions.push(optionId);
      newOptionTexts.push(optionText); // Agregar el texto de la opción
      OptionCorrect.push(isCorrect); // Agregar el texto de la opción
    }

    setSelectedOptions(newSelectedOptions);

    // Obtener el question_id de la pregunta actual
    const questionId = evaluationQuestions?.[currentQuestion]?.question_id;

    // Verificar si el questionId es válido
    if (questionId !== undefined) {
      setAnswers((prevAnswers) => {
        // Filtrar respuestas anteriores y agregar la nueva o actualizarla
        const updatedAnswers = prevAnswers.filter(
          (answer) => answer.question_id !== questionId,
        );
        return [
          ...updatedAnswers,
          {
            question_id: questionId,
            response: newSelectedOptions,
            response2: newOptionTexts, // Almacenar múltiples textos seleccionados
            isCorret:
              newSelectedOptions.every(
                (optId) =>
                  evaluationQuestions?.[currentQuestion]?.options.find(
                    (opt) => opt.option_id === optId,
                  )?.is_correct,
              ) &&
              newSelectedOptions.length ===
                evaluationQuestions?.[currentQuestion]?.options.filter(
                  (opt) => opt.is_correct,
                ).length,
            isCorrect2: OptionCorrect,
            score: score,
          },
        ];
      });
    }

    // Mostrar botón continuar si hay al menos una opción seleccionada
    setShowContinueButton(newSelectedOptions.length > 0);
  };

  const handleFinish = () => {
    setEvaluationCompleted(true);

    // Guardar el tiempo final y detener el temporizador
    setFinalTime(timeElapsed);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Calcular y mostrar el puntaje total
    const totalScore = answers.reduce((score, answer) => {
      const question = evaluationQuestions?.find(
        (q) => q.question_id === answer.question_id,
      );
      if (question?.type_id !== 3 && answer.isCorret) {
        // No contar preguntas type_id === 3
        return score + (question?.score || 0);
      }
      return score;
    }, 0);

    console.log("Puntaje total:", totalScore);
    setTotalScore(totalScore);
    if (onFinish) onFinish();

    if (selectedModuleId) {
      // Si hay un selectedModuleId, es una evaluación de módulo

      const moduloResultado = {
        user_id: userInfo.id,
        puntaje: totalScore,
        module_id: selectedModuleId,
        evaluation_id: evaluationQuestions?.[0]?.evaluation_id || 0,
        answers: answers.map((answer) => ({
          question_id: answer.question_id,
          response: answer.response || null, // Este campo está correcto
          response2: answer.response2, // Este campo está correcto
          isCorrect: answer.isCorret || false, // Aquí debes asegurarte que uses 'isCorrect'
          isCorrect2: answer.isCorrect2 || null, // Este campo está correcto también
          score: answer.score,
        })),
      };
      createResultModule(moduloResultado);

      console.log("MODULO_RESULTADO", moduloResultado);
    } else {
      // Si no hay selectedModuleId, es la evaluación final del curso
      const courseId = Array.isArray(router.query.course_id)
        ? parseInt(router.query.course_id[0], 10)
        : parseInt(router.query.course_id as string, 10);

      const cursoResultado = {
        course_id: courseId, // Usar el course_id del router o contexto
        evaluation_id: evaluationQuestions?.[0]?.evaluation_id || 0,
        puntaje: totalScore,
        user_id: userInfo.id,
        second_chance: false,
        answers: answers.map((answer) => ({
          question_id: answer.question_id,
          response: answer.response || null, // Este campo está correcto
          response2: answer.response2, // Este campo está correcto
          isCorrect: answer.isCorret || false, // Aquí debes asegurarte que uses 'isCorrect'
          isCorrect2: answer.isCorrect2 || null, // Este campo está correcto también
          score: answer.score,
        })),
      };
      createResultCourse(cursoResultado);
      console.log("CURSO_RESULTADO", cursoResultado);
    }
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setShowGif(true);
    setTimeout(() => {
      setShowGif(false);
    }, 3000); // Show GIF for 3 seconds before the question
  };

  //evaluacion general
  const handleStartEvaluation = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setTotalScore(0);
    setCorrectAnswers(0);
    setEvaluationCompleted(false);
    setShowStartMessage(false);

    if (isFinalEvaluation) {
      setShowNPSForm(true); // Show NPS form before final evaluation
      // Verificar si los cuestionarios de NPS y Star tienen resultados
      if (cuestionariosnps && cuestionariostar) {
        // Mostrar NPSForm si no hay resultados en NPS
        if (cuestionariosnps.length === 0) {
          setShowNPSForm(true);
        } else {
          setShowNPSForm(false); // Ocultar NPS si ya tiene resultados
        }

        // Mostrar StarForm si no hay resultados en Star
        if (cuestionariostar.length === 0) {
          setShowStarForm(true);
        } else {
          setShowStarForm(false); // Ocultar StarForm si ya tiene resultados
        }
      }
    } else {
      setShowStartMessage(false);
    }
  };

  const handleReintentarEvaluation = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setTotalScore(0);
    setCorrectAnswers(0);
    setEvaluationCompleted(false);
    setShowStartMessage(false);
    if (onUpdated) onUpdated();
  };

  const handleReloadEvaluation = () => {
    if (isFinalEvaluation) {
      setShowNPSForm(true); // Show NPS form before final evaluation
    } else {
      setShowStartMessage(false);
    }
  };

  const handleNPSSubmit = (score: number) => {
    const npscreate = {
      user_id: userInfo.id, // Usar el course_id del router o contexto
      score: score,
      course_id: courseId,
      cuestype_id: 1,
    };
    createCuestionarioResult(npscreate);
    console.log(`NPS Score: ${score}`);
    setShowNPSForm(false); // Ocultar formulario NPS
    setShowStarForm(true); // Mostrar formulario de estrellas
  };

  const handleStarSubmit = (score: number) => {
    const starcreate = {
      user_id: userInfo.id, // Usar el course_id del router o contexto
      score: score,
      course_id: courseId,
      cuestype_id: 2,
    };
    createCuestionarioResult(starcreate);
    console.log(`Star Score: ${score}`);
    setShowStarForm(false); // Ocultar formulario de estrellas
    setShowStartMessage(false);
  };

  const handleContinue = () => {
    if (currentVideoIndex < (sessionVideo?.length || 0) - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setVideoEnded(false);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      handleFinish();
    }
  };

  const moduleResult = moduleResults?.find(
    (result) => result.module_id === selectedModuleId,
  );
  //numero de intentos
  const hasTwoAttempts =
    moduleResults &&
    moduleResults.filter((result) => result.module_id === selectedModuleId)
      .length >= 2;

  const attemptCount =
    moduleResults?.filter((result) => result.module_id === selectedModuleId)
      .length || 0;

  const isFinalEvaluation = !selectedModuleId;

  //CURSO RESULTADOS VERIFICAR
  // Si no hay selectedModuleId, es la evaluación final del curso
  //const courseId = Array.isArray(router.query.course_id)
  //? parseInt(router.query.course_id[0], 10)
  // : parseInt(router.query.course_id as string, 10);

  //si el estudiante tiene mayor a 16 en todo sus modules result primer intento(created_at) puede obtener un segundo intento en el examen final,
  //es decir el second_chance debe estar activado en el coruse_results

  //obtener la nota del primer created_at(la fecha de creacion que se creo primero) por cada evalation_id
  const hasTwoEvaCourse =
    moduleResults &&
    moduleResults.filter(
      (result) =>
        result.puntaje >= 16 && result.evaluation_id == result.evaluation_id,
    );

  //reutilizar el anterior y validar si en todos los modulos se obtiene la nota mayor a 16
  //si tiene mayor a 16 habilitar segundo intento / caso contrario solo tendra un intento a courseresults //actualización de que finalizo el curso.

  // Función para obtener el primer resultado de evaluación por evaluation_id
  const getFirstCreatedAtResults = (moduleResults?: ModuleResults[]) => {
    if (!moduleResults) return [];

    // Ordenar por fecha de creación y filtrar el primer resultado por evaluation_id
    const uniqueResults = moduleResults.reduce((acc, result) => {
      const existing = acc.find(
        (r) => r.evaluation_id === result.evaluation_id,
      );
      if (
        !existing ||
        new Date(result.created_at) < new Date(existing.created_at)
      ) {
        return [
          ...acc.filter((r) => r.evaluation_id !== result.evaluation_id),
          result,
        ];
      }
      return acc;
    }, [] as ModuleResults[]);

    return uniqueResults;
  };

  // Obtener la nota del primer intento de evaluación en cada evaluation_id
  const firstResults = getFirstCreatedAtResults(moduleResults);
  // Filtrar módulos con puntaje mayor o igual a 16
  const modulesWithHighScores = firstResults.filter(
    (result) => result.puntaje >= 16,
  );
  // Verificar si todos los módulos tienen un puntaje mayor o igual a 16
  const allModulesPassed = modulesWithHighScores.length === firstResults.length;
  // Habilitar segundo intento si todos los módulos tienen puntaje mayor o igual a 16
  const enableSecondAttempt = allModulesPassed;
  // Si no pasa en todos los módulos, solo tiene un intento
  if (enableSecondAttempt) {
    console.log("Se habilita el segundo intento.");
  } else {
    console.log("Solo tiene un intento.");
  }

  // Asegúrate de que courseId tiene el valor correcto del curso que estás filtrando
  const attemptCountCourse =
    (courseResults &&
      courseResults?.filter((result) => result.course_id === courseId)
        .length) ||
    0;

  return (
    <div className="h-full w-full p-4 relative">
      {showNPSForm ? (
        <NPSForm onSubmit={handleNPSSubmit} />
      ) : showStarForm ? (
        <StarForm onSubmit={handleStarSubmit} />
      ) : sessionVideo ? (
        isPptx ? (
          // Visor PPTX usando Office Viewer (puedes cambiar a Google Viewer si lo prefieres)
          <div className="flex flex-col items-center h-full">
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                sessionVideo,
              )}`}
              width="100%"
              height="600px"
              frameBorder="0"
              title="PPTX Viewer"
              allowFullScreen
              style={{
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px #0002",
              }}
            ></iframe>
          </div>
        ) : (
          // Video player responsive
          <div className="flex flex-col items-center w-full h-full">
            <div className="w-full sm:max-w-none max-w-sm mx-auto">
              <div
                className="relative w-full bg-black rounded-lg overflow-hidden"
                style={{ aspectRatio: "var(--video-aspect, 16/9)" }}
              >
                <style>{`@media (max-width: 639px) { :root { --video-aspect: 9/16; } }`}</style>
                <video
                  key={sessionVideo}
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-full object-contain"
                  playsInline
                  onEnded={handleVideoEnd}
                  ref={videoRef}
                >
                  <source src={sessionVideo} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        )
      ) : evaluationQuestions && evaluationQuestions.length > 0 ? (
        showStartMessage ? (
          <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-brandm-500 to-brandmc-100 p-3 sm:p-4 md:p-6 rounded-lg shadow-lg">
            <h1
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-yellow-400 mb-4 sm:mb-6 font-extrabold animate-pulse text-center leading-tight ${
                isFinalEvaluation ? "" : "hidden"
              }`}
            >
              EVALUACIÓN FINAL
            </h1>
            <p
              className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white mb-6 sm:mb-8 text-center px-2 ${
                isFinalEvaluation ? "" : "hidden"
              }`}
            >
              Para finalizar el curso, inicia esto
            </p>
            <h1
              className={`text-6xl text-yellow-400 mb-6 font-extrabold animate-pulse ${
                isFinalEvaluation ? "hidden" : ""
              }`}
            >
              ¡Ponte a Prueba!
            </h1>
            <p
              className={`text-4xl text-white mb-8  text-center ${
                isFinalEvaluation ? "hidden" : ""
              }`}
            >
              Para finalizar el módulo, ¡Inicia la Evaluación!
            </p>

            <p
              className={`text-sm sm:text-base md:text-lg lg:text-xl text-white mb-6 sm:mb-8 text-center px-4 ${
                isFinalEvaluation ? "hidden" : ""
              }`}
            >
              ¡Tienes 2 Intentos Disponibles! Si obtienes mayor a 16 en el
              primer intento de los examenes modulares tienes un segundo intento
              en el examen final
            </p>
            {/*Imagen dependiendo de evaluación del modulo y evaluación final*/}
            <img
              src={
                isFinalEvaluation
                  ? "https://res.cloudinary.com/dk2red18f/image/upload/v1721282668/WEB_EDUCA/WEB-IMAGENES/gpki5vwl5iscesql4vgz.png"
                  : "https://res.cloudinary.com/dk2red18f/image/upload/v1721282653/WEB_EDUCA/WEB-IMAGENES/iedxcrpplh3wmu5zfctf.png"
              }
              alt="Evaluation"
              className="mb-4 sm:mb-6 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300"
            />
            <div>
              {enableSecondAttempt === false && attemptCountCourse === 1 ? (
                <p
                  className={`text-white text-xl mt-4 ${
                    isFinalEvaluation ? "" : "hidden"
                  }`}
                >
                  Completaste todos los intentos disponibles
                </p>
              ) : enableSecondAttempt === true && attemptCountCourse === 1 ? (
                <button
                  onClick={handleStartEvaluation}
                  className={`bg-yellow-400 text-purple-900 font-bold text-xl rounded-full px-8 py-4 shadow-lg hover:bg-yellow-500 transition-colors duration-300 ${
                    isFinalEvaluation ? "" : "hidden"
                  }`}
                >
                  Volver a Intentar
                </button>
              ) : enableSecondAttempt === true && attemptCountCourse === 2 ? (
                <p
                  className={`text-white text-xl mt-4 ${
                    isFinalEvaluation ? "" : "hidden"
                  }`}
                >
                  Completaste todos los intentos disponibles
                </p>
              ) : (
                <button
                  onClick={handleStartEvaluation}
                  className={`bg-yellow-400 text-purple-900 font-bold text-xl rounded-full px-8 py-4 shadow-lg hover:bg-yellow-500 transition-colors duration-300 ${
                    isFinalEvaluation ? "" : "hidden"
                  }`}
                >
                  Comenzar Evaluación Final
                </button>
              )}
            </div>
            <div>
              <div>
                {attemptCount >= 2 ? (
                  <p
                    className={`text-white text-xl mt-4 ${
                      isFinalEvaluation ? "hidden" : ""
                    }`}
                  >
                    Completaste todos los intentos disponibles
                  </p>
                ) : attemptCount === 1 ? (
                  <button
                    onClick={handleStartEvaluation}
                    className={`bg-yellow-400 text-purple-900 font-bold text-xl rounded-full px-8 py-4 shadow-lg hover:bg-yellow-500 transition-colors duration-300 ${
                      isFinalEvaluation ? "hidden" : ""
                    }`}
                  >
                    Volver a Intentar
                  </button>
                ) : (
                  <button
                    onClick={handleStartEvaluation}
                    className={`bg-yellow-400 text-purple-900 font-bold text-xl rounded-full px-8 py-4 shadow-lg hover:bg-yellow-500 transition-colors duration-300 ${
                      isFinalEvaluation ? "hidden" : ""
                    }`}
                  >
                    Comenzar Evaluación
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 text-white text-sm">
              <p className="animate-bounce">¡Buena suerte!</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-white p-4 md:p-6 rounded-lg shadow-xl space-y-6">
            {/* Puntaje actual   , arriba para cambiar el fondo*/}
            <div className="w-full text-center text-brandm-500 text-2xl md:text-4xl font-bold">
              Puntaje: {totalScore}
            </div>

            {/* Progreso de evaluación */}
            <div className="w-full max-w-6xl bg-brandmc-100 rounded-full h-10 md:h-10 mb-6 overflow-hidden shadow-lg">
              <div
                className="bg-brandmo-800 h-10 md:h-10 text-xs font-medium text-white text-center leading-none rounded-full transition-all duration-300 ease-in-out"
                style={{
                  width: `${
                    ((currentQuestion + 1) / evaluationQuestions.length) * 100
                  }%`,
                }}
              >
                <p className="text-white text-xl pt-3 font-bold">
                  {Math.round(
                    ((currentQuestion + 1) / evaluationQuestions.length) * 100,
                  )}
                  %
                </p>
              </div>
            </div>

            {!evaluationCompleted ? (
              <div className="flex flex-col items-center text-center w-full max-w-6xl space-y-4 sm:space-y-6">
                {/* Question Title */}
                <h3 className="text-brandmc-100 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl pb-3 sm:pb-5 md:pb-7 font-montserrat font-extrabold leading-tight mb-4 sm:mb-6 px-2">
                  {evaluationQuestions[currentQuestion]?.question_text}
                </h3>
                <div className="flex w-full space-x-8">
                  {/* Question Image */}
                  <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-1">
                    {evaluationQuestions[currentQuestion]?.image && (
                      <img
                        src={evaluationQuestions[currentQuestion]?.image}
                        alt="Imagen relacionada con la pregunta"
                        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:w-4/5 rounded-lg shadow-lg h-auto object-contain"
                      />
                    )}
                  </div>

                  {/* Opciones de respuesta */}
                  <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4 order-2 lg:order-2">
                    {/* Pregunta de opción múltiple */}
                    {evaluationQuestions[currentQuestion]?.type_id === 1 && (
                      <ul className="space-y-2 sm:space-y-3">
                        {evaluationQuestions[currentQuestion]?.options.map(
                          (option, idx) => (
                            <li
                              key={idx}
                              className="flex items-start space-x-2 sm:space-x-3"
                            >
                              <input
                                type="checkbox"
                                className="w-5 h-5 text-yellow-500 rounded focus:ring focus:ring-purple-700"
                                checked={selectedOptions.includes(
                                  option.option_id,
                                )}
                                onChange={() =>
                                  handleMultipleSelect(
                                    option.option_id,
                                    option.option_text,
                                    option.is_correct,
                                    evaluationQuestions?.[currentQuestion]
                                      ?.score || 0,
                                  )
                                }
                              />
                              <label className="text-white text-xl">
                                {option.option_text}
                              </label>
                            </li>
                          ),
                        )}
                      </ul>
                    )}

                    {/* Pregunta abierta */}
                    {evaluationQuestions[currentQuestion]?.type_id === 3 && (
                      <textarea
                        value={textAnswer}
                        onChange={handleTextAnswerChange}
                        className="w-full h-40 p-4 text-white bg-gray-700 rounded-lg border border-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        placeholder="Escribe tu respuesta aquí..."
                      />
                    )}

                    {/* Pregunta de opción única */}
                    {evaluationQuestions[currentQuestion]?.type_id === 4 && (
                      <ul className="space-y-2 sm:space-y-3">
                        {evaluationQuestions[currentQuestion]?.options.map(
                          (option, idx) => (
                            <li key={idx}>
                              <button
                                className={`p-3 sm:p-4 md:p-6 text-sm sm:text-base md:text-lg lg:text-xl font-bold rounded-lg w-full transition-all duration-300 px-4 sm:px-6 md:px-8 lg:px-10 ${
                                  selectedOption === option.option_id
                                    ? isCorrect
                                      ? "bg-green-500 border-green-600"
                                      : "bg-red-500 border-red-600"
                                    : "bg-brandm-500  text-white hover:bg-yellow-400 "
                                }`}
                                onClick={() =>
                                  handleOptionSelect(
                                    option.option_id,
                                    option.option_text,
                                    option.is_correct,
                                    evaluationQuestions?.[currentQuestion]
                                      ?.score || 0,
                                  )
                                }
                                disabled={selectedOption !== null}
                              >
                                {option.option_text}
                              </button>
                            </li>
                          ),
                        )}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Mostrar botón continuar */}
                {showContinueButton && (
                  <button
                    className="mt-6 p-3 bg-brandm-400 text-white text-2xl font-bold rounded-lg shadow-lg w-full md:w-1/3 transition-transform transform hover:scale-105"
                    onClick={handleNextQuestion}
                  >
                    {currentQuestion < (evaluationQuestions?.length || 0) - 1
                      ? "Siguiente"
                      : "Finalizar"}
                  </button>
                )}
                {/*Reacciones para repsuesta incorrecta e incorrecta */}
                {showReaction && (
                  <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                    {Array.from({ length: 20 }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`absolute text-4xl md:text-6xl ${
                          isCorrect ? "text-green-500" : "text-red-500"
                        } animate-float`}
                        style={{
                          bottom: "0",
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 0.5}s`,
                        }}
                      >
                        {isCorrect ? "😊" : "😢"}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full  bg-white">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl text-center text-white p-8 space-y-6">
                  {/* Imagen central con estrellas */}
                  <div className="relative flex justify-center mb-6">
                    <img
                      src={
                        totalScore >= 16
                          ? "https://res.cloudinary.com/dk2red18f/image/upload/v1709006952/CEEC/PREQUIZZ/yyhjjq12kstinufbzvmi.png"
                          : totalScore >= 13
                            ? "https://res.cloudinary.com/dk2red18f/image/upload/v1709006864/CEEC/PREQUIZZ/drqdrqzjws2ltwqjccek.png"
                            : "https://res.cloudinary.com/dk2red18f/image/upload/v1709006848/CEEC/PREQUIZZ/ow40gsipk4rpxspixvzm.png"
                      }
                      className="w-60 h-60 rounded-full border-4 border-brandmc-100 shadow-md"
                    />
                    {/* Estrellas alrededor de la imagen */}
                    <div className="absolute flex justify-center space-x-2 -top-12 pb-20">
                      <img
                        src={estrella_llena}
                        alt="Estrella 1"
                        className="w-12 h-12"
                      />
                      {totalScore >= 13 && (
                        <img
                          src={estrella_llena}
                          alt="Estrella 2"
                          className="w-12 h-12"
                        />
                      )}
                      {totalScore >= 16 && (
                        <img
                          src={estrella_llena}
                          alt="Estrella 3"
                          className="w-12 h-12"
                        />
                      )}
                    </div>
                  </div>

                  {/* Mensaje final */}
                  <p className="text-2xl font-semibold mb-4 text-brandm-500">
                    {totalScore >= 16
                      ? "¡Eres realmente el rey del saber!"
                      : totalScore >= 13
                        ? "¡Nada mal, pero puedes mejorar!"
                        : "¡Necesitas repasar las sesiones!"}
                  </p>

                  {/* Resumen de resultados */}
                  <div className="grid grid-cols-3 gap-6 bg-brandmc-100 rounded-lg p-6 shadow-lg text-lg font-semibold text-yellow-300">
                    <div className="col-span-1 flex flex-col items-center">
                      <span className="text-xl">Duración</span>
                      {/* Add the image below the label */}
                      <img
                        src="https://res.cloudinary.com/dk2red18f/image/upload/v1730908225/CEEC/PREQUIZZ/ect4ksc3nxzzu7jsu5jw.png"
                        alt="Duración icon"
                        className="w-18 h-18 my-2"
                      />
                      <span className="text-xl">
                        {finalTime !== null ? Math.floor(finalTime / 60) : 0}{" "}
                        min {finalTime !== null ? finalTime % 60 : 0} s
                      </span>
                    </div>
                    <div className="col-span-1 flex flex-col items-center">
                      <span className="text-xl">Respuestas Correctas</span>
                      {/* Add the image below the label */}
                      <img
                        src="https://res.cloudinary.com/dk2red18f/image/upload/v1730908225/CEEC/PREQUIZZ/b4a0n1srq6zwexb837d3.png"
                        alt="Correctas icon"
                        className="w-18 h-18 my-2"
                      />
                      <span className="text-xl">{correctAnswers}</span>
                    </div>
                    <div className="col-span-1 flex flex-col items-center">
                      <span className="text-xl">Total de Preguntas</span>
                      {/* Add the image below the label */}
                      <img
                        src="https://res.cloudinary.com/dk2red18f/image/upload/v1730908225/CEEC/PREQUIZZ/aogv21pxjfi2civsg7a9.png"
                        alt="Total icon"
                        className="w-18 h-18 my-2"
                      />
                      <span className="text-xl">
                        {evaluationQuestions?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Botón de acción */}
                  <div className="pt-4">
                    <button
                      onClick={handleReintentarEvaluation}
                      className={`w-full py-3 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 ${
                        totalScore >= 16
                          ? "bg-brandm-500 text-white"
                          : "bg-brandm-500 text-white"
                      }`}
                    >
                      Regresar
                    </button>
                  </div>

                  {/*Finalizar Evalauación los botones ya nos e muestra 
                 {attemptCount >= 2 ? (
                  <p className="text-white text-xl mt-4">
                    Completaste todos los intentos disponibles
                  </p>
                ) : attemptCount === 1 ? (
                  <button
                    onClick={handleStartEvaluation}
                    className="bg-yellow-400 text-purple-900 font-bold text-xl rounded-full px-8 py-4 shadow-lg hover:bg-yellow-500 transition-colors duration-300"
                  >
                    Volver a Intentar
                  </button>
                ) : (
                  <button
                    onClick={handleStartEvaluation}
                    className="bg-yellow-400 text-purple-900 font-bold text-xl rounded-full px-8 py-4 shadow-lg hover:bg-yellow-500 transition-colors duration-300"
                  >
                    Comenzar Evaluación
                  </button>
                )}
                    */}
                </div>
              </div>
            )}

            {/* Botones para evaluación final */}
            {selectedOption !== null &&
              !showReaction &&
              !evaluationCompleted && (
                <button
                  className="mt-10 p-3  text-2xl bg-brandmo-800 text-white font-bold rounded-lg shadow-lg w-full md:w-1/3"
                  onClick={handleNextQuestion}
                >
                  {currentQuestion < (evaluationQuestions?.length || 0) - 1
                    ? "Siguiente"
                    : "Finalizar"}
                </button>
              )}
          </div>
        )
      ) : (
        <div className="flex justify-center items-center h-full w-full p-4 text-white">
          Selecciona una sesión para iniciar el curso
        </div>
      )}
    </div>
  );
};

export default MainContentPrueba;
