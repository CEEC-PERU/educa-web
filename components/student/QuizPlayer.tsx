import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { useResultModule } from '../../hooks/resultado/useResultModule';
import { useResultCourse } from '../../hooks/courses/useCourseResults';
import {
  useCuestionarioStar,
  useCuestionarioNPS,
  useCreateCuestionario,
} from '../../hooks/useCuestionario';
import NPSForm from './NPSForm';
import StarForm from './StarForm';
import { Question, ModuleResults, CourseResults } from '../../interfaces/StudentModule';

const ESTRELLA_LLENA =
  'https://res.cloudinary.com/dk2red18f/image/upload/v1730907418/CEEC/PREQUIZZ/kqw9stwbaz9tftv5ep77.png';

type Answer = {
  question_id: number;
  response: string | number | number[];
  response2: string | number | string[];
  isCorret: boolean | string;
  isCorrect2: boolean[] | boolean | string;
  score: number | null;
};

interface QuizPlayerProps {
  evaluationQuestions: Question[];
  selectedModuleId?: number | null;
  moduleResults?: ModuleResults[];
  courseResults?: CourseResults[];
  onUpdated?: () => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({
  evaluationQuestions,
  selectedModuleId,
  moduleResults,
  courseResults,
  onUpdated,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [evaluationCompleted, setEvaluationCompleted] = useState(false);
  const [showStartMessage, setShowStartMessage] = useState(true);
  const [showReaction, setShowReaction] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [showNPSForm, setShowNPSForm] = useState(false);
  const [showStarForm, setShowStarForm] = useState(false);
  const [textAnswer, setTextAnswer] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();
  const userInfo = user as { id: number };
  const { createResultModule } = useResultModule();
  const { createResultCourse } = useResultCourse();
  const { createCuestionarioResult } = useCreateCuestionario();
  const router = useRouter();
  const courseId = Array.isArray(router.query.course_id)
    ? parseInt(router.query.course_id[0], 10)
    : parseInt(router.query.course_id as string, 10);
  const { cuestionariostar } = useCuestionarioStar(courseId);
  const { cuestionariosnps } = useCuestionarioNPS(courseId);

  const isFinalEvaluation = !selectedModuleId;

  const currentQuestionType = evaluationQuestions[currentQuestion]?.type_id;
  const showContinueButton =
    (currentQuestionType === 3 && textAnswer.trim() !== '') ||
    (currentQuestionType === 1 && selectedOptions.length > 0);

  const attemptCount =
    moduleResults?.filter((r) => r.module_id === selectedModuleId).length || 0;

  const getFirstCreatedAtResults = (results?: ModuleResults[]) => {
    if (!results) return [];
    return results.reduce((acc, result) => {
      const existing = acc.find((r) => r.evaluation_id === result.evaluation_id);
      if (!existing || new Date(result.created_at) < new Date(existing.created_at)) {
        return [...acc.filter((r) => r.evaluation_id !== result.evaluation_id), result];
      }
      return acc;
    }, [] as ModuleResults[]);
  };

  const firstResults = getFirstCreatedAtResults(moduleResults);
  const enableSecondAttempt = firstResults.every((r) => r.puntaje >= 16);

  const attemptCountCourse =
    courseResults?.filter((r) => r.course_id === courseId).length || 0;

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNextQuestion = () => {
    if (currentQuestionType === 3 && textAnswer.trim() === '') {
      alert('Por favor, responde la pregunta.');
      return;
    }
    if (currentQuestion >= evaluationQuestions.length - 1) {
      handleFinish();
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
    setSelectedOption(null);
    setSelectedOptions([]);
    setTextAnswer('');
    setIsCorrect(null);
  };

  const handleOptionSelect = (
    optionId: number,
    optionText: string,
    correct: boolean,
    score: number,
  ) => {
    setSelectedOption(optionId);
    setIsCorrect(correct);
    setShowReaction(true);

    const questionId = evaluationQuestions[currentQuestion]?.question_id;
    if (questionId !== undefined) {
      setAnswers((prev) => [
        ...prev.filter((a) => a.question_id !== questionId),
        { question_id: questionId, response: optionId, response2: optionText, isCorret: correct, isCorrect2: '', score },
      ]);
    }

    if (correct) {
      setTotalScore((prev) => prev + (evaluationQuestions[currentQuestion]?.score || 0));
      setCorrectAnswers((prev) => prev + 1);
    }
    setTimeout(() => setShowReaction(false), 2000);
  };

  const handleTextAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextAnswer(value);

    const questionId = evaluationQuestions[currentQuestion]?.question_id;
    if (questionId !== undefined) {
      setAnswers((prev) => [
        ...prev.filter((a) => a.question_id !== questionId),
        {
          question_id: questionId,
          response: '',
          response2: value,
          isCorret: '',
          isCorrect2: '',
          score: evaluationQuestions[currentQuestion]?.score || 0,
        },
      ]);
    }
  };

  const handleMultipleSelect = (
    optionId: number,
    optionText: string,
    correct: boolean,
    score: number,
  ) => {
    const questionId = evaluationQuestions[currentQuestion]?.question_id;
    const existing = answers.find((a) => a.question_id === questionId);

    let newSelectedOptions = selectedOptions.includes(optionId)
      ? selectedOptions.filter((id) => id !== optionId)
      : [...selectedOptions, optionId];

    let newOptionTexts = (existing?.response2 as string[]) || [];
    let newOptionCorrect = (existing?.isCorrect2 as boolean[]) || [];

    if (selectedOptions.includes(optionId)) {
      newOptionTexts = newOptionTexts.filter((t) => t !== optionText);
      newOptionCorrect = newOptionCorrect.filter((c) => c !== correct);
    } else {
      newOptionTexts = [...newOptionTexts, optionText];
      newOptionCorrect = [...newOptionCorrect, correct];
    }

    setSelectedOptions(newSelectedOptions);

    if (questionId !== undefined) {
      const allCorrect =
        newSelectedOptions.every(
          (id) => evaluationQuestions[currentQuestion]?.options.find((o) => o.option_id === id)?.is_correct,
        ) &&
        newSelectedOptions.length ===
          evaluationQuestions[currentQuestion]?.options.filter((o) => o.is_correct).length;

      setAnswers((prev) => [
        ...prev.filter((a) => a.question_id !== questionId),
        {
          question_id: questionId,
          response: newSelectedOptions,
          response2: newOptionTexts,
          isCorret: allCorrect,
          isCorrect2: newOptionCorrect,
          score,
        },
      ]);
    }
  };

  const handleFinish = () => {
    setEvaluationCompleted(true);
    setFinalTime(timeElapsed);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const score = answers.reduce((acc, answer) => {
      const question = evaluationQuestions.find((q) => q.question_id === answer.question_id);
      if (question?.type_id !== 3 && answer.isCorret) {
        return acc + (question?.score || 0);
      }
      return acc;
    }, 0);

    setTotalScore(score);

    const mappedAnswers = answers.map((a) => ({
      question_id: a.question_id,
      response: a.response || null,
      response2: a.response2,
      isCorrect: a.isCorret || false,
      isCorrect2: a.isCorrect2 || null,
      score: a.score,
    }));

    if (selectedModuleId) {
      createResultModule({
        user_id: userInfo.id,
        puntaje: score,
        module_id: selectedModuleId,
        evaluation_id: evaluationQuestions[0]?.evaluation_id || 0,
        answers: mappedAnswers,
      });
    } else {
      createResultCourse({
        course_id: courseId,
        evaluation_id: evaluationQuestions[0]?.evaluation_id || 0,
        puntaje: score,
        user_id: userInfo.id,
        second_chance: false,
        answers: mappedAnswers,
      });
    }
  };

  const handleStartEvaluation = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setTotalScore(0);
    setCorrectAnswers(0);
    setEvaluationCompleted(false);
    setShowStartMessage(false);

    if (isFinalEvaluation) {
      if (cuestionariosnps?.length === 0) {
        setShowNPSForm(true);
      } else if (cuestionariostar?.length === 0) {
        setShowStarForm(true);
      }
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

  const handleNPSSubmit = (score: number) => {
    createCuestionarioResult({ user_id: userInfo.id, score, course_id: courseId, cuestype_id: 1 });
    setShowNPSForm(false);
    setShowStarForm(cuestionariostar?.length === 0);
  };

  const handleStarSubmit = (score: number) => {
    createCuestionarioResult({ user_id: userInfo.id, score, course_id: courseId, cuestype_id: 2 });
    setShowStarForm(false);
    setShowStartMessage(false);
  };

  if (showNPSForm) return <NPSForm onSubmit={handleNPSSubmit} />;
  if (showStarForm) return <StarForm onSubmit={handleStarSubmit} />;

  if (showStartMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-brandm-500 to-brandmc-100 p-3 sm:p-4 md:p-6 rounded-lg shadow-lg">
        {isFinalEvaluation ? (
          <>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-yellow-400 mb-4 sm:mb-6 font-extrabold animate-pulse text-center leading-tight">
              EVALUACIÓN FINAL
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white mb-6 sm:mb-8 text-center px-2">
              Para finalizar el curso, inicia esto
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-yellow-400 mb-6 font-extrabold animate-pulse text-center">
              ¡Ponte a Prueba!
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-8 text-center px-2">
              Para finalizar el módulo, ¡Inicia la Evaluación!
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-6 sm:mb-8 text-center px-4">
              ¡Tienes 2 Intentos Disponibles! Si obtienes mayor a 16 en el primer
              intento de los examenes modulares tienes un segundo intento en el examen final
            </p>
          </>
        )}

        <img
          src={
            isFinalEvaluation
              ? 'https://res.cloudinary.com/dk2red18f/image/upload/v1721282668/WEB_EDUCA/WEB-IMAGENES/gpki5vwl5iscesql4vgz.png'
              : 'https://res.cloudinary.com/dk2red18f/image/upload/v1721282653/WEB_EDUCA/WEB-IMAGENES/iedxcrpplh3wmu5zfctf.png'
          }
          alt="Evaluation"
          className="mb-4 sm:mb-6 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300"
        />

        {isFinalEvaluation ? (
          <>
            {(enableSecondAttempt === false && attemptCountCourse === 1) ||
            (enableSecondAttempt === true && attemptCountCourse === 2) ? (
              <p className="text-white text-xl mt-4">Completaste todos los intentos disponibles</p>
            ) : (
              <button
                onClick={handleStartEvaluation}
                className="bg-yellow-400 text-purple-900 font-bold text-xl rounded-full px-8 py-4 shadow-lg hover:bg-yellow-500 transition-colors duration-300"
              >
                {attemptCountCourse === 1 ? 'Volver a Intentar' : 'Comenzar Evaluación Final'}
              </button>
            )}
          </>
        ) : (
          <>
            {attemptCount >= 2 ? (
              <p className="text-white text-xl mt-4">Completaste todos los intentos disponibles</p>
            ) : (
              <button
                onClick={handleStartEvaluation}
                className="bg-yellow-400 text-purple-900 font-bold text-xl rounded-full px-8 py-4 shadow-lg hover:bg-yellow-500 transition-colors duration-300"
              >
                {attemptCount === 1 ? 'Volver a Intentar' : 'Comenzar Evaluación'}
              </button>
            )}
          </>
        )}

        <div className="mt-4 text-white text-sm">
          <p className="animate-bounce">¡Buena suerte!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white p-4 md:p-6 rounded-lg shadow-xl space-y-6">
      <div className="w-full text-center text-brandm-500 text-2xl md:text-4xl font-bold">
        Puntaje: {totalScore}
      </div>

      <div className="w-full max-w-6xl bg-brandmc-100 rounded-full h-10 mb-6 overflow-hidden shadow-lg">
        <div
          className="bg-brandmo-800 h-10 text-xs font-medium text-white text-center leading-none rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${((currentQuestion + 1) / evaluationQuestions.length) * 100}%` }}
        >
          <p className="text-white text-xl pt-3 font-bold">
            {Math.round(((currentQuestion + 1) / evaluationQuestions.length) * 100)}%
          </p>
        </div>
      </div>

      {!evaluationCompleted ? (
        <div className="flex flex-col items-center text-center w-full max-w-6xl space-y-4 sm:space-y-6">
          <h3 className="text-brandmc-100 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl pb-3 sm:pb-5 md:pb-7 font-montserrat font-extrabold leading-tight mb-4 sm:mb-6 px-2">
            {evaluationQuestions[currentQuestion]?.question_text}
          </h3>

          <div className="flex flex-col lg:flex-row w-full lg:space-x-8 space-y-4 lg:space-y-0">
            <div className="w-full lg:w-1/2 flex justify-center order-1">
              {evaluationQuestions[currentQuestion]?.image && (
                <img
                  src={evaluationQuestions[currentQuestion].image}
                  alt="Imagen relacionada con la pregunta"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:w-4/5 rounded-lg shadow-lg h-auto object-contain"
                />
              )}
            </div>

            <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4 order-2">
              {currentQuestionType === 1 && (
                <ul className="space-y-2 sm:space-y-3">
                  {evaluationQuestions[currentQuestion].options.map((option, idx) => (
                    <li key={idx} className="flex items-start space-x-2 sm:space-x-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-yellow-500 rounded focus:ring focus:ring-purple-700"
                        checked={selectedOptions.includes(option.option_id)}
                        onChange={() =>
                          handleMultipleSelect(
                            option.option_id,
                            option.option_text,
                            option.is_correct,
                            evaluationQuestions[currentQuestion]?.score || 0,
                          )
                        }
                      />
                      <label className="text-white text-xl">{option.option_text}</label>
                    </li>
                  ))}
                </ul>
              )}

              {currentQuestionType === 3 && (
                <textarea
                  value={textAnswer}
                  onChange={handleTextAnswerChange}
                  className="w-full h-40 p-4 text-white bg-gray-700 rounded-lg border border-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Escribe tu respuesta aquí..."
                />
              )}

              {currentQuestionType === 4 && (
                <ul className="space-y-2 sm:space-y-3">
                  {evaluationQuestions[currentQuestion].options.map((option, idx) => (
                    <li key={idx}>
                      <button
                        className={`p-3 sm:p-4 md:p-6 text-sm sm:text-base md:text-lg lg:text-xl font-bold rounded-lg w-full transition-all duration-300 px-4 sm:px-6 md:px-8 lg:px-10 ${
                          selectedOption === option.option_id
                            ? isCorrect
                              ? 'bg-green-500 border-green-600'
                              : 'bg-red-500 border-red-600'
                            : 'bg-brandm-500 text-white hover:bg-yellow-400'
                        }`}
                        onClick={() =>
                          handleOptionSelect(
                            option.option_id,
                            option.option_text,
                            option.is_correct,
                            evaluationQuestions[currentQuestion]?.score || 0,
                          )
                        }
                        disabled={selectedOption !== null}
                      >
                        {option.option_text}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {showContinueButton && (
            <button
              className="mt-6 p-3 bg-brandm-400 text-white text-2xl font-bold rounded-lg shadow-lg w-full md:w-1/3 transition-transform transform hover:scale-105"
              onClick={handleNextQuestion}
            >
              {currentQuestion < evaluationQuestions.length - 1 ? 'Siguiente' : 'Finalizar'}
            </button>
          )}

          {showReaction && (
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              {Array.from({ length: 20 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`absolute text-4xl md:text-6xl ${
                    isCorrect ? 'text-green-500' : 'text-red-500'
                  } animate-float`}
                  style={{ bottom: '0', left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 0.5}s` }}
                >
                  {isCorrect ? '😊' : '😢'}
                </div>
              ))}
            </div>
          )}

          {selectedOption !== null && !showReaction && !evaluationCompleted && (
            <button
              className="mt-10 p-3 text-2xl bg-brandmo-800 text-white font-bold rounded-lg shadow-lg w-full md:w-1/3"
              onClick={handleNextQuestion}
            >
              {currentQuestion < evaluationQuestions.length - 1 ? 'Siguiente' : 'Finalizar'}
            </button>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-full bg-white">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl text-center text-white p-8 space-y-6">
            <div className="relative flex justify-center mb-6">
              <img
                src={
                  totalScore >= 16
                    ? 'https://res.cloudinary.com/dk2red18f/image/upload/v1709006952/CEEC/PREQUIZZ/yyhjjq12kstinufbzvmi.png'
                    : totalScore >= 13
                      ? 'https://res.cloudinary.com/dk2red18f/image/upload/v1709006864/CEEC/PREQUIZZ/drqdrqzjws2ltwqjccek.png'
                      : 'https://res.cloudinary.com/dk2red18f/image/upload/v1709006848/CEEC/PREQUIZZ/ow40gsipk4rpxspixvzm.png'
                }
                className="w-60 h-60 rounded-full border-4 border-brandmc-100 shadow-md"
              />
              <div className="absolute flex justify-center space-x-2 -top-12 pb-20">
                <img src={ESTRELLA_LLENA} alt="Estrella 1" className="w-12 h-12" />
                {totalScore >= 13 && <img src={ESTRELLA_LLENA} alt="Estrella 2" className="w-12 h-12" />}
                {totalScore >= 16 && <img src={ESTRELLA_LLENA} alt="Estrella 3" className="w-12 h-12" />}
              </div>
            </div>

            <p className="text-2xl font-semibold mb-4 text-brandm-500">
              {totalScore >= 16
                ? '¡Eres realmente el rey del saber!'
                : totalScore >= 13
                  ? '¡Nada mal, pero puedes mejorar!'
                  : '¡Necesitas repasar las sesiones!'}
            </p>

            <div className="grid grid-cols-3 gap-6 bg-brandmc-100 rounded-lg p-6 shadow-lg text-lg font-semibold text-yellow-300">
              <div className="col-span-1 flex flex-col items-center">
                <span className="text-xl">Duración</span>
                <img
                  src="https://res.cloudinary.com/dk2red18f/image/upload/v1730908225/CEEC/PREQUIZZ/ect4ksc3nxzzu7jsu5jw.png"
                  alt="Duración icon"
                  className="w-18 h-18 my-2"
                />
                <span className="text-xl">
                  {finalTime !== null ? Math.floor(finalTime / 60) : 0} min{' '}
                  {finalTime !== null ? finalTime % 60 : 0} s
                </span>
              </div>
              <div className="col-span-1 flex flex-col items-center">
                <span className="text-xl">Respuestas Correctas</span>
                <img
                  src="https://res.cloudinary.com/dk2red18f/image/upload/v1730908225/CEEC/PREQUIZZ/b4a0n1srq6zwexb837d3.png"
                  alt="Correctas icon"
                  className="w-18 h-18 my-2"
                />
                <span className="text-xl">{correctAnswers}</span>
              </div>
              <div className="col-span-1 flex flex-col items-center">
                <span className="text-xl">Total de Preguntas</span>
                <img
                  src="https://res.cloudinary.com/dk2red18f/image/upload/v1730908225/CEEC/PREQUIZZ/aogv21pxjfi2civsg7a9.png"
                  alt="Total icon"
                  className="w-18 h-18 my-2"
                />
                <span className="text-xl">{evaluationQuestions.length}</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleReintentarEvaluation}
                className="w-full py-3 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 bg-brandm-500 text-white"
              >
                Regresar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPlayer;
