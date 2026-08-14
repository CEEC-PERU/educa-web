import React, { useState } from "react";
import Modal from "react-modal";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "@/components/layouts/AppLayout";
import { Profile } from "../../interfaces/User/UserInterfaces";
import { useCourseStudent } from "../../hooks/useCourseStudents";
import CourseCard from "../../components/student/CourseCard";
import { useRouter } from "next/router";
import { useCoursesCount } from "../../hooks/user/useUserCourses";
import StudentVerificationModal from "../../components/student/StudentVerificationModal";
import StudentCoursePreviewModal, {
  CoursePreview,
} from "../../components/student/StudentCoursePreviewModal";
import StudentHero from "../../components/student/StudentHero";
import StudentPortalFooter from "../../components/student/StudentPortalFooter";

Modal.setAppElement("#__next");

const StudentIndex = () => {
  const { profileInfo } = useAuth();
  const { courseStudent } = useCourseStudent();
  const { coursescount } = useCoursesCount();
  const [selectedCourse, setSelectedCourse] = useState<CoursePreview | null>(
    null,
  );
  const router = useRouter();

  const profile = profileInfo as Profile | null;
  const name = profile?.first_name ?? "";
  const avatar = profile?.profile_picture ?? null;

  const navigateToCourseDetails = () => {
    if (!selectedCourse) return;
    router.push({
      pathname: "/student/course-details",
      query: { course_id: selectedCourse.course_id },
    });
  };

  return (
    <>
      <StudentVerificationModal />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r pt-40 pb-10 from-student-bg-start via-student-bg-mid to-student-bg-end p-4">
        <StudentHero name={name} avatar={avatar} coursescount={coursescount} />
        <div
          id="cursos"
          className="w-full max-w-screen-lg mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
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
              onClick={() => setSelectedCourse(item.Course)}
            />
          ))}
        </div>
      </div>
      {selectedCourse && (
        <StudentCoursePreviewModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onViewDetails={navigateToCourseDetails}
        />
      )}
      <StudentPortalFooter />
    </>
  );
};

StudentIndex.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default StudentIndex;
