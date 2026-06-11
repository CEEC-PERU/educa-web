import React from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useEvaluationUsers } from '../../../../hooks/resultado/useEvaluationUser';
import { UsersList } from '../../../../components/Evaluation/UserList';
import { UserDetails } from '../../../../components/Evaluation/UserDetail';
import AppLayout from '../../../../components/layouts/AppLayout';
import type { NextPageWithLayout } from '../../../../types/next';

const CorporateUsers: NextPageWithLayout = () => {
  const { logout, user, profileInfo } = useAuth();
  const {
    evaluationId,
    evaluationData,
    filteredData,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedUser,
    setSelectedUser,
    statusFilter,
    setStatusFilter,
    getUserDisplayName,
    getProgressPercentage,
    getLatestScore,
    navigateToUserDetail,
  } = useEvaluationUsers();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <>
      {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black mb-2">
                Usuarios Asignados a la Evaluación
              </h2>
              <p className="text-gray-600">
                Evaluación ID: {evaluationId} | Total: {evaluationData.length}{' '}
                usuarios | Mostrando: {filteredData.length}
              </p>
            </div>

            {evaluationData.length > 0 ? (
              <div className="flex gap-6">
                <UsersList
                  evaluationData={evaluationData}
                  filteredData={filteredData}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  getUserDisplayName={getUserDisplayName}
                  getProgressPercentage={getProgressPercentage}
                  getLatestScore={getLatestScore}
                  onUserDoubleClick={navigateToUserDetail}
                />
                <UserDetails
                  selectedUser={selectedUser}
                  getUserDisplayName={getUserDisplayName}
                  getLatestScore={getLatestScore}
                  onViewDetails={navigateToUserDetail}
                />
              </div>
            ) : (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                No se encontraron asignaciones para esta evaluación.
              </div>
            )}
    </>
  );
};

CorporateUsers.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default CorporateUsers;
