import React from 'react';
import { CourseDetail } from '@/interfaces/Courses/CourseDetail';
import CourseEnrollCard from './CourseEnrollCard';

interface CourseDescriptionProps {
  course: CourseDetail;
  onStart: () => void;
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({ course, onStart }) => (
  <div className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-4">Descripción del curso</h1>
      <p className="text-sm lg:text-base mb-4">{course.description_large}</p>
      <div>
        <h2 className="text-xl font-bold mb-4">Con este curso aprenderás a:</h2>
        {course.courseModules.map((module) => (
          <div key={module.module_id} className="flex items-center mb-2">
            <img
              src="https://res.cloudinary.com/dk2red18f/image/upload/v1720132228/WEB_EDUCA/WEB-IMAGENES/mfhd6gr1moprougfd1ig.png"
              className="w-4 h-4 lg:w-6 lg:h-6 mr-2"
              alt="Módulo"
            />
            <p className="text-sm lg:text-base">{module.name}</p>
          </div>
        ))}
      </div>
    </div>
    <CourseEnrollCard onStart={onStart} />
  </div>
);

export default CourseDescription;
