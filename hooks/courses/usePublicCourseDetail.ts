import { useEffect, useState } from "react";
import { CourseDetail } from "@/interfaces/Courses/CourseDetail";
import { fetchCourse, fetchModulesByCourseId } from "@/features/courses/courses.api";
import { fetchProfessor } from "@/features/professors/professors.api";

export const usePublicCourseDetail = (course_id: number) => {
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!course_id) return;

    let isCancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [course, modules] = await Promise.all([
          fetchCourse(course_id),
          fetchModulesByCourseId(course_id),
        ]);
        const professor = await fetchProfessor(course.professor_id);

        if (isCancelled) return;

        setCourseDetail({
          course_id: course.course_id,
          name: course.name,
          description_short: course.description_short,
          description_large: course.description_large,
          intro_video: course.intro_video,
          presentation_professor: course.presentation_professor,
          duration_video: course.duration_video,
          image: course.image,
          duration_course: course.duration_course,
          is_active: course.is_active,
          courseCategory: { name: "" },
          courseProfessor: {
            full_name: professor.full_name,
            image: professor.image,
            especialitation: professor.especialitation,
            description: professor.description,
            professorLevel: { name: "" },
          },
          courseModules: modules.map((module) => ({
            name: module.name,
            is_active: String(module.is_active),
            module_id: module.module_id,
            moduleSessions: (module.moduleSessions ?? []).map((session) => ({
              name: session.name,
            })),
          })),
        });
      } catch (err) {
        if (isCancelled) return;
        console.error("Error fetching public course detail:", err);
        setError("Error fetching course detail. Please try again.");
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    load();

    return () => {
      isCancelled = true;
    };
  }, [course_id]);

  return { courseDetail, error, isLoading };
};
