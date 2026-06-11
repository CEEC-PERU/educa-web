import React from "react";
import { useRouter } from "next/router";
import { useCourseQuery } from "@/features/courses/courses.queries";
import { useDeleteCourseMutation } from "@/features/courses/courses.mutations";
import { useEvaluationsQuery } from "@/features/evaluations/evaluations.queries";
import { getUserFacingMessage } from "@/lib/http/error";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import DetailView from "../../components/courses/DetailView";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import ModalConfirmation from "../../components/ModalConfirmation";
import useModal from "../../hooks/ui/useModal";
import { toast } from "sonner";

const CourseDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { isVisible, showModal, hideModal } = useModal();

  const courseQuery = useCourseQuery(id);
  const evaluationsQuery = useEvaluationsQuery();
  const deleteCourseMutation = useDeleteCourseMutation();

  const course = courseQuery.data ?? null;
  const evaluations = evaluationsQuery.data ?? [];
  const loading = courseQuery.isLoading || evaluationsQuery.isLoading;

  const handleEdit = () => {
    if (course) {
      router.push(`/content/editCourse?id=${course.course_id}`);
    }
  };

  const handleDelete = async () => {
    if (!course) return;
    try {
      await deleteCourseMutation.mutateAsync(course.course_id);
      toast.success("Curso eliminado correctamente");
      router.push("/content");
    } catch (err) {
      toast.error(getUserFacingMessage(err) ?? "Error al eliminar el curso");
    }
  };

  if (loading || !course) {
    return null;
  }

  if (courseQuery.isError) {
    return (
      <p className="text-gray-500 text-center mt-20">Curso no encontrado.</p>
    );
  }

  const evaluationName =
    evaluations.find(
      (evaluation) => evaluation.evaluation_id === course.evaluation_id,
    )?.name ?? "No asignado";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleEdit}
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg px-4 py-2 transition-colors"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Editar
          </button>
          <button
            type="button"
            onClick={showModal}
            className="flex items-center gap-1.5 text-sm font-medium text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg px-4 py-2 transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
            Eliminar
          </button>
        </div>
      </div>

      <DetailView
        name={course.name}
        imageUrl={course.image}
        descriptionShort={course.description_short}
        descriptionLarge={course.description_large}
        evaluationName={evaluationName}
        duration={course.duration_course}
        isActive={course.is_active}
        videoUrl={course.intro_video}
      />
      <ModalConfirmation
        show={isVisible}
        onClose={hideModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

CourseDetail.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default CourseDetail;
