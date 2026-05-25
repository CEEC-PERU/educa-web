import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import AlertComponent from "@/components/AlertComponent";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Module } from "@/interfaces/Module";
import { Flashcard } from "@/interfaces/Flashcard";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useCourseModulesQuery } from "@/features/courses/courses.queries";
import {
  useDeleteFlashcardMutation,
  useUpdateFlashcardMutation,
} from "@/features/flashcards/flashcards.mutations";
import { getUserFacingMessage } from "@/lib/http/error";
import ButtonComponent from "@/components/ButtonComponent";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import useModal from "@/hooks/ui/useModal";
import ModalConfirmation from "@/components/ModalConfirmation";
import { XMarkIcon } from "@heroicons/react/24/outline";

const FlashcardsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(
    null,
  );
  const [flashcardToDelete, setFlashcardToDelete] = useState<number | null>(
    null,
  );

  // Estado de edición
  const [isEditing, setIsEditing] = useState(false);
  const [editQuestion, setEditQuestion] = useState("");

  const {
    isVisible: isFlashcardModalVisible,
    showModal: showFlashcardModal,
    hideModal: hideFlashcardModal,
  } = useModal();

  const courseId = router.isReady && id !== undefined ? Number(id) : undefined;
  const modulesQuery = useCourseModulesQuery(courseId);
  const modules: Module[] = modulesQuery.data ?? [];
  const deleteFlashcardMutation = useDeleteFlashcardMutation();
  const updateFlashcardMutation = useUpdateFlashcardMutation();
  const editLoading = updateFlashcardMutation.isPending;

  useEffect(() => {
    if (modulesQuery.isError) {
      setError(
        getUserFacingMessage(modulesQuery.error) ??
          "Hubo un error al cargar los módulos",
      );
    }
  }, [modulesQuery.isError, modulesQuery.error]);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.success) {
      setSuccessMessage(router.query.success as string);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [router.isReady, router.query.success]);

  const handleDeleteFlashcard = async () => {
    if (flashcardToDelete !== null) {
      try {
        await deleteFlashcardMutation.mutateAsync(flashcardToDelete);
        if (selectedFlashcard?.flashcard_id === flashcardToDelete) {
          setSelectedFlashcard(null);
          setIsEditing(false);
        }
        setSuccessMessage("Flashcard eliminada exitosamente");
        setTimeout(() => setSuccessMessage(null), 5000);
        setFlashcardToDelete(null);
        hideFlashcardModal();
      } catch (err) {
        console.error("Error al eliminar la flashcard:", err);
        setError(getUserFacingMessage(err));
      }
    }
  };

  const handleSelectFlashcard = (flashcard: Flashcard) => {
    setSelectedFlashcard(flashcard);
    setIsEditing(false);
    setEditQuestion(flashcard.question);
  };

  const handleCloseFlashcard = () => {
    setSelectedFlashcard(null);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (selectedFlashcard) {
      setEditQuestion(selectedFlashcard.question);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedFlashcard) {
      setEditQuestion(selectedFlashcard.question);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedFlashcard) return;

    try {
      await updateFlashcardMutation.mutateAsync({
        flashcardId: selectedFlashcard.flashcard_id,
        data: {
          question: editQuestion.trim(),
          correct_answer: selectedFlashcard.correct_answer,
          incorrect_answer: selectedFlashcard.incorrect_answer,
        },
      });

      const updated: Flashcard = {
        ...selectedFlashcard,
        question: editQuestion.trim(),
      };
      setSelectedFlashcard(updated);
      setIsEditing(false);
      setSuccessMessage("Flashcard actualizada exitosamente");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error("Error al actualizar la flashcard:", err);
      setError(getUserFacingMessage(err));
    }
  };

  return (
    <>
      {successMessage && (
        <AlertComponent
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      {statusMessage && (
        <AlertComponent
          type="info"
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
            selectedFlashcard ? "w-2/5" : "w-full"
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
                                  ? "bg-purple-200"
                                  : ""
                              }`}
                              onClick={() => handleSelectFlashcard(flashcard)}
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
          <aside className="w-3/5 bg-white p-6 border-l border-gray-300 shadow-lg ml-4 rounded-lg overflow-y-auto max-h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 mr-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={editQuestion}
                    onChange={(e) => setEditQuestion(e.target.value)}
                    className="w-full text-xl font-bold border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Escribe la pregunta..."
                  />
                ) : (
                  <h2 className="text-xl font-bold">
                    {selectedFlashcard.question}
                  </h2>
                )}
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      disabled={editLoading || !editQuestion.trim()}
                      className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {editLoading ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={editLoading}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button onClick={handleStartEdit}>
                    <PencilSquareIcon className="w-5 h-5 text-blue-500 hover:text-blue-700 transition-colors" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setFlashcardToDelete(selectedFlashcard.flashcard_id);
                    showFlashcardModal();
                  }}
                >
                  <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700 transition-colors" />
                </button>
                <button onClick={handleCloseFlashcard}>
                  <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors" />
                </button>
              </div>
            </div>

            {/* Respuestas Correctas */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-3 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Respuestas Correctas
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {selectedFlashcard.correct_answer?.length > 0 ? (
                  selectedFlashcard.correct_answer.map((url, index) => (
                    <div
                      key={`correct-${index}`}
                      className="relative group rounded-lg overflow-hidden border-2 border-green-200 hover:border-green-400 transition-colors"
                    >
                      <img
                        src={url}
                        alt={`Respuesta correcta ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm col-span-3">
                    No hay imágenes de respuestas correctas
                  </p>
                )}
              </div>
            </div>

            {/* Respuestas Incorrectas */}
            <div>
              <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wider mb-3 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Respuestas Incorrectas
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {selectedFlashcard.incorrect_answer?.length > 0 ? (
                  selectedFlashcard.incorrect_answer.map((url, index) => (
                    <div
                      key={`incorrect-${index}`}
                      className="relative group rounded-lg overflow-hidden border-2 border-red-200 hover:border-red-400 transition-colors"
                    >
                      <img
                        src={url}
                        alt={`Respuesta incorrecta ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm col-span-3">
                    No hay imágenes de respuestas incorrectas
                  </p>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>
      <ModalConfirmation
        show={isFlashcardModalVisible}
        onClose={hideFlashcardModal}
        onConfirm={handleDeleteFlashcard}
      />
    </>
  );
};

FlashcardsPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default FlashcardsPage;
