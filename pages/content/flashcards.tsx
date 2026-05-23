import React, { useState, useEffect } from "react";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import { useRouter } from "next/router";
import { Course } from "@/interfaces/Courses/Course";
import { getCourses } from "@/services/courses/courseService";
import CardCourses from "@/components/Content/CardCourses";

const Flashcards: NextPageWithLayout = () => {
  const [cursos, setCursos] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCourses();
        setCursos(data);
      } catch (error) {
        setError("Error fetching courses");
        console.error("Error fetching courses:", error);
      }
    };

    fetchData();
  }, []);

  const handleViewModulesClick = (courseId?: number) => {
    if (courseId) {
      router.push(`/content/detailFlashcard?id=${courseId}`);
    }
  };
  return (
    <>
      <div className="flex justify-between items-center mb-4"></div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* lista de módulos */}
        {cursos.map((curso) => (
          <CardCourses
            key={curso.course_id}
            id={curso.course_id}
            image={curso.image}
            name={curso.name}
            description_short={curso.description_short}
            duration_course={curso.duration_course}
            rating={4.9}
            buttonLabel="Ver Módulos"
            textColor="text-blue-gray-900"
            onButtonClick={() => handleViewModulesClick(curso.course_id)}
          />
        ))}
      </div>
    </>
  );
};

Flashcards.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Flashcards;
