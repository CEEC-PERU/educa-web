import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Module } from "@/interfaces/Module";
import { Flashcard } from "@/interfaces/Flashcard";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import {
  useCourseModulesQuery,
  useCourseQuery,
} from "@/features/courses/courses.queries";
import {
  useDeleteFlashcardMutation,
  useUpdateFlashcardMutation,
} from "@/features/flashcards/flashcards.mutations";
import { getUserFacingMessage } from "@/lib/http/error";
import useModal from "@/hooks/ui/useModal";
import ModalConfirmation from "@/components/ModalConfirmation";
import { toast } from "sonner";

const FlashcardsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(
    null,
  );
  const [flashcardToDelete, setFlashcardToDelete] = useState<number | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editQuestion, setEditQuestion] = useState("");

  const {
    isVisible: isDeleteModalVisible,
    showModal: showDeleteModal,
    hideModal: hideDeleteModal,
  } = useModal();

  const courseId = router.isReady && id !== undefined ? Number(id) : undefined;
  const courseQuery = useCourseQuery(courseId);
  const modulesQuery = useCourseModulesQuery(courseId);
  const modules: Module[] = modulesQuery.data ?? [];
  const deleteFlashcardMutation = useDeleteFlashcardMutation();
  const updateFlashcardMutation = useUpdateFlashcardMutation();
  const editLoading = updateFlashcardMutation.isPending;

  const handleDeleteFlashcard = async () => {
    if (flashcardToDelete === null) return;
    try {
      await deleteFlashcardMutation.mutateAsync(flashcardToDelete);
      if (selectedFlashcard?.flashcard_id === flashcardToDelete) {
        setSelectedFlashcard(null);
        setIsEditing(false);
      }
      toast.success("Flashcard eliminada exitosamente");
      setFlashcardToDelete(null);
      hideDeleteModal();
    } catch (err) {
      toast.error(
        getUserFacingMessage(err) ?? "Error al eliminar la flashcard",
      );
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
    if (selectedFlashcard) setEditQuestion(selectedFlashcard.question);
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
      setSelectedFlashcard({
        ...selectedFlashcard,
        question: editQuestion.trim(),
      });
      setIsEditing(false);
      toast.success("Flashcard actualizada exitosamente");
    } catch (err) {
      toast.error(
        getUserFacingMessage(err) ?? "Error al actualizar la flashcard",
      );
    }
  };

  if (modulesQuery.isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (modulesQuery.isError) {
    return (
      <p className="text-gray-500 text-center mt-20">
        {getUserFacingMessage(modulesQuery.error) ??
          "Error al cargar los módulos"}
      </p>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/content/flashcards"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Volver
        </Link>
        <span className="text-gray-300">/</span>
        <h2 className="text-2xl font-bold text-gray-800">
          {courseQuery.data?.name ?? "Flashcards"}
        </h2>
      </div>

      {modules.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">
          No hay módulos para este curso.
        </p>
      ) : (
        <div className="flex gap-4">
          <div
            className={`space-y-4 mb-10 transition-all duration-300 ease-in-out ${
              selectedFlashcard ? "w-2/5" : "w-full"
            }`}
          >
            {modules.map((module) => (
              <div
                key={module.module_id}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <Disclosure defaultOpen={true}>
                  {({ open }) => (
                    <>
                      <DisclosureButton className="flex justify-between items-center w-full px-6 py-4 text-sm font-medium text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-colors">
                        <div className="flex items-center gap-2">
                          {open ? (
                            <ChevronUpIcon className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="font-semibold text-gray-700">
                            {module.name}
                          </span>
                        </div>
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex-shrink-0"
                        >
                          <Link
                            href={`/content/addFlashcard?moduleId=${module.module_id}`}
                            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Añadir Flashcard
                          </Link>
                        </div>
                      </DisclosureButton>
                      <DisclosurePanel className="px-6 py-4 bg-white">
                        <div className="flex flex-col space-y-1">
                          {module.moduleFlashcards?.length ? (
                            module.moduleFlashcards.map((flashcard) => (
                              <div
                                key={flashcard.flashcard_id}
                                className={`cursor-pointer px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                                  selectedFlashcard?.flashcard_id ===
                                  flashcard.flashcard_id
                                    ? "bg-purple-100 text-purple-800"
                                    : "hover:bg-gray-50 text-gray-700"
                                }`}
                                onClick={() => handleSelectFlashcard(flashcard)}
                              >
                                {flashcard.question}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-400">
                              No hay flashcards para este módulo
                            </p>
                          )}
                        </div>
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              </div>
            ))}
          </div>

          <aside
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              selectedFlashcard
                ? "w-3/5 opacity-100"
                : "w-0 opacity-0 pointer-events-none"
            }`}
          >
            {selectedFlashcard && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 mr-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.target.value)}
                        className="w-full text-xl font-bold border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Escribe la pregunta..."
                      />
                    ) : (
                      <h2 className="text-xl font-bold text-gray-800">
                        {selectedFlashcard.question}
                      </h2>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
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
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        aria-label="Editar flashcard"
                        onClick={handleStartEdit}
                      >
                        <PencilSquareIcon className="w-5 h-5 text-blue-500 hover:text-blue-700 transition-colors" />
                      </button>
                    )}
                    <button
                      aria-label="Eliminar flashcard"
                      onClick={() => {
                        setFlashcardToDelete(selectedFlashcard.flashcard_id);
                        showDeleteModal();
                      }}
                    >
                      <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700 transition-colors" />
                    </button>
                    <button
                      aria-label="Cerrar panel"
                      onClick={handleCloseFlashcard}
                    >
                      <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-700 transition-colors" />
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Respuestas Correctas
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedFlashcard.correct_answer?.length > 0 ? (
                      selectedFlashcard.correct_answer.map((url, index) => (
                        <div
                          key={`correct-${index}`}
                          className="rounded-lg overflow-hidden border-2 border-green-200 hover:border-green-400 transition-colors"
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

                <div>
                  <h3 className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    Respuestas Incorrectas
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedFlashcard.incorrect_answer?.length > 0 ? (
                      selectedFlashcard.incorrect_answer.map((url, index) => (
                        <div
                          key={`incorrect-${index}`}
                          className="rounded-lg overflow-hidden border-2 border-red-200 hover:border-red-400 transition-colors"
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
              </div>
            )}
          </aside>
        </div>
      )}

      <ModalConfirmation
        show={isDeleteModalVisible}
        onClose={hideDeleteModal}
        onConfirm={handleDeleteFlashcard}
      />
    </>
  );
};

FlashcardsPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default FlashcardsPage;
