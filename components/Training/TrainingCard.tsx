import React from 'react';
import { TrainingProgram } from '@/interfaces/Training/Training';
import { CalendarIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { LuPencil, LuTrash } from 'react-icons/lu';
import { EyeIcon } from 'lucide-react';

interface TrainingCardProps {
  training: TrainingProgram;
  onClick: (training: TrainingProgram, e: React.MouseEvent) => void;
  onEdit?: (training: TrainingProgram) => void;
  onDelete?: (training: TrainingProgram) => void;
}

const TrainingCard: React.FC<TrainingCardProps> = ({
  training,
  onClick,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      onClick={(e) => onClick(training, e)}
      className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-violet-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

      {/* Header with Eye Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {training.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {training.description}
          </p>
        </div>

        {/* Status badge and Eye Icon container */}
        <div className="flex flex-col items-end gap-2 ml-2">
          <EyeIcon className="h-5 w-5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap
            ${
              training.is_active === true
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {training.is_active === true ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <BookOpenIcon className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
          <span>{training.total_days || 0} días</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
          <span className="truncate">
            {new Date(training.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(training);
            }}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LuPencil className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Editar</span>
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(training);
            }}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LuTrash className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainingCard;
