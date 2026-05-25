import React from "react";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import { useCoursesQuery } from "@/features/courses/courses.queries";
import { getUserFacingMessage } from "@/lib/http/error";
import CourseCard from "@/components/courses/CourseCard";
import ButtonComponent from "../../components/ButtonComponent";
import Loader from "../../components/Loader";
import { useRouter } from "next/router";

const Home: NextPageWithLayout = () => {
  const router = useRouter();
  const coursesQuery = useCoursesQuery();
  const courses = coursesQuery.data ?? [];

  const handleViewCourse = (courseId: number) => {
    router.push(`/content/${courseId}`);
  };

  if (coursesQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <ButtonComponent
          buttonLabel="Añadir Curso"
          buttonroute="/content/addCourse"
          backgroundColor="bg-gradient-to-r from-blue-500 to-blue-400"
          textColor="text-white"
          fontSize="text-xs"
          buttonSize="py-2 px-7"
        />
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
        {courses.map((course) => (
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
