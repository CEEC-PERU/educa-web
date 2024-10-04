import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import "./../../app/globals.css";
import {
  Question,
  ModuleResults,
  VideosInteractivo,
  CourseEvaluation,
  ModuleEvaluation,
} from "../../interfaces/StudentModule";
import { useResultModule } from "../../hooks/useResultModule";
import { useResultCourse } from "../../hooks/useCourseResults";
import { useAuth } from "../../context/AuthContext";
import NPSForm from "./../../components/student/NPSForm";

interface MainContentProps {
  sessionVideosInteractivos?: VideosInteractivo[];
  sessionVideo?: string;
  evaluationQuestions?: Question[];
  onFinish?: () => void;
  onProgress?: (progress: number, isCompleted: boolean) => void;
  videoProgress?: number;
  selectedModuleId?: number | null;
  moduleResults?: ModuleResults[];
  courseEvaluation?: CourseEvaluation[];
  moduleEvaluation?: ModuleEvaluation[];
}

const MainContentPrueba: React.FC<MainContentProps> = ({
  sessionVideosInteractivos,
  sessionVideo,
  evaluationQuestions,
  onFinish,
  onProgress,
  videoProgress = 0,
  selectedModuleId,
  moduleResults,
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
  const [showNPSForm, setShowNPSForm] = useState(false); // State to show NPS form
  const [textAnswer, setTextAnswer] = useState(""); // For open-ended questions
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]); // For multiple choice
  // Nuevo estado para guardar todas las respuestas seleccionadas
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
  const [showContinueButton, setShowContinueButton] = useState(false); // Estado para controlar el botón de "Continuar"

  const videoRef = useRef<HTMLVideoElement>(null);

  // Context
  const { user, token } = useAuth();
  const userInfo = user as { id: number };
  const { createResultModule } = useResultModule();
  const { createResultCourse } = useResultCourse();
  const router = useRouter();

  useEffect(() => {
    // Actualización automática sin recargar cuando cambia el estado
    if (moduleResults && moduleResults.length > 0) {
      console.log("Resultados del módulo actualizados", moduleResults);
    }
  }, [moduleResults]); // Se actualizará cada vez que cambien los resultados del módulo

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

  useEffect(() => {
    if (videoRef.current) {
      const handleTimeUpdate = () => {
        const currentTime = videoRef.current!.currentTime;
        const duration = videoRef.current!.duration;
        const progress = (currentTime / duration) * 100;
        if (onProgress) onProgress(progress, false);
        setCurrentTime(currentTime);
      };

      const handleSeeking = () => {
        if (videoRef.current!.currentTime > currentTime) {
          videoRef.current!.currentTime = currentTime;
        }
      };

      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
      videoRef.current.addEventListener("seeking", handleSeeking);

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
        }
      };
    }
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

  const handleOptionSelect = (
    optionId: number,
    optionText: string,
    isCorrect: boolean,
    score: number
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
          (answer) => answer.question_id !== questionId
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
        (prev) => prev + (evaluationQuestions?.[currentQuestion]?.score || 0)
      );
      setCorrectAnswers((prev) => prev + 1); // Increment correct answers count
    }
    setTimeout(() => {
      setShowReaction(false);
    }, 2000);
  };

  const handleTextAnswerChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
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
          (answer) => answer.question_id !== questionId
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
    score: number
  ) => {
    let newSelectedOptions = [...selectedOptions];
    let newOptionTexts =
      (answers.find(
        (answer) =>
          answer.question_id ===
          evaluationQuestions?.[currentQuestion]?.question_id
      )?.response2 as string[]) || [];
    let OptionCorrect =
      (answers.find(
        (answer) =>
          answer.question_id ===
          evaluationQuestions?.[currentQuestion]?.question_id
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
          (answer) => answer.question_id !== questionId
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
                    (opt) => opt.option_id === optId
                  )?.is_correct
              ) &&
              newSelectedOptions.length ===
                evaluationQuestions?.[currentQuestion]?.options.filter(
                  (opt) => opt.is_correct
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
    // Mostrar las respuestas por consola
    console.log("Respuestas seleccionadas:", answers);
    // Calcular y mostrar el puntaje total
    const totalScore = answers.reduce((score, answer) => {
      const question = evaluationQuestions?.find(
        (q) => q.question_id === answer.question_id
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
    } else {
      setShowStartMessage(false);
    }
  };

  const handleReloadEvaluation = () => {
    if (isFinalEvaluation) {
      setShowNPSForm(true); // Show NPS form before final evaluation
    } else {
      setShowStartMessage(false);
    }
  };

  const handleNPSSubmit = (score: number) => {
    console.log(`NPS Score: ${score}`);
    setShowNPSForm(false); // Ocultar formulario NPS

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
    (result) => result.module_id === selectedModuleId
  );
  console.log(moduleResult)
  const hasTwoAttempts =
    moduleResults &&
    moduleResults.filter((result) => result.module_id === selectedModuleId)
      .length >= 2;
console.log(hasTwoAttempts)
  const attemptCount =
    moduleResults?.filter((result) => result.module_id === selectedModuleId)
      .length || 0;

  console.log(`Número de intentos: ${attemptCount}`);

  const isFinalEvaluation = !selectedModuleId;

  return (
    <div className="h-full w-full p-4 relative">
      {showNPSForm ? (
        <NPSForm onSubmit={handleNPSSubmit} />
      ) : sessionVideo ? (
        <div className="flex flex-col items-center">
          <video
            key={sessionVideo}
            controls
            className="w-full h-full"
            style={{ maxWidth: "100%" }}
            onEnded={handleVideoEnd}
            ref={videoRef}
          >
            <source src={sessionVideo} type="video/mp4" />
          </video>
        </div>
      ) : evaluationQuestions && evaluationQuestions.length > 0 ? (
        showStartMessage ? (
          <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-purple-900 to-fuchsia-700 p-6 rounded-lg shadow-lg">
            <h1
              className={`text-6xl text-yellow-400 mb-6 font-extrabold animate-pulse ${
                isFinalEvaluation ? "" : "hidden"
              }`}
            >
              EVALUACIÓN FINAL
            </h1>
            <p
              className={`text-4xl text-white mb-8 ${
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
              className={`text-4xl text-white mb-8 ${
                isFinalEvaluation ? "hidden" : ""
              }`}
            >
              Para finalizar el módulo, ¡Inicia la Evaluación!
            </p>
            {/*Imagen dependiendo de evaluación del modulo y evaluación final*/}
            <img
              src={
                isFinalEvaluation
                  ? "https://res.cloudinary.com/dk2red18f/image/upload/v1721282668/WEB_EDUCA/WEB-IMAGENES/gpki5vwl5iscesql4vgz.png"
                  : "https://res.cloudinary.com/dk2red18f/image/upload/v1721282653/WEB_EDUCA/WEB-IMAGENES/iedxcrpplh3wmu5zfctf.png"
              }
              alt="Evaluation"
              className="mb-6 w-64 h-64 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300"
            />
            <div>
              <div>
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
              </div>
            </div>

            <div className="mt-4 text-white text-sm">
              <p className="animate-bounce">¡Buena suerte!</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-purple-900 to-fuchsia-700 p-4 md:p-6 rounded-lg shadow-lg">
            {/*Evaluación inicio*/}
            <div className="w-3/4 bg-gray-800 rounded-full h-3 md:h-4 mb-4 md:mb-6 overflow-hidden">
              {/*Porcentaje actual del progresod e evaluación y hasta cuando termine la evlauación*/}
              <div
                className="bg-yellow-600 h-3 md:h-4 text-xs font-medium text-white text-center leading-none rounded-full"
                style={{
                  width: `${
                    ((currentQuestion + 1) / evaluationQuestions.length) * 100
                  }%`,
                }}
              >
                {((currentQuestion + 1) / evaluationQuestions.length) * 100}%
              </div>
            </div>
            {/*Puntaje actual mientras esta respondiendo las preguntas */}
            <div className="flex flex-col items-center text-center w-full max-w-4xl mb-4 md:mb-6">
              <p className="text-white text-3xl  md:text-3xl">
                Puntaje: {totalScore}
              </p>
            </div>
           
            {!evaluationCompleted ? (
              <div className="flex flex-col items-center text-center w-full max-w-4xl">
                <h3 className="text-white text-2xl md:text-3xl pb-5 md:pb-7">
                  {evaluationQuestions[currentQuestion]?.question_text}
                </h3>
                {evaluationQuestions[currentQuestion]?.image && (
                  <img
                    src={evaluationQuestions[currentQuestion]?.image}
                    alt="Question related"
                    className="w-2/3 md:w-1/3 rounded-lg shadow-lg pb-5"
                  />
                )}
                {/*Pregunta de tipo opciones multiple(varias respuestas correctas) */}
                {evaluationQuestions[currentQuestion]?.type_id === 1 && (
                  <ul className="space-y-3">
                    {evaluationQuestions[currentQuestion]?.options.map(
                      (option, idx) => (
                        <li key={idx}>
                          <input
                            type="checkbox"
                            checked={selectedOptions.includes(option.option_id)}
                            onChange={() =>
                              handleMultipleSelect(
                                option.option_id,
                                option.option_text,
                                option.is_correct,
                                evaluationQuestions?.[currentQuestion]?.score ||
                                  0
                              )
                            }
                          />
                          <label>{option.option_text}</label>
                        </li>
                      )
                    )}
                  </ul>
                )}
                {/*Pregunta de tipo abierto */}
                {evaluationQuestions[currentQuestion]?.type_id === 3 && (
                  <textarea
                    value={textAnswer}
                    onChange={handleTextAnswerChange}
                    className="w-full h-40 p-2 border rounded"
                    placeholder="Escribe tu respuesta aquí..."
                  />
                )}
                {/*Pregunta de tipo opciones (seleccionar) */}
                {evaluationQuestions[currentQuestion]?.type_id === 4 && (
                  <ul className="space-y-3">
                    {evaluationQuestions[currentQuestion]?.options.map(
                      (option, idx) => (
                        <li key={idx}>
                          <button
                            className={`p-2 rounded-lg ${
                              selectedOption === option.option_id
                                ? isCorrect
                                  ? "bg-green-500"
                                  : "bg-red-500"
                                : "bg-yellow-600"
                            }`}
                            onClick={() =>
                              handleOptionSelect(
                                option.option_id,
                                option.option_text,
                                option.is_correct,
                                evaluationQuestions?.[currentQuestion]?.score ||
                                  0
                              )
                            }
                            disabled={selectedOption !== null}
                          >
                            {option.option_text}
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                )}

                {/* Mostrar botón continuar solo si está habilitado para evalauciones de modulo */}
                {showContinueButton && (
                  <button
                    className="mt-6 p-3 bg-yellow-500 text-purple-900 font-bold rounded-lg shadow-lg w-full md:w-1/3"
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
              <div className="mt-6 text-white text-center text-2xl">
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
              </div>
            )}
            {/*Botones para evaluacion final */}
            {selectedOption !== null &&
              !showReaction &&
              !evaluationCompleted && (
                <button
                  className="mt-6 p-3 bg-yellow-500 text-purple-900 font-bold rounded-lg shadow-lg w-full md:w-1/3"
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
