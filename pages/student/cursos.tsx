import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import {
  useCourseStudent,
  useCourseStudentCategory,
} from "../../hooks/useCourseStudents";
import { useCategoriesl } from "../../hooks/courses/useCategories";
import CourseCard from "../../components/student/CourseCard";
import { useRouter } from "next/router";
import Footter from "../../components/Footter";

const StudentCursosPage = () => {
  const { courseStudent, isLoading } = useCourseStudent();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { categories } = useCategoriesl();
  const router = useRouter();

  const { courseStudentCategory, isLoading: categoryLoading } =
    useCourseStudentCategory(selectedCategoryId);

  useEffect(() => {
    if (!("Notification" in window)) return;

    const requestPermission = async () => {
      const permission =
        Notification.permission === "granted"
          ? "granted"
          : await Notification.requestPermission();

      if (permission !== "granted") return;

      const notification = new Notification("MentorMind", {
        body: "Bienvenido a MentorMind",
        icon: "https://res.cloudinary.com/dk2red18f/image/upload/v1724273141/WEB_EDUCA/gy7xwx0d7banshaqmitz.png",
      });

      notification.addEventListener("click", () => {
        window.open("https://www.openjavascript.com", "_blank", "noopener,noreferrer");
      });

      setTimeout(() => notification.close(), 5_000);

      if ("vibrate" in navigator) {
        navigator.vibrate([300, 200, 300]);
      }
    };

    requestPermission();
  }, []);

  const navigateToCourseDetails = (courseId: number) => {
    router.push({ pathname: "/student/course-details", query: { course_id: courseId } });
  };

  const displayedCourses = selectedCategoryId ? courseStudentCategory : courseStudent;
  const loading = selectedCategoryId ? categoryLoading : isLoading;

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 p-4 pt-8">
        <div className="w-full max-w-screen-lg mt-2 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            className={`whitespace-nowrap px-4 py-2 rounded-lg flex-shrink-0 transition-colors ${
              selectedCategoryId === null
                ? "bg-white/20 text-white font-semibold"
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => setSelectedCategoryId(null)}
          >
            Todos
          </button>

          {categories.map((category) => (
            <button
              key={category.category_id}
              className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg flex-shrink-0 transition-colors ${
                selectedCategoryId === category.category_id
                  ? "bg-white/20 text-white font-semibold"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setSelectedCategoryId(category.category_id)}
            >
              <img src={category.logo} alt="" className="h-5 w-5 flex-shrink-0" />
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-16 text-white text-lg animate-pulse">Cargando cursos...</div>
        ) : (
          <div className="w-full max-w-screen-lg mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayedCourses?.map((item) => (
              <CourseCard
                key={item.Course?.course_id}
                name={item.Course?.name}
                description={item.Course?.description_short}
                image={item.Course?.image}
                profesor={item.Course?.courseProfessor?.full_name}
                categoria={item.Course?.courseCategory?.name}
                course_id={item.Course?.course_id}
                onClick={() => item.Course && navigateToCourseDetails(item.Course.course_id)}
              />
            ))}
          </div>
        )}
      </div>
      <Footter />
    </>
  );
};

StudentCursosPage.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default StudentCursosPage;
