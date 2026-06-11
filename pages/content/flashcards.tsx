import React from "react";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import { useRouter } from "next/router";
import { useCoursesQuery } from "@/features/courses/courses.queries";
import { getUserFacingMessage } from "@/lib/http/error";
import CourseCard from "@/components/courses/CourseCard";
import CourseCardSkeleton from "@/components/courses/CourseCardSkeleton";

const Flashcards: NextPageWithLayout = () => {
  const router = useRouter();
  const coursesQuery = useCoursesQuery();
  const courses = coursesQuery.data ?? [];

  const handleViewModules = (courseId: number) => {
    router.push(`/content/detailFlashcard?id=${courseId}`);
  };

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
          "Error al cargar los cursos. Intenta de nuevo."}
      </p>
    );
  }

  if (courses.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-20">
        No hay cursos disponibles.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.course_id}
          course={course}
          buttonLabel="Ver Módulos"
          onButtonClick={handleViewModules}
        />
      ))}
    </div>
  );
};

Flashcards.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Flashcards;
