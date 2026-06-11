import React from "react";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import Link from "next/link";
import { useCoursesQuery } from "@/features/courses/courses.queries";
import { getUserFacingMessage } from "@/lib/http/error";
import CourseCard from "@/components/courses/CourseCard";
import CourseCardSkeleton from "@/components/courses/CourseCardSkeleton";
import { useRouter } from "next/router";

const Home: NextPageWithLayout = () => {
  const router = useRouter();
  const coursesQuery = useCoursesQuery();
  const courses = coursesQuery.data ?? [];

  const handleViewCourse = (courseId: number) => {
    router.push(`/content/${courseId}`);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Link
          href="/content/addCourse"
          className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold uppercase rounded-full px-7 py-2 shadow-md hover:shadow-lg transition-all"
        >
          Añadir Curso
        </Link>
      </div>

      {coursesQuery.isError && (
        <p className="text-red-500 mb-4">
          {getUserFacingMessage(coursesQuery.error)}
        </p>
      )}

      {!coursesQuery.isError && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-lg font-medium">No hay cursos disponibles</p>
          <p className="text-sm mt-1">
            Crea el primer curso usando el botón de arriba.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {coursesQuery.isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))
          : courses.map((course) => (
              <CourseCard
                key={course.course_id}
                course={course}
                buttonLabel="Ver detalles"
                onButtonClick={handleViewCourse}
              />
            ))}
      </div>
    </>
  );
};

Home.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Home;
