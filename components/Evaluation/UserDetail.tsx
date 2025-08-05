import React from 'react';
import { EvaluationAssignment } from '../../interfaces/EvaluationModule/EvaluationStudent';
import { StatusBadge, AttemptStatusBadge } from './StatusBadges';

interface UserDetailsProps {
  selectedUser: EvaluationAssignment | null;
  getUserDisplayName: (student: any) => string;
  getLatestScore: (assignment: EvaluationAssignment) => number | null;
  onViewDetails: (userId: number, evaluationScheId: number) => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({
  selectedUser,
  getUserDisplayName,
  getLatestScore,
  onViewDetails,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!selectedUser) {
    return (
      <div className="w-1/2 bg-white rounded-lg shadow-md">
        <div className="p-8 text-center text-gray-500">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <p className="text-lg font-medium mb-2">Selecciona un usuario</p>
          <p>Haz clic en un usuario de la lista para ver sus detalles</p>
        </div>
      </div>
    );
  }

  const handleViewDetails = () => {
    const userId = selectedUser.student?.user_id;
    const evaluationScheId = selectedUser.evaluation_sche_id;

    if (userId && evaluationScheId) {
      onViewDetails(userId, evaluationScheId);
    } else {
      console.error('Missing user_id or evaluation_sche_id');
    }
  };

  return (
    <div className="w-1/2 bg-white rounded-lg shadow-md">
      <div className="p-6">
        {/* Header del Usuario */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {getUserDisplayName(selectedUser.student)}
              </h3>
              <p className="text-gray-600">
                Asignación #{selectedUser.assignment_id}
              </p>
            </div>
            <div className="text-right">
              {selectedUser.status && (
                <StatusBadge status={selectedUser.status} />
              )}
              <p className="text-sm text-gray-500 mt-1">
                Asignado: {formatDate(selectedUser.assigned_at)}
              </p>
            </div>
          </div>

          {/* Botón Ver Detalles Completos */}
          <div className="mt-4">
            <button
              onClick={handleViewDetails}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Ver Evaluación Completa
            </button>
          </div>
        </div>

        {/* Información del Usuario */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">
            Información Personal
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">DNI</label>
              <p className="text-gray-900">
                {selectedUser.student?.dni || 'No disponible'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">
                {selectedUser.student?.userProfile?.email || 'No disponible'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Teléfono
              </label>
              <p className="text-gray-900">
                {selectedUser.student?.userProfile?.phone || 'No disponible'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Estado
              </label>
              <div className="mt-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedUser.student?.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedUser.student?.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información de IDs para debugging */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold mb-2 text-gray-700">
            IDs de Sistema
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-500">User ID:</span>
              <span className="ml-2 font-mono">
                {selectedUser.student?.user_id || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Evaluation Sche ID:</span>
              <span className="ml-2 font-mono">
                {selectedUser.evaluation_sche_id || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Fechas de la Evaluación */}
        {(selectedUser.start_date || selectedUser.due_date) && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">
              Fechas de la Evaluación
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {selectedUser.start_date && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Fecha de Inicio
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedUser.start_date)}
                  </p>
                </div>
              )}
              {selectedUser.due_date && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Fecha de Vencimiento
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedUser.due_date)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estadísticas de Intentos */}
        {selectedUser.evaluation && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">
              Estadísticas de Evaluación
            </h4>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {selectedUser.evaluation?.attempts?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Intentos Realizados</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">
                  {selectedUser.evaluation?.max_attempts || 0}
                </p>
                <p className="text-sm text-gray-600">Intentos Máximos</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {getLatestScore(selectedUser) || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">Última Puntuación</p>
              </div>
            </div>
          </div>
        )}

        {/* Historial de Intentos */}
        {selectedUser.evaluation?.attempts &&
          selectedUser.evaluation.attempts.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-800">
                Historial de Intentos
              </h4>
              <div className="max-h-60 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        #
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Puntuación
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Estado
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedUser.evaluation.attempts.map(
                      (attempt, attemptIndex) => (
                        <tr key={attempt.attempt_id || attemptIndex}>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">
                            {attempt.attempt_id || attemptIndex + 1}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {attempt.score || 'N/A'}
                          </td>
                          <td className="px-4 py-2">
                            {attempt.status && (
                              <AttemptStatusBadge status={attempt.status} />
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {formatDate(attempt.completed_at)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
