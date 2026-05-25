import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import AlertComponent from "@/components/AlertComponent";
import Loader from "@/components/Loader";
import { Flashcard } from "@/interfaces/Flashcard";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import FormField from "@/components/FormField";
import MultipleImageUpload from "@/components/MultipleImageUpload";
import ActionButtons from "@/components/Content/ActionButtons";
import { useCreateFlashcardMutation } from "@/features/flashcards/flashcards.mutations";
import { getUserFacingMessage } from "@/lib/http/error";

const AddFlashcard: NextPageWithLayout = () => {
  const [flashcard, setFlashcard] = useState<Omit<Flashcard, "flashcard_id">>({
    question: "",
    correct_answer: [],
    incorrect_answer: [],
    module_id: 0,
  });
  const [correctImages, setCorrectImages] = useState<File[]>([]);
  const [incorrectImages, setIncorrectImages] = useState<File[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { moduleId } = router.query;

  const createFlashcardMutation = useCreateFlashcardMutation();
  const formLoading = createFlashcardMutation.isPending;

  useEffect(() => {
    if (moduleId) {
      setFlashcard((prevFlashcard) => ({
        ...prevFlashcard,
        module_id: Number(moduleId),
      }));
      setLoading(false);
    }
  }, [moduleId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value } = e.target;
    setFlashcard((prevFlashcard) => ({
      ...prevFlashcard,
      [id]: value,
    }));
    setTouchedFields((prev) => ({ ...prev, [id]: true }));
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id } = e.target;
    setTouchedFields((prev) => ({ ...prev, [id]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!flashcard.question.trim()) {
        throw new Error("La pregunta es obligatoria");
      }
      if (correctImages.length !== 3) {
        throw new Error("Debes subir exactamente 3 imágenes correctas");
      }
      if (incorrectImages.length !== 3) {
        throw new Error("Debes subir exactamente 3 imágenes incorrectas");
      }

      await createFlashcardMutation.mutateAsync({
        question: flashcard.question,
        moduleId: flashcard.module_id,
        correctImages,
        incorrectImages,
      });

      setError(null);
      setShowAlert(true);

      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err: any) {
      setError(
        err?.message
          ? err.message
          : (getUserFacingMessage(err) ?? "Error al crear la flashcard"),
      );
      setShowAlert(true);
    }
  };

  const handleCancel = () => {
    setFlashcard({
      question: "",
      correct_answer: [],
      incorrect_answer: [],
      module_id: Number(moduleId),
    });
    setCorrectImages([]);
    setIncorrectImages([]);
    setTouchedFields({});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-2xl rounded-lg flex-grow mr-4"
      >
        {showAlert && (
          <AlertComponent
            type={error ? "danger" : "success"}
            message={error || "Flashcard agregada exitosamente."}
            onClose={() => setShowAlert(false)}
          />
        )}

        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center text-purple-600 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver
        </button>

        <FormField
          id="question"
          label="Pregunta"
          type="text"
          value={flashcard.question}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!flashcard.question && touchedFields["question"]}
          touched={touchedFields["question"]}
          required
        />

        <MultipleImageUpload
          label="Respuestas Correctas (3 imágenes)"
          onImagesUpload={setCorrectImages}
          maxImages={3}
          currentImages={correctImages}
        />

        <MultipleImageUpload
          label="Respuestas Incorrectas (3 imágenes)"
          onImagesUpload={setIncorrectImages}
          maxImages={3}
          currentImages={incorrectImages}
        />
      </form>

      <div className="ml-4 flex-shrink-0">
        <ActionButtons
          onSave={handleSubmit}
          onCancel={handleCancel}
          isEditing={true}
        />
      </div>
      {formLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </>
  );
};

AddFlashcard.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default AddFlashcard;
