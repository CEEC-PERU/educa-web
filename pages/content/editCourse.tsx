import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import { useCategoriesQuery } from "@/features/categories/categories.queries";
import { useProfessorsQuery } from "@/features/professors/professors.queries";
import {
  useAvailableEvaluationsQuery,
  useEvaluationByIdQuery,
} from "@/features/evaluations/evaluations.queries";
import { useCourseQuery } from "@/features/courses/courses.queries";
import { useUpdateCourseMutation } from "@/features/courses/courses.mutations";
import { getUserFacingMessage } from "@/lib/http/error";
import { uploadVideo } from "@services/videoService";
import { uploadImage } from "@services/imageService";
import { Course } from "@/interfaces/Courses/Course";
import MediaUploadPreview from "@components/MediaUploadPreview";
import FormField from "@components/FormField";
import SectionCard from "@components/ui/SectionCard";
import SidebarSelect from "@components/ui/SidebarSelect";
import SidebarInput from "@components/ui/SidebarInput";
import Toggle from "@components/ui/Toggle";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

const EditCourse: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const courseId = typeof id === "string" ? id : undefined;

  const categoriesQuery = useCategoriesQuery();
  const professorsQuery = useProfessorsQuery();
  const availableEvaluationsQuery = useAvailableEvaluationsQuery();
  const courseQuery = useCourseQuery(courseId);
  const updateCourseMutation = useUpdateCourseMutation();

  const courseEvaluationId = courseQuery.data?.evaluation_id;
  const needsCurrentEval =
    typeof courseEvaluationId === "number" && courseEvaluationId > 0;
  const currentEvalQuery = useEvaluationByIdQuery(
    needsCurrentEval ? courseEvaluationId : undefined,
  );

  const categories = categoriesQuery.data ?? [];
  const professors = professorsQuery.data ?? [];

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [presentationVideoFile, setPresentationVideoFile] =
    useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<
    Omit<Course, "course_id" | "created_at" | "updated_at">
  >({
    name: "",
    description_short: "",
    description_large: "",
    category_id: 0,
    professor_id: 0,
    intro_video: "",
    presentation_professor: "",
    duration_video: "",
    image: "",
    duration_course: "",
    evaluation_id: 0,
    is_active: true,
  });

  const evaluations = useMemo(() => {
    const available = availableEvaluationsQuery.data ?? [];
    if (!needsCurrentEval) return available;

    const alreadyInList = available.some(
      (ev) => ev.evaluation_id === courseEvaluationId,
    );
    if (alreadyInList) {
      return [
        available.find((ev) => ev.evaluation_id === courseEvaluationId)!,
        ...available.filter((ev) => ev.evaluation_id !== courseEvaluationId),
      ];
    }

    // The current evaluation is not in the "available" list (already assigned),
    // so we inject it from the detail query.
    const currentEval = currentEvalQuery.data?.evaluation;
    return currentEval ? [currentEval, ...available] : available;
  }, [
    availableEvaluationsQuery.data,
    courseEvaluationId,
    needsCurrentEval,
    currentEvalQuery.data,
  ]);

  useEffect(() => {
    const courseRes = courseQuery.data;
    if (!courseRes) return;
    setFormData({
      name: courseRes.name,
      description_short: courseRes.description_short,
      description_large: courseRes.description_large,
      category_id: courseRes.category_id,
      professor_id: courseRes.professor_id,
      intro_video: courseRes.intro_video,
      presentation_professor: courseRes.presentation_professor ?? "",
      duration_video: courseRes.duration_video,
      image: courseRes.image,
      duration_course: courseRes.duration_course,
      evaluation_id: courseRes.evaluation_id,
      is_active: courseRes.is_active,
    });
  }, [courseQuery.data]);

  const loading =
    categoriesQuery.isLoading ||
    professorsQuery.isLoading ||
    availableEvaluationsQuery.isLoading ||
    courseQuery.isLoading ||
    (needsCurrentEval && currentEvalQuery.isLoading);

  const queryError =
    categoriesQuery.isError ||
    professorsQuery.isError ||
    availableEvaluationsQuery.isError ||
    courseQuery.isError;

  const formLoading = updateCourseMutation.isPending;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;
    try {
      let videoUrl = formData.intro_video;
      let presentationVideoUrl = formData.presentation_professor;
      let imageUrl = formData.image;

      if (videoFile) videoUrl = await uploadVideo(videoFile, "Cursos/Videos");
      if (presentationVideoFile)
        presentationVideoUrl = await uploadVideo(
          presentationVideoFile,
          "Cursos/Videos",
        );
      if (imageFile) imageUrl = await uploadImage(imageFile, "Cursos/Images");

      await updateCourseMutation.mutateAsync({
        id: courseId,
        course: {
          ...formData,
          intro_video: videoUrl,
          presentation_professor: presentationVideoUrl,
          image: imageUrl,
        },
      });
      toast.success("Curso actualizado correctamente");
    } catch (err) {
      toast.error(getUserFacingMessage(err) ?? "Error al actualizar el curso");
    }
  };

  if (loading) return null;

  if (queryError) {
    return (
      <p className="text-gray-500 text-center mt-20">
        Error al cargar los datos. Intenta de nuevo.
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-sm"
          aria-label="Volver"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
            Cursos
          </p>
          <h1 className="text-xl font-semibold text-gray-900 leading-tight">
            {courseQuery.data?.name ?? "Editar Curso"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <SectionCard title="Información del curso">
              <FormField
                id="name"
                label="Nombre"
                type="text"
                value={formData.name}
                onChange={handleChange}
              />
              <FormField
                id="description_short"
                label="Descripción corta"
                type="textarea"
                value={formData.description_short}
                onChange={handleChange}
              />
              <FormField
                id="description_large"
                label="Descripción larga"
                type="textarea"
                rows={5}
                value={formData.description_large}
                onChange={handleChange}
              />
            </SectionCard>

            <SectionCard title="Imagen del curso">
              <MediaUploadPreview
                onMediaUpload={(file) => setImageFile(file)}
                accept="image/*"
                label="Subir imagen"
                initialPreview={formData.image}
              />
            </SectionCard>

            <SectionCard title="Videos">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Video de introducción
                  </span>
                  <MediaUploadPreview
                    onMediaUpload={(file) => setVideoFile(file)}
                    accept="video/*"
                    label="Subir video"
                    inputId="mediaUpload-intro_video"
                    initialPreview={formData.intro_video}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Presentación del profesor
                  </span>
                  <MediaUploadPreview
                    onMediaUpload={(file) => setPresentationVideoFile(file)}
                    accept="video/*"
                    label="Subir video"
                    inputId="mediaUpload-presentation_professor"
                    initialPreview={formData.presentation_professor}
                  />
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-6">
            <SectionCard title="Publicación">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Estado del curso
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formData.is_active
                      ? "Visible para estudiantes"
                      : "Oculto para estudiantes"}
                  </p>
                </div>
                <Toggle
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, is_active: val }))
                  }
                />
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formLoading && (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                  )}
                  {formLoading ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full text-sm font-medium text-gray-500 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </SectionCard>

            <SectionCard title="Clasificación">
              <SidebarSelect
                id="category_id"
                label="Categoría"
                value={formData.category_id.toString()}
                onChange={handleChange}
                options={categories.map((cat) => ({
                  value: cat.category_id.toString(),
                  label: cat.name,
                }))}
              />
              <SidebarSelect
                id="professor_id"
                label="Profesor"
                value={formData.professor_id.toString()}
                onChange={handleChange}
                options={[
                  { value: "", label: "Seleccionar profesor" },
                  ...professors.map((prof) => ({
                    value: prof.professor_id.toString(),
                    label: prof.full_name,
                  })),
                ]}
              />
              <SidebarSelect
                id="evaluation_id"
                label="Evaluación"
                value={formData.evaluation_id.toString()}
                onChange={handleChange}
                options={[
                  { value: "", label: "Sin evaluación" },
                  ...evaluations.map((ev) => ({
                    value: ev.evaluation_id.toString(),
                    label: ev.name,
                  })),
                ]}
              />
            </SectionCard>

            <SectionCard title="Duración">
              <SidebarInput
                id="duration_video"
                label="Vídeo principal"
                value={formData.duration_video}
                onChange={handleChange}
                placeholder="ej. 12:30"
              />
              <SidebarInput
                id="duration_course"
                label="Curso completo"
                value={formData.duration_course}
                onChange={handleChange}
                placeholder="ej. 4h 30m"
              />
            </SectionCard>
          </div>
        </div>
      </form>
    </div>
  );
};

EditCourse.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default EditCourse;
