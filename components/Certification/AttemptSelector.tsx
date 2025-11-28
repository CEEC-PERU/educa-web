import { CertificationAttempt } from '@/interfaces/Certification/CertificationStudentAttempt';
import { formatDate } from '@/services/evaluationmodule/evaluation';
import React from 'react';

interface AttemptSelectorProps {
  attempts: CertificationAttempt[];
  selectedAttempt: CertificationAttempt | null;
  onSelectAttempt: (attemptId: number) => void;
}

const AttemptSelectorCertification: React.FC<AttemptSelectorProps> = ({
  attempts,
  selectedAttempt,
  onSelectAttempt,
}) => {
  if (attempts.length === 0) return null;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Seleccionar Intento ({attempts.length} disponible
        {attempts.length > 1 ? 's' : ''}):
      </label>
      <select
        value={selectedAttempt?.attempt_id || ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value) {
            onSelectAttempt(parseInt(value));
          }
        }}
        className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-transparent"
      >
        <option value="">Selecciona un intento...</option>
        {attempts.map((attempt) => (
          <option key={attempt.attempt_id} value={attempt.attempt_id}>
            Intento {attempt.attempt_number} - {attempt.completed_at} -{' '}
            <span
              className={attempt.passed ? 'text-green-600' : 'text-red-600'}
            >
              {attempt.passed ? 'Aprobado' : 'Reprobado'}
            </span>{' '}
            -{' '}
            {Math.round(
              (attempt.score_obtained / attempt.total_points_available) * 100
            )}
            %
          </option>
        ))}
      </select>
    </div>
  );
};

export default AttemptSelectorCertification;
