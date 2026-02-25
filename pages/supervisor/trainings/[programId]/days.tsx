import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/supervisor/SibebarSupervisor';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useTrainingDay } from '@/hooks/resultado/useTrainingDay';
import { useRouter } from 'next/router';
import { TrainingDay } from '@/interfaces/Training/Training';
import TrainingDayCard from '@/components/Training/TrainingDayCard';
import {
  deleteTrainingDay,
  updateTrainingDay,
  createTrainingDay,
} from '@/services/training/trainingService';
import Modal from '@/components/Admin/Modal';
import { useAuth } from '@/context/AuthContext';
import DayForm from '@/components/Training/DayForm';

const TrainingDaysPage: React.FC = () => {
  const router = useRouter();
  const { programId } = router.query;
  const { token } = useAuth();
  const [showSidebar, setShowSidebar] = useState(true);
  const [isModalFormOpen, setIsModalFormOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<TrainingDay | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const { trainingDays, loading, error, refetch } = useTrainingDay(
    programId ? Number(programId) : undefined,
  );

  const handleViewDaysDetails = (programId: number, dayId: number) => {
    router.push(`/supervisor/trainings/${programId}/days/${dayId}`);
  };

  const handleDayClick = (day: TrainingDay) => {
    if (day.day_id && day.program_id) {
      handleViewDaysDetails(day.program_id, day.day_id);
    }
  };

  const openCreateModal = () => {
    setSelectedDay(null);
    setFormMode('create');
    setIsModalFormOpen(true);
  };

  const openEditModal = (day: TrainingDay) => {
    setSelectedDay(day);
    setFormMode('edit');
    setIsModalFormOpen(true);
  };

  const closeFormModal = () => {
    setIsModalFormOpen(false);
    setSelectedDay(null);
  };

  const handleFormSubmit = async (title: string) => {
    if (!token || !programId) return;

    try {
      if (formMode === 'create') {
        await createTrainingDay(Number(programId), { title }, token);
      } else if (selectedDay) {
        await updateTrainingDay(
          selectedDay.program_id,
          selectedDay.day_id,
          { title },
          token,
        );
      }
      await refetch();
      closeFormModal();
    } catch (error) {
      console.error(
        `Error al ${formMode === 'create' ? 'crear' : 'actualizar'} el día:`,
        error,
      );
      throw error;
    }
  };

  const openDeleteModal = (day: TrainingDay) => {
    setSelectedDay(day);
    setIsModalDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalDeleteOpen(false);
    setSelectedDay(null);
  };

  const confirmDelete = async () => {
    if (!selectedDay || !token) return;

    try {
      setIsDeleting(true);
      await deleteTrainingDay(
        selectedDay.program_id,
        selectedDay.day_id,
        token,
      );
      await refetch();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar el día de formación:', error);
      alert('Error al eliminar el día de formación');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gray-50">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          <main className="p-6 flex-grow transition-all duration-300 ease-in-out ml-20">
            <div className="mb-6">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
              >
                ← Volver a Programas de Formación
              </button>
            </div>

            <div className="mx-auto">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Días de Formación
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Gestiona los días de formación para el programa
                    seleccionado.
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button
                    onClick={openCreateModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Añadir Nuevo Día
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : trainingDays.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No hay días de formación disponibles.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trainingDays.map((day) => (
                    <TrainingDayCard
                      key={day.day_id}
                      day={day}
                      onClick={handleDayClick}
                      onEdit={openEditModal}
                      onDelete={openDeleteModal}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal Unificado de Crear/Editar */}
      {isModalFormOpen && (
        <Modal
          isOpen={isModalFormOpen}
          onClose={closeFormModal}
          title={formMode === 'create' ? 'Crear Nuevo Día' : 'Editar Día'}
          size="md"
        >
          <DayForm
            day={selectedDay}
            mode={formMode}
            onSubmit={handleFormSubmit}
            onCancel={closeFormModal}
          />
        </Modal>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {isModalDeleteOpen && (
        <Modal
          isOpen={isModalDeleteOpen}
          onClose={closeDeleteModal}
          title="Confirmar Eliminación"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              ¿Estás seguro de que deseas eliminar el día{' '}
              <span className="font-semibold">"{selectedDay?.title}"</span>?
            </p>
            <p className="text-sm text-gray-500">
              Esta acción no se puede deshacer y se eliminarán todos los
              contenidos asociados.
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
    </ProtectedRoute>
  );
};

export default TrainingDaysPage;
