import React from 'react';
import { CourseModules } from '@/interfaces/Courses/CourseDetail';

interface CourseSyllabusProps {
  modules: CourseModules[];
}

const CourseSyllabus: React.FC<CourseSyllabusProps> = ({ modules }) => (
  <div className="items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 pb-20 px-4 lg:px-60">
    <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-white pt-20">Temario</h1>
    {modules.map((module) => (
      <div
        key={module.module_id}
        className="items-center justify-center bg-brandazul-600 mb-4 p-4 border border-gray-300 rounded text-white"
      >
        <div className="flex items-center">
          <img
            src="https://res.cloudinary.com/dk2red18f/image/upload/v1720197367/WEB_EDUCA/ICONOS/rp2dudec5uvmkpq2e9rw.png"
            className="w-5 h-10 lg:w-5 lg:h-10 mr-2"
            alt="Módulo"
          />
          <p className="text-sm lg:text-base mr-2">Módulo: {module.name}</p>
        </div>
        <div className="ml-8">
          {module.moduleSessions.map((session, idx) => (
            <div
              key={`${module.module_id}-session-${idx}`}
              className="flex items-center mb-2"
            >
              <img
                src="https://res.cloudinary.com/dk2red18f/image/upload/v1720200323/WEB_EDUCA/ICONOS/pxuankjrczkaks3sei4m.png"
                className="w-4 h-4 lg:w-6 lg:h-6 mr-2"
                alt="Sesión"
              />
              <p className="text-sm lg:text-base">Sesión: {session.name}</p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default CourseSyllabus;
