import {
  EvaluationAnswer,
  EvaluationQuestion,
  EvaluationAttempt
} from '../../interfaces/EvaluationModule/EvaluationStudentAttempt';

interface QuestionResult {
  isCorrect: boolean;
  selectedOption: any;
  earnedPoints: number;
}

export const getQuestionResult = (
  question: EvaluationQuestion, 
  answers: EvaluationAnswer[]
): QuestionResult => {
  const questionAnswer = answers.find(
    answer => answer.question_sche_id === question.question_sche_id
  );
  
  if (!questionAnswer) {
    return { isCorrect: false, selectedOption: null, earnedPoints: 0 };
  }

  return {
    isCorrect: questionAnswer.is_correct,
    selectedOption: question.options.find(
      opt => opt.option_sche_id === questionAnswer.option_sche_id
    ),
    earnedPoints: questionAnswer.points_earned
  };
};

export const calculateEvaluationStats = (selectedAttempt: EvaluationAttempt) => {
  const percentage = parseFloat(selectedAttempt.percentage);
  const totalQuestions = selectedAttempt.evaluation.questions.length;
  const correctAnswers = selectedAttempt.answers.filter(
    answer => answer.is_correct
  ).length;
  const passingScore = selectedAttempt.evaluation.passing_score;
  const isPassed = selectedAttempt.score >= passingScore;

  return {
    percentage,
    totalQuestions,
    correctAnswers,
    passingScore,
    isPassed,
  };
};