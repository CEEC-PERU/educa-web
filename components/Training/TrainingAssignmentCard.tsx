import React from 'react';
import { TrainingAssignment } from '@/interfaces/Training/Training';
import { EyeIcon } from 'lucide-react';

interface TrainingAssignmentCardProps {
  assignment: TrainingAssignment;
  onClick: (assignment: TrainingAssignment, e: React.MouseEvent) => void;
}

const TrainingAssignmentCard: React.FC<TrainingAssignmentCardProps> = ({
  assignment,
  onClick,
}) => {
  return (
    <div
      onClick={(e) => onClick(assignment, e)}
      className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {assignment.program_id}
          </h3>
        </div>

        <div className="flex flex-col items-end gap-2 ml-2">
          <EyeIcon className="h-5 w-5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap
            ${
              assignment.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {assignment.is_active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrainingAssignmentCard;
