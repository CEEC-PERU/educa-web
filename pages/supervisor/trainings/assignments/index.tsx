import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/supervisor/SibebarSupervisor';
import '@/app/globals.css';
import Modal from '@/components/Admin/Modal';
import { useTrainingAssignment } from '@/hooks/resultado/useTrainingAssingment';
import { useAuth } from '@/context/AuthContext';
import { UserInfo } from '@/interfaces/Training/Training';
import TrainingAssignmentCard from '@/components/Training/TrainingAssignmentCard';
import TrainingAssignmentForm from '@/components/Training/TrainingAssignmentForm';

const AssignmentsPage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const { user } = useAuth();
  const userInfo = user as UserInfo;

  const { assignments, loading, error, refetch } = useTrainingAssignment(
    userInfo?.id,
  );
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
                      key={assignment.assignment_id}
                      assignment={assignment}
                      onClick={() => {}}
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
          <TrainingAssignmentForm onSuccess={() => {}} onCancel={() => {}} />
        </Modal>
      )}
    </div>
  );
};

export default AssignmentsPage;
