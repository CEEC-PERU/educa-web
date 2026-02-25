import React from 'react';
import { TrainingAssignment } from '@/interfaces/Training/Training';
import {
  CalendarDays,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  PowerOff,
} from 'lucide-react';

interface TrainingAssignmentCardProps {
  assignment: TrainingAssignment;
  //onClick: (assignment: TrainingAssignment, e: React.MouseEvent) => void;
  onDelete?: (assignment: TrainingAssignment) => void;
  onDetail?: (assignment: TrainingAssignment) => void;
}

const formatearFecha = (fechaISO: string): string => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const TrainingAssignmentCard: React.FC<TrainingAssignmentCardProps> = ({
  assignment,
  onDelete,
  onDetail,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (onDelete) {
      onDelete(assignment);
    }
  };

  const handleDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (onDetail) {
      onDetail(assignment);
    }
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 cursor-pointer overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-colors
                ${
                  assignment.isActive
                    ? 'bg-green-100 text-green-700 ring-1 ring-green-200'
                    : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
                }`}
              >
                {assignment.isActive ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Activo</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" />
                    <span>Inactivo</span>
                  </>
                )}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {assignment.programTitle}
            </h3>
          </div>

          <div className="ml-4 flex items-center gap-2">
            {/* Botón Desactivar */}
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-9 h-9 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center transition-colors group/btn z-10"
                title="Desactivar asignación"
              >
                <PowerOff className="w-4 h-4 text-amber-600 group-hover/btn:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {/* NOMBRE DE LA CAMPAÑA */}
          <div className="flex items-center gap-3 text-sm">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium mb-0.5">
                Campaña
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {assignment.classroomCode}
              </p>
            </div>
          </div>

          {/* Fecha de Asignación */}
          <div className="flex items-center gap-3 text-sm">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <CalendarDays className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium mb-0.5">
                Asignado
              </p>
              <p className="text-sm font-medium text-gray-700">
                {formatearFecha(assignment.assignedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* linea separadora */}
        <div className="border-t border-gray-100 my-4" />

        {/* Acción */}
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group-hover:shadow-lg"
          type="button"
          onClick={handleDetail}
        >
          <span>Ver Detalles</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
    </div>
  );
};

export default TrainingAssignmentCard;
