import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from './../../components/Content/SideBar';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import AlertComponent from '@/components/AlertComponent';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import './../../app/globals.css';
import { Module } from '@/interfaces/Module';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { getModulesByCourseId } from '@/services/courses/courseService';
import ButtonComponent from '@/components/ButtonComponent';
import { deleteFlashcard } from '@/services/flashcards/flashcardService';
import { TrashIcon } from '@heroicons/react/24/solid';
import useModal from '@/hooks/ui/useModal';
import ModalConfirmation from '@/components/ModalConfirmation';
import { XMarkIcon } from '@heroicons/react/24/outline';

const FlashcardsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [showSidebar, setShowSidebar] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedFlashcard, setSelectedFlashcard] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [flashcardToDelete, setFlashcardToDelete] = useState<number | null>(
    null,
  );
  const {
    isVisible: isFlashcardModalVisible,
    showModal: showFlashcardModal,
    hideModal: hideFlashcardModal,
  } = useModal();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const [modulesData] = await Promise.all([
          getModulesByCourseId(Number(id)),
        ]);
        setModules(modulesData);
      } catch (error) {
        setError('Hubo un error al cargar los módulos');
        console.error('Hubo un error al cargar los módulos:', error);
      }
    };

    fetchModules();
    if (router.query.success) {
      setSuccessMessage(router.query.success as string);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [id, router.query.success]);

  const handleDeleteFlashcard = async () => {
    if (flashcardToDelete !== null) {
      try {
        await deleteFlashcard(flashcardToDelete);
        setModules(
          modules.map((module) => ({
            ...module,
            moduleFlashcards:
              module.moduleFlashcards?.filter(
                (flashcard) => flashcard.flashcard_id !== flashcardToDelete,
              ) || [],
          })),
        );
        setSuccessMessage('Flashcard eliminada exitosamente');
        setTimeout(() => setSuccessMessage(null), 5000);
        setFlashcardToDelete(null);
        hideFlashcardModal();
      } catch (error) {
        console.error('Error al eliminar la flashcard:', error);
        setError('Hubo un error al eliminar la flashcard');
      }
    }
  };

  const handleCloseFlashcard = () => {
    setSelectedFlashcard(null);
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          <main
            className={`p-6 flex-grow ${showSidebar ? 'ml-20' : ''} transition-all duration-300 ease-in-out`}
          >
            {successMessage && (
              <AlertComponent
                type="success"
                message={successMessage}
                onClose={() => setSuccessMessage(null)}
              />
            )}
            {statusMessage && (
              <AlertComponent
                type="info" // Azul para información
                message={statusMessage}
                onClose={() => setStatusMessage(null)}
              />
            )}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Flashcards</h2>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex">
              <div
                className={`space-y-4 mb-10 transition-all duration-300 ease-in-out ${
                  selectedFlashcard ? 'w-2/5' : 'w-full'
                }`}
              >
                {modules.map((module) => (
                  <div
                    key={module.module_id}
                    className="border border-gray-300 rounded-lg"
                  >
                    <Disclosure defaultOpen={true}>
                      {({ open }) => (
                        <>
                          <DisclosureButton className="flex justify-between items-center w-full px-6 py-4 text-sm font-medium text-left text-purple-1000 bg-gradient-purple focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 rounded-t-lg">
                            <div className="flex items-center">
                              {open ? (
                                <ChevronUpIcon className="w-5 h-5 text-purple-500 mr-2" />
                              ) : (
                                <ChevronDownIcon className="w-5 h-5 text-purple-500 mr-2" />
                              )}
                              <span className="flex-grow">{module.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex justify-between items-center mr-2">
                                <ButtonComponent
                                  buttonLabel="Añadir Flashcard"
                                  buttonroute={`/content/addFlashcard?moduleId=${module.module_id}`}
                                  backgroundColor="bg-gradient-blue"
                                  textColor="text-white"
                                  fontSize="text-xs"
                                  buttonSize="py-2 px-4"
                                />
                              </div>
                            </div>
                          </DisclosureButton>
                          <DisclosurePanel className="text-m text-gray-700 px-6 py-4 rounded-b-lg">
                            <div className="flex flex-col space-y-2">
                              {module.moduleFlashcards?.length ? (
                                module.moduleFlashcards.map((flashcard) => (
                                  <div
                                    key={flashcard.flashcard_id}
                                    className={`flex items-center cursor-pointer hover:bg-purple-100 p-2 rounded ${
                                      selectedFlashcard?.flashcard_id ===
                                      flashcard.flashcard_id
                                        ? 'bg-purple-200'
                                        : ''
                                    }`}
                                    onClick={() =>
                                      setSelectedFlashcard(flashcard)
                                    }
                                  >
                                    <div className="flex flex-col">
                                      <p className="font-medium">
                                        {flashcard.question}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p>No hay flashcards para este módulo</p>
                              )}
                            </div>
                          </DisclosurePanel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                ))}
              </div>
              {selectedFlashcard && (
                <aside className="w-3/5 bg-white p-4 border-l border-gray-300 shadow-lg ml-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                      {selectedFlashcard.question}
                    </h2>
                    <div className="flex items-center space-x-2">
                      {/* mostrar las respuestas correctas e incorrectas */}

                      <button
                        onClick={() => {
                          setFlashcardToDelete(selectedFlashcard.flashcard_id);
                          showFlashcardModal();
                        }}
                      >
                        <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700" />
                      </button>
                      <button onClick={handleCloseFlashcard}>
                        <XMarkIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
                      </button>
                    </div>
                  </div>
                </aside>
              )}
            </div>
          </main>
        </div>
        <ModalConfirmation
          show={isFlashcardModalVisible}
          onClose={hideFlashcardModal}
          onConfirm={handleDeleteFlashcard}
        />
      </div>
    </ProtectedRoute>
  );
};

export default FlashcardsPage;
