import React from 'react';
import { useRouter } from 'next/router';
import AppLayout from '@/components/layouts/AppLayout';
import CourseMaterials from '@components/student/CourseMaterials';
import CourseHero from '@components/student/course-details/CourseHero';
import CourseDescription from '@components/student/course-details/CourseDescription';
import CourseSyllabus from '@components/student/course-details/CourseSyllabus';
import CourseProfessor from '@components/student/course-details/CourseProfessor';
import { useCourseDetail } from '@hooks/courses/useCourseDetail';
import { useCoursesMaterials } from '@hooks/courses/courseMaterial';

const CourseDetails = () => {
  const router = useRouter();
  const { course_id } = router.query;
  const courseIdNumber = Array.isArray(course_id)
    ? parseInt(course_id[0])
    : parseInt(course_id || '0');

  const { courseDetail, isLoading } = useCourseDetail(courseIdNumber);
  const { coursesMaterials } = useCoursesMaterials(courseIdNumber);

  const navigateToCourse = () => {
    router.push({ pathname: '/student/modulos/', query: { course_id: courseIdNumber } });
  };

  if (isLoading || courseDetail.length === 0) return null;

  const course = courseDetail[0];
  const materials = Array.isArray(coursesMaterials) && coursesMaterials.length > 0
    ? coursesMaterials
    : coursesMaterials?.material
    ? [coursesMaterials]
    : null;

  return (
    <>
      <CourseHero course={course} />

      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-100 p-4">
        <CourseDescription course={course} onStart={navigateToCourse} />

        {materials && (
          <div className="py-12 md:py-20 bg-brand-100 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <CourseMaterials materials={materials} />
            </div>
          </div>
        )}

        <CourseSyllabus modules={course.courseModules} />
        <CourseProfessor
          professor={course.courseProfessor}
          presentationVideo={course.presentation_professor}
        />
      </div>
    </>
  );
};

CourseDetails.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default CourseDetails;
