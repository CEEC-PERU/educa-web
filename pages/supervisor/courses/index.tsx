import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useCoursesBySupervisorQuery } from "@/features/courses/courses.queries";
import CourseCard from "../../../components/CourseCard";
import AppLayout from "../../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../../types/next";
import { BookOpenIcon } from "@heroicons/react/24/outline";

const SupervisorCourses: NextPageWithLayout = () => {
  const { user } = useAuth();
  const userId = (user as { id: number } | null)?.id;

  const { data: courses, isLoading, isError } = useCoursesBySupervisorQuery(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2">
        <p className="text-red-500 font-medium">Error al cargar los cursos</p>
        <p className="text-sm text-gray-400">Intenta recargar la página</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
        {courses && (
          <p className="mt-1 text-sm text-gray-500">
            {courses.length} {courses.length === 1 ? "curso asignado" : "cursos asignados"}
          </p>
        )}
      </div>

      {courses?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <BookOpenIcon className="h-12 w-12 text-gray-300" />
          <p className="text-sm">No tienes cursos asignados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses?.map((course) => (
            <CourseCard
              key={course.course_id}
              course={course}
              redirectPath="nota/"
            />
          ))}
        </div>
      )}
    </>
  );
};

SupervisorCourses.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default SupervisorCourses;
