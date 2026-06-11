import React from 'react';
import { CourseDetail } from '@/interfaces/Courses/CourseDetail';

interface CourseHeroProps {
  course: CourseDetail;
}

const CourseHero: React.FC<CourseHeroProps> = ({ course }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 p-4">
    <div className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
      <div className="text-white">
        <h1 className="text-3xl lg:text-5xl font-bold mb-8">{course.name}</h1>
        <p className="text-sm lg:text-base mb-4">{course.description_short}</p>
        <div className="flex items-center">
          <img
            src={course.courseProfessor.image}
            className="rounded-full w-16 h-16 lg:w-20 lg:h-20 mr-4"
            alt={course.courseProfessor.full_name}
          />
          <div>
            <p className="text-lg lg:text-xl text-white font-bold">
              {course.courseProfessor.full_name}
            </p>
            <p className="text-xs lg:text-sm">{course.courseProfessor.description}</p>
          </div>
        </div>
      </div>
      <div className="aspect-w-16 aspect-h-9">
        <video
          width="600"
          controls
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          className="rounded-lg w-full"
        >
          <source src={course.intro_video} type="video/mp4" />
        </video>
      </div>
    </div>
  </div>
);

export default CourseHero;
