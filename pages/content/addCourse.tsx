import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import MediaUploadPreview from "@components/MediaUploadPreview";
import FormField from "@components/FormField";
import SidebarSelect from "@components/ui/SidebarSelect";
import SectionCard from "@components/ui/SectionCard";
import { useCategoriesQuery } from "@/features/categories/categories.queries";
import { useProfessorsQuery } from "@/features/professors/professors.queries";
import { useAvailableEvaluationsQuery } from "@/features/evaluations/evaluations.queries";
import { useCreateCourseMutation } from "@/features/courses/courses.mutations";
import { getUserFacingMessage } from "@/lib/http/error";
import { Course } from "@/interfaces/Courses/Course";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

interface FormData extends Omit<
  Course,
  "course_id" | "created_at" | "updated_at"
> {
  [key: string]: string | boolean | number | undefined;
}

const ID_FIELDS = ["category_id", "professor_id", "evaluation_id"];

const AddCourse: NextPageWithLayout = () => {
  const router = useRouter();

  const categoriesQuery = useCategoriesQuery();
  const professorsQuery = useProfessorsQuery();
  const evaluationsQuery = useAvailableEvaluationsQuery();
  const createCourseMutation = useCreateCourseMutation();

  const categories = categoriesQuery.data ?? [];
  const professors = professorsQuery.data ?? [];
  const evaluations = evaluationsQuery.data ?? [];
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [presentationVideoFile, setPresentationVideoFile] =
    useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description_short: "",
    description_large: "",
    category_id: 0,
    professor_id: 0,
    evaluation_id: 0,
    intro_video: "",
    duration_video: "",
    image: "",
    duration_course: "",
    is_active: true,
  });
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageUploadRef = useRef<{ clear: () => void }>(null);
  const videoUploadRef = useRef<{ clear: () => void }>(null);
  const presentationVideoUploadRef = useRef<{ clear: () => void }>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [id]:
        type === "checkbox"
          ? checked
          : ID_FIELDS.includes(id)
            ? Number(value)
            : value,
    }));
  };

  const isValid =
    (formData.name as string).trim().length > 0 &&
    (formData.description_short as string).trim().length > 0 &&
    (formData.description_large as string).trim().length > 0 &&
    (formData.category_id as number) > 0 &&
    (formData.professor_id as number) > 0 &&
    (formData.evaluation_id as number) > 0 &&
    (formData.duration_video as string).trim().length > 0 &&
    (formData.duration_course as string).trim().length > 0 &&
    imageFile !== null &&
    videoFile !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await createCourseMutation.mutateAsync({
        course: formData,
        videoFile: videoFile!,
        imageFile: imageFile!,
        presentationVideoFile: presentationVideoFile ?? undefined,
      });
      toast.success("Curso creado exitosamente");
      router.push("/content");
    } catch (err: unknown) {
      toast.error(getUserFacingMessage(err) ?? "Error al crear el curso");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectPlaceholder = (
    isLoading: boolean,
    isError: boolean,
    label: string,
  ) => {
    if (isLoading) return "Cargando...";
    if (isError) return "Error al cargar";
    return label;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link
        href="/content"
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Volver
      </Link>

      <SectionCard title="Nuevo Curso">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <FormField
                id="name"
                label="Nombre del Curso"
                type="text"
                value={formData.name as string}
                onChange={handleChange}
                error={touched && !(formData.name as string).trim()}
                touched={touched}
                required
              />
              <FormField
                id="description_short"
                label="Descripción Corta"
                type="textarea"
                value={formData.description_short as string}
                onChange={handleChange}
                rows={4}
                error={
                  touched && !(formData.description_short as string).trim()
                }
                touched={touched}
                required
              />
              <FormField
                id="description_large"
                label="Descripción Larga"
                type="textarea"
                value={formData.description_large as string}
                onChange={handleChange}
                rows={4}
                error={
                  touched && !(formData.description_large as string).trim()
                }
                touched={touched}
                required
              />
              <div>
                <SidebarSelect
                  id="category_id"
                  label="Categoría"
                  value={
                    (formData.category_id as number) === 0
                      ? ""
                      : (formData.category_id as number).toString()
                  }
                  onChange={handleChange}
                  options={[
                    {
                      value: "",
                      label: selectPlaceholder(
                        categoriesQuery.isLoading,
                        categoriesQuery.isError,
                        "Seleccionar Categoría",
                      ),
                    },
                    ...categories.map((c) => ({
                      value: c.category_id.toString(),
                      label: c.name,
                    })),
                  ]}
                />
                {touched && (formData.category_id as number) === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    La categoría es requerida
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen
                </label>
                <MediaUploadPreview
                  ref={imageUploadRef}
                  onMediaUpload={(file) => setImageFile(file)}
                  accept="image/*"
                  label="Subir imagen"
                />
                {touched && !imageFile && (
                  <p className="text-xs text-red-500 mt-1">
                    La imagen es requerida
                  </p>
                )}
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">
              <div>
                <SidebarSelect
                  id="professor_id"
                  label="Profesor"
                  value={
                    (formData.professor_id as number) === 0
                      ? ""
                      : (formData.professor_id as number).toString()
                  }
                  onChange={handleChange}
                  options={[
                    {
                      value: "",
                      label: selectPlaceholder(
                        professorsQuery.isLoading,
                        professorsQuery.isError,
                        "Seleccionar Profesor",
                      ),
                    },
                    ...professors.map((p) => ({
                      value: p.professor_id.toString(),
                      label: p.full_name,
                    })),
                  ]}
                />
                {touched && (formData.professor_id as number) === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    El profesor es requerido
                  </p>
                )}
              </div>
              <div>
                <SidebarSelect
                  id="evaluation_id"
                  label="Evaluación"
                  value={
                    (formData.evaluation_id as number) === 0
                      ? ""
                      : (formData.evaluation_id as number).toString()
                  }
                  onChange={handleChange}
                  options={[
                    {
                      value: "",
                      label: selectPlaceholder(
                        evaluationsQuery.isLoading,
                        evaluationsQuery.isError,
                        "Seleccionar Evaluación",
                      ),
                    },
                    ...evaluations.map((ev) => ({
                      value: ev.evaluation_id.toString(),
                      label: ev.name,
                    })),
                  ]}
                />
                {touched && (formData.evaluation_id as number) === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    La evaluación es requerida
                  </p>
                )}
              </div>
              <FormField
                id="duration_video"
                label="Duración del Video"
                type="text"
                value={formData.duration_video as string}
                onChange={handleChange}
                error={touched && !(formData.duration_video as string).trim()}
                touched={touched}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video de Introducción
                </label>
                <MediaUploadPreview
                  ref={videoUploadRef}
                  onMediaUpload={(file) => setVideoFile(file)}
                  accept="video/*"
                  label="Subir video"
                  inputId="mediaUpload-intro_video"
                />
                {touched && !videoFile && (
                  <p className="text-xs text-red-500 mt-1">
                    El video es requerido
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video de Presentación del Profesor
                </label>
                <MediaUploadPreview
                  ref={presentationVideoUploadRef}
                  onMediaUpload={(file) => setPresentationVideoFile(file)}
                  accept="video/*"
                  label="Subir video"
                  inputId="mediaUpload-presentation_professor"
                />
              </div>
              <FormField
                id="duration_course"
                label="Duración del Curso"
                type="text"
                value={formData.duration_course as string}
                onChange={handleChange}
                error={touched && !(formData.duration_course as string).trim()}
                touched={touched}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 mt-2 border-t border-gray-100">
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
              {isSubmitting ? "Guardando..." : "Guardar curso"}
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
      </SectionCard>
    </div>
  );
};

AddCourse.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default AddCourse;
