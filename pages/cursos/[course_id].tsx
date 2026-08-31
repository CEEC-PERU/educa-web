import React from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import PublicNavbar from "@/components/navigation/PublicNavbar";
import Footer from "@/components/Footter";
import CourseHero from "@/components/student/course-details/CourseHero";
import CourseDescription from "@/components/student/course-details/CourseDescription";
import CourseSyllabus from "@/components/student/course-details/CourseSyllabus";
import CourseProfessor from "@/components/student/course-details/CourseProfessor";
import { usePublicCourseDetail } from "@/hooks/courses/usePublicCourseDetail";
import { PUBLIC_COURSE_IDS } from "@/utils/publicCourseIds";
import "@/app/globals.css";

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

const PublicCourseDetails = () => {
  const router = useRouter();
  const { course_id } = router.query;
  const courseIdNumber = Array.isArray(course_id)
    ? parseInt(course_id[0])
    : parseInt(course_id || "0");
  const isAllowedPublicly = PUBLIC_COURSE_IDS.includes(courseIdNumber);
  const { courseDetail, isLoading, error } = usePublicCourseDetail(
    isAllowedPublicly ? courseIdNumber : 0,
  );

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-brand-100">
      <PublicNavbar variant="landing" />

      {isLoading && (
        <div className="min-h-screen flex items-center justify-center text-white">
          Cargando curso...
        </div>
      )}

      {!isLoading && (error || !courseDetail) && (
        <div className="min-h-screen flex items-center justify-center text-white text-center px-4">
          No se pudo encontrar este curso.
        </div>
      )}

      {!isLoading && courseDetail && (
        <>
          <CourseHero course={courseDetail} />
          <div className="min-h-screen flex flex-col items-center justify-center bg-brand-100 p-4">
            <CourseDescription course={courseDetail} onStart={goToLogin} />
            <CourseSyllabus modules={courseDetail.courseModules} />
            <CourseProfessor
              professor={courseDetail.courseProfessor}
              presentationVideo={courseDetail.presentation_professor}
            />
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default PublicCourseDetails;
