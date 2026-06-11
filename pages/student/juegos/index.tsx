import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { useCourseStudent } from "../../../hooks/useCourseStudents";
import CourseCard from "../../../components/student/CourseCard";
import { useRouter } from "next/router";

const JuegosIndex = () => {
  const { courseStudent, isLoading } = useCourseStudent();
  const router = useRouter();

  const navigateToCourseModules = (courseid: number) => {
    router.push({ pathname: "/student/juegos/modulos", query: { courseid } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300">
        <p className="text-white">Cargando cursos...</p>
      </div>
    );
  }

  if (courseStudent.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300">
        <p className="text-white">No tienes cursos asignados.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 px-4 py-10 sm:px-8 sm:py-14">
      <div className="w-full max-w-screen-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Juegos Didácticos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {courseStudent.map((item) => (
            <CourseCard
              key={item.Course.course_id}
              name={item.Course.name}
              description={item.Course.description_short}
              image={item.Course.image}
              profesor={item.Course.courseProfessor.full_name}
              categoria={item.Course.courseCategory.name}
              course_id={item.Course.course_id}
              onClick={() => navigateToCourseModules(item.Course.course_id)}
              isJuegosIndex={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

JuegosIndex.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default JuegosIndex;
