import React, { useState } from "react";
import { useRouter } from "next/router";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import FormField from "@/components/FormField";
import MultipleImageUpload from "@/components/MultipleImageUpload";
import { useCreateFlashcardMutation } from "@/features/flashcards/flashcards.mutations";
import { getUserFacingMessage } from "@/lib/http/error";
import { toast } from "sonner";

const AddFlashcard: NextPageWithLayout = () => {
  const router = useRouter();
  const moduleId = router.isReady ? Number(router.query.moduleId) : undefined;

  const [question, setQuestion] = useState("");
  const [correctImages, setCorrectImages] = useState<File[]>([]);
  const [incorrectImages, setIncorrectImages] = useState<File[]>([]);
  const [touched, setTouched] = useState(false);

  const createFlashcardMutation = useCreateFlashcardMutation();
  const isSubmitting = createFlashcardMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!question.trim()) {
      toast.error("La pregunta es obligatoria");
      return;
    }
    if (correctImages.length !== 3) {
      toast.error("Debes subir exactamente 3 imágenes correctas");
      return;
    }
    if (incorrectImages.length !== 3) {
      toast.error("Debes subir exactamente 3 imágenes incorrectas");
      return;
    }

    try {
      await createFlashcardMutation.mutateAsync({
        question: question.trim(),
        moduleId: moduleId!,
        correctImages,
        incorrectImages,
      });
      toast.success("Flashcard agregada exitosamente");
      router.back();
    } catch (err: unknown) {
      toast.error(getUserFacingMessage(err) ?? "Error al crear la flashcard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Volver
        </button>
        <span className="text-gray-300">/</span>
        <h2 className="text-2xl font-bold text-gray-800">Nueva Flashcard</h2>
      </div>

      <FormField
        id="question"
        label="Pregunta"
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onBlur={() => setTouched(true)}
        error={!question.trim() && touched}
        touched={touched}
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

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting && (
            <svg
              className="w-4 h-4 animate-spin"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          )}
          {isSubmitting ? "Guardando..." : "Guardar Flashcard"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="text-sm font-medium text-gray-500 hover:text-gray-800 disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

AddFlashcard.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default AddFlashcard;
