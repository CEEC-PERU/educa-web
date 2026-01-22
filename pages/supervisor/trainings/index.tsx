import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/supervisor/SibebarSupervisor';
import './../../../app/globals.css';
import Modal from '../../../components/Admin/Modal';
import { useAuth } from '@/context/AuthContext';
import { UserInfo } from '@/interfaces/Training/Training';
import { useTrainings } from '@/hooks/useTraining';
import { TrainingProgram } from '@/interfaces/Training/Training';
import TrainingCard from '@/components/Training/TrainingCard';
import EmptyState from '@/components/Training/EmptyState';
import { useRouter } from 'next/router';
import TrainingForm from '@/components/Training/TrainingForm';
import { deleteProgram } from '@/services/training/trainingService';

const TrainingsPage: React.FC = () => {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  //const [showAssignModal, setShowAssignModal] = useState(false);
  //revisar el estado con el que inicia ya que tiene que un objeto definido
  const [editingTraining, setEditingTraining] =
    useState<TrainingProgram | null>(null);

  const { user } = useAuth();
  //obtenemos el enterprise_id y id del usuario logueado, pero carga después de renderizar
  const userInfo = user as UserInfo;

  const { trainings, loading, error, refetch } = useTrainings(userInfo?.id);

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setEditingTraining(null);
  };

  const handleFormSuccess = async () => {
    await refetch();
    handleCloseCreateModal();
  };

  const handleViewTrainingDays = (programId: number) => {
    router.push(`/supervisor/trainings/${programId}/days`);
  };

  const handleTrainingClick = (
    training: TrainingProgram,
    e: React.MouseEvent,
  ) => {
    const target = e.target as HTMLElement;
    const isActiveButton = target.closest('button');

    if (!isActiveButton && training.program_id) {
      handleViewTrainingDays(training.program_id);
    }
  };

  const handleEditTraining = (training: TrainingProgram) => {
    setEditingTraining(training);
    setShowCreateModal(true);
  };

  const handleDeleteTraining = (training: TrainingProgram) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar el programa')) {
      deleteProgram(
        training.program_id,
        localStorage.getItem('userToken') || '',
      )
        .then(async () => {
          await refetch();
        })
        .catch((error) => {
          console.error('Error al eliminar el programa:', error);
          alert('Ocurrió un error al eliminar el programa.');
        });
    }
  };
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main
          className={`flex-grow p-4 md:p-6 transition-all duration-300 ease-in-out`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Programas de Formación
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Administra las capacitaciones para tus estudiantes desde esta
                  sección.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                {/* contenido y eventos para creación de capacitaciones */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Crear Nuevo Programa
                </button>
                {/* POR IMPLEMENTAR, YA QUE FALTA MIGRAR LOS COURSESTUDENTS A CLASSROOMSTUDENTS
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Asignar Programa
                </button> */}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : trainings.length === 0 ? (
                <EmptyState onAction={() => setShowCreateModal(true)} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trainings.map((training) => (
                    <TrainingCard
                      key={training.program_id}
                      training={training}
                      onClick={handleTrainingClick}
                      onEdit={handleEditTraining}
                      onDelete={handleDeleteTraining}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={handleCloseCreateModal}
          title={
            editingTraining
              ? 'Editar programa de formación'
              : 'Crear nuevo programa de formación'
          }
          size="xl"
          closeOnBackdropClick={false}
        >
          <TrainingForm
            training={editingTraining || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseCreateModal}
          />
        </Modal>
      )}

      {/*
      {showAssignModal && (
        <Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title="Asignar programa de formación"
          size="lg"
          closeOnBackdropClick={false}
        >
          Dato
        </Modal>
      )}*/}
    </div>
  );
};

export default TrainingsPage;
