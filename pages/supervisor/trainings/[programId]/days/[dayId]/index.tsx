'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/supervisor/SibebarSupervisor';
import { useRouter } from 'next/router';
import { useTrainingContent } from '@/hooks/resultado/useTrainingContent';
import { TrainingContent } from '@/interfaces/Training/Training';
import TrainingContentCard from '@/components/Training/TrainingContentCard';
import { FaCirclePlus } from 'react-icons/fa6';
import {
  uploadTrainingContent,
  deleteTrainingContentsById,
} from '@/services/training/trainingService';
import { useAuth } from '@/context/AuthContext';
import Modal from '@/components/Admin/Modal';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import ContentForm from '@/components/Training/ContentForm';

export default function DayDetailPage() {
  const router = useRouter();
  const { programId, dayId } = router.query;
  const { token } = useAuth();
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedContent, setSelectedContent] =
    useState<TrainingContent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalFormOpen, setIsModalFormOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const { trainingContents, loading, error, refetch } = useTrainingContent(
    dayId ? Number(dayId) : undefined,
  );

  const openCreateModal = () => {
    setSelectedContent(null);
    setFormMode('create');
    setIsModalFormOpen(true);
  };

  const closeFormModal = () => {
    setIsModalFormOpen(false);
    setSelectedContent(null);
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (!token || !dayId) return;

    try {
      if (formMode === 'create') {
        await uploadTrainingContent(Number(dayId), formData, token);
        //console.log('Crear contenido con datos:', formData);
      } else if (selectedContent) {
        //actualizar contenido en caso sea necesario
      }
      await refetch();
      closeFormModal();
    } catch (error) {
      console.error('Error al guardar el contenido de formación:', error);
      alert(
        'Error al guardar el contenido de formación. Por favor, inténtalo de nuevo.',
      );
      throw error;
    }
  };

  const openDeleteModal = (content: TrainingContent) => {
    setSelectedContent(content);
    setIsModalDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalDeleteOpen(false);
    setSelectedContent(null);
  };

  const confirmDeleteContent = async () => {
    if (!selectedContent || !token) return;

    try {
      setIsDeleting(true);
      await deleteTrainingContentsById(
        selectedContent.day_id,
        selectedContent.content_id,
        token,
      );
      setIsDeleting(false);
      closeDeleteModal();
      await refetch();
    } catch (error) {
      console.error('Error al eliminar el contenido de formación:', error);
      alert(
        'Error al eliminar el contenido de formación. Por favor, inténtalo de nuevo.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          <main
            className={`p-6 flex-grow transition-all duration-300 ease-in-out ${showSidebar ? 'ml-20' : 'ml-0'}`}
          >
            <div className="mb-6">
              <button
                onClick={() => router.back()}
                className="mb-4 text-gray-600 hover:text-gray-800"
              >
                ← Volver a Días
              </button>
            </div>

            <div className="mx-auto">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Contenidos del Día de Formación
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Gestiona los contenidos de formación para el día
                    seleccionado.
                  </p>
                </div>

                <div className="mt-4 sm:mt-0">
                  <button
                    onClick={openCreateModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaCirclePlus />
                    <span className="ml-2">Añadir contenido</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12"></div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : trainingContents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No hay contenidos de formación para este día.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trainingContents.map((content: TrainingContent) => (
                    <TrainingContentCard
                      key={content.content_id}
                      content={content}
                      onDelete={openDeleteModal}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {isModalFormOpen && (
        <Modal
          isOpen={isModalFormOpen}
          onClose={closeFormModal}
          title={
            formMode === 'create'
              ? 'Añadir Contenido de Formación'
              : 'Editar Contenido de Formación'
          }
          size="md"
        >
          <ContentForm
            content={selectedContent}
            mode={formMode}
            onSubmit={handleFormSubmit}
            onCancel={closeFormModal}
          />
        </Modal>
      )}

      {isModalDeleteOpen && (
        <Modal
          isOpen={isModalDeleteOpen}
          onClose={closeDeleteModal}
          title="Confirmar eliminación"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              ¿Estás seguro de que deseas eliminar este contenido de formación?
              Esta acción no se puede deshacer.
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
                onClick={confirmDeleteContent}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
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
}
