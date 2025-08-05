import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusColors = {
    assigned: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  const statusLabels = {
    assigned: 'Asignado',
    in_progress: 'En Progreso',
    completed: 'Completado',
    overdue: 'Vencido',
    cancelled: 'Cancelado',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        statusColors[status as keyof typeof statusColors] ||
        'bg-gray-100 text-gray-800'
      }`}
    >
      {statusLabels[status as keyof typeof statusLabels] || status}
    </span>
  );
};

export const AttemptStatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  const statusLabels = {
    completed: 'Completado',
    in_progress: 'En Progreso',
    failed: 'Fallido',
    cancelled: 'Cancelado',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        statusColors[status as keyof typeof statusColors] ||
        'bg-gray-100 text-gray-800'
      }`}
    >
      {statusLabels[status as keyof typeof statusLabels] || status}
    </span>
  );
};
