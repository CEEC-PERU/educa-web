import React from 'react';
import { formatDate } from '../../services/evaluationmodule/evaluation';
import { EvaluationAttempt } from '../../interfaces/EvaluationModule/EvaluationStudentAttempt';

interface AttemptSelectorProps {
  attempts: EvaluationAttempt[];
  selectedAttempt: EvaluationAttempt;
  onSelectAttempt: (attemptId: number) => void;
}

const AttemptSelector: React.FC<AttemptSelectorProps> = ({
  attempts,
  selectedAttempt,
  onSelectAttempt,
}) => {
  if (attempts.length <= 1) return null;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Seleccionar Intento:
      </label>
      <select
        value={selectedAttempt.attempt_id}
        onChange={(e) => onSelectAttempt(parseInt(e.target.value))}
        className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-transparent"
      >
        {attempts.map((attempt) => (
          <option key={attempt.attempt_id} value={attempt.attempt_id}>
            Intento {attempt.attempt_number} - {formatDate(attempt.completed_at)} - {attempt.percentage}%
          </option>
        ))}
      </select>
    </div>
  );
};

export default AttemptSelector;