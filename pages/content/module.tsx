import React from "react";
import { useRouter } from "next/router";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import CourseCard from "@components/courses/CourseCard";
import CourseCardSkeleton from "@components/courses/CourseCardSkeleton";
import { useCoursesQuery } from "@/features/courses/courses.queries";
import { getUserFacingMessage } from "@/lib/http/error";

const ModulePage: NextPageWithLayout = () => {
  const router = useRouter();
  const coursesQuery = useCoursesQuery();

  if (coursesQuery.isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (coursesQuery.isError) {
    return (
      <p className="text-gray-500 text-center mt-20">
        {getUserFacingMessage(coursesQuery.error) ??
          "Error al cargar los cursos."}
      </p>
    );
  }

  const cursos = coursesQuery.data ?? [];

  if (cursos.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-20">
        No hay cursos disponibles.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Módulos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursos.map((curso) => (
          <CourseCard
            key={curso.course_id}
            course={curso}
            buttonLabel="Ver Módulos"
            onButtonClick={(courseId) =>
              router.push(`/content/detailModule?id=${courseId}`)
            }
          />
        ))}
      </div>
    </div>
  );
};

ModulePage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default ModulePage;
