import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/supervisor/SibebarSupervisor';
import '@/app/globals.css';
import Modal from '@/components/Admin/Modal';
import { useTrainingAssignment } from '@/hooks/resultado/useTrainingAssingment';
import { useAuth } from '@/context/AuthContext';
import { TrainingAssignment, UserInfo } from '@/interfaces/Training/Training';
import TrainingAssignmentCard from '@/components/Training/TrainingAssignmentCard';
import TrainingAssignmentForm from '@/components/Training/TrainingAssignmentForm';
import { deleteTrainingAssignment } from '@/services/training/trainingService';

const AssignmentsPage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const { token } = useAuth();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<TrainingAssignment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const { user } = useAuth();
  const userInfo = user as UserInfo;

  const { assignments, loading, error, refetch } = useTrainingAssignment(
    userInfo?.id,
  );

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
  };

  const handleFormSuccess = async () => {
    await refetch();
    handleCloseAssignModal();
  };

  const openDeleteModal = (assignment: TrainingAssignment) => {
    setSelectedAssignment(assignment);
    setIsModalDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalDeleteOpen(false);
    setSelectedAssignment(null);
  };

  const confirmDelete = async () => {
    if (!selectedAssignment || !token) return;

    try {
      setIsDeleting(true);
      await deleteTrainingAssignment(
        selectedAssignment.programId,
        selectedAssignment.classroomId,
        token,
      );
      setIsDeleting(false);
      closeDeleteModal();
      await refetch();
    } catch (error) {
      console.error('Error al intentar eliminar la asignación:', error);
      alert(
        'Hubo un error al eliminar la asignación. Por favor, inténtalo de nuevo.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-1 p-6 transition-all duration-300 ease-in-out`}>
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Asignaciones
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Gestiona las asignaciones de los programas de formación aquí.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Asignar Programa
                </button>
              </div>
            </div>
            {/* lista de asignaciones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    No hay asignaciones disponibles.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assignments.map((assignment) => (
                    <TrainingAssignmentCard
                      key={assignment.assignmentId}
                      assignment={assignment}
                      onClick={() => {}}
                      onDelete={openDeleteModal}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      {showAssignModal && (
        <Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title="Asignar programa de formación"
          size="lg"
          closeOnBackdropClick={false}
        >
          <TrainingAssignmentForm
            onSuccess={handleFormSuccess}
            onCancel={handleCloseAssignModal}
          />
        </Modal>
      )}

      {isModalDeleteOpen && (
        <Modal
          isOpen={isModalDeleteOpen}
          onClose={closeDeleteModal}
          title="Confirmar Eliminación"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              ¿Estás seguro de que deseas eliminar esta asignación?
            </p>

            <p className="text-sm text-gray-500">
              Esta acción no se puede deshacer. Una vez eliminada, la asignación
              será removida del sistema.
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center"
              >
                {isDeleting && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AssignmentsPage;
