import React from 'react';
import { TrainingDay } from '@/interfaces/Training/Training';
import { EyeIcon, CalendarDays, Target } from 'lucide-react';
import { LuPencil, LuTrash } from 'react-icons/lu';

interface TrainingDayCardProps {
  day: TrainingDay;
  onClick: (day: TrainingDay) => void;
  onEdit?: (day: TrainingDay) => void;
  onDelete?: (day: TrainingDay) => void;
}

const TrainingDayCard: React.FC<TrainingDayCardProps> = ({
  day,
  onClick,
  onEdit,
  onDelete,
}) => {
  const handleCardClick = () => {
    onClick(day);
  };

  const handleActionClick = (
    e: React.MouseEvent,
    action: (day: TrainingDay) => void,
  ) => {
    e.stopPropagation(); // Prevenir propagación
    action(day);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-violet-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {day.day_number}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {day.title}
            </h3>
          </div>
        </div>
        <EyeIcon className="h-5 w-5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
      </div>

      {/* Metadata */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Día {day.day_number}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="h-4 w-4 text-green-500" />
            <span className="font-medium">{day.completion_threshold}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Progreso requerido</span>
            <span className="font-semibold text-gray-700">
              {day.completion_threshold}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${day.completion_threshold}%` }}
            />
          </div>
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex gap-2 pt-4 mt-4 border-t border-gray-100">
          {onEdit && (
            <button
              onClick={(e) => handleActionClick(e, onEdit)}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LuPencil className="h-4 w-4 mr-2" />
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => handleActionClick(e, onDelete)}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LuTrash className="h-4 w-4 mr-2" />
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainingDayCard;
