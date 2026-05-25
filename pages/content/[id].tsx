import React, { useState } from "react";
import { useRouter } from "next/router";
import { useCourseQuery } from "@/features/courses/courses.queries";
import { useDeleteCourseMutation } from "@/features/courses/courses.mutations";
import { useEvaluationsQuery } from "@/features/evaluations/evaluations.queries";
import { getUserFacingMessage } from "@/lib/http/error";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import DetailView from "../../components/DetailView";
import ActionButtons from "../../components/Content/ActionButtons";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Loader from "../../components/Loader";
import ModalConfirmation from "../../components/ModalConfirmation";
import AlertComponent from "../../components/AlertComponent";
import useModal from "../../hooks/ui/useModal";
import "./../../app/globals.css";

const CourseDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { isVisible, showModal, hideModal } = useModal();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      await deleteCourseMutation.mutateAsync(course.course_id.toString());
      setSuccess("Registro eliminado correctamente");
      router.push("/content");
    } catch (err) {
      setError(getUserFacingMessage(err));
      console.error("Error eliminando el curso:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!course) {
    return <p>Loading...</p>;
  }

  const evaluationName =
    evaluations.find(
      (evaluation) => evaluation.evaluation_id === course.evaluation_id,
    )?.name || "No asignado";

  const courseDetails = [
    { value: course.description_short },
    { value: course.description_large },
    { label: "Evaluación:", value: evaluationName },
    { label: "Duración del curso:", value: course.duration_course },
    { label: "Activo:", value: course.is_active ? "Sí" : "No" },
  ];

  return (
    <>
      {success && (
        <AlertComponent
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}
      {error && (
        <AlertComponent
          type="danger"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center text-purple-600 mb-4"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Volver
      </button>
      <div className="flex flex-col md:flex-row p-2 flex-1">
        <DetailView
          title={course.name}
          imageUrl={course.image}
          details={courseDetails}
          videoUrl={course.intro_video}
        />
        <div className="md:ml-8 mt-4 md:mt-0 bg-white rounded-md flex-shrink-0">
          <ActionButtons
            onEdit={handleEdit}
            onDelete={showModal}
            customSize={true}
          />
        </div>
      </div>
      <ModalConfirmation
        show={isVisible}
        onClose={hideModal}
        onConfirm={handleDelete}
      />
    </>
  );
};

CourseDetail.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default CourseDetail;
