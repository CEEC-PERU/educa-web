import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { TrophyIcon, TargetIcon } from 'lucide-react';
import { getScoreColors } from '../../services/evaluationmodule/evaluation';
import { EvaluationAttempt } from '../../interfaces/EvaluationModule/EvaluationStudentAttempt';

interface EvaluationScoreOverviewProps {
  selectedAttempt: EvaluationAttempt;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  passingScore: number;
  isPassed: boolean;
}

const EvaluationScoreOverview: React.FC<EvaluationScoreOverviewProps> = ({
  selectedAttempt,
  percentage,
  correctAnswers,
  totalQuestions,
  passingScore,
  isPassed,
}) => {
  const scoreColors = getScoreColors(percentage);

  return (
    <div className={`mb-8 p-6 rounded-lg border-2 ${scoreColors.bg}`}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Puntuación Final
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <span className={`text-4xl font-bold ${scoreColors.text}`}>
              {selectedAttempt.score}/{selectedAttempt.evaluation.total_points}
            </span>
            <span className={`text-2xl font-semibold ${scoreColors.text}`}>
              ({percentage.toFixed(1)}%)
            </span>
            {isPassed ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="font-medium">Aprobado</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full">
                <XCircleIcon className="h-5 w-5" />
                <span className="font-medium">No Aprobado</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <TrophyIcon className="h-8 w-8 text-yellow-500 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Correctas</p>
            <p className="font-bold text-lg">{correctAnswers}/{totalQuestions}</p>
          </div>
          <div className="text-center">
            <TargetIcon className="h-8 w-8 text-blue-500 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Puntuación Mínima</p>
            <p className="font-bold text-lg">{passingScore} pts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationScoreOverview;