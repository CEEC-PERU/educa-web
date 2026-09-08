import React from "react";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "@/components/layouts/AppLayout";
import { Profile } from "../../interfaces/User/UserInterfaces";
import { useRouter } from "next/router";
import { useCoursesCount } from "../../hooks/user/useUserCourses";
import {
  useCourseTimeSummary,
  useLearningTimeSummary,
} from "../../hooks/courses/useCourseTime";
import StudentVerificationModal from "../../components/student/StudentVerificationModal";
import StudentHero from "../../components/student/StudentHero";
import RecentCourseCard from "../../components/student/RecentCourseCard";
import Footer from "../../components/Footter";

const StudentIndex = () => {
  const { profileInfo } = useAuth();
  const { coursescount } = useCoursesCount();
  const { summary, isLoading: isSummaryLoading } = useCourseTimeSummary(4);
  const { totalSeconds: learningTimeSeconds, isLoading: isLearningTimeLoading } =
    useLearningTimeSummary();
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

  const recentCourses = summary?.recentCourses ?? [];
  const hasRecentCourses = recentCourses.length > 0;

  return (
    <>
      <StudentVerificationModal />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 translate-x-[8%] lg:block"
      >
        <img
          src="/qtech_robot_transparent.gif"
          alt=""
          className="h-64 w-64 object-contain"
        />
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r pt-4 pb-10 from-student-bg-start via-student-bg-mid to-student-bg-end p-4">
        <StudentHero
          name={name}
          avatar={avatar}
          coursescount={coursescount}
          learningTimeSeconds={learningTimeSeconds}
          isLearningTimeLoading={isLearningTimeLoading}
        />

        <div className="w-full max-w-screen-xl mt-1 pt-2 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-white">
            Vistos recientemente
          </h2>
        </div>

        <div
          id="cursos"
          className="w-full max-w-screen-xl mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-[100px]"
        >
          {isSummaryLoading ? (
            <p className="text-white/70 col-span-full">Cargando...</p>
          ) : hasRecentCourses ? (
            recentCourses.map((item) => (
              <RecentCourseCard
                key={item.course_id}
                course_id={item.course_id}
                name={item.name}
                image={item.image}
                categoria={item.category_name}
                lastViewedAt={item.last_viewed_at}
                totalDurationSeconds={item.total_duration_seconds}
                progress={item.progress}
                onClick={() => navigateToCourseDetails(item.course_id)}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-white/80 py-6">
              <p className="mb-3">Aún no has explorado ningún curso.</p>
              <a
                href="/student/cursos"
                className="inline-flex items-center rounded-lg bg-brandrosado-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brandfucsia-900"
              >
                Ver mis cursos
              </a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

StudentIndex.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default StudentIndex;
