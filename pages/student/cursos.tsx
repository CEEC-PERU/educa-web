import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import AppLayout from "@/components/layouts/AppLayout";
import { Course } from "../../interfaces/Courses/CourseStudent";
import {
  useCourseStudent,
  useCourseStudentCategory,
} from "../../hooks/useCourseStudents";
import { useCategoriesl } from "../../hooks/courses/useCategories";
import CourseCard from "../../components/student/CourseCard";
import { XCircleIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import Footter from "../../components/Footter";

Modal.setAppElement("#__next");

const StudentCursosPage = () => {
  const { courseStudent, isLoading } = useCourseStudent();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const { categories } = useCategoriesl();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
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
        window.open(
          "https://www.openjavascript.com",
          "_blank",
          "noopener,noreferrer",
        );
      });

      setTimeout(() => notification.close(), 5_000);

      if ("vibrate" in navigator) {
        navigator.vibrate([300, 200, 300]);
      }
    };

    requestPermission();
  }, []);

  const openModal = (course: Course) => setSelectedCourse(course);
  const closeModal = () => setSelectedCourse(null);

  const navigateToCourseDetails = () => {
    if (!selectedCourse) return;
    router.push({
      pathname: "/student/course-details",
      query: { course_id: selectedCourse.course_id },
    });
  };

  const displayedCourses = selectedCategoryId
    ? courseStudentCategory
    : courseStudent;
  const loading = selectedCategoryId ? categoryLoading : isLoading;

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 p-4">
        <div className="w-full max-w-screen-lg mt-2 flex gap-4 overflow-x-auto scrollbar-hide overflow-auto">
          <button
            className={`whitespace-nowrap p-4 rounded-lg flex-shrink-0 transition-colors ${
              selectedCategoryId === null
                ? "bg-white/20 text-white font-semibold"
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => setSelectedCategoryId(null)}
          >
            Todos
          </button>

          {categories.map((category) => (
            <div
              key={category.category_id}
              className="flex items-center space-x-2"
            >
              <img
                src={category.logo}
                alt={category.name}
                className="h-6 w-6"
              />
              <button
                className={`whitespace-nowrap pr-8 rounded-lg flex-shrink-0 transition-colors ${
                  selectedCategoryId === category.category_id
                    ? "text-white font-semibold underline"
                    : "text-white hover:opacity-80"
                }`}
                onClick={() => setSelectedCategoryId(category.category_id)}
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="mt-16 text-white text-lg animate-pulse">
            Cargando cursos...
          </div>
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
                onClick={() => item.Course && openModal(item.Course)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedCourse && (
        <Modal
          key={selectedCourse.course_id}
          isOpen={true}
          onRequestClose={closeModal}
          overlayClassName="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
          className="relative bg-white rounded-lg overflow-hidden shadow-lg max-w-lg w-full outline-none"
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-black z-10"
          >
            <XCircleIcon className="h-8 w-8" />
          </button>
          <img
            className="w-full h-64 object-cover"
            src={selectedCourse.image}
            alt={selectedCourse.name}
          />
          <div className="px-6 py-4">
            <div className="bg-brandmorado-600 rounded font-bold text-md mb-2 text-white p-4">
              {selectedCourse.courseCategory.name}
            </div>
            <div className="font-bold text-md mb-2 text-black">
              {selectedCourse.name}
            </div>
            <p className="text-brandrosado-800 text-base mb-4">
              Por: {selectedCourse.courseProfessor.full_name}
            </p>
            <p className="text-black text-sm mb-4">
              {selectedCourse.description_short}
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-brandmorado-500 text-white px-4 py-2 rounded hover:bg-brandmorado-700 border-2 border-brandborder-400 flex items-center"
                onClick={navigateToCourseDetails}
              >
                Detalles del curso
                <ChevronRightIcon className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        </Modal>
      )}
      <Footter />
    </>
  );
};

StudentCursosPage.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default StudentCursosPage;
