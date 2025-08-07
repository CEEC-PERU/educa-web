import React from 'react';
import { 
  ClockIcon,
  CalendarIcon,
  AcademicCapIcon,
  DocumentTextIcon
} from '@heroicons/react/24/solid';
import { formatDate } from '../../services/evaluationmodule/evaluation';
import { EvaluationAttempt } from '../../interfaces/EvaluationModule/EvaluationStudentAttempt';

interface EvaluationStatsCardsProps {
  selectedAttempt: EvaluationAttempt;
}

const EvaluationStatsCards: React.FC<EvaluationStatsCardsProps> = ({ selectedAttempt }) => {
  const statsData = [
    {
      icon: ClockIcon,
      color: 'text-blue-500',
      label: 'Tiempo Total',
      value: `${selectedAttempt.time_spent_minutes} min`
    },
    {
      icon: CalendarIcon,
      color: 'text-green-500',
      label: 'Completado',
      value: formatDate(selectedAttempt.completed_at),
      isDate: true
    },
    {
      icon: AcademicCapIcon,
      color: 'text-purple-500',
      label: 'Intento',
      value: selectedAttempt.attempt_number.toString()
    },
    {
      icon: DocumentTextIcon,
      color: 'text-indigo-500',
      label: 'Estado',
      value: selectedAttempt.status,
      capitalize: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
            <div className="ml-3">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`font-semibold ${stat.isDate ? 'text-xs' : ''} ${stat.capitalize ? 'capitalize' : ''}`}>
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EvaluationStatsCards;