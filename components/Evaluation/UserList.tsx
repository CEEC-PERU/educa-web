import React from 'react';
import { EvaluationAssignment } from '../../interfaces/EvaluationModule/EvaluationStudent';
import { StatusBadge } from './StatusBadges';

interface UsersListProps {
  evaluationData: EvaluationAssignment[];
  filteredData: EvaluationAssignment[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  selectedUser: EvaluationAssignment | null;
  setSelectedUser: (user: EvaluationAssignment) => void;
  getUserDisplayName: (student: any) => string;
  getProgressPercentage: (assignment: EvaluationAssignment) => number;
  getLatestScore: (assignment: EvaluationAssignment) => number | null;
  onUserDoubleClick: (userId: number, evaluationScheId: number) => void;
}

export const UsersList: React.FC<UsersListProps> = ({
  evaluationData,
  filteredData,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  selectedUser,
  setSelectedUser,
  getUserDisplayName,
  getProgressPercentage,
  getLatestScore,
  onUserDoubleClick,
}) => {
  const handleUserDoubleClick = (assignment: EvaluationAssignment) => {
    const userId = assignment.student?.user_id;
    const evaluationScheId = assignment.evaluation_sche_id;

    if (userId && evaluationScheId) {
      onUserDoubleClick(userId, evaluationScheId);
    }
  };

  return (
    <div className="w-1/2 bg-white rounded-lg shadow-md">
      {/* Controles de Búsqueda y Filtros */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-4">
          {/* Info sobre doble click */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-600">
              💡 <strong>Tip:</strong> Haz doble clic en un usuario para ver su
              evaluación completa
            </p>
          </div>

          {/* Barra de Búsqueda */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por DNI, nombre o email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtro por Estado */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos ({evaluationData.length})
            </button>
            {['assigned', 'in_progress', 'completed', 'overdue'].map(
              (status) => {
                const count = evaluationData.filter(
                  (a) => a.status === status
                ).length;
                if (count === 0) return null;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      statusFilter === status
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status === 'assigned' && 'Asignados'}
                    {status === 'in_progress' && 'En Progreso'}
                    {status === 'completed' && 'Completados'}
                    {status === 'overdue' && 'Vencidos'} ({count})
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div className="max-h-[600px] overflow-y-auto">
        {filteredData.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredData.map((assignment, index) => (
              <div
                key={assignment.assignment_id || index}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedUser?.assignment_id === assignment.assignment_id
                    ? 'bg-blue-50 border-r-4 border-blue-500'
                    : ''
                }`}
                onClick={() => setSelectedUser(assignment)}
                onDoubleClick={() => handleUserDoubleClick(assignment)}
                title="Doble clic para ver evaluación completa"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {getUserDisplayName(assignment.student)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      DNI: {assignment.student?.dni || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {assignment.student?.userProfile?.email || 'Sin email'}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      {assignment.status && (
                        <StatusBadge status={assignment.status} />
                      )}
                      {getLatestScore(assignment) && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Puntuación: {getLatestScore(assignment)}
                        </span>
                      )}
                    </div>
                    {/* IDs en pequeño para debug */}
                    <p className="text-xs text-gray-400 mt-1">
                      User: {assignment.student?.user_id} | Eval:{' '}
                      {assignment.evaluation_sche_id}
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>ID: {assignment.assignment_id}</p>
                    <p className="mt-1">
                      {assignment.evaluation?.attempts?.length || 0}/
                      {assignment.evaluation?.max_attempts || 0} intentos
                    </p>
                    {/* Barra de progreso */}
                    <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${getProgressPercentage(assignment)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.501-.881-6.119-2.333l-.135-.135A7.962 7.962 0 0112 5a7.958 7.958 0 0114 7.083"
              />
            </svg>
            <p>No se encontraron usuarios que coincidan con la búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};
