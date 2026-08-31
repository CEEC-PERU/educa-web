import React from "react";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "@/components/layouts/AppLayout";
import { Profile } from "../../interfaces/User/UserInterfaces";
import { useCourseStudent } from "../../hooks/useCourseStudents";
import CourseCard from "../../components/student/CourseCard";
import { useRouter } from "next/router";
import { useCoursesCount } from "../../hooks/user/useUserCourses";
import StudentVerificationModal from "../../components/student/StudentVerificationModal";
import StudentHero from "../../components/student/StudentHero";
import StudentPortalFooter from "../../components/student/StudentPortalFooter";

const StudentIndex = () => {
  const { profileInfo } = useAuth();
  const { courseStudent } = useCourseStudent();
  const { coursescount } = useCoursesCount();
  const router = useRouter();

  const profile = profileInfo as Profile | null;
  const name = profile?.first_name ?? "";
  const avatar = profile?.profile_picture ?? null;

  const navigateToCourseDetails = (courseId: number) => {
    router.push({
      pathname: "/student/course-details",
      query: { course_id: courseId },
    });
  };

  return (
    <>
      <StudentVerificationModal />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r pt-40 pb-10 from-student-bg-start via-student-bg-mid to-student-bg-end p-4">
        <StudentHero name={name} avatar={avatar} coursescount={coursescount} />
        <div className="w-full max-w-screen-lg mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Tus cursos</h2>
        </div>
        <div
          id="cursos"
          className="w-full max-w-screen-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          {courseStudent.map((item) => (
            <CourseCard
              key={item.Course.course_id}
              name={item.Course.name}
              description={item.Course.description_short}
              image={item.Course.image}
              profesor={item.Course.courseProfessor.full_name}
              categoria={item.Course.courseCategory.name}
              course_id={item.Course.course_id}
              onClick={() => navigateToCourseDetails(item.Course.course_id)}
            />
          ))}
        </div>
      </div>
      <StudentPortalFooter />
    </>
  );
};

StudentIndex.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default StudentIndex;
