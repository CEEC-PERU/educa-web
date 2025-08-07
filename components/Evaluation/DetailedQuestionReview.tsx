import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { getQuestionResult } from '../../utils/evaluation/questionAnalysis';
import { 
      EvaluationAttempt,
  EvaluationQuestion,
  EvaluationOption
 } from '../../interfaces/EvaluationModule/EvaluationStudentAttempt';


interface DetailedQuestionReviewProps {
  selectedAttempt: EvaluationAttempt;
}

const DetailedQuestionReview: React.FC<DetailedQuestionReviewProps> = ({ selectedAttempt }) => {
  const getOptionClass = (isSelected: boolean, isCorrect: boolean): string => {
    let optionClass = 'p-3 rounded-lg border';
    
    if (isSelected && isCorrect) {
      optionClass += ' bg-green-50 border-green-200 text-green-800';
    } else if (isSelected && !isCorrect) {
      optionClass += ' bg-red-50 border-red-200 text-red-800';
    } else if (!isSelected && isCorrect) {
      optionClass += ' bg-blue-50 border-blue-200 text-blue-800';
    } else {
      optionClass += ' bg-gray-50 border-gray-200 text-gray-700';
    }

    return optionClass;
  };

  const renderOptionLabel = (isSelected: boolean, isCorrect: boolean) => {
    if (isSelected) {
      return (
        <span className="text-sm font-medium">
          {isCorrect ? '✓ Tu respuesta' : '✗ Tu respuesta'}
        </span>
      );
    }
    
    if (!isSelected && isCorrect) {
      return (
        <span className="text-sm font-medium text-blue-600">
          ✓ Respuesta correcta
        </span>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Revisión Detallada
      </h3>
      
      {selectedAttempt.evaluation.questions
        .sort((a, b) => a.order_index - b.order_index)
        .map((question: EvaluationQuestion, questionIndex: number) => {
          const result = getQuestionResult(question, selectedAttempt.answers);
          
          return (
            <div
              key={question.question_sche_id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded-full font-semibold text-sm">
                      {questionIndex + 1}
                    </span>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {question.question_text}
                    </h4>
                    {result.isCorrect ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {result.earnedPoints}/{question.points} pts
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {question.options
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((option: EvaluationOption) => {
                    const isSelected = result.selectedOption?.option_sche_id === option.option_sche_id;
                    const isCorrect = option.is_correct;
                    
                    return (
                      <div key={option.option_sche_id} className={getOptionClass(isSelected, isCorrect)}>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {renderOptionLabel(isSelected, isCorrect)}
                          </div>
                          <span className="flex-1">{option.option_text}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {question.explanation && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Explicación:</strong> {question.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default DetailedQuestionReview;